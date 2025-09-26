import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SignOutCard() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      }}
      activeOpacity={0.7}
      onPress={handleSignOut}
    >
      <Animated.View entering={FadeIn.delay(400)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f3f4f6',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16
          }}>
            <Ionicons name="log-out" size={20} color="#6b7280" />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16, 
              color: '#6b7280'
            }}>
              Sair
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
