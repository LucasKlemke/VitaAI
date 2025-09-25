import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface ActionButtonsProps {
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

export default function ActionButtons({ onCameraPress, onGalleryPress }: ActionButtonsProps) {
  return (
    <Animated.View 
      entering={FadeIn.delay(300)}
      style={{ marginBottom: 16 }}
    >
      <Text style={{ 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#374151',
        textAlign: 'center',
        marginBottom: 16
      }}>
        Registrar Nova Refeição
      </Text>
    
      <View style={{ gap: 16, marginBottom: 24 }}>
        <Animated.View entering={FadeInDown.delay(500)}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ff6b35',
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#ff6b35',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
              flexDirection: 'row'
            }}
            onPress={onCameraPress}
            activeOpacity={0.9}
          >
            <Ionicons name="camera" size={24} color="white" style={{ marginRight: 12 }} />
            <Text style={{ 
              color: 'white', 
              fontSize: 16, 
              fontWeight: '600'
            }}>
              Tirar Foto
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700)}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              flexDirection: 'row'
            }}
            onPress={onGalleryPress}
            activeOpacity={0.9}
          >
            <MaterialIcons name="photo-library" size={24} color="#ff6b35" style={{ marginRight: 12 }} />
            <Text style={{ 
              color: '#ff6b35', 
              fontSize: 16, 
              fontWeight: '600'
            }}>
              Escolher da Galeria
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
