import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom, useAtomValue } from 'jotai';
import { analysisAtom, refreshTriggerAtom, userProfileAtom, userProfileLoadingAtom } from '@/atoms/analysis';
import { toast } from 'sonner-native';
import { useUser } from '@clerk/clerk-expo';
import { getUserProfile } from '@/lib/queries/userQueries';
import { saveFoodEntry } from '@/lib/queries/foodQueries';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function FixedNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const setAnalysis = useSetAtom(analysisAtom);
  const setRefreshTrigger = useSetAtom(refreshTriggerAtom);
  const setUserProfile = useSetAtom(userProfileAtom);
  const setUserProfileLoading = useSetAtom(userProfileLoadingAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const userProfileLoading = useAtomValue(userProfileLoadingAtom);
  const { user } = useUser();

  // Initialize Google AI
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!);

  // Function to analyze food image using Gemini
  const analyzeFoodImage = async (base64Image: string, mimeType: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Analise esta imagem de alimento e forneça informações nutricionais abrangentes.

    Instruções:
    1. Forneça estimativas realistas baseadas em bancos de dados nutricionais científicos
    2. Todos os valores nutricionais devem ser números decimais
    3. portion_size deve ser em gramas
    4. confidence_score deve ser entre 0.00 e 1.00
    5. Valores de micronutrientes devem estar nas unidades corretas (mg, mcg, etc.)
    6. Responda sempre em português brasileiro
    7. Seja específico e preciso com os valores nutricionais

    Retorne um JSON com a seguinte estrutura:
    {
      "foodAnalysis": {
        "food_name": "string",
        "description": "string", 
        "food_category": "string",
        "portion_size": number,
        "portion_description": "string",
        "confidence_score": number,
        "macronutrients": {
          "calories": number,
          "protein": number,
          "carbohydrates": number,
          "total_carbs": number,
          "dietary_fiber": number,
          "net_carbs": number,
          "total_fat": number,
          "saturated_fat": number,
          "trans_fat": number,
          "monounsaturated_fat": number,
          "polyunsaturated_fat": number,
          "cholesterol": number,
          "sodium": number,
          "sugar": number,
          "added_sugar": number
        },
        "micronutrients": {
          "vitamin_a": number,
          "vitamin_c": number,
          "vitamin_d": number,
          "vitamin_e": number,
          "vitamin_k": number,
          "vitamin_b1_thiamine": number,
          "vitamin_b2_riboflavin": number,
          "vitamin_b3_niacin": number,
          "vitamin_b5_pantothenic_acid": number,
          "vitamin_b6_pyridoxine": number,
          "vitamin_b7_biotin": number,
          "vitamin_b9_folate": number,
          "vitamin_b12_cobalamin": number,
          "calcium": number,
          "iron": number,
          "magnesium": number,
          "phosphorus": number,
          "potassium": number,
          "zinc": number,
          "copper": number,
          "manganese": number,
          "selenium": number,
          "iodine": number,
          "chromium": number,
          "molybdenum": number
        },
        "health_benefits": ["string"]
      }
    }
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Gemini');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    return parsedData;
  };

  // Fetch user profile from Supabase when component mounts (only if not already loaded)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id && !userProfile && !userProfileLoading) {
        setUserProfileLoading(true);
        try {
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        } finally {
          setUserProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id, userProfile, userProfileLoading, setUserProfile, setUserProfileLoading]);

  const captureImage = async (camera = false) => {
    let result: any;
    try {
      if (camera) {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 1,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 1,
          base64: true,
        });
      }

      if (!result.canceled) {
        // Show loading toast immediately
        const toastId = toast.loading('Analyzing your meal...', {
          position: 'top-center'
        });

        // Navigate to results page
        router.push({
          pathname: '/result',
          params: { imageUri: result.assets[0].uri }
        });

        toast.promise(
          analyzeFoodImage(result.assets[0].base64!, 'image/jpeg')
            .then(async (data) => {
              const foodAnalysis = data.foodAnalysis;
              foodAnalysis.image = result.assets[0].uri;
              setAnalysis(foodAnalysis);
              
              // Save to database if userId is provided
              if (userProfile?.id) {
                try {
                  const savedEntry = await saveFoodEntry(
                    userProfile.id,
                    foodAnalysis,
                    result.assets[0].uri,
                    'snack'
                  );
                  console.log('Food entry saved successfully:', savedEntry.id);
                  
                  // Trigger refresh of dashboard data
                  setRefreshTrigger(prev => prev + 1);
                } catch (saveError) {
                  console.error('Failed to save food entry:', saveError);
                }
              }
              
              return foodAnalysis;
            }),
          {
            loading: 'Analisando...',
            success: (foodAnalysis) => `Análise realizada com sucesso ${foodAnalysis.food_name}`,
            error: (err: any) => {
              console.log(err);
              return `Falha na análise: ${err.message}`;
            },
          }
        );

        // Dismiss the initial loading toast
        toast.dismiss(toastId);
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to process image', {
        description: error.message,
        position: 'top-center'
      });
      router.back();
    }
  };

  const navItems = [
    {
      name: 'Início',
      icon: 'home',
      route: '/',
      isActive: pathname === '/'
    },
    {
      name: 'Calendário',
      icon: 'calendar',
      route: '/calendar',
      isActive: pathname === '/calendar'
    },
    {
      name: 'Perfil',
      icon: 'person',
      route: '/profile',
      isActive: pathname === '/profile'
    }
  ];

  return (
    <BlurView
      intensity={20}
      tint="light"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        paddingTop: 12,
        paddingBottom: 20,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        zIndex: 1000
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Navigation Items */}
        <View style={{ 
          flexDirection: 'row', 
          flex: 1,
          justifyContent: 'flex-start',
          gap: 32
        }}>
          {navItems.map((item, index) => (
            <Animated.View 
              key={item.name}
              entering={FadeInDown.delay(800 + index * 50)} 
            >
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 4
                }}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={24} 
                  color={item.isActive ? '#ff6b35' : '#9CA3AF'} 
                />
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: '500', 
                  color: item.isActive ? '#ff6b35' : '#9CA3AF',
                  marginTop: 4
                }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Add Button */}
        <Animated.View 
          entering={FadeInDown.delay(950)}
          style={{
            position: 'absolute',
            right: 15,
            top: -50
          }}
        >
          <TouchableOpacity
            style={{
              width: 72,
              height: 72,
              borderRadius: 40,
              backgroundColor: '#ff6b35',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#ff6b35',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}
            onPress={() => {
              Alert.alert(
                'Adicionar Foto',
                'Escolha como você quer registrar sua refeição',
                [
                  {
                    text: 'Tirar Foto',
                    onPress: () => captureImage(true),
                    style: 'default'
                  },
                  {
                    text: 'Escolher da Galeria',
                    onPress: () => captureImage(false),
                    style: 'default'
                  },
                  {
                    text: 'Cancelar',
                    style: 'cancel'
                  }
                ],
                { cancelable: true }
              );
            }}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="add" 
              size={46} 
              color="white" 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </BlurView>
  );
}
