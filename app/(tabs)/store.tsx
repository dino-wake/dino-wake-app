import { Colors } from '@/constants/theme';
import { ShoppingBag } from 'lucide-react-native';
import { ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

const SKINS = [
  { id: '1', name: '초록 다이노', category: '기본 공룡 스킨', price: '300 P', emoji: '🦕' },
  { id: '2', name: '오렌지 다이노', category: '기본 공룡 스킨', price: '300 P', emoji: '🦖' },
  { id: '3', name: '블루 다이노', category: '기본 공룡 스킨', price: '500 P', emoji: '🐉' },
  { id: '4', name: '핑크 다이노', category: '기본 공룡 스킨', price: '500 P', emoji: '🦎' },
];

function StoreCard({
  name,
  category,
  price,
  emoji,
}: {
  name: string;
  category: string;
  price: string;
  emoji: string;
}) {
  return (
    <Box
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <Box
        style={{
          height: 120,
          backgroundColor: '#DFF0E5',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 56 }}>{emoji}</Text>
      </Box>
      <VStack style={{ padding: 12, gap: 6 }}>
        <Text style={{ fontSize: 11, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
          {category}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
          {name}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
          {price}
        </Text>
      </VStack>
    </Box>
  );
}

export default function StoreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 헤더 */}
        <VStack style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 20, gap: 4 }}>
          <Text style={{ fontSize: 26, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
            스토어
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
            나만의 다이노를 꾸며보세요
          </Text>
        </VStack>

        {/* 포인트 배너 */}
        <Box style={{ paddingHorizontal: 20 }}>
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <VStack style={{ gap: 2, flex: 1 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                보유 포인트
              </Text>
              <Text style={{ fontSize: 22, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
                1,240 P
              </Text>
            </VStack>
            <Pressable
              style={{
                backgroundColor: '#DFF0E5',
                borderRadius: 100,
                paddingHorizontal: 14,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ShoppingBag size={14} color="#3D8A5A" />
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
                내역 보기
              </Text>
            </Pressable>
          </Box>
        </Box>

        {/* 광고 배너 */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          <Box
            style={{
              backgroundColor: '#F5F0EA',
              borderRadius: 16,
              height: 100,
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                position: 'absolute',
                top: 12,
                left: 14,
                backgroundColor: Colors.light.icon,
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 9, fontFamily: 'Outfit_700Bold', color: '#FFFFFF', letterSpacing: 1 }}>
                AD
              </Text>
            </Box>
            <Text
              style={{
                position: 'absolute',
                top: 38,
                left: 14,
                fontSize: 15,
                fontFamily: 'Outfit_600SemiBold',
                color: Colors.light.text,
                lineHeight: 15 * 1.4,
                width: 200,
              }}
            >
              {'디노 알람과 함께하는\n아침의 시작 ☀️'}
            </Text>
            <Text style={{ position: 'absolute', top: 24, right: 14, fontSize: 48 }}>🦖</Text>
          </Box>
        </Box>

        {/* 카테고리 탭 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 }}>
          <HStack style={{ gap: 10 }}>
            <Pressable
              style={{
                flex: 1,
                height: 44,
                backgroundColor: '#3D8A5A',
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: '#FFFFFF' }}>
                스킨
              </Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                height: 44,
                backgroundColor: '#FFFFFF',
                borderRadius: 100,
                borderWidth: 1.5,
                borderColor: Colors.light.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>
                사운드
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* 스킨 그리드 */}
        <Box style={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}>
          {[0, 2].map((startIdx) => (
            <HStack key={startIdx} style={{ gap: 12 }}>
              {SKINS.slice(startIdx, startIdx + 2).map((skin) => (
                <StoreCard
                  key={skin.id}
                  name={skin.name}
                  category={skin.category}
                  price={skin.price}
                  emoji={skin.emoji}
                />
              ))}
            </HStack>
          ))}
        </Box>

      </ScrollView>
    </SafeAreaView>
  );
}
