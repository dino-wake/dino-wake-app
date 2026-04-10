import { Colors } from '@/constants/theme';
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  MapPin,
  Play,
  Sun,
} from 'lucide-react-native';
import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

const FORECAST = [
  { time: '15시', icon: 'sun', temp: '2°' },
  { time: '16시', icon: 'sun', temp: '2°' },
  { time: '17시', icon: 'sun', temp: '1°' },
  { time: '18시', icon: 'cloud', temp: '1°' },
  { time: '19시', icon: 'cloud', temp: '1°' },
  { time: '20시', icon: 'cloud', temp: '0°' },
];

function ForecastIcon({ icon }: { icon: string }) {
  const color = icon === 'sun' ? '#E8A054' : Colors.light.icon;
  return icon === 'sun' ? (
    <Sun size={24} color={color} />
  ) : (
    <Cloud size={24} color={color} />
  );
}

export default function BriefingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 날씨 카드 */}
        <Box
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            padding: 24,
            paddingTop: 16,
            gap: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {/* 위치 + 날씨 정보 */}
          <HStack style={{ alignItems: 'center', width: '100%' }}>
            <HStack style={{ alignItems: 'center', gap: 6, flex: 1 }}>
              <MapPin size={14} color="#3D8A5A" />
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                서울특별시
              </Text>
              <ChevronRight size={14} color="#3D8A5A" strokeWidth={2} style={{ opacity: 0.5 }} />
            </HStack>
            <VStack style={{ alignItems: 'flex-end', gap: 2 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                흐림
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: '#3D8A5A', opacity: 0.7 }}>
                최고 3° | 최저 -5°
              </Text>
            </VStack>
          </HStack>

          {/* 시간별 예보 */}
          <HStack style={{ justifyContent: 'space-between', width: '100%' }}>
            {FORECAST.map((f) => (
              <VStack key={f.time} style={{ alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>
                  {f.time}
                </Text>
                <ForecastIcon icon={f.icon} />
                <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                  {f.temp}
                </Text>
              </VStack>
            ))}
          </HStack>

          {/* 날씨 요약 */}
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Outfit_700Bold',
              color: '#3D8A5A',
              lineHeight: 15 * 1.5,
              textAlign: 'center',
            }}
          >
            오늘은 흐린 날씨로 최고 3°, 최저 -5°{'\n'}입니다. 따뜻하게 입으세요!
          </Text>
        </Box>

        {/* 다시보기 + 감정 버튼 */}
        <HStack style={{ paddingHorizontal: 24, paddingTop: 20, gap: 10 }}>
          <Pressable
            style={{
              flex: 1,
              height: 56,
              backgroundColor: '#DFF0E5',
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Play size={20} color="#3D8A5A" />
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A', lineHeight: 13 * 1.4 }}>
              {'오늘의 브리핑\n다시보기'}
            </Text>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              height: 56,
              backgroundColor: '#FFF0E8',
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 22 }}>🦕</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#E07050', lineHeight: 13 * 1.4 }}>
              {'오늘 기분은\n어때요?'}
            </Text>
          </Pressable>
        </HStack>

        {/* 뉴스 카드 */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              height: 200,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* 뉴스 텍스트 */}
            <VStack style={{ position: 'absolute', top: 24, left: 20, width: 316, gap: 10 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Outfit_700Bold',
                  color: Colors.light.text,
                  lineHeight: 17 * 1.35,
                }}
              >
                AI 기술 혁신으로 새로운 시대 개막
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Outfit_400Regular',
                  color: Colors.light.icon,
                  lineHeight: 13 * 1.5,
                }}
              >
                인공지능 기술의 급속한 발전으로 다양한 산업 분야에서 혁신적인 변화가 일어나고 있습니다.
              </Text>
            </VStack>

            {/* 페이지네이션 */}
            <HStack
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 20,
                paddingBottom: 16,
                alignItems: 'center',
              }}
            >
              <HStack style={{ gap: 6, alignItems: 'center', flex: 1 }}>
                <Box style={{ width: 24, height: 6, borderRadius: 3, backgroundColor: '#3D8A5A' }} />
                <Box style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.light.border }} />
                <Box style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.light.border }} />
              </HStack>
              <HStack style={{ gap: 8, paddingHorizontal: 12 }}>
                <Pressable
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#F7F7F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={16} color={Colors.light.icon} />
                </Pressable>
                <Pressable
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#3D8A5A',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={16} color="#FFFFFF" />
                </Pressable>
              </HStack>
            </HStack>
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

        {/* 운세 카드 */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}>
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              gap: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* 운세 헤더 */}
            <HStack style={{ alignItems: 'center', width: '100%' }}>
              <HStack style={{ alignItems: 'center', gap: 8, flex: 1 }}>
                <Box
                  style={{
                    backgroundColor: '#3D8A5A',
                    borderRadius: 100,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ fontSize: 10, fontFamily: 'Outfit_700Bold', color: '#FFFFFF', letterSpacing: 1 }}>
                    TODAY
                  </Text>
                </Box>
                <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                  오늘의 운세
                </Text>
              </HStack>
              <Box
                style={{
                  backgroundColor: '#B8DFBE',
                  borderRadius: 100,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>
                  물병자리
                </Text>
              </Box>
            </HStack>

            {/* 운세 설명 */}
            <Box
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: Colors.light.border,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Outfit_500Medium',
                  color: Colors.light.icon,
                  lineHeight: 13 * 1.6,
                }}
              >
                오늘은 새로운 시작을 위한 좋은 날입니다. 긍정적인 마음가짐으로 하루를 시작하면 예상치 못한 행운이 찾아올 거예요. ✨
              </Text>
            </Box>

            {/* 운 점수 */}
            <HStack style={{ justifyContent: 'space-between' }}>
              {[
                { icon: '💰', label: '금전운', dots: '●●●●', color: '#B8DFBE', dotColor: '#3D8A5A' },
                { icon: '❤️', label: '애정운', dots: '●●●●●', color: '#FFD6CC', dotColor: '#E07050' },
                { icon: '💼', label: '사업운', dots: '●●●●', color: '#FFE8CC', dotColor: '#E8A054' },
              ].map((item) => (
                <VStack
                  key={item.label}
                  style={{
                    alignItems: 'center',
                    gap: 6,
                    width: 90,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    padding: 14,
                    paddingHorizontal: 8,
                    borderWidth: 1,
                    borderColor: item.color,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: 8, letterSpacing: 2, color: item.dotColor }}>
                    {item.dots}
                  </Text>
                </VStack>
              ))}
            </HStack>

            {/* 행운의 색 + 숫자 */}
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
              <VStack style={{ gap: 6 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>
                  행운의 색
                </Text>
                <HStack style={{ alignItems: 'center', gap: 8 }}>
                  {['#3D8A5A', '#E8A054', '#E07050'].map((c) => (
                    <Box
                      key={c}
                      style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c }}
                    />
                  ))}
                </HStack>
              </VStack>
              <VStack style={{ gap: 6, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>
                  행운의 숫자
                </Text>
                <Text style={{ fontSize: 30, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                  7
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Box>

      </ScrollView>
    </SafeAreaView>
  );
}
