import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface FormInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  icon: keyof typeof Ionicons.glyphMap
  secureTextEntry?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
  keyboardType?: 'default' | 'email-address' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}

export default function FormInput({
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry = false,
  showPassword = false,
  onTogglePassword,
  keyboardType = 'default',
  autoCapitalize = 'sentences'
}: FormInputProps) {
  return (
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
        <Ionicons name={icon} size={20} color="#6b7280" style={{ marginRight: 12 }} />
        <TextInput
          style={{ 
            flex: 1, 
            fontSize: 16,
            color: '#1f2937'
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {onTogglePassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={{ padding: 4 }}
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
