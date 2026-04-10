import { Colors } from '@/constants/theme';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

const SKINS = [
  { id: '1', name: '초록 다이노', emoji: '🦕', owned: true },
  { id: '2', name: '오렌지 다이노', emoji: '🦖', owned: true },
  { id: '3', name: '블루 다이노', emoji: '🐉', owned: false },
  { id: '4', name: '핑크 다이노', emoji: '🦎', owned: false },
];

export default function DinoSkinScreen() {
  const [selected, setSelected] = useState('1');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      {/* 헤더 */}
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
          다이노 스킨
        </Text>
        <View style={{ flex: 1 }} />
        <View style={{ width: 36 }} />
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 현재 사용 중 */}
        <VStack style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 12 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon, letterSpacing: 0.4 }}>
            현재 사용 중
          </Text>
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Box
              style={{
                width: 110,
                height: 90,
                borderRadius: 14,
                backgroundColor: '#DFF0E5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 56 }}>🦕</Text>
            </Box>
            <VStack style={{ gap: 6, flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
                초록 다이노
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                기본 스킨
              </Text>
              <Box
                style={{
                  backgroundColor: '#DFF0E5',
                  borderRadius: 100,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  alignSelf: 'flex-start',
                }}
              >
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
                  사용 중
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>

        <View style={{ height: 1, backgroundColor: Colors.light.border }} />

        {/* 보유 스킨 */}
        <VStack style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 14 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon, letterSpacing: 0.4 }}>
            보유 중인 스킨
          </Text>
          {[0, 2].map((startIdx) => (
            <HStack key={startIdx} style={{ gap: 12 }}>
              {SKINS.slice(startIdx, startIdx + 2).map((skin) => (
                <Pressable
                  key={skin.id}
                  style={{ flex: 1 }}
                  onPress={() => skin.owned && setSelected(skin.id)}
                >
                  <Box
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 20,
                      overflow: 'hidden',
                      borderWidth: selected === skin.id ? 2 : 0,
                      borderColor: '#3D8A5A',
                      opacity: skin.owned ? 1 : 0.5,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 10,
                      elevation: 2,
                    }}
                  >
                    <Box style={{ height: 100, backgroundColor: '#DFF0E5', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 50 }}>{skin.emoji}</Text>
                      {selected === skin.id && (
                        <Box
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            backgroundColor: '#3D8A5A',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={13} color="#FFFFFF" />
                        </Box>
                      )}
                    </Box>
                    <VStack style={{ padding: 12, gap: 2 }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                        {skin.name}
                      </Text>
                      {!skin.owned && (
                        <Text style={{ fontSize: 11, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                          미보유
                        </Text>
                      )}
                    </VStack>
                  </Box>
                </Pressable>
              ))}
            </HStack>
          ))}
        </VStack>

      </ScrollView>
    </SafeAreaView>
  );
}
