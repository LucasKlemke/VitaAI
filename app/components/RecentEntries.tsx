import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { getTodayFoodEntries } from '../../lib/queries/foodQueries';

interface FoodEntry {
  id: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  macronutrients: {
    calories: number;
  }[];
}

interface RecentEntriesProps {
  userId: string;
}

export default function RecentEntries({ userId }: RecentEntriesProps) {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [userId]);

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (entryDate.getTime() === today.getTime()) {
        return `Hoje, ${date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      } else {
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
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
        marginTop: 8,
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
          <View key={entry.id} style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8,
            borderBottomWidth: index !== entries.length - 1 ? 1 : 0,
            borderBottomColor: '#f1f5f9'
          }}>
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
            <Text style={{ 
              fontSize: 15, 
              color: '#ff6b35', 
              fontWeight: '600' 
            }}>
              {entry.macronutrients?.[0]?.calories || 0} kcal
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}
