import { ImageSourcePropType } from 'react-native';

export type EggCategory = 'Caipira' | 'Premium' | 'Organico' | 'Branco';

export type Egg = {
  id: string;
  name: string;
  category: EggCategory;
  price: number;
  vendor: string;
  rating: number;
  stock: number;
  description: string;
  image: ImageSourcePropType;
};
