import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';

interface NameCardProps {
  userProfile: any;
  user: any;
}

export default function NameCard({ userProfile, user }: NameCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.full_name || user?.firstName || '');

  const handleSaveName = async () => {
    // TODO: Implement name update functionality
    setIsEditingName(false);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      }}
    >
      <Animated.View entering={FadeIn.delay(200)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f3f4f6',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16
          }}>
            <Ionicons name="person" size={20} color="#6b7280" />
          </View>
          
          <View style={{ flex: 1 }}>
            {isEditingName ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#374151',
                    paddingVertical: 4
                  }}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={handleSaveName}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: '#10b981'
                  }}
                >
                  <Ionicons name="checkmark" size={14} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingName(false);
                    setEditedName(userProfile?.full_name || user?.firstName || '');
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: '#ef4444'
                  }}
                >
                  <Ionicons name="close" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ 
                  fontSize: 16, 
                  color: '#6b7280'
                }}>
                  {editedName || 'Digite seu nome'}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditingName(true)}
                  style={{
                    padding: 4
                  }}
                >
                  <Ionicons name="pencil" size={14} color="#6b7280" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
