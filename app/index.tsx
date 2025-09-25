import { Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import { toast } from 'sonner-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { getUserProfile } from '@/lib/queries/userQueries';
import { saveFoodEntry } from '@/lib/queries/foodQueries';
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import MainDashboard from './components/MainDashboard';

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
            <MainDashboard
              width={width}
              height={height}
              userName={userProfile?.full_name || user?.firstName || 'Usuário'}
              dailyNutrition={dailyNutrition}
              onCameraPress={() => captureImage(true)}
              onGalleryPress={() => captureImage(false)}
            />
          </ScrollView>
        </LinearGradient>
      </SignedIn>
      
      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}