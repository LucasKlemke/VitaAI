import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

export default function FixedNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      icon: 'home',
      route: '/',
      isActive: pathname === '/'
    },
    {
      name: 'Calendário',
      icon: 'calendar',
      route: '/calendar',
      isActive: pathname === '/calendar'
    },
    {
      name: 'Perfil',
      icon: 'person',
      route: '/profile',
      isActive: pathname === '/profile'
    }
  ];

  return (
    <BlurView
      intensity={20}
      tint="light"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        gap: 16,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {navItems.map((item, index) => (
          <Animated.View 
            key={item.name}
            entering={FadeInDown.delay(800 + index * 50)} 
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: item.isActive 
                  ? 'rgba(255, 107, 53, 0.2)' 
                  : 'rgba(255, 255, 255, 0.3)',
                borderRadius: 16,
                padding: 12,
                alignItems: 'center',
                borderWidth: item.isActive ? 2 : 1,
                borderColor: item.isActive 
                  ? '#ff6b35' 
                  : 'rgba(255, 255, 255, 0.5)'
              }}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={item.isActive ? '#ff6b35' : '#6b7280'} 
              />
              <Text style={{ 
                fontSize: 12, 
                fontWeight: '600', 
                color: item.isActive ? '#ff6b35' : '#6b7280',
                marginTop: 4
              }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </BlurView>
  );
}
