import { mockEggCatalog } from '@/src/data/mockEggCatalog';
import { CartItem, Order } from '@/src/models/order';
import { User } from '@/src/models/user';

type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

type UpdateUserPayload = {
  phone: string;
  avatarUri: string | null;
  defaultAddress: string;
};

const usersByEmail = new Map<string, User>();
const ordersByUserId = new Map<string, Order[]>();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildUserFromEmail(email: string) {
  const prefix = email.split('@')[0] || 'aluno';
  const parts = prefix.split(/[._-]/).filter(Boolean);
  const firstName = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : 'Aluno';
  const lastName = parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1) : 'Expo';

  return {
    id: `user-${prefix.toLowerCase()}`,
    firstName,
    lastName,
    email,
    phone: '(84) 99999-9999',
    avatarUri: null,
    defaultAddress: 'Rua das Gemas, 120 - Centro',
  };
}

function findUserById(userId: string) {
  return [...usersByEmail.values()].find((user) => user.id === userId) ?? null;
}

export const mockBackend = {
  async login(email: string, password: string) {
    await wait(450);

    if (!email.includes('@') || password.trim().length < 4) {
      throw new Error('Preencha email valido e senha com pelo menos 4 caracteres.');
    }

    const existingUser = usersByEmail.get(email);
    if (existingUser) {
      return existingUser;
    }

    const fallbackUser = buildUserFromEmail(email);
    usersByEmail.set(email, fallbackUser);
    return fallbackUser;
  },

  async signUp(payload: SignUpPayload) {
    await wait(600);

    const user: User = {
      id: `user-${payload.email.toLowerCase()}`,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      avatarUri: null,
      defaultAddress: 'Rua das Gemas, 120 - Centro',
    };

    usersByEmail.set(user.email, user);
    return user;
  },

  async updateUser(userId: string, payload: UpdateUserPayload) {
    await wait(350);

    const currentUser = findUserById(userId);

    if (!currentUser) {
      throw new Error('Usuario nao encontrado para atualizacao.');
    }

    const updatedUser: User = {
      ...currentUser,
      phone: payload.phone.trim(),
      avatarUri: payload.avatarUri,
      defaultAddress: payload.defaultAddress.trim(),
    };

    usersByEmail.set(updatedUser.email, updatedUser);
    return updatedUser;
  },

  async fetchEggs() {
    await wait(300);
    return mockEggCatalog;
  },

  async fetchOrders(userId: string) {
    await wait(250);
    return ordersByUserId.get(userId) ?? [];
  },

  async createOrder(userId: string, items: CartItem[], deliveryAddress: string, contactPhone: string) {
    await wait(700);

    const subtotal = items.reduce((sum, item) => sum + item.egg.price * item.quantity, 0);
    const deliveryFee = subtotal >= 60 ? 0 : 6;
    const order: Order = {
      id: `order-${Date.now()}`,
      code: `PED-${String(Date.now()).slice(-5)}`,
      createdAt: new Date().toISOString(),
      items,
      deliveryAddress: deliveryAddress.trim(),
      contactPhone: contactPhone.trim(),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };

    const currentOrders = ordersByUserId.get(userId) ?? [];
    ordersByUserId.set(userId, [order, ...currentOrders]);

    return order;
  },
};
