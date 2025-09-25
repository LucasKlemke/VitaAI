import { Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import AppIcon from '../assets/images/AppIcon.png';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, Redirect } from 'expo-router'
import SignOutButton from './components/SignOutButton'
import { supabase, getUserProfile } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);
  const { width, height } = Dimensions.get('window');
  
  // Mock data for daily nutrition summary
  const dailyNutrition = {
    calories: 1850,
    protein: 95,
    fat: 78,
    carbs: 210,
    meals: 3
  };
  
  console.log(user?.emailAddresses);
  console.log(user?.id)

  // Fetch user profile from Supabase when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
          console.log('User profile from database:', profile);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

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
          fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: {
                inlineData: {
                  data: result.assets[0].base64,
                  mimeType: 'image/jpeg',
                },
              },
            }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Analysis failed');
              }
              return response.json();
            })
            .then(data => {
              const foodAnalysis = data.data.foodAnalysis;
              foodAnalysis.image = result.assets[0].uri;
              setAnalysis(foodAnalysis);
              return foodAnalysis;
            }),
          {
            loading: 'Analyzing nutritional content...',
            success: (foodAnalysis) => `Successfully analyzed ${foodAnalysis.identifiedFood}`,
            error: (err: any) => `Analysis failed: ${err.message}`,
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
              justifyContent: 'center', 
              padding: 24,
              position: 'relative'
            }}>
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
              <View style={{
                position: 'absolute',
                top: height * 0.3,
                left: width * 0.1,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(135, 206, 235, 0.1)',
                opacity: 0.4
              }} />

              {/* Main Glass Card */}
              <BlurView
                intensity={20}
                tint="light"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: 24,
                  padding: 32,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.1,
                  shadowRadius: 24,
                  elevation: 8
                }}
              >
                {/* Dashboard Header */}
                <Animated.View 
                  entering={FadeIn.delay(100)}
                  style={{ marginBottom: 24 }}
                >
                  <Text style={{ 
                    fontSize: 28, 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    marginBottom: 8
                  }}>
                    Olá, {userProfile?.full_name || user?.firstName || 'Usuário'}! 👋
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    color: '#6b7280',
                    marginBottom: 24
                  }}>
                    Aqui está o seu resumo de hoje
                  </Text>

                  {/* Daily Calories Card */}
                  <View style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4
                  }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ 
                        fontSize: 18, 
                        fontWeight: '600', 
                        color: '#374151',
                        marginBottom: 8
                      }}>
                        Calorias Registradas Hoje
                      </Text>
                      <Text style={{ 
                        fontSize: 36, 
                        fontWeight: 'bold', 
                        color: '#ff6b35',
                        marginBottom: 4
                      }}>
                        {dailyNutrition.calories}
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: '#6b7280'
                      }}>
                        de {dailyNutrition.meals} refeições
                      </Text>
                    </View>
                  </View>

                  {/* Macronutrients Cards */}
                  <View style={{ 
                    flexDirection: 'row', 
                    gap: 12,
                    marginBottom: 24 
                  }}>
                    <View style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="fitness" size={24} color="#3b82f6" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {dailyNutrition.protein}g
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Proteína
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="water" size={24} color="#f59e0b" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {dailyNutrition.fat}g
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Gordura
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="flash" size={24} color="#10b981" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {dailyNutrition.carbs}g
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Carboidrato
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View 
                  entering={FadeIn.delay(300)}
                  style={{ marginBottom: 16 }}
                >
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '600', 
                    color: '#374151',
                    textAlign: 'center',
                    marginBottom: 16
                  }}>
                    Registrar Nova Refeição
                  </Text>
                
                  <View style={{ gap: 16, marginBottom: 24 }}>
                  <Animated.View entering={FadeInDown.delay(500)}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#ff6b35',
                        height: 56,
                        borderRadius: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#ff6b35',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                        flexDirection: 'row'
                      }}
                      onPress={() => captureImage(true)}
                      activeOpacity={0.9}
                    >
                      <Ionicons name="camera" size={24} color="white" style={{ marginRight: 12 }} />
                      <Text style={{ 
                        color: 'white', 
                        fontSize: 16, 
                        fontWeight: '600'
                      }}>
                        Tirar Foto
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(700)}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        height: 56,
                        borderRadius: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                        flexDirection: 'row'
                      }}
                      onPress={() => captureImage(false)}
                      activeOpacity={0.9}
                    >
                      <MaterialIcons name="photo-library" size={24} color="#ff6b35" style={{ marginRight: 12 }} />
                      <Text style={{ 
                        color: '#ff6b35', 
                        fontSize: 16, 
                        fontWeight: '600'
                      }}>
                        Escolher da Galeria
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  </View>
                </Animated.View>
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