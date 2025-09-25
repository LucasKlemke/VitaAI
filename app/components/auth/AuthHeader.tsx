import React from 'react'
import { View, Text, Image } from 'react-native'

interface AuthHeaderProps {
  title?: string
  subtitle?: string
  showSubtitle?: boolean
}

export default function AuthHeader({ 
  title, 
  subtitle, 
  showSubtitle = true 
}: AuthHeaderProps) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 32 }}>
      <Image 
        source={require('../../../assets/images/vita-icon-black.png')} 
        style={{ width: 60, height: 60, marginBottom: 16 }} 
      />
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#1f2937',
        marginBottom: 8
      }}>
        Vita.AI
      </Text>
      {showSubtitle && subtitle && (
        <Text style={{ 
          fontSize: 14, 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {subtitle}
        </Text>
      )}
      {title && (
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '600', 
          color: '#374151',
          marginBottom: 4,
          textAlign: 'center'
        }}>
          {title}
        </Text>
      )}
    </View>
  )
}
