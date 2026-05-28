import { db } from '@/config/firebase';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    doc,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'received' | 'preparing' | 'shipped' | 'delivered';

export type PaymentMethod = 'card' | 'pix' | 'boleto';

export type OrderItem = {
    eggId: string;
    name: string;
    price: number;
    quantity: number;
    vendor: string;
    producerId: string;
    imageUrl: string;
};

export type OrderAddress = {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
};

export type Order = {
    id: string;
    buyerId: string;
    buyerName: string;
    items: OrderItem[];
    producerIds: string[];
    total: number;
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    createdAt: number;
};

export type CreateOrderPayload = {
    items: OrderItem[];
    total: number;
    address: OrderAddress;
    paymentMethod: PaymentMethod;
};

type OrdersState = {
    orders: Order[];
    isInitializing: boolean;
};

type OrdersAction =
    | { type: 'SET_ORDERS'; payload: Order[] }
    | { type: 'RESET' };

type OrdersContextType = OrdersState & {
    createOrder: (payload: CreateOrderPayload) => Promise<string>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function describeFirestoreError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
        case 'permission-denied':
            return 'Você não tem permissão para essa operação.';
        case 'unavailable':
            return 'Serviço indisponível. Verifique sua conexão e tente novamente.';
        case 'not-found':
            return 'Pedido não encontrado.';
        default:
            return 'Não foi possível concluir a operação. Tente novamente.';
    }
}

function docToOrder(id: string, data: any): Order {
    return {
        id,
        buyerId: data.buyerId ?? '',
        buyerName: data.buyerName ?? '',
        items: Array.isArray(data.items) ? data.items : [],
        producerIds: Array.isArray(data.producerIds) ? data.producerIds : [],
        total: data.total ?? 0,
        address: data.address ?? { street: '', number: '', neighborhood: '', city: '' },
        paymentMethod: (data.paymentMethod ?? 'card') as PaymentMethod,
        status: (data.status ?? 'received') as OrderStatus,
        createdAt: data.createdAt ?? 0,
    };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
    switch (action.type) {
        case 'SET_ORDERS':
            return { orders: action.payload, isInitializing: false };
        case 'RESET':
            return { orders: [], isInitializing: true };
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(ordersReducer, { orders: [], isInitializing: true });

    useEffect(() => {
        if (!user) {
            dispatch({ type: 'RESET' });
            return;
        }
        const filter = user.role === 'producer'
            ? where('producerIds', 'array-contains', user.id)
            : where('buyerId', '==', user.id);
        const q = query(collection(db, 'orders'), filter, orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const orders = snap.docs.map((d) => docToOrder(d.id, d.data()));
            dispatch({ type: 'SET_ORDERS', payload: orders });
        });
        return unsub;
    }, [user?.id, user?.role]);

    async function createOrder(payload: CreateOrderPayload): Promise<string> {
        if (!user) throw new Error('Você precisa estar logado para finalizar a compra.');
        try {
            const producerIds = Array.from(new Set(payload.items.map((i) => i.producerId).filter(Boolean)));
            const ref = await addDoc(collection(db, 'orders'), {
                buyerId: user.id,
                buyerName: user.name,
                items: payload.items,
                producerIds,
                total: payload.total,
                address: payload.address,
                paymentMethod: payload.paymentMethod,
                status: 'received' as OrderStatus,
                createdAt: Date.now(),
            });
            return ref.id;
        } catch (err) {
            throw new Error(describeFirestoreError(err));
        }
    }

    async function updateOrderStatus(id: string, status: OrderStatus) {
        try {
            await updateDoc(doc(db, 'orders', id), { status });
        } catch (err) {
            throw new Error(describeFirestoreError(err));
        }
    }

    return (
        <OrdersContext.Provider value={{ ...state, createOrder, updateOrderStatus }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders(): OrdersContextType {
    const ctx = useContext(OrdersContext);
    if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
    return ctx;
}
