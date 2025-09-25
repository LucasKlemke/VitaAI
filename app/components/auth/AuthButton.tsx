import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AuthButtonProps {
  onPress: () => void
  title: string
  icon?: keyof typeof Ionicons.glyphMap
  disabled?: boolean
}

export default function AuthButton({ 
  onPress, 
  title, 
  icon = 'arrow-forward',
  disabled = false 
}: AuthButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#d1d5db' : '#ff6b35',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: disabled ? '#d1d5db' : '#ff6b35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: disabled ? 0.1 : 0.3,
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
        marginRight: icon ? 8 : 0
      }}>
        {title}
      </Text>
      {icon && (
        <Ionicons name={icon} size={20} color="white" />
      )}
    </TouchableOpacity>
  )
}
