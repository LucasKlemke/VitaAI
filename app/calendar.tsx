import { Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

// Mock data for days with registered meals
const daysWithMeals = [
  { date: '2024-01-15', calories: 1850, protein: 95, fat: 78, carbs: 210, meals: 3 },
  { date: '2024-01-14', calories: 1650, protein: 85, fat: 70, carbs: 190, meals: 2 },
  { date: '2024-01-13', calories: 2100, protein: 110, fat: 85, carbs: 240, meals: 4 },
  { date: '2024-01-12', calories: 1750, protein: 90, fat: 75, carbs: 200, meals: 3 },
  { date: '2024-01-10', calories: 1950, protein: 100, fat: 80, carbs: 220, meals: 3 },
];

export default function Calendar() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedDay, setSelectedDay] = useState<any>(null);

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
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#374151" />
                </TouchableOpacity>
                
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
                      onPress={() => day.hasData && setSelectedDay(day.data)}
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
              </BlurView>

              {/* Selected Day Summary */}
              {selectedDay && (
                <Animated.View
                  entering={FadeInDown}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4
                  }}
                >
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                  }}>
                    <Text style={{ 
                      fontSize: 20, 
                      fontWeight: 'bold', 
                      color: '#1f2937'
                    }}>
                      Resumo do Dia
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedDay(null)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: 'rgba(107, 114, 128, 0.2)',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Ionicons name="close" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ 
                      fontSize: 32, 
                      fontWeight: 'bold', 
                      color: '#ff6b35',
                      marginBottom: 4
                    }}>
                      {selectedDay.calories}
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: '#6b7280'
                    }}>
                      calorias de {selectedDay.meals} refeições
                    </Text>
                  </View>

                  <View style={{ 
                    flexDirection: 'row', 
                    gap: 12 
                  }}>
                    <View style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center'
                    }}>
                      <Text style={{ 
                        fontSize: 18, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {selectedDay.protein}g
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280'
                      }}>
                        Proteína
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center'
                    }}>
                      <Text style={{ 
                        fontSize: 18, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {selectedDay.fat}g
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280'
                      }}>
                        Gordura
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center'
                    }}>
                      <Text style={{ 
                        fontSize: 18, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {selectedDay.carbs}g
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280'
                      }}>
                        Carboidrato
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}

              {/* Legend */}
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                padding: 16,
                marginTop: 16,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#ff6b35',
                    marginRight: 8
                  }} />
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#6b7280'
                  }}>
                    Dias com refeições registradas
                  </Text>
                </View>
              </View>
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
