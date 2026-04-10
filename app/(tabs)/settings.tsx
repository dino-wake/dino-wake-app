import { Colors } from '@/constants/theme';
import {
  Bell,
  ChevronRight,
  Clock4,
  Info,
  LayoutGrid,
  ListChecks,
  Mic,
  Moon,
  Palette,
  Pencil,
  Vibrate,
} from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { ScrollView, Switch, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

// ─── 공통 설정 행 ─────────────────────────────────────────────────────────────

function SettingsRow({
  icon,
  iconBg,
  title,
  sub,
  right,
  onPress,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  right?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 }}>
        <Box
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <VStack style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
            {title}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
            {sub}
          </Text>
        </VStack>
        {right}
      </HStack>
    </Pressable>
  );
}

function Divider() {
  return (
    <View style={{ height: 1, backgroundColor: Colors.light.border, marginLeft: 20 }} />
  );
}

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {children}
    </Box>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontFamily: 'Outfit_600SemiBold',
        color: Colors.light.icon,
        letterSpacing: 0.4,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}

export default function SettingsScreen() {
  const [vibrate, setVibrate] = useState(true);
  const [briefingOn, setBriefingOn] = useState(true);
  const [tts, setTts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleStyle = (value: boolean) => ({
    trackColor: { false: Colors.light.border, true: Colors.light.accentGreenLight },
    thumbColor: '#FFFFFF' as string,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 헤더 */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 20 }}>
          <Text style={{ fontSize: 26, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
            설정
          </Text>
        </Box>

        {/* 프로필 카드 */}
        <Box style={{ paddingHorizontal: 20 }}>
          <Pressable>
            <Box
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <VStack style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
                  다이노 집사
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                  dino@alarm.app
                </Text>
              </VStack>
              <ChevronRight size={18} color={Colors.light.icon} />
            </Box>
          </Pressable>
        </Box>

        {/* 다이노 섹션 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 24, gap: 8 }}>
          <SectionLabel label="다이노" />
          <SectionCard>
            <SettingsRow
              icon={<Palette size={16} color="#3D8A5A" />}
              iconBg="#DFF0E5"
              title="다이노 스킨"
              sub="초록 다이노 (기본)"
              right={<ChevronRight size={16} color={Colors.light.icon} />}
            />
            <Divider />
            <SettingsRow
              icon={<Bell size={16} color="#3D8A5A" />}
              iconBg="#DFF0E5"
              title="울음소리"
              sub="초록 다이노 울음소리 (기본)"
              right={<ChevronRight size={16} color={Colors.light.icon} />}
            />
            <Divider />
            <SettingsRow
              icon={<Pencil size={16} color="#3D8A5A" />}
              iconBg="#DFF0E5"
              title="다이노 이름"
              sub="미설정"
              right={<ChevronRight size={16} color={Colors.light.icon} />}
            />
          </SectionCard>
        </Box>

        {/* 광고 배너 */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 24 }}>
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

        {/* 알람 섹션 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 24, gap: 8 }}>
          <SectionLabel label="알람" />
          <SectionCard>
            <SettingsRow
              icon={<Vibrate size={16} color="#3D8A5A" />}
              iconBg="#DFF0E5"
              title="진동"
              sub="알람 시 진동을 울립니다"
              right={
                <Switch
                  value={vibrate}
                  onValueChange={setVibrate}
                  trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <Divider />
            <SettingsRow
              icon={<Clock4 size={16} color="#3D8A5A" />}
              iconBg="#DFF0E5"
              title="다시알림"
              sub="5분 간격, 3회"
              right={<ChevronRight size={16} color={Colors.light.icon} />}
            />
          </SectionCard>
        </Box>

        {/* 브리핑 섹션 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 24, gap: 8 }}>
          <SectionLabel label="브리핑" />
          <SectionCard>
            <SettingsRow
              icon={<LayoutGrid size={16} color="#E8A054" />}
              iconBg="#FFF0E8"
              title="브리핑 사용"
              sub="알람 해제 후 브리핑을 표시합니다"
              right={
                <Switch
                  value={briefingOn}
                  onValueChange={setBriefingOn}
                  trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <Divider />
            <SettingsRow
              icon={<ListChecks size={16} color="#E8A054" />}
              iconBg="#FFF0E8"
              title="브리핑 항목"
              sub="날씨, 뉴스, 운세"
              right={<ChevronRight size={16} color={Colors.light.icon} />}
            />
            <Divider />
            <SettingsRow
              icon={<Mic size={16} color="#E8A054" />}
              iconBg="#FFF0E8"
              title="AI 읽어주기"
              sub="브리핑을 음성으로 읽어줍니다"
              right={
                <Switch
                  value={tts}
                  onValueChange={setTts}
                  trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </SectionCard>
        </Box>

        {/* 앱 섹션 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, gap: 8 }}>
          <SectionLabel label="앱" />
          <SectionCard>
            <SettingsRow
              icon={<Moon size={16} color="#8B6FD4" />}
              iconBg="#EEE8FF"
              title="다크 모드"
              sub="시스템 설정 따름"
              right={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <Divider />
            <SettingsRow
              icon={<Info size={16} color="#8B6FD4" />}
              iconBg="#EEE8FF"
              title="버전 정보"
              sub="v1.0.0"
              right={<ChevronRight size={16} color={Colors.light.icon} />}
            />
          </SectionCard>
        </Box>

      </ScrollView>
    </SafeAreaView>
  );
}
