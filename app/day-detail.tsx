import { Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { getFoodEntriesByDate } from '../lib/queries/foodQueries'
import { getUserProfile } from '../lib/queries/userQueries'
import DashboardHeader from './components/DashboardHeader';
import MacronutrientsCards from './components/MacronutrientsCards';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import { getFoodEntryById, convertFoodEntryToAnalysis } from '../lib/queries/foodQueries';

interface FoodEntry {
  id: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  date: string;
  macronutrients: {
    calories: number;
    protein: number;
    carbohydrates: number;
    total_fat: number;
  }[];
}

interface DailyNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meals: number;
}

export default function DayDetail() {
  const router = useRouter();
  const { user } = useUser();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    meals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setAnalysis = useSetAtom(analysisAtom);

  // Fetch food entries for the selected date
  useEffect(() => {
    const fetchDayData = async () => {
      if (!user?.id || !date) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First, get the user profile to get the database user ID
        const userProfile = await getUserProfile(user.id);
        if (!userProfile?.id) {
          throw new Error('User profile not found');
        }
        
        const data = await getFoodEntriesByDate(userProfile.id, date);
        setEntries(data || []);
        
        // Calculate daily nutrition totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        data?.forEach(entry => {
          if (entry.macronutrients && entry.macronutrients.length > 0) {
            const macro = entry.macronutrients[0];
            totalCalories += Number(macro.calories) || 0;
            totalProtein += Number(macro.protein) || 0;
            totalCarbs += Number(macro.carbohydrates) || 0;
            totalFat += Number(macro.total_fat) || 0;
          }
        });
        
        setDailyNutrition({
          calories: Math.round(totalCalories),
          protein: Math.round(totalProtein),
          carbs: Math.round(totalCarbs),
          fat: Math.round(totalFat),
          meals: data?.length || 0
        });
      } catch (err) {
        console.error('Error fetching day data:', err);
        setError('Erro ao carregar dados do dia');
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [user?.id, date]);

  const formatTime = (timeString: string) => {
    try {
      let date: Date;
      
      if (timeString.includes('T')) {
        // ISO format with date and time
        date = new Date(timeString);
      } else if (timeString.includes(':')) {
        // Time only format - create a date for the selected date with this time
        const [hours, minutes, seconds] = timeString.split(':');
        const selectedDate = new Date(date!);
        date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 
                       parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds || '0', 10));
      } else {
        return 'Horário não disponível';
      }
      
      if (isNaN(date.getTime())) {
        return 'Horário não disponível';
      }
      
      // Format time in Brazilian format
      const formattedTime = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
      
      return formattedTime;
      
    } catch {
      return 'Horário não disponível';
    }
  };

  const getMealTypeLabel = (mealType: string) => {
    const labels = {
      breakfast: 'Café da manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche'
    };
    return labels[mealType as keyof typeof labels] || 'Refeição';
  };

  const handleEntryPress = async (entryId: string) => {
    try {
      // Fetch full food entry data
      const foodEntry = await getFoodEntryById(entryId);
      
      // Convert to analysis format
      const analysis = convertFoodEntryToAnalysis(foodEntry);
      
      // Set analysis in global state
      setAnalysis(analysis);
      
      // Navigate to result page
      router.push({
        pathname: '/result',
        params: { 
          imageUri: foodEntry.image_url || '',
          fromEntry: 'true'
        }
      });
    } catch (error) {
      console.error('Error fetching food entry:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse the date string as local time to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Normalize dates to compare only the date part (ignore time)
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      
      if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Hoje';
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Ontem';
      } else {
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch {
      return dateString;
    }
  };

  const LoadingSkeleton = () => (
    <View style={{ 
      flex: 1, 
      paddingTop: 100,
      paddingHorizontal: 24,
      paddingBottom: 24,
      backgroundColor: '#f8fafc'
    }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 24 
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#1f2937" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={{
            width: 120,
            height: 24,
            backgroundColor: '#e5e7eb',
            borderRadius: 8,
            marginBottom: 4
          }} />
          <View style={{
            width: 80,
            height: 16,
            backgroundColor: '#e5e7eb',
            borderRadius: 4
          }} />
        </View>
      </View>
      
      <View style={{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 40 
      }}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={{ 
          marginTop: 12, 
          fontSize: 16, 
          color: '#6b7280' 
        }}>
          Carregando dados...
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <SignedIn>
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ 
              flex: 1, 
              padding: 24,
              paddingTop: 60
            }}>
              {/* Header */}
              <Animated.View 
                entering={FadeIn.delay(100)}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  marginBottom: 24 
                }}
              >
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#1f2937" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 28, 
                    fontWeight: 'bold', 
                    color: '#1f2937'
                  }}>
                    {formatDate(date || '')}
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    color: '#6b7280'
                  }}>
                    Resumo nutricional
                  </Text>
                </View>
              </Animated.View>

              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <View style={{ 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  paddingVertical: 40 
                }}>
                  <Ionicons name="alert-circle" size={48} color="#ef4444" />
                  <Text style={{ 
                    marginTop: 12, 
                    fontSize: 16, 
                    color: '#ef4444',
                    textAlign: 'center'
                  }}>
                    {error}
                  </Text>
                </View>
              ) : (
                <>
                  {/* Dashboard Header */}
                  <DashboardHeader 
                      userName=""
                      dailyNutrition={{
                        calories: dailyNutrition.calories,
                        meals: dailyNutrition.meals
                      }}
                    />

                  {/* Macronutrients Cards */}
                   <MacronutrientsCards 
                      macronutrients={{
                        protein: dailyNutrition.protein,
                        fat: dailyNutrition.fat,
                        carbs: dailyNutrition.carbs
                      }}
                    />

                  {/* Food Entries */}
                   <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: 16
                    }}>
                      Refeições ({entries.length})
                    </Text>
                    
                    {entries.length === 0 ? (
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 40
                      }}>
                        <Ionicons name="restaurant" size={48} color="#94a3b8" />
                        <Text style={{
                          fontSize: 16,
                          color: '#64748b',
                          textAlign: 'center',
                          marginTop: 12
                        }}>
                          Nenhuma refeição registrada neste dia
                        </Text>
                      </View>
                    ) : (
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {entries.map((entry, index) => (
                          <TouchableOpacity
                            key={entry.id}
                            onPress={() => handleEntryPress(entry.id)}
                            activeOpacity={0.7}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: 16,
                              paddingHorizontal: 4,
                              borderBottomWidth: index !== entries.length - 1 ? 1 : 0,
                              borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                              borderRadius: 8,
                              marginHorizontal: -4
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={{ 
                                fontSize: 16, 
                                color: '#1f2937', 
                                fontWeight: '600' 
                              }}>
                                {entry.food_name}
                              </Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ 
                                  fontSize: 14, 
                                  color: '#6b7280',
                                  marginRight: 12
                                }}>
                                  {formatTime(entry.time)}
                                </Text>
                                <View style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 6
                                }}>
                                  <Text style={{
                                    fontSize: 12,
                                    color: '#6b7280',
                                    fontWeight: '500'
                                  }}>
                                    {getMealTypeLabel(entry.meal_type)}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{ 
                                fontSize: 18, 
                                color: '#ff6b35', 
                                fontWeight: 'bold' 
                              }}>
                                {entry.macronutrients?.[0]?.calories || 0} kcal
                              </Text>
                              
                              {/* Macronutrients with icons */}
                              <View style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                marginTop: 6,
                                gap: 8
                              }}>
                                {/* Protein */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Ionicons name="fitness" size={14} color="#3b82f6" />
                                  <Text style={{ 
                                    fontSize: 12, 
                                    color: '#6b7280',
                                    marginLeft: 2,
                                    fontWeight: '500'
                                  }}>
                                    {Math.round(entry.macronutrients?.[0]?.protein || 0)}g
                                  </Text>
                                </View>
                                
                                {/* Carbs */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Ionicons name="flash" size={14} color="#10b981" />
                                  <Text style={{ 
                                    fontSize: 12, 
                                    color: '#6b7280',
                                    marginLeft: 2,
                                    fontWeight: '500'
                                  }}>
                                    {Math.round(entry.macronutrients?.[0]?.carbohydrates || 0)}g
                                  </Text>
                                </View>
                                
                                {/* Fat */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Ionicons name="water" size={14} color="#f59e0b" />
                                  <Text style={{ 
                                    fontSize: 12, 
                                    color: '#6b7280',
                                    marginLeft: 2,
                                    fontWeight: '500'
                                  }}>
                                    {Math.round(entry.macronutrients?.[0]?.total_fat || 0)}g
                                  </Text>
                                </View>
                              </View>
                              
                              <Text style={{ 
                                fontSize: 10, 
                                color: '#94a3b8',
                                marginTop: 4
                              }}>
                                Toque para ver detalhes
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                </>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </SignedIn>
      
      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}
