import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AuthLayout from './AuthLayout'
import AuthHeader from './AuthHeader'
import FormInput from './FormInput'
import AuthButton from './AuthButton'

interface VerificationScreenProps {
  emailAddress: string
  code: string
  setCode: (code: string) => void
  onVerifyPress: () => void
  onResendCode?: () => void
}

export default function VerificationScreen({
  emailAddress,
  code,
  setCode,
  onVerifyPress,
  onResendCode
}: VerificationScreenProps) {
  return (
    <AuthLayout>
      {/* Header */}
      <AuthHeader 
        title="Verificar Seu E-mail"
        subtitle={`Enviamos um código de verificação para ${emailAddress}`}
      />

      {/* Verification Form */}
      <View style={{ marginBottom: 24 }}>
        <FormInput
          value={code}
          onChangeText={setCode}
          placeholder="Digite seu código de verificação"
          icon="keypad-outline"
          keyboardType="number-pad"
        />
      </View>

      {/* Verify Button */}
      <AuthButton
        onPress={onVerifyPress}
        title="Verificar E-mail"
      />

      {/* Resend Code */}
      {onResendCode && (
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={onResendCode}>
          <Text style={{ 
            fontSize: 14, 
            color: '#ff6b35',
            fontWeight: '500'
          }}>
            Não recebeu o código? Reenviar
          </Text>
        </TouchableOpacity>
      )}
    </AuthLayout>
  )
}
