import { auth, db } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useReducer } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'producer';

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

type SignupData = {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: UserRole;
};

type AuthState = {
    user: User | null;
    isInitializing: boolean;
    isLoading: boolean;
    error: string | null;
};

type AuthAction =
    | { type: 'AUTH_INIT_DONE'; payload: User | null }
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' };

type AuthContextType = AuthState & {
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Translates the most common Firebase Auth error codes into PT-BR messages
// shown to the user. Anything unmapped falls back to a generic message.
function describeAuthError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
        case 'auth/invalid-email':
            return 'Email inválido.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Email ou senha incorretos.';
        case 'auth/email-already-in-use':
            return 'Este email já está em uso.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/network-request-failed':
            return 'Falha de rede. Verifique sua conexão.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas. Tente novamente mais tarde.';
        default:
            return 'Não foi possível concluir a operação. Tente novamente.';
    }
}

async function loadUserProfile(fbUser: FirebaseUser): Promise<User | null> {
    const snap = await getDoc(doc(db, 'users', fbUser.uid));
    if (!snap.exists()) return null;
    const data = snap.data() as { name: string; role: UserRole };
    return {
        id: fbUser.uid,
        email: fbUser.email ?? '',
        name: data.name,
        role: data.role,
    };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_INIT_DONE':
            return { ...state, user: action.payload, isInitializing: false };
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS':
            return { ...state, user: action.payload, isLoading: false, error: null };
        case 'AUTH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'AUTH_LOGOUT':
            return { ...state, user: null, isLoading: false, error: null };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isInitializing: true,
        isLoading: false,
        error: null,
    });

    // Restore session on mount + react to external auth changes (e.g. logout from another tab).
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            if (!fbUser) {
                dispatch({ type: 'AUTH_INIT_DONE', payload: null });
                return;
            }
            try {
                const profile = await loadUserProfile(fbUser);
                dispatch({ type: 'AUTH_INIT_DONE', payload: profile });
            } catch {
                dispatch({ type: 'AUTH_INIT_DONE', payload: null });
            }
        });
        return unsub;
    }, []);

    async function login(email: string, password: string) {
        dispatch({ type: 'AUTH_START' });
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const profile = await loadUserProfile(cred.user);
            if (!profile) {
                await signOut(auth);
                dispatch({
                    type: 'AUTH_ERROR',
                    payload: 'Perfil de usuário não encontrado. Entre em contato com o suporte.',
                });
                return;
            }
            dispatch({ type: 'AUTH_SUCCESS', payload: profile });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR', payload: describeAuthError(err) });
        }
    }

    async function signup(data: SignupData) {
        dispatch({ type: 'AUTH_START' });
        try {
            const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const fullName = `${data.name} ${data.surname}`.trim();
            await setDoc(doc(db, 'users', cred.user.uid), {
                name: fullName,
                role: data.role,
                email: data.email,
                createdAt: Date.now(),
            });
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                    id: cred.user.uid,
                    name: fullName,
                    email: data.email,
                    role: data.role,
                },
            });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR', payload: describeAuthError(err) });
        }
    }

    async function logout() {
        // Clear user state first so dependent listeners (e.g. StoreContext's
        // Firestore subscription) unmount before the auth token disappears,
        // avoiding a transient permission-denied from active queries.
        dispatch({ type: 'AUTH_LOGOUT' });
        await signOut(auth);
    }

    return (
        <AuthContext.Provider value={{ ...state, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
