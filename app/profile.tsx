import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import SignOutButton from './components/SignOutButton'
import { getUserProfile } from '@/lib/supabase'

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);
  const { width, height } = Dimensions.get('window');

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

  // Mock stats for user
  const userStats = {
    totalMeals: 47,
    totalDays: 15,
    averageCalories: 1850,
    favoriteMacro: 'Proteína'
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
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#374151" />
                </TouchableOpacity>
                
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 28, 
                    fontWeight: 'bold', 
                    color: '#1f2937'
                  }}>
                    Meu Perfil
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    color: '#6b7280'
                  }}>
                    Informações da sua conta
                  </Text>
                </View>
              </Animated.View>

              {/* Profile Card */}
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
                  elevation: 8,
                  marginBottom: 24
                }}
              >
                {/* Profile Picture and Basic Info */}
                <Animated.View 
                  entering={FadeIn.delay(200)}
                  style={{ alignItems: 'center', marginBottom: 24 }}
                >
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    borderWidth: 2,
                    borderColor: '#ff6b35'
                  }}>
                    <Ionicons name="person" size={40} color="#ff6b35" />
                  </View>
                  
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    marginBottom: 4
                  }}>
                    {userProfile?.full_name || user?.firstName || 'Usuário'}
                  </Text>
                  
                  <Text style={{ 
                    fontSize: 16, 
                    color: '#6b7280',
                    marginBottom: 8
                  }}>
                    {user?.emailAddresses?.[0]?.emailAddress || 'email@exemplo.com'}
                  </Text>
                  
                  <View style={{
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 107, 53, 0.3)'
                  }}>
                    <Text style={{ 
                      fontSize: 12, 
                      fontWeight: '600', 
                      color: '#ff6b35'
                    }}>
                      Membro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </Text>
                  </View>
                </Animated.View>

                {/* User Stats */}
                <Animated.View 
                  entering={FadeIn.delay(300)}
                  style={{ marginBottom: 24 }}
                >
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: 16,
                    textAlign: 'center'
                  }}>
                    Suas Estatísticas
                  </Text>
                  
                  <View style={{ 
                    flexDirection: 'row', 
                    flexWrap: 'wrap',
                    gap: 12
                  }}>
                    <View style={{
                      flex: 1,
                      minWidth: '45%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}>
                      <Ionicons name="restaurant" size={24} color="#3b82f6" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {userStats.totalMeals}
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Refeições Analisadas
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      minWidth: '45%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}>
                      <Ionicons name="calendar" size={24} color="#10b981" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {userStats.totalDays}
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Dias Ativos
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      minWidth: '45%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}>
                      <Ionicons name="flame" size={24} color="#f59e0b" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {userStats.averageCalories}
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Calorias/Dia
                      </Text>
                    </View>

                    <View style={{
                      flex: 1,
                      minWidth: '45%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}>
                      <Ionicons name="fitness" size={24} color="#8b5cf6" style={{ marginBottom: 8 }} />
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        marginBottom: 2
                      }}>
                        {userStats.favoriteMacro}
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280',
                        textAlign: 'center'
                      }}>
                        Macro Favorito
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Account Actions */}
                <Animated.View 
                  entering={FadeIn.delay(400)}
                  style={{ gap: 12 }}
                >
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: 8,
                    textAlign: 'center'
                  }}>
                    Ações da Conta
                  </Text>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="settings" size={24} color="#6b7280" style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: '#374151'
                      }}>
                        Configurações
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280'
                      }}>
                        Personalizar preferências
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="help-circle" size={24} color="#6b7280" style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: '#374151'
                      }}>
                        Ajuda e Suporte
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280'
                      }}>
                        Central de ajuda
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 16,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="information-circle" size={24} color="#6b7280" style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: '#374151'
                      }}>
                        Sobre o App
                      </Text>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#6b7280'
                      }}>
                        Versão 1.0.0
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </Animated.View>
              </BlurView>

              {/* Sign Out Section */}
              <Animated.View
                entering={FadeIn.delay(500)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: 12
                }}>
                  Sair da Conta
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6b7280',
                  textAlign: 'center',
                  marginBottom: 16
                }}>
                  Você pode fazer login novamente a qualquer momento
                </Text>
                <SignOutButton />
              </Animated.View>
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
