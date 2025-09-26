import { View, Text, Image } from 'react-native';
import DashboardHeader from './DashboardHeader';
import MacronutrientsCards from './MacronutrientsCards';
import RecentEntries from './RecentEntries';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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
  userId: string;
  dailyNutrition: DailyNutrition;
  loadingNutrition?: boolean;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  refreshTrigger?: number;
}

export default function MainDashboard({ 
  width, 
  height, 
  userName, 
  userId,
  dailyNutrition, 
  loadingNutrition = false,
  onCameraPress, 
  onGalleryPress,
  refreshTrigger
}: MainDashboardProps) {
  // Loading skeleton components
  const LoadingSkeleton = () => (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <View style={{ flex: 1 }}>
          <View style={{
            width: 120,
            height: 48,
            backgroundColor: '#e5e7eb',
            borderRadius: 8,
            marginBottom: 8
          }} />
          <View style={{
            width: 100,
            height: 16,
            backgroundColor: '#e5e7eb',
            borderRadius: 4
          }} />
        </View>
        <View style={{
          width: 80,
          height: 80,
          backgroundColor: '#e5e7eb',
          borderRadius: 40
        }} />
      </View>
    </Animated.View>
  );

  const MacronutrientsLoadingSkeleton = () => (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={{ 
        flexDirection: 'row', 
        gap: 12,
        marginBottom: 24 
      }}
    >
      {[1, 2, 3].map((index) => (
        <View key={index} style={{
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
          <View style={{
            width: 40,
            height: 24,
            backgroundColor: '#e5e7eb',
            borderRadius: 4,
            marginBottom: 8,
            alignSelf: 'flex-start'
          }} />
          <View style={{
            width: 50,
            height: 12,
            backgroundColor: '#e5e7eb',
            borderRadius: 4,
            marginBottom: 16,
            alignSelf: 'flex-start'
          }} />
          <View style={{
            width: 50,
            height: 50,
            backgroundColor: '#e5e7eb',
            borderRadius: 25
          }} />
        </View>
      ))}
    </Animated.View>
  );

  if (loadingNutrition) {
    return (
      <View style={{ 
        flex: 1, 
        paddingTop: 100,
        paddingHorizontal: 24,
        paddingBottom: 24,
        backgroundColor: '#f8fafc'
      }}>
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
        
        <LoadingSkeleton />
        <MacronutrientsLoadingSkeleton />
      </View>
    );
  }

  return (
    <View style={{ 
      flex: 1, 
      paddingTop: 100,
      paddingHorizontal: 24,
      paddingBottom: 24,
      backgroundColor: '#f8fafc'
    }}>
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

      <RecentEntries userId={userId} refreshTrigger={refreshTrigger} />

      {/* Safe space at the bottom */}
      <View style={{ height: 56 }} />
    </View>
  );
}
