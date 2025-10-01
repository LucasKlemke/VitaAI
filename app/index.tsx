import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom, useAtomValue } from 'jotai';
import { analysisAtom, refreshTriggerAtom, userProfileAtom, userProfileLoadingAtom } from '@/atoms/analysis';
import { toast } from 'sonner-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { getUserProfile } from '@/lib/queries/userQueries';
import { saveFoodEntry, getTodayNutritionSummary } from '@/lib/queries/foodQueries';
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import MainDashboard from './components/MainDashboard';

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);
  const setUserProfile = useSetAtom(userProfileAtom);
  const setUserProfileLoading = useSetAtom(userProfileLoadingAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const userProfileLoading = useAtomValue(userProfileLoadingAtom);
  const { user } = useUser();
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    meals: 0
  });
  const [loadingNutrition, setLoadingNutrition] = useState(false);
  const refreshTrigger = useAtomValue(refreshTriggerAtom);

  // Fetch user profile from Supabase when component mounts (only if not already loaded)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id && !userProfile && !userProfileLoading) {
        setUserProfileLoading(true);
        try {
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
          console.log('User profile from database:', profile);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        } finally {
          setUserProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id, userProfile, userProfileLoading, setUserProfile, setUserProfileLoading]);

  // Fetch today's nutrition data
  useEffect(() => {
    const fetchTodayNutrition = async () => {
      if (userProfile?.id) {
        try {
          setLoadingNutrition(true);
          const nutritionData = await getTodayNutritionSummary(userProfile.id);
          setDailyNutrition(nutritionData);
        } catch (error) {
          console.error('Error fetching today nutrition:', error);
          // Set default values on error
          setDailyNutrition({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            meals: 0
          });
        } finally {
          setLoadingNutrition(false);
        }
      }
    };

    // Only fetch nutrition data if user profile is loaded and not currently loading
    if (userProfile && !userProfileLoading) {
      fetchTodayNutrition();
    }
  }, [userProfile?.id, refreshTrigger, userProfileLoading]);

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
              userName={userProfile?.full_name || user?.firstName || 'Usuário'}
              userId={userProfile?.id || ''}
              dailyNutrition={dailyNutrition}
              loadingNutrition={loadingNutrition || userProfileLoading}
              refreshTrigger={refreshTrigger}
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