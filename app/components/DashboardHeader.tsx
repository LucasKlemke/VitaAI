import { Image, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

interface DailyNutrition {
  calories: number;
  meals: number;
}

interface DashboardHeaderProps {
  userName: string;
  dailyNutrition: DailyNutrition;
}

export default function DashboardHeader({ userName, dailyNutrition }: DashboardHeaderProps) {
  // Calculate progress percentage (assuming 2000 calories as daily goal)
  const dailyGoal = 2000;
  const progressPercentage = Math.min((dailyNutrition.calories / dailyGoal) * 100, 100);
  const radius = 40;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Animated.View 
      entering={FadeIn.delay(100)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
         <Image source={require('../../assets/images/vita-icon-black.png')} style={{ width: 30, height: 30 }} />
      <Text style={{ 
        fontSize: 28, 
        color: '#1f2937',
        marginLeft: 5
      }}>
        Vita.AI
      </Text>
      </View>
     


      {/* Main Calories Card */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          {/* Left side - Calories */}
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 48, 
              color: '#1f2937',
              marginBottom: 4
            }}>
              {dailyNutrition.calories}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Total calorias
            </Text>
          </View>

          {/* Right side - Circular Progress */}
          <View style={{ alignItems: 'center' }}>
            <Svg width={100} height={100} style={{ position: 'relative' }}>
              {/* Background circle */}
              <Circle
                cx={50}
                cy={50}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <Circle
                cx={50}
                cy={50}
                r={radius}
                stroke="#ff6b35"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 50 50)`}
              />
            </Svg>
            {/* Flame icon in center */}
            <View style={{ 
              position: 'absolute', 
              top: 50 - 12, 
              left: 50 - 12 
            }}>
              <Ionicons name="flame" size={24} color="#ff6b35" />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
