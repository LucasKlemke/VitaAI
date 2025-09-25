import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Macronutrients {
  protein: number;
  fat: number;
  carbs: number;
}

interface MacronutrientsCardsProps {
  macronutrients: Macronutrients;
}

export default function MacronutrientsCards({ macronutrients }: MacronutrientsCardsProps) {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 12,
      marginBottom: 24 
    }}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center'
      }}>
        <Ionicons name="fitness" size={24} color="#3b82f6" style={{ marginBottom: 8 }} />
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: 2
        }}>
          {macronutrients.protein}g
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Proteína
        </Text>
      </View>

      <View style={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center'
      }}>
        <Ionicons name="water" size={24} color="#f59e0b" style={{ marginBottom: 8 }} />
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: 2
        }}>
          {macronutrients.fat}g
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Gordura
        </Text>
      </View>

      <View style={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center'
      }}>
        <Ionicons name="flash" size={24} color="#10b981" style={{ marginBottom: 8 }} />
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: 2
        }}>
          {macronutrients.carbs}g
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Carboidrato
        </Text>
      </View>
    </View>
  );
}
