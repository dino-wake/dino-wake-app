import { Colors } from '@/constants/theme';
import { Clock3 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import Svg, { Circle, Path } from 'react-native-svg';
import { router } from 'expo-router';

const ACCENT_GREEN = '#3D8A5A';
const MINT_LIGHT = '#DFF0E5';
const MINT = '#7DCBA4';

type Emotion = {
  label: string;
  angle: number; // 0 = top, clockwise in degrees
};

const EMOTIONS: Emotion[] = [
  { label: '상쾌해요', angle: 0 },
  { label: '설레요', angle: 60 },
  { label: '불안해요', angle: 120 },
  { label: '졸려요', angle: 180 },
  { label: '피곤해요', angle: 240 },
  { label: '편안해요', angle: 300 },
];

const DIAL_SIZE = 340;
const CX = 170;
const CY = 170;
const OUTER_R = 130;
const INNER_R = 109; // 0.84 × 130
const KNOB_R = (OUTER_R + INNER_R) / 2;
const LABEL_R = 158;

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180;
}

function pt(cx: number, cy: number, r: number, angle: number) {
  const rad = toRad(angle);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(startAngle: number, sweepAngle: number) {
  const endAngle = startAngle + sweepAngle;
  const large = sweepAngle > 180 ? 1 : 0;
  const s1 = pt(CX, CY, OUTER_R, startAngle);
  const e1 = pt(CX, CY, OUTER_R, endAngle);
  const e2 = pt(CX, CY, INNER_R, endAngle);
  const s2 = pt(CX, CY, INNER_R, startAngle);
  return `M ${s1.x} ${s1.y} A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${e1.x} ${e1.y} L ${e2.x} ${e2.y} A ${INNER_R} ${INNER_R} 0 ${large} 0 ${s2.x} ${s2.y} Z`;
}

function EmotionLabel({
  emotion,
  selected,
  onPress,
}: {
  emotion: Emotion;
  selected: boolean;
  onPress: () => void;
}) {
  const pos = pt(CX, CY, LABEL_R, emotion.angle);
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        left: pos.x - 36,
        top: pos.y - 12,
        width: 72,
        alignItems: 'center',
      }}
      hitSlop={8}
    >
      <Text
        style={{
          fontSize: 13,
          fontFamily: selected ? 'Outfit_700Bold' : 'Outfit_500Medium',
          color: selected ? Colors.light.text : Colors.light.icon,
        }}
      >
        {emotion.label}
      </Text>
    </Pressable>
  );
}

export default function EmotionDialScreen() {
  const [selected, setSelected] = useState<Emotion>(EMOTIONS[4]); // 피곤해요

  const arcEnd = selected.angle;
  const arcStart = arcEnd - 120;
  const knobPos = pt(CX, CY, KNOB_R, arcEnd);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Dino + Speech Bubble */}
      <VStack style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 15, paddingBottom: 16 }}>
        <View style={{ width: 280, height: 260, position: 'relative' }}>
          {/* Speech bubble */}
          <Box
            style={{
              position: 'absolute',
              top: 34,
              left: 165,
              backgroundColor: '#F0F0ED',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              maxWidth: 110,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Outfit_600SemiBold',
                color: Colors.light.icon,
                textAlign: 'center',
                lineHeight: 14 * 1.4,
                width: 80,
              }}
            >
              오늘 기분이 어때요?
            </Text>
          </Box>
          {/* Dino placeholder */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 160,
              height: 180,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 100 }}>🦕</Text>
          </View>
        </View>
      </VStack>

      {/* Dial Section */}
      <VStack style={{ paddingHorizontal: 24, paddingBottom: 0, gap: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Outfit_700Bold',
            color: Colors.light.text,
            letterSpacing: -0.3,
            textAlign: 'center',
          }}
        >
          {selected.label}
        </Text>

        {/* Dial */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: DIAL_SIZE, height: DIAL_SIZE, position: 'relative' }}>
            <Svg width={DIAL_SIZE} height={DIAL_SIZE} style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Background ring (full) */}
              <Path d={arcPath(0, 359.9)} fill="#E8E8E4" />
              {/* Progress arc (mint) */}
              <Path d={arcPath(arcStart, 120)} fill={MINT} />
              {/* Inner white circle */}
              <Circle cx={CX} cy={CY} r={INNER_R - 2} fill="#FFFFFF" />
              {/* Center dot */}
              <Circle cx={CX} cy={CY} r={3} fill="#D0D0CC" />
            </Svg>

            {/* Knob */}
            <View
              style={{
                position: 'absolute',
                left: knobPos.x - 17,
                top: knobPos.y - 17,
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: '#FFFFFF',
                borderWidth: 3,
                borderColor: MINT,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 4,
              }}
            />

            {/* Emotion Labels */}
            {EMOTIONS.map((emotion) => (
              <EmotionLabel
                key={emotion.label}
                emotion={emotion}
                selected={emotion.label === selected.label}
                onPress={() => setSelected(emotion)}
              />
            ))}
          </View>
        </View>

        {/* Skip Button */}
        <HStack
          style={{
            height: 48,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: Colors.light.border,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{ flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Clock3 size={16} color={Colors.light.icon} />
            <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>나중에 기록할래요</Text>
          </Pressable>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
