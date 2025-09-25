import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import BackgroundElements from './BackgroundElements';
import DashboardHeader from './DashboardHeader';
import MacronutrientsCards from './MacronutrientsCards';
import ActionButtons from './ActionButtons';

interface DailyNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meals: number;
}

interface MainDashboardProps {
  width: number;
  height: number;
  userName: string;
  dailyNutrition: DailyNutrition;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

export default function MainDashboard({ 
  width, 
  height, 
  userName, 
  dailyNutrition, 
  onCameraPress, 
  onGalleryPress 
}: MainDashboardProps) {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      padding: 24,
      position: 'relative'
    }}>
      <BackgroundElements width={width} height={height} />

      {/* Main Glass Card */}
      <BlurView
        intensity={20}
        tint="light"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 24,
          padding: 32,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 8
        }}
      >
        <DashboardHeader 
          userName={userName}
          dailyNutrition={{
            calories: dailyNutrition.calories,
            meals: dailyNutrition.meals
          }}
        />

        <MacronutrientsCards 
          macronutrients={{
            protein: dailyNutrition.protein,
            fat: dailyNutrition.fat,
            carbs: dailyNutrition.carbs
          }}
        />

        <ActionButtons 
          onCameraPress={onCameraPress}
          onGalleryPress={onGalleryPress}
        />
      </BlurView>
    </View>
  );
}
