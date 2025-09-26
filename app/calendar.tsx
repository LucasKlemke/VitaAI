import { Text, View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { getDailyNutritionSummaryAlternative } from '../lib/queries/foodQueries'
import { getUserProfile } from '../lib/queries/userQueries'

export default function Calendar() {
  const router = useRouter();
  const { user } = useUser();
  const [daysWithMeals, setDaysWithMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's nutrition data for the current month
  useEffect(() => {
    const fetchNutritionData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First, get the user profile to get the database user ID
        const userProfile = await getUserProfile(user.id);
        if (!userProfile?.id) {
          throw new Error('User profile not found');
        }
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Calculate start and end dates for the calendar view (6 weeks)
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 41); // 6 weeks
        
        const data = await getDailyNutritionSummaryAlternative(
          userProfile.id, // Use database user ID instead of Clerk ID
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        
        setDaysWithMeals(data);
      } catch (err) {
        console.error('Error fetching nutrition data:', err);
        setError('Erro ao carregar dados nutricionais');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [user?.id]);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks
      const dateString = current.toISOString().split('T')[0];
      const dayData = daysWithMeals.find(day => day.date === dateString);
      
      days.push({
        date: new Date(current),
        dateString,
        isCurrentMonth: current.getMonth() === month,
        hasData: !!dayData,
        data: dayData
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const today = new Date();

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
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 28, 
                    fontWeight: 'bold', 
                    color: '#1f2937'
                  }}>
                    Calendário
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    color: '#6b7280'
                  }}>
                    {monthNames[today.getMonth()]} {today.getFullYear()}
                  </Text>
                </View>
              </Animated.View>

              {/* Calendar */}
              <BlurView
                intensity={20}
                tint="light"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 24,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.1,
                  shadowRadius: 24,
                  elevation: 8,
                  marginBottom: 24
                }}
              >
                {loading ? (
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
                    <TouchableOpacity
                      onPress={() => {
                        setError(null);
                        setLoading(true);
                        // Re-fetch data
                        const fetchNutritionData = async () => {
                          if (!user?.id) return;
                          
                          try {
                            // First, get the user profile to get the database user ID
                            const userProfile = await getUserProfile(user.id);
                            if (!userProfile?.id) {
                              throw new Error('User profile not found');
                            }
                            
                            const today = new Date();
                            const year = today.getFullYear();
                            const month = today.getMonth();
                            
                            const firstDay = new Date(year, month, 1);
                            const startDate = new Date(firstDay);
                            startDate.setDate(startDate.getDate() - firstDay.getDay());
                            
                            const endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + 41);
                            
                            const data = await getDailyNutritionSummaryAlternative(
                              userProfile.id, // Use database user ID instead of Clerk ID
                              startDate.toISOString().split('T')[0],
                              endDate.toISOString().split('T')[0]
                            );
                            
                            setDaysWithMeals(data);
                          } catch (err) {
                            console.error('Error fetching nutrition data:', err);
                            setError('Erro ao carregar dados nutricionais');
                          } finally {
                            setLoading(false);
                          }
                        };
                        fetchNutritionData();
                      }}
                      style={{
                        marginTop: 16,
                        backgroundColor: '#ff6b35',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8
                      }}
                    >
                      <Text style={{ 
                        color: 'white', 
                        fontWeight: '600' 
                      }}>
                        Tentar Novamente
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Days of week header */}
                    <View style={{ 
                      flexDirection: 'row', 
                      marginBottom: 16 
                    }}>
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                        <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                          <Text style={{ 
                            fontSize: 14, 
                            fontWeight: '600', 
                            color: '#6b7280' 
                          }}>
                            {day}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Calendar grid */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {calendarDays.map((day, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            width: '14.28%',
                            aspectRatio: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            marginBottom: 4,
                            backgroundColor: day.hasData 
                              ? 'rgba(255, 107, 53, 0.2)' 
                              : 'transparent',
                            borderWidth: day.hasData ? 1 : 0,
                            borderColor: day.hasData ? '#ff6b35' : 'transparent'
                          }}
                          onPress={() => day.hasData && router.push({
                            pathname: '/day-detail',
                            params: { date: day.dateString }
                          })}
                          disabled={!day.hasData}
                          activeOpacity={0.7}
                        >
                          <Text style={{ 
                            fontSize: 16, 
                            fontWeight: day.hasData ? '600' : '400',
                            color: day.hasData 
                              ? '#ff6b35' 
                              : day.isCurrentMonth 
                                ? '#374151' 
                                : '#d1d5db'
                          }}>
                            {day.date.getDate()}
                          </Text>
                          {day.hasData && (
                            <View style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: '#ff6b35',
                              marginTop: 2
                            }} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
              </BlurView>
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
