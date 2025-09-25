import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

interface AuthLinkProps {
  text: string
  linkText: string
  href: string
}

export default function AuthLink({ text, linkText, href }: AuthLinkProps) {
  return (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ 
        fontSize: 14, 
        color: '#6b7280'
      }}>
        {text}{' '}
      </Text>
      <Link href={href}>
        <Text style={{ 
          fontSize: 14, 
          color: '#ff6b35',
          fontWeight: '600'
        }}>
          {linkText}
        </Text>
      </Link>
    </View>
  )
}
