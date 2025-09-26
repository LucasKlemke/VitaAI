import { Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { getUserProfile } from '@/lib/queries/userQueries'
import { NameCard, EmailCard, SignOutCard } from './components/profile'

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);

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


  return (
    <>
      <SignedIn>
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
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
                
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: '#1f2937'
                  }}>
                    Perfil
                  </Text>
                </View>
              </Animated.View>

              <NameCard userProfile={userProfile} user={user} />
              <EmailCard user={user} />
              <SignOutCard />
            </View>
          </ScrollView>
        </View>
      </SignedIn>
      
      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}
