import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Macronutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  total_carbs: number;
  dietary_fiber: number;
  net_carbs: number;
  total_fat: number;
  saturated_fat: number;
  trans_fat: number;
  monounsaturated_fat: number;
  polyunsaturated_fat: number;
  cholesterol: number;
  sodium: number;
  sugar: number;
  added_sugar: number;
}

interface Micronutrients {
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;
  vitamin_b1_thiamine: number;
  vitamin_b2_riboflavin: number;
  vitamin_b3_niacin: number;
  vitamin_b5_pantothenic_acid: number;
  vitamin_b6_pyridoxine: number;
  vitamin_b7_biotin: number;
  vitamin_b9_folate: number;
  vitamin_b12_cobalamin: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
  copper: number;
  manganese: number;
  selenium: number;
  iodine: number;
  chromium: number;
  molybdenum: number;
}

interface FoodAnalysis {
  food_name: string;
  description: string;
  food_category: string;
  portion_size: number;
  portion_description: string;
  confidence_score: number;
  macronutrients: Macronutrients;
  micronutrients: Micronutrients;
  health_benefits: string[];
  image?: string;
}

interface ResultDataProps {
  analysis: FoodAnalysis;
  imageUri?: string;
  showImage?: boolean;
}

const NutritionBadge = ({ label, value }: { label: string; value: string }) => (
  <View style={{
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }}>
    <Text style={{ 
      fontSize: 12, 
      color: '#6b7280',
      marginBottom: 4
    }}>
      {label}
    </Text>
    <Text style={{ 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: '#1f2937'
    }}>
      {value}
    </Text>
  </View>
);

const HealthTag = ({ text, positive }: { text: string; positive: boolean }) => (
  <View style={{
    backgroundColor: positive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: positive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'
  }}>
    <Text style={{ 
      fontSize: 12, 
      fontWeight: '500',
      color: positive ? '#166534' : '#92400e'
    }}>
      {text}
    </Text>
  </View>
);

