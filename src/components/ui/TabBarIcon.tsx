import { Ionicons } from '@expo/vector-icons';

type TabBarIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export function TabBarIcon({ icon, color }: TabBarIconProps) {
  return <Ionicons name={icon} size={22} color={color} />;
}
