import { EGGS } from '@/data/dummy-data';
import Egg, { EggCategory } from '@/models/eggs';
import { createContext, useContext, useReducer } from 'react';

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
};

type StoreAction =
    | { type: 'ADD_LISTING'; payload: Egg }
    | { type: 'UPDATE_LISTING'; payload: Egg }
    | { type: 'DELETE_LISTING'; payload: string };

type StoreContextType = StoreState & {
    addListing: (producerId: string, vendorName: string, data: ListingFormData) => void;
    updateListing: (id: string, data: ListingFormData) => void;
    deleteListing: (id: string) => void;
    getProducerListings: (producerId: string) => Egg[];
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function storeReducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
        case 'ADD_LISTING':
            return { eggs: [action.payload, ...state.eggs] };
        case 'UPDATE_LISTING':
            return {
                eggs: state.eggs.map((e) =>
                    e.id === action.payload.id ? action.payload : e,
                ),
            };
        case 'DELETE_LISTING':
            return { eggs: state.eggs.filter((e) => e.id !== action.payload) };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(storeReducer, { eggs: EGGS });

    function addListing(producerId: string, vendorName: string, data: ListingFormData) {
        const newEgg = new Egg(
            String(Date.now()),
            data.name,
            data.price,
            vendorName,
            5.0,
            data.imageUrl,
            producerId,
            data.category,
            data.quantity,
            data.description,
        );
        dispatch({ type: 'ADD_LISTING', payload: newEgg });
    }

    function updateListing(id: string, data: ListingFormData) {
        const existing = state.eggs.find((e) => e.id === id);
        if (!existing) return;
        const updated = new Egg(
            id,
            data.name,
            data.price,
            existing.vendor,
            existing.vendorRating,
            data.imageUrl,
            existing.producerId,
            data.category,
            data.quantity,
            data.description,
        );
        dispatch({ type: 'UPDATE_LISTING', payload: updated });
    }

    function deleteListing(id: string) {
        dispatch({ type: 'DELETE_LISTING', payload: id });
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
