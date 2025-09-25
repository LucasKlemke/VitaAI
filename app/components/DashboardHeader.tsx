import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DailyNutrition {
  calories: number;
  meals: number;
}

interface DashboardHeaderProps {
  userName: string;
  dailyNutrition: DailyNutrition;
}

export default function DashboardHeader({ userName, dailyNutrition }: DashboardHeaderProps) {
  return (
    <Animated.View 
      entering={FadeIn.delay(100)}
      style={{ marginBottom: 24 }}
    >
      <Text style={{ 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#1f2937',
        marginBottom: 8
      }}>
        Olá, {userName}! 👋
      </Text>
      <Text style={{ 
        fontSize: 16, 
        color: '#6b7280',
        marginBottom: 24
      }}>
        Aqui está o seu resumo de hoje
      </Text>

      {/* Daily Calories Card */}
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: 8
          }}>
            Calorias Registradas Hoje
          </Text>
          <Text style={{ 
            fontSize: 36, 
            fontWeight: 'bold', 
            color: '#ff6b35',
            marginBottom: 4
          }}>
            {dailyNutrition.calories}
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#6b7280'
          }}>
            de {dailyNutrition.meals} refeições
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
