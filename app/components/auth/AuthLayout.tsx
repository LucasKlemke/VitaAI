import React from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
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
              {children}
            </BlurView>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}