// Cool loading skeleton with animations
const CoolLoadingSkeleton = () => {
  const pulseAnimation = useSharedValue(0);
  const shimmerAnimation = useSharedValue(-1);

  useEffect(() => {
    // Pulse animation
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );

    // Shimmer animation
    shimmerAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseAnimation.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerAnimation.value * 300 }],
  }));

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Elements */}
        <View style={{
          position: 'absolute',
          top: 50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          opacity: 0.6
        }} />
        <View style={{
          position: 'absolute',
          bottom: 100,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: 'rgba(255, 192, 203, 0.1)',
          opacity: 0.5
        }} />

        {/* Image Skeleton */}
        <Animated.View 
          style={[
            {
              margin: 24, 
              marginTop: 60,
              borderRadius: 20,
              height: 200,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 24,
              elevation: 8
            },
            pulseStyle
          ]}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                transform: [{ skewX: '-20deg' }],
                width: 100,
              },
              shimmerStyle
            ]}
          />
        </Animated.View>

        {/* Content Skeletons */}
        {[1, 2, 3, 4, 5].map((index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 100).duration(500)}
            style={[
              {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: 24,
                padding: 24,
                marginHorizontal: 24,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
                elevation: 8
              },
              pulseStyle
            ]}
          >
            <View style={{
              width: '60%',
              height: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: 10,
              marginBottom: 16
            }} />
            <View style={{
              width: '100%',
              height: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 6,
              marginBottom: 8
            }} />
            <View style={{
              width: '80%',
              height: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 6,
              marginBottom: 8
            }} />
            <View style={{
              width: '90%',
              height: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 6
            }} />
          </Animated.View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default function ResultData({ analysis, imageUri, showImage = true }: ResultDataProps) {
  const [isLoading, setIsLoading] = useState(true);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    if (analysis) {
      setIsLoading(false);
      // Animate the progress bar when analysis is available
      progressWidth.value = withTiming((analysis.confidence_score ?? 0) * 100, { duration: 1000 });
    }
  }, [analysis]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (isLoading) return <CoolLoadingSkeleton />;

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Elements */}
        <View style={{
          position: 'absolute',
          top: 50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          opacity: 0.6
        }} />
        <View style={{
          position: 'absolute',
          bottom: 100,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: 'rgba(255, 192, 203, 0.1)',
          opacity: 0.5
        }} />

        {/* Food Image Header */}
        {showImage && (analysis?.image || imageUri) && (
          <Animated.View 
            entering={FadeIn.duration(600)} 
            style={{ 
              margin: 24, 
              marginTop: 60,
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 24,
              elevation: 8
            }}
          >
            <Image
              source={{ uri: analysis?.image ?? imageUri }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          </Animated.View>
        )}

        {/* Food Identification Section */}
        <BlurView
          intensity={20}
          tint="light"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 24,
            marginBottom: 16,
            marginTop: showImage ? 0 : 60,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={{ alignItems: 'center' }}
          >
            <Text style={{ 
              fontSize: 14, 
              color: '#6b7280',
              marginBottom: 8,
              textAlign: 'center'
            }}>
              {analysis?.food_category}
            </Text>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: '#1f2937',
              textAlign: 'center'
            }}>
              {analysis?.food_name}
            </Text>
            {analysis?.description && (
              <Text style={{ 
                fontSize: 14, 
                color: '#6b7280',
                marginTop: 8,
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {analysis.description}
              </Text>
            )}
          </Animated.View>
        </BlurView>

        {/* Health Score */}
        <BlurView
          intensity={20}
          tint="light"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 24,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '600', 
                color: '#374151'
              }}>
                Pontuação
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="heart" size={20} color="#ff6b35" />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: '#ff6b35',
                  marginLeft: 8
                }}>
                  {Math.round((analysis?.confidence_score ?? 0) * 100)}/100
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  animatedStyle,
                  {
                    backgroundColor: '#ff6b35',
                  }
                ]}
              />
            </View>
          </Animated.View>
        </BlurView>

        {/* Quick Nutrition Facts */}
        <BlurView
          intensity={20}
          tint="light"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 24,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
          >
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              Resumo Nutricional
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingVertical: 8 }}
            >
              <NutritionBadge label="Calorias" value={analysis?.macronutrients.calories?.toString() ?? ''} />
              <NutritionBadge label="Proteína" value={`${analysis?.macronutrients.protein}g`} />
              <NutritionBadge label="Carboidrato" value={`${analysis?.macronutrients.carbohydrates}g`} />
              <NutritionBadge label="Gordura" value={`${analysis?.macronutrients.total_fat}g`} />
              <NutritionBadge label="Fibra" value={`${analysis?.macronutrients.dietary_fiber}g`} />
            </ScrollView>
          </Animated.View>
        </BlurView>

        {/* Macronutrient Distribution */}
        <BlurView
          intensity={20}
          tint="light"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 24,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <Animated.View
            entering={FadeInDown.delay(500).duration(500)}
          >
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              Macronutrientes
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              height: 16, 
              backgroundColor: 'rgba(229, 231, 235, 0.5)', 
              borderRadius: 8, 
              overflow: 'hidden',
              marginBottom: 12
            }}>
              {(() => {
                const protein = analysis?.macronutrients.protein || 0;
                const carbs = analysis?.macronutrients.carbohydrates || 0;
                const fat = analysis?.macronutrients.total_fat || 0;
                
                const proteinCalories = protein * 4;
                const carbsCalories = carbs * 4;
                const fatCalories = fat * 9;
                const totalCalories = proteinCalories + carbsCalories + fatCalories;
                
                const proteinPercent = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
                const carbsPercent = totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
                const fatPercent = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;
                
                return (
                  <>
                    <View style={{ backgroundColor: '#3b82f6', width: `${proteinPercent}%` }} />
                    <View style={{ backgroundColor: '#10b981', width: `${carbsPercent}%` }} />
                    <View style={{ backgroundColor: '#f59e0b', width: `${fatPercent}%` }} />
                  </>
                );
              })()}
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Proteína
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start' }}>
                  {(() => {
                    const calories = analysis?.macronutrients.calories || 0;
                    const protein = analysis?.macronutrients.protein || 0;
                    const proteinCalories = protein * 4;
                    return calories > 0 ? Math.round((proteinCalories / calories) * 100) : 0;
                  })()}%
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Carboidrato
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start' }}>
                  {(() => {
                    const calories = analysis?.macronutrients.calories || 0;
                    const carbs = analysis?.macronutrients.carbohydrates || 0;
                    const carbsCalories = carbs * 4;
                    return calories > 0 ? Math.round((carbsCalories / calories) * 100) : 0;
                  })()}%
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Gordura
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start' }}>
                  {(() => {
                    const calories = analysis?.macronutrients.calories || 0;
                    const fat = analysis?.macronutrients.total_fat || 0;
                    const fatCalories = fat * 9;
                    return calories > 0 ? Math.round((fatCalories / calories) * 100) : 0;
                  })()}%
                </Text>
              </View>
            </View>
          </Animated.View>
        </BlurView>

        {/* Detailed Nutrition */}
        <BlurView
          intensity={20}
          tint="light"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 24,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8
          }}
        >
          <Animated.View
            entering={FadeInDown.delay(700).duration(500)}
          >
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              Nutrição Detalhada
            </Text>
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.4)'
            }}>
              {/* Header Row */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                paddingBottom: 12, 
                borderBottomWidth: 1, 
                borderBottomColor: 'rgba(107, 114, 128, 0.2)' 
              }}>
                <Text style={{ 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  flex: 1 
                }}>
                  Nutriente
                </Text>
                <Text style={{ 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  flex: 1, 
                  textAlign: 'center' 
                }}>
                  Por Porção
                </Text>
                <Text style={{ 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  flex: 1, 
                  textAlign: 'right' 
                }}>
                  Por 100g
                </Text>
              </View>

              {/* Data Rows */}
              {(() => {
                const macros = analysis?.macronutrients;
                if (!macros) return null;
                
                const nutritionData = [
                  { label: 'Calorias', value: `${macros.calories}`, unit: 'kcal' },
                  { label: 'Proteína', value: `${macros.protein}`, unit: 'g' },
                  { label: 'Carboidratos', value: `${macros.carbohydrates}`, unit: 'g' },
                  { label: 'Fibra', value: `${macros.dietary_fiber}`, unit: 'g' },
                  { label: 'Gordura Total', value: `${macros.total_fat}`, unit: 'g' },
                  { label: 'Gordura Saturada', value: `${macros.saturated_fat}`, unit: 'g' },
                  { label: 'Colesterol', value: `${macros.cholesterol}`, unit: 'mg' },
                  { label: 'Sódio', value: `${macros.sodium}`, unit: 'mg' },
                  { label: 'Açúcar', value: `${macros.sugar}`, unit: 'g' }
                ];
                
                return nutritionData.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(107, 114, 128, 0.1)'
                    }}
                  >
                    <Text style={{ 
                      fontWeight: '500', 
                      color: '#374151', 
                      flex: 1
                    }}>
                      {item.label}
                    </Text>
                    <Text style={{ 
                      color: '#374151', 
                      flex: 1, 
                      textAlign: 'center' 
                    }}>
                      {item.value} {item.unit}
                    </Text>
                    <Text style={{ 
                      color: '#374151', 
                      flex: 1, 
                      textAlign: 'right' 
                    }}>
                      Por porção
                    </Text>
                  </View>
                ));
              })()}
            </View>
          </Animated.View>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 9999, // full rounded
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9999,
  },
});
