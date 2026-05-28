import { db } from '@/config/firebase';
import Egg, { EggCategory } from '@/models/eggs';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ListingFormData = {
    name: string;
    price: number;
    quantity: number;
    category: EggCategory;
    description: string;
    imageUrl: string;
};

type StoreState = {
    eggs: Egg[];
    isInitializing: boolean;
};

type StoreAction =
    | { type: 'SET_LISTINGS'; payload: Egg[] }
    | { type: 'RESET' };

type StoreContextType = StoreState & {
    addListing: (producerId: string, vendorName: string, data: ListingFormData) => Promise<void>;
    updateListing: (id: string, data: ListingFormData) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    getProducerListings: (producerId: string) => Egg[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Translates common Firestore error codes into PT-BR messages.
function describeFirestoreError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
        case 'permission-denied':
            return 'Você não tem permissão para essa operação.';
        case 'unavailable':
            return 'Serviço indisponível. Verifique sua conexão e tente novamente.';
        case 'not-found':
            return 'Anúncio não encontrado.';
        default:
            return 'Não foi possível concluir a operação. Tente novamente.';
    }
}

function docToEgg(id: string, data: any): Egg {
    return new Egg(
        id,
        data.name ?? '',
        data.price ?? 0,
        data.vendor ?? '',
        data.vendorRating ?? 5.0,
        data.imageUrl ?? '',
        data.producerId ?? '',
        (data.category ?? 'outro') as EggCategory,
        data.quantity ?? 30,
        data.description ?? '',
    );
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function storeReducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
        case 'SET_LISTINGS':
            return { eggs: action.payload, isInitializing: false };
        case 'RESET':
            return { eggs: [], isInitializing: true };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(storeReducer, { eggs: [], isInitializing: true });

    // Only subscribe while authenticated — Firestore rules require auth, so an
    // open listener after logout would fire a permission-denied error.
    useEffect(() => {
        if (!user) {
            dispatch({ type: 'RESET' });
            return;
        }
        const unsub = onSnapshot(collection(db, 'listings'), (snap) => {
            const eggs = snap.docs.map((d) => docToEgg(d.id, d.data()));
            dispatch({ type: 'SET_LISTINGS', payload: eggs });
        });
        return unsub;
    }, [user?.id]);

    async function addListing(producerId: string, vendorName: string, data: ListingFormData) {
        try {
            await addDoc(collection(db, 'listings'), {
                name: data.name,
                price: data.price,
                quantity: data.quantity,
                category: data.category,
                description: data.description,
                imageUrl: data.imageUrl,
                vendor: vendorName,
                vendorRating: 5.0,
                producerId,
                createdAt: Date.now(),
            });
        } catch (err) {
            throw new Error(describeFirestoreError(err));
        }
    }

    async function updateListing(id: string, data: ListingFormData) {
        try {
            await updateDoc(doc(db, 'listings', id), {
                name: data.name,
                price: data.price,
                quantity: data.quantity,
                category: data.category,
                description: data.description,
                imageUrl: data.imageUrl,
            });
        } catch (err) {
            throw new Error(describeFirestoreError(err));
        }
    }

    async function deleteListing(id: string) {
        try {
            await deleteDoc(doc(db, 'listings', id));
        } catch (err) {
            throw new Error(describeFirestoreError(err));
        }
    }

    function getProducerListings(producerId: string): Egg[] {
        return state.eggs.filter((e) => e.producerId === producerId);
    }

    return (
        <StoreContext.Provider value={{ ...state, addListing, updateListing, deleteListing, getProducerListings }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore(): StoreContextType {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used inside StoreProvider');
    return ctx;
}
