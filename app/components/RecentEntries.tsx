import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { getTodayFoodEntries, getFoodEntryById, convertFoodEntryToAnalysis } from '../../lib/queries/foodQueries';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import { Ionicons } from '@expo/vector-icons';

interface FoodEntry {
  id: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  macronutrients: {
    calories: number;
    protein: number;
    carbohydrates: number;
    total_fat: number;
  }[];
}

interface RecentEntriesProps {
  userId: string;
  refreshTrigger?: number;
}

export default function RecentEntries({ userId, refreshTrigger }: RecentEntriesProps) {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);

  useEffect(() => {
    const fetchTodayEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTodayFoodEntries(userId);
        setEntries(data);
      } catch (err) {
        console.error('Error fetching today entries:', err);
        setError('Erro ao carregar entradas recentes');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTodayEntries();
    }
  }, [userId, refreshTrigger]);

  const formatTime = (timeString: string) => {
    try {
      let date: Date;
      
      if (timeString.includes('T')) {
        // ISO format with date and time
        date = new Date(timeString);
      } else if (timeString.includes(':')) {
        // Time only format - create a date for today with this time
        const today = new Date();
        const [hours, minutes, seconds] = timeString.split(':');
        date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                       parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds || '0', 10));
      } else {
        return 'Horário não disponível';
      }
      
      if (isNaN(date.getTime())) {
        return 'Horário não disponível';
      }
      
      // Convert to Brazil timezone (UTC-3)
      const brazilTime = new Date(date.getTime() - (3 * 60 * 60 * 1000));
      
      // Format time in Brazilian format
      const formattedTime = brazilTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
      
      // Since we're showing today's entries, always show "Hoje"
      return `Hoje, ${formattedTime}`;
      
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

  const LoadingSkeleton = () => (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2
      }}
    >
      <View style={{
        width: 100,
        height: 18,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginBottom: 12
      }} />
      {[1, 2, 3].map((index) => (
        <View key={index} style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
          borderBottomWidth: index !== 3 ? 1 : 0,
          borderBottomColor: '#f1f5f9'
        }}>
          <View style={{ flex: 1 }}>
            <View style={{
              width: 150,
              height: 15,
              backgroundColor: '#e5e7eb',
              borderRadius: 4,
              marginBottom: 4
            }} />
            <View style={{
              width: 100,
              height: 12,
              backgroundColor: '#e5e7eb',
              borderRadius: 4
            }} />
          </View>
          <View style={{
            width: 60,
            height: 15,
            backgroundColor: '#e5e7eb',
            borderRadius: 4
          }} />
        </View>
      ))}
    </Animated.View>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        marginTop: 4,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100
      }}>
        <Text style={{
          fontSize: 16,
          color: '#ef4444',
          textAlign: 'center'
        }}>
          {error}
        </Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100
      }}>
        <Text style={{
          fontSize: 16,
          color: '#64748b',
          textAlign: 'center'
        }}>
          Nenhuma entrada registrada hoje
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#94a3b8',
          textAlign: 'center',
          marginTop: 4
        }}>
          Use a câmera para registrar suas refeições
        </Text>
      </View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        marginTop: 4,
        marginBottom: 42,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2
      }}
    >
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12
      }}>
        Recentes
      </Text>
      
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
              paddingVertical: 12,
              paddingHorizontal: 4,
              borderBottomWidth: index !== entries.length - 1 ? 1 : 0,
              borderBottomColor: '#f1f5f9',
              borderRadius: 8,
              marginHorizontal: -4
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 15, 
                color: '#334155', 
                fontWeight: '500' 
              }}>
                {entry.food_name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={{ 
                  fontSize: 12, 
                  color: '#64748b',
                  marginRight: 8
                }}>
                  {formatTime(entry.time)}
                </Text>
                <View style={{
                  backgroundColor: '#f1f5f9',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4
                }}>
                  <Text style={{
                    fontSize: 10,
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    {getMealTypeLabel(entry.meal_type)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ 
                fontSize: 15, 
                color: '#ff6b35', 
                fontWeight: '600' 
              }}>
                {entry.macronutrients?.[0]?.calories || 0} kcal
              </Text>
              
              {/* Macronutrients with icons */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginTop: 4,
                gap: 8
              }}>
                {/* Protein */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="fitness" size={12} color="#3b82f6" />
                  <Text style={{ 
                    fontSize: 10, 
                    color: '#64748b',
                    marginLeft: 2,
                    fontWeight: '500'
                  }}>
                    {Math.round(entry.macronutrients?.[0]?.protein || 0)}g
                  </Text>
                </View>
                
                {/* Carbs */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="flash" size={12} color="#10b981" />
                  <Text style={{ 
                    fontSize: 10, 
                    color: '#64748b',
                    marginLeft: 2,
                    fontWeight: '500'
                  }}>
                    {Math.round(entry.macronutrients?.[0]?.carbohydrates || 0)}g
                  </Text>
                </View>
                
                {/* Fat */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="water" size={12} color="#f59e0b" />
                  <Text style={{ 
                    fontSize: 10, 
                    color: '#64748b',
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
    </Animated.View>
  );
}
