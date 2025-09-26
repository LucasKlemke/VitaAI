import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmailCardProps {
  user: any;
}

export default function EmailCard({ user }: EmailCardProps) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      }}
    >
      <Animated.View entering={FadeIn.delay(300)}>
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
            <Ionicons name="mail" size={20} color="#6b7280" />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16, 
              color: '#6b7280'
            }}>
              {user?.emailAddresses?.[0]?.emailAddress || 'email@exemplo.com'}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: '#9ca3af',
              marginTop: 2
            }}>
              Membro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
