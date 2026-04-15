import { createContext, useContext, useReducer } from 'react';

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
    isLoading: boolean;
    error: string | null;
};

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' };

type AuthContextType = AuthState & {
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

// Contas pré-cadastradas para testes
const MOCK_USERS: Array<User & { password: string }> = [
    {
        id: '1',
        name: 'Ana Compradora',
        email: 'comprador@teste.com',
        password: '123456',
        role: 'buyer',
    },
    {
        id: '2',
        name: 'João Produtor',
        email: 'produtor@teste.com',
        password: '123456',
        role: 'producer',
    },
];

// Usuários criados em tempo de execução (simulam persistência durante a sessão)
const runtimeUsers: Array<User & { password: string }> = [];

function simulateDelay(ms = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS':
            return { user: action.payload, isLoading: false, error: null };
        case 'AUTH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'AUTH_LOGOUT':
            return { user: null, isLoading: false, error: null };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isLoading: false,
        error: null,
    });

    async function login(email: string, password: string) {
        dispatch({ type: 'AUTH_START' });
        await simulateDelay();

        const allUsers = [...MOCK_USERS, ...runtimeUsers];
        const found = allUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );

        if (!found) {
            dispatch({ type: 'AUTH_ERROR', payload: 'Email ou senha incorretos.' });
            return;
        }

        const { password: _pw, ...user } = found;
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
    }

    async function signup(data: SignupData) {
        dispatch({ type: 'AUTH_START' });
        await simulateDelay();

        const allUsers = [...MOCK_USERS, ...runtimeUsers];
        const emailTaken = allUsers.some(
            (u) => u.email.toLowerCase() === data.email.toLowerCase(),
        );

        if (emailTaken) {
            dispatch({ type: 'AUTH_ERROR', payload: 'Este email já está em uso.' });
            return;
        }

        const newUser: User & { password: string } = {
            id: String(Date.now()),
            name: `${data.name} ${data.surname}`,
            email: data.email,
            password: data.password,
            role: data.role,
        };

        runtimeUsers.push(newUser);

        const { password: _pw, ...user } = newUser;
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
    }

    function logout() {
        dispatch({ type: 'AUTH_LOGOUT' });
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
