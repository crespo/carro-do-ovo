import { Egg } from '@/src/models/egg';
import { CartItem, Order } from '@/src/models/order';
import { User } from '@/src/models/user';
import { mockBackend } from '@/src/services/mockBackend';
import { createContext, PropsWithChildren, startTransition, useContext, useEffect, useState } from 'react';

type AppContextValue = {
  user: User | null;
  eggs: Egg[];
  cart: CartItem[];
  orders: Order[];
  booting: boolean;
  login: (email: string, password: string) => Promise<User>;
  signUp: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  addToCart: (egg: Egg, quantity: number) => void;
  updateCartQuantity: (eggId: string, quantity: number) => void;
  submitOrder: () => Promise<Order>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    mockBackend.fetchEggs().then((items) => {
      startTransition(() => {
        setEggs(items);
        setBooting(false);
      });
    });
  }, []);

  async function login(email: string, password: string) {
    const authenticatedUser = await mockBackend.login(email.trim().toLowerCase(), password);
    const existingOrders = await mockBackend.fetchOrders(authenticatedUser.id);

    startTransition(() => {
      setUser(authenticatedUser);
      setOrders(existingOrders);
      setCart([]);
    });

    return authenticatedUser;
  }

  async function signUp(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const createdUser = await mockBackend.signUp(payload);

    startTransition(() => {
      setUser(createdUser);
      setOrders([]);
      setCart([]);
    });

    return createdUser;
  }

  function logout() {
    startTransition(() => {
      setUser(null);
      setCart([]);
      setOrders([]);
    });
  }

  function addToCart(egg: Egg, quantity: number) {
    setCart((current) => {
      const existingItem = current.find((item) => item.egg.id === egg.id);

      if (!existingItem) {
        return [...current, { egg, quantity }];
      }

      return current.map((item) =>
        item.egg.id === egg.id ? { ...item, quantity: item.quantity + quantity } : item,
      );
    });
  }

  function updateCartQuantity(eggId: string, quantity: number) {
    setCart((current) =>
      current
        .map((item) => (item.egg.id === eggId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  async function submitOrder() {
    if (!user) {
      throw new Error('Voce precisa entrar antes de finalizar o pedido.');
    }

    if (!cart.length) {
      throw new Error('Adicione pelo menos um item ao carrinho.');
    }

    const createdOrder = await mockBackend.createOrder(user.id, cart);

    startTransition(() => {
      setOrders((current) => [createdOrder, ...current]);
      setCart([]);
    });

    return createdOrder;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        eggs,
        cart,
        orders,
        booting,
        login,
        signUp,
        logout,
        addToCart,
        updateCartQuantity,
        submitOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within AppProvider.');
  }

  return context;
}
