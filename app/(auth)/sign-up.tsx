import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { createUserProfile } from '@/lib/queries/userQueries'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        
        // Create user profile in Supabase database
        try {
          const userId = await createUserProfile(
            signUpAttempt.createdUserId!,
            emailAddress,
            fullName
          )
          console.log('User profile created successfully:', userId)
        } catch (dbError) {
          console.error('Failed to create user profile in database:', dbError)
          // Don't block the user flow if database creation fails
          // They can still use the app, but their data won't be saved
        }
        
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const { width, height } = Dimensions.get('window')

  if (pendingVerification) {
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
                    <Ionicons name="mail" size={28} color="#ff6b35" />
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
                    Verificar Seu E-mail
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#6b7280',
                    textAlign: 'center',
                    paddingHorizontal: 20
                  }}>
                    Enviamos um código de verificação para {emailAddress}
                  </Text>
                </View>

                {/* Verification Form */}
                <View style={{ marginBottom: 24 }}>
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
                    <Ionicons name="keypad-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                    <TextInput
                      style={{ 
                        flex: 1, 
                        fontSize: 16,
                        color: '#1f2937'
                      }}
                      value={code}
                      placeholder="Digite seu código de verificação"
                      placeholderTextColor="#9ca3af"
                      onChangeText={(code) => setCode(code)}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                {/* Verify Button */}
                <TouchableOpacity 
                  onPress={onVerifyPress}
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
                >
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 16, 
                    fontWeight: '600',
                    marginRight: 8
                  }}>
                    Verificar E-mail
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>

                {/* Resend Code */}
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#ff6b35',
                    fontWeight: '500'
                  }}>
                    Não recebeu o código? Reenviar
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    )
  }

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
                  <Ionicons name="person-add" size={28} color="#ff6b35" />
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
                  Cadastrar
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  Crie sua conta para começar
                </Text>
              </View>

              {/* Form */}
              <View style={{ gap: 20, marginBottom: 24 }}>
                {/* Full Name Input */}
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
                    <Ionicons name="person-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                    <TextInput
                      style={{ 
                        flex: 1, 
                        fontSize: 16,
                        color: '#1f2937'
                      }}
                      value={fullName}
                      placeholder="nome completo"
                      placeholderTextColor="#9ca3af"
                      onChangeText={(name) => setFullName(name)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

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
                      style={{ 
                        flex: 1, 
                        fontSize: 16,
                        color: '#1f2937'
                      }}
                      autoCapitalize="none"
                      value={emailAddress}
                      placeholder="endereço de e-mail"
                      placeholderTextColor="#9ca3af"
                      onChangeText={(email) => setEmailAddress(email)}
                      keyboardType="email-address"
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
                      style={{ 
                        flex: 1, 
                        fontSize: 16,
                        color: '#1f2937'
                      }}
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
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
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

              {/* Sign Up Button */}
              <TouchableOpacity 
                onPress={onSignUpPress}
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
              >
                <Text style={{ 
                  color: 'white', 
                  fontSize: 16, 
                  fontWeight: '600',
                  marginRight: 8
                }}>
                  Cadastrar
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6b7280'
                }}>
                  Já tem uma conta?{' '}
                </Text>
                <Link href="/(auth)/sign-in">
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#ff6b35',
                    fontWeight: '600'
                  }}>
                    Entrar
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