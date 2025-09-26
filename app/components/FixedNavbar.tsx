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
              userId: userProfile?.id,
              imageUrl: result.assets[0].uri,
              mealType: 'snack'
            }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Analysis failed');
              }
              return response.json();
            })
            .then(async (data) => {
              const foodAnalysis = data.data.foodAnalysis;
              foodAnalysis.image = result.assets[0].uri;
              setAnalysis(foodAnalysis);
              
              // Save to database if userId is provided
              if (data.userId) {
                try {
                  const savedEntry = await saveFoodEntry(
                    data.userId,
                    foodAnalysis,
                    data.imageUrl,
                    data.mealType
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
