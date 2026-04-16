import Egg from '@/models/eggs';
import { createContext, useContext, useReducer } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
    egg: Egg;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: 'ADD_ITEM'; payload: Egg }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { eggId: string; quantity: number } }
    | { type: 'CLEAR_CART' };

type CartContextType = CartState & {
    addItem: (egg: Egg) => void;
    removeItem: (eggId: string) => void;
    updateQuantity: (eggId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find((i) => i.egg.id === action.payload.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.egg.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
                    ),
                };
            }
            return { items: [...state.items, { egg: action.payload, quantity: 1 }] };
        }
        case 'REMOVE_ITEM':
            return { items: state.items.filter((i) => i.egg.id !== action.payload) };
        case 'UPDATE_QUANTITY': {
            const { eggId, quantity } = action.payload;
            if (quantity <= 0) {
                return { items: state.items.filter((i) => i.egg.id !== eggId) };
            }
            return {
                items: state.items.map((i) =>
                    i.egg.id === eggId ? { ...i, quantity } : i,
                ),
            };
        }
        case 'CLEAR_CART':
            return { items: [] };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce((sum, i) => sum + i.egg.price * i.quantity, 0);

    function addItem(egg: Egg) {
        dispatch({ type: 'ADD_ITEM', payload: egg });
    }

    function removeItem(eggId: string) {
        dispatch({ type: 'REMOVE_ITEM', payload: eggId });
    }

    function updateQuantity(eggId: string, quantity: number) {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { eggId, quantity } });
    }

    function clearCart() {
        dispatch({ type: 'CLEAR_CART' });
    }

    return (
        <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
