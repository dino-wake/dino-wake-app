import { Tabs } from 'expo-router';
import { Bell, LayoutGrid, Settings, ShoppingBag } from 'lucide-react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[scheme].tint,
        tabBarInactiveTintColor: Colors[scheme].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? '#161513' : '#FFFFFF',
          borderTopColor: scheme === 'dark' ? '#2A2927' : '#E5E4E1',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Outfit_500Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '알람',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="briefing"
        options={{
          title: '브리핑',
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: '스토어',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
