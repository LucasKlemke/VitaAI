import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

interface Macronutrients {
  protein: number;
  fat: number;
  carbs: number;
}

interface MacronutrientsCardsProps {
  macronutrients: Macronutrients;
}

export default function MacronutrientsCards({ macronutrients }: MacronutrientsCardsProps) {
  // Define daily goals for each macronutrient
  const proteinGoal = 150;
  const fatGoal = 65;
  const carbsGoal = 200;

  // Calculate progress percentages
  const proteinProgress = Math.min((macronutrients.protein / proteinGoal) * 100, 100);
  const fatProgress = Math.min((macronutrients.fat / fatGoal) * 100, 100);
  const carbsProgress = Math.min((macronutrients.carbs / carbsGoal) * 100, 100);

  const radius = 25;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;

  const createProgressCircle = (progress: number, color: string, icon: string) => {
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <View style={{ alignItems: 'center', position: 'relative' }}>
        <Svg width={60} height={60}>
          {/* Background circle */}
          <Circle
            cx={30}
            cy={30}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={30}
            cy={30}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 30 30)`}
          />
        </Svg>
        {/* Icon in center */}
        <View style={{ 
          position: 'absolute', 
          top: 30 - 10, 
          left: 30 - 10 
        }}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 12,
      marginBottom: 24 
    }}>
      {/* Protein Card */}
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontSize: 24, 
          color: '#1f2937',
          marginBottom: 4,
          textAlign: 'left',
          alignSelf: 'flex-start'
        }}>
          {macronutrients.protein}g
        </Text>
        <Text style={{ 
          fontSize: 10, 
          color: '#6b7280',
          textAlign: 'left',
          marginBottom: 12,
          fontWeight: '500',
          alignSelf: 'flex-start'
        }}>
          Proteína
        </Text>
        {createProgressCircle(proteinProgress, '#3b82f6', 'fitness')}
      </View>

      {/* Carbs Card */}
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontSize: 24, 
          color: '#1f2937',
          marginBottom: 4,
          textAlign: 'left',
          alignSelf: 'flex-start'
        }}>
          {macronutrients.carbs}g
        </Text>
        <Text style={{ 
          fontSize: 10, 
          color: '#6b7280',
          textAlign: 'left',
          marginBottom: 12,
          fontWeight: '500',
          alignSelf: 'flex-start'
        }}>
          Carboidrato
        </Text>
        {createProgressCircle(carbsProgress, '#10b981', 'flash')}
      </View>

      {/* Fat Card */}
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontSize: 24, 
          color: '#1f2937',
          marginBottom: 4,
          textAlign: 'left',
          alignSelf: 'flex-start'
        }}>
          {macronutrients.fat}g
        </Text>
        <Text style={{ 
          fontSize: 10, 
          color: '#6b7280',
          textAlign: 'left',
          marginBottom: 12,
          fontWeight: '500',
          alignSelf: 'flex-start'
        }}>
          Gordura
        </Text>
        {createProgressCircle(fatProgress, '#f59e0b', 'water')}
      </View>
    </View>
  );
}
