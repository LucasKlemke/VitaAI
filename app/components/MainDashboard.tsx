import { View, Text, ActivityIndicator, Image, ScrollView } from 'react-native';
import DashboardHeader from './DashboardHeader';
import MacronutrientsCards from './MacronutrientsCards';
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
  dailyNutrition: DailyNutrition;
  loadingNutrition?: boolean;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

export default function MainDashboard({ 
  width, 
  height, 
  userName, 
  dailyNutrition, 
  loadingNutrition = false,
  onCameraPress, 
  onGalleryPress 
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

      {/* Recent Entries (Mocked) */}
      <ScrollView style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: 12
        }}>
          Recentes
        </Text>
        {/* Mocked list of recent entries */}
        <View>
          {[
            {
              id: 1,
              food: 'Grilled Chicken Salad',
              calories: 350,
              time: 'Hoje, 12:30 PM'
            },
            {
              id: 2,
              food: 'Oatmeal with Berries',
              calories: 220,
              time: 'Hoje, 8:10 AM'
            },
            {
              id: 3,
              food: 'Greek Yogurt',
              calories: 120,
              time: 'Yesterday, 9:00 PM'
            }
          ].map(entry => (
            <View key={entry.id} style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
              borderBottomWidth: entry.id !== 3 ? 1 : 0,
              borderBottomColor: '#f1f5f9'
            }}>
              <View>
                <Text style={{ fontSize: 15, color: '#334155', fontWeight: '500' }}>
                  {entry.food}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {entry.time}
                </Text>
              </View>
              <Text style={{ fontSize: 15, color: '#ff6b35', fontWeight: '600' }}>
                {entry.calories} kcal
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
