import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const { width, height } = Dimensions.get('window')

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
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
              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'rgba(255, 165, 0, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}>
                  <Ionicons name="leaf" size={28} color="#ff6b35" />
                </View>
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: 8
                }}>
                  Vita.AI
                </Text>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: 4
                }}>
                  Entrar
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  Bem-vindo de volta à sua jornada de saúde
                </Text>
              </View>

              {/* Form */}
              <View style={{ gap: 20, marginBottom: 24 }}>
                {/* Email Input */}
                <View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 56,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2
                  }}>
                    <Ionicons name="mail-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                    <TextInput
                      style={{ flex: 1, fontSize: 16, color: '#1f2937' }}
                      autoCapitalize="none"
                      value={emailAddress}
                      placeholder="endereço de e-mail"
                      placeholderTextColor="#9ca3af"
                      onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 56,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2
                  }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                    <TextInput
                      style={{ flex: 1, fontSize: 16, color: '#1f2937' }}
                      value={password}
                      placeholder="senha"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      onChangeText={(password) => setPassword(password)}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color="#6b7280" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Disclaimer */}
              <Text style={{ 
                fontSize: 12, 
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: 16,
                lineHeight: 16
              }}>
                Para uso apenas por adultos (18 anos ou mais). Manter fora do alcance de crianças e animais de estimação. Em caso de ingestão acidental, entre em contato com nossa linha direta.
              </Text>
              
              <Text style={{ 
                fontSize: 14, 
                color: '#374151',
                textAlign: 'center',
                marginBottom: 20,
                fontWeight: '500'
              }}>
                Por favor, consuma com responsabilidade!
              </Text>

              {/* Sign In Button */}
              <TouchableOpacity 
                onPress={onSignInPress}
                style={{
                  backgroundColor: '#ff6b35',
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  shadowColor: '#ff6b35',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                  flexDirection: 'row'
                }}
                activeOpacity={0.9}
              >
                <Text style={{ 
                  color: 'white', 
                  fontSize: 16, 
                  fontWeight: '600',
                  marginRight: 8
                }}>
                  Entrar
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6b7280' 
                }}>
                  Não tem uma conta?{' '}
                </Text>
                <Link href="/(auth)/sign-up">
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#ff6b35',
                    fontWeight: '600'
                  }}>
                    Cadastrar
                  </Text>
                </Link>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}