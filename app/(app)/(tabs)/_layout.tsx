import { TabBarIcon } from '@/src/components/ui/TabBarIcon';
import { palette } from '@/src/theme/palette';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary900,
        tabBarInactiveTintColor: palette.primary700,
        tabBarStyle: {
          backgroundColor: palette.creamStrong,
          borderTopColor: palette.borderStrong,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'fredoka',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Catalogo',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={focused ? 'egg' : 'egg-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
