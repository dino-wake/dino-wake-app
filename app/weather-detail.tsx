import { Colors } from '@/constants/theme';
import {
  ChevronLeft,
  Cloud,
  CloudRain,
  Droplets,
  Menu,
  Snowflake,
  Sun,
} from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

const ACCENT_ORANGE = '#E8A054';
const ACCENT_CORAL = '#E05555';
const MINT = '#7DCBA4';
const ACCENT_GREEN = '#3D8A5A';
const MINT_LIGHT = '#DFF0E5';
const CARD_BG = '#FFFFFF';

function WeatherIcon({ name, size, color }: { name: string; size: number; color: string }) {
  if (name === 'sun') return <Sun size={size} color={color} />;
  if (name === 'cloud-rain') return <CloudRain size={size} color={color} />;
  if (name === 'snowflake') return <Snowflake size={size} color={color} />;
  return <Cloud size={size} color={color} />;
}

const HOURLY = [
  { time: '오후 4시', icon: 'cloud', iconColor: ACCENT_GREEN, temp: '0°C', rain: '0%', active: true },
  { time: '오후 5시', icon: 'cloud', iconColor: ACCENT_ORANGE, temp: '0°C', rain: '0%', active: false },
  { time: '오후 6시', icon: 'cloud', iconColor: Colors.light.icon, temp: '0°C', rain: '0%', active: false },
  { time: '오후 7시', icon: 'cloud', iconColor: Colors.light.icon, temp: '0°C', rain: '0%', active: false },
];

const WEEKLY = [
  { date: '01/14', day: '수요일', icon: 'sun', iconColor: ACCENT_ORANGE, temp: '0°C/-6°C', rain: '0%', rainColor: Colors.light.icon, active: true },
  { date: '01/15', day: '목요일', icon: 'cloud-rain', iconColor: Colors.light.icon, temp: '7°C/0°C', rain: '24%', rainColor: ACCENT_CORAL, active: false },
  { date: '01/16', day: '금요일', icon: 'sun', iconColor: ACCENT_ORANGE, temp: '6°C/0°C', rain: '0%', rainColor: Colors.light.icon, active: false },
  { date: '01/17', day: '토요일', icon: 'sun', iconColor: ACCENT_ORANGE, temp: '5°C/0°C', rain: '0%', rainColor: Colors.light.icon, weekend: true, active: false },
  { date: '01/18', day: '일요일', icon: 'snowflake', iconColor: MINT, temp: '5°C/1°C', rain: '100%', rainColor: ACCENT_GREEN, weekend: true, active: false },
  { date: '01/19', day: '월요일', icon: 'snowflake', iconColor: MINT, temp: '1°C/-7°C', rain: '100%', rainColor: ACCENT_GREEN, active: false },
  { date: '01/20', day: '화요일', icon: 'sun', iconColor: ACCENT_ORANGE, temp: '-4°C/8°C', rain: '0%', rainColor: Colors.light.icon, active: false },
];

