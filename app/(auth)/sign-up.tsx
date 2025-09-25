import * as React from 'react'
import { Text, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { createUserProfile } from '@/lib/queries/userQueries'
import { AuthLayout, AuthHeader, FormInput, AuthButton, AuthLink, VerificationScreen } from '../components/auth'

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

  if (pendingVerification) {
    return (
      <VerificationScreen
        emailAddress={emailAddress}
        code={code}
        setCode={setCode}
        onVerifyPress={onVerifyPress}
      />
    )
  }

  return (
    <AuthLayout>
      {/* Header */}
      <AuthHeader subtitle="Crie sua conta para começar" />

      {/* Form */}
      <View style={{ gap: 20, marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '600', 
          color: '#374151',
          marginBottom: 4,
          textAlign: 'left',
        }}>
          Cadastro
        </Text>
        
        {/* Full Name Input */}
        <FormInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="nome completo"
          icon="person-outline"
          autoCapitalize="words"
        />

        {/* Email Input */}
        <FormInput
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="endereço de e-mail"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <FormInput
          value={password}
          onChangeText={setPassword}
          placeholder="senha"
          icon="lock-closed-outline"
          secureTextEntry={!showPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </View>

      {/* Sign Up Button */}
      <AuthButton
        onPress={onSignUpPress}
        title="Cadastrar"
      />

      {/* Sign In Link */}
      <AuthLink
        text="Já tem uma conta?"
        linkText="Entrar"
        href="/(auth)/sign-in"
      />
    </AuthLayout>
  )
}