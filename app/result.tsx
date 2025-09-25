import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useAtomValue } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import LoadingSkeleton from './components/LoadingSkeleton';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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

const Page = () => {
  const { imageUri } = useLocalSearchParams();
  const analysis = useAtomValue(analysisAtom);
  const [isLoading, setIsLoading] = useState(true);
  const progressWidth = useSharedValue(0);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (analysis) {
      setIsLoading(false);
      // Animate the progress bar when analysis is available
      progressWidth.value = withTiming(analysis.healthScore ?? 0, { duration: 1000 });
    }
  }, [analysis]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (isLoading) return <LoadingSkeleton />;

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
            source={{ uri: analysis?.image ?? (imageUri as string) }}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
        </Animated.View>

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
              {analysis?.foodCategory}
            </Text>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: '#1f2937',
              textAlign: 'center'
            }}>
              {analysis?.identifiedFood}
            </Text>
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
                Pontuação Nutricional
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="heart" size={20} color="#ff6b35" />
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  color: '#ff6b35',
                  marginLeft: 8
                }}>
                  {analysis?.healthScore ?? 0}/100
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
              <NutritionBadge label="Calorias" value={analysis?.nutritionFacts.perPortion.calories ?? ''} />
              <NutritionBadge label="Proteína" value={`${analysis?.nutritionFacts.perPortion.protein}g`} />
              <NutritionBadge label="Carboidrato" value={`${analysis?.nutritionFacts.perPortion.carbs}g`} />
              <NutritionBadge label="Gordura" value={`${analysis?.nutritionFacts.perPortion.fat}g`} />
              <NutritionBadge label="Fibra" value={`${analysis?.nutritionFacts.perPortion.fiber}g`} />
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
              Distribuição de Macronutrientes
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
                const toPercent = (n: number): `${number}%` => `${n}%` as `${number}%`;
                const protein = parseFloat(analysis?.nutritionFacts.macronutrientDistribution.proteinPercentage ?? '0');
                const carbs = parseFloat(analysis?.nutritionFacts.macronutrientDistribution.carbsPercentage ?? '0');
                const fat = parseFloat(analysis?.nutritionFacts.macronutrientDistribution.fatPercentage ?? '0');
                return (
                  <>
                    <View style={{ backgroundColor: '#3b82f6', width: toPercent(protein) }} />
                    <View style={{ backgroundColor: '#10b981', width: toPercent(carbs) }} />
                    <View style={{ backgroundColor: '#f59e0b', width: toPercent(fat) }} />
                  </>
                );
              })()}
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>
                Proteína {analysis?.nutritionFacts.macronutrientDistribution.proteinPercentage}%
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>
                Carboidrato {analysis?.nutritionFacts.macronutrientDistribution.carbsPercentage}%
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>
                Gordura {analysis?.nutritionFacts.macronutrientDistribution.fatPercentage}%
              </Text>
            </View>
          </Animated.View>
        </BlurView>

        {/* Health Tags */}
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
            entering={FadeInDown.delay(600).duration(500)}
          >
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              Características Principais
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {analysis?.healthBenefits.map((benefit, i) => (
                <HealthTag key={`benefit-${i}`} text={benefit} positive={true} />
              ))}
              {analysis?.potentialConcerns.map((concern, i) => (
                <HealthTag key={`concern-${i}`} text={concern} positive={false} />
              ))}
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
                const perPortion = (analysis?.nutritionFacts?.perPortion ?? {}) as Record<string, string>;
                const per100g = (analysis?.nutritionFacts?.per100g ?? {}) as Record<string, string>;
                return Object.keys(perPortion).map((key) => (
                  <View
                    key={key}
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
                      flex: 1,
                      textTransform: 'capitalize'
                    }}>
                      {key}
                    </Text>
                    <Text style={{ 
                      color: '#374151', 
                      flex: 1, 
                      textAlign: 'center' 
                    }}>
                      {perPortion[key]}
                    </Text>
                    <Text style={{ 
                      color: '#374151', 
                      flex: 1, 
                      textAlign: 'right' 
                    }}>
                      {per100g[key] ?? ''}
                    </Text>
                  </View>
                ));
              })()}
            </View>
          </Animated.View>
        </BlurView>

        {/* Additional Info Cards */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          style={{ marginHorizontal: 24, marginBottom: 20 }}
        >
          <View style={{ gap: 16 }}>
            {/* Preparation Tips Card */}
            <BlurView
              intensity={20}
              tint="light"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: 24,
                padding: 24,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
                elevation: 8
              }}
            >
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: 12
              }}>
                Dicas de Preparo
              </Text>
              {analysis?.preparationTips.map((tip, i) => (
                <Text key={i} style={{ 
                  fontSize: 14, 
                  color: '#6b7280',
                  marginBottom: 8,
                  lineHeight: 20
                }}>
                  • {tip}
                </Text>
              ))}
            </BlurView>

            {/* Storage Advice Card */}
            <BlurView
              intensity={20}
              tint="light"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: 24,
                padding: 24,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
                elevation: 8
              }}
            >
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: 12
              }}>
                Recomendações de Armazenamento
              </Text>
              {analysis?.storageRecommendations.map((tip, i) => (
                <Text key={i} style={{ 
                  fontSize: 14, 
                  color: '#6b7280',
                  marginBottom: 8,
                  lineHeight: 20
                }}>
                  • {tip}
                </Text>
              ))}
            </BlurView>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Page;

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