export default function WeatherDetailScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {/* Header */}
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, height: 56 }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>날씨</Text>
        <View style={{ flex: 1 }} />
        <Pressable style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Menu size={24} color={Colors.light.text} />
        </Pressable>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <VStack style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 28, gap: 16 }}>
          {/* Location Badge */}
          <Box style={{ backgroundColor: MINT_LIGHT, borderRadius: 16, height: 72, justifyContent: 'center', paddingHorizontal: 20 }}>
            <VStack style={{ gap: 4 }}>
              <Text style={{ fontSize: 20, fontFamily: 'Outfit_800ExtraBold', color: Colors.light.text }}>서울특별시</Text>
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>1월 14일 수요일 오후 3시 | °C</Text>
            </VStack>
          </Box>

          {/* Condition */}
          <HStack style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 22 }}>🌤</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>구름이 적은 날이에요.</Text>
          </HStack>

          {/* Temperature */}
          <HStack style={{ alignItems: 'center', gap: 12 }}>
            <Cloud size={52} color={Colors.light.icon} />
            <Text style={{ fontSize: 64, fontFamily: 'Outfit_300Light', color: Colors.light.text, lineHeight: 76 }}>0°C</Text>
          </HStack>

          {/* Air Quality */}
          <HStack style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>돌발 대기  |</Text>
            <Text style={{ fontSize: 13 }}>🌈</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: ACCENT_GREEN }}>보통</Text>
          </HStack>
        </VStack>

        {/* Detail Cards */}
        <HStack style={{ paddingHorizontal: 20, gap: 10, justifyContent: 'space-between' }}>
          {[
            { label: '최고', value: '0°C' },
            { label: '최저', value: '-6°C' },
            { label: '풍속', value: '2.6m/s' },
            { label: '습도', value: '29%' },
          ].map((card) => (
            <VStack
              key={card.label}
              style={{
                flex: 1,
                height: 80,
                backgroundColor: CARD_BG,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>{card.label}</Text>
              <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>{card.value}</Text>
            </VStack>
          ))}
        </HStack>

        {/* Ad Banner */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          <Box
            style={{
              backgroundColor: '#F5F0EA',
              borderRadius: 16,
              height: 100,
              overflow: 'hidden',
            }}
          >
            <View style={{ position: 'absolute', top: 12, left: 14 }}>
              <Box style={{ backgroundColor: Colors.light.icon, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Outfit_700Bold', color: CARD_BG, letterSpacing: 1 }}>AD</Text>
              </Box>
            </View>
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

        {/* Hourly Section */}
        <VStack style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8, gap: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>시간대별 날씨</Text>
          <HStack style={{ gap: 12, justifyContent: 'space-between' }}>
            {HOURLY.map((h) => (
              <VStack
                key={h.time}
                style={{
                  flex: 1,
                  height: 110,
                  backgroundColor: h.active ? MINT_LIGHT : CARD_BG,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingHorizontal: 8,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: h.active ? 0 : 0.04,
                  shadowRadius: 6,
                  elevation: h.active ? 0 : 1,
                }}
              >
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>{h.time}</Text>
                <Cloud size={24} color={h.iconColor} />
                <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>{h.temp}</Text>
                <HStack style={{ alignItems: 'center', gap: 2 }}>
                  <Droplets size={10} color={Colors.light.icon} />
                  <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>{h.rain}</Text>
                </HStack>
              </VStack>
            ))}
          </HStack>
        </VStack>

        {/* Weekly Section */}
        <VStack style={{ paddingHorizontal: 20, paddingTop: 24, gap: 8 }}>
          <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: Colors.light.text, paddingHorizontal: 4 }}>주간 날씨</Text>
          <View style={{ height: 12 }} />
          {WEEKLY.map((w, i) => (
            <HStack
              key={w.date}
              style={{
                height: 68,
                backgroundColor: i === 0 ? MINT_LIGHT : CARD_BG,
                borderRadius: 16,
                paddingHorizontal: 16,
                alignItems: 'center',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: i === 0 ? 0 : 0.04,
                shadowRadius: 6,
                elevation: i === 0 ? 0 : 1,
              }}
            >
              <VStack style={{ width: 50, gap: 2 }}>
                <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>{w.date}</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: w.weekend ? ACCENT_CORAL : Colors.light.icon }}>{w.day}</Text>
              </VStack>
              <View style={{ flex: 1 }} />
              <WeatherIcon name={w.icon} size={28} color={w.iconColor} />
              <View style={{ flex: 1 }} />
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>{w.temp}</Text>
              <View style={{ width: 16 }} />
              <HStack style={{ alignItems: 'center', gap: 3 }}>
                <Droplets size={12} color={w.rainColor} />
                <Text style={{ fontSize: 12, fontFamily: w.rain === '100%' ? 'Outfit_600SemiBold' : 'Outfit_500Medium', color: w.rainColor }}>{w.rain}</Text>
              </HStack>
            </HStack>
          ))}
        </VStack>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
