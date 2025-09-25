import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'
import React from 'react'
import { AuthLayout, AuthHeader, FormInput, AuthButton, AuthLink } from '../components/auth'

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

  return (
    <AuthLayout>
      {/* Header */}
      <AuthHeader />

      {/* Form */}
      <View style={{ gap: 20, marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 18, 
          textAlign: 'left',
          fontWeight: '600', 
          color: '#374151',
          marginBottom: 4
        }}>
          Login
        </Text>
        
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

      {/* Sign In Button */}
      <AuthButton
        onPress={onSignInPress}
        title="Entrar"
      />

      {/* Sign Up Link */}
      <AuthLink
        text="Não tem uma conta?"
        linkText="Cadastrar"
        href="/(auth)/sign-up"
      />
    </AuthLayout>
  )
}