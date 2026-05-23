import { Colors } from '@/constants/theme';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { deleteDailyMemo, getDailyMemo, initDailyMemoDb, upsertDailyMemo } from '@/lib/db/daily-memo';
import {
  type BriefingSettings,
  getBriefingSettings,
  initBriefingSettingsDb,
  saveBriefingSettings,
} from '@/lib/db/briefing-settings';
import { initAlarmDb } from '@/lib/db/alarms';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';

// ─── 토글 태그 ────────────────────────────────────────────────────────────────

function ToggleTag({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      {active ? (
        <Box className="rounded-full bg-dino-accent-green-light px-3.5 py-1.5">
          <Text className="text-dino-tag font-semibold text-dino-accent-green-dark">{label}</Text>
        </Box>
      ) : (
        <Box className="rounded-full border border-dino-border px-3.5 py-1.5">
          <Text className="text-dino-tag font-medium text-dino-text-secondary">{label}</Text>
        </Box>
      )}
    </Pressable>
  );
}

// ─── BriefingSection ─────────────────────────────────────────────────────────

const DEFAULTS: BriefingSettings = {
  narration: false,
  weather: true,
  fortuneZodiac: false,
  fortuneStar: false,
  news: true,
};

export function BriefingSection() {
  const [settings, setSettings] = useState<BriefingSettings>(DEFAULTS);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    initAlarmDb();
    initBriefingSettingsDb();
    initDailyMemoDb();
    setSettings(getBriefingSettings());
    setMemo(getDailyMemo());
  }, []);

  function toggle(key: keyof BriefingSettings) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveBriefingSettings(next);
  }

  function handleBlur() {
    const trimmed = memo.trim();
    if (trimmed === '') {
      deleteDailyMemo();
    } else {
      upsertDailyMemo(trimmed);
    }
  }

  function handleClear() {
    setMemo('');
    deleteDailyMemo();
  }

  return (
    <Box
      className="rounded-2xl bg-background-0 px-4 py-[14px]"
      style={{
        shadowColor: Colors.light.shadowNeutral,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <VStack space="sm">
        {/* 헤더: 타이틀 + 읽어주기 토글 */}
        <HStack className="items-center" space="sm">
          <Text className="text-dino-body-md font-bold text-dino-text-primary">브리핑 설정하기</Text>
          <Text className="text-dino-body-md text-dino-border-strong">|</Text>
          <Pressable
            onPress={() => toggle('narration')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          >
            <Box
              className="rounded-full"
              style={{
                width: 7,
                height: 7,
                backgroundColor: settings.narration ? '#3D8A5A' : Colors.light.border,
              }}
            />
            <Text
              className="text-dino-tag font-semibold"
              style={{ color: settings.narration ? '#3D8A5A' : Colors.light.icon }}
            >
              읽어주기
            </Text>
          </Pressable>
        </HStack>

        {/* 브리핑 항목 토글 태그 */}
        <HStack className="flex-wrap" space="sm">
          <ToggleTag label="날씨"       active={settings.weather}       onPress={() => toggle('weather')} />
          <ToggleTag label="띠별 운세"  active={settings.fortuneZodiac} onPress={() => toggle('fortuneZodiac')} />
          <ToggleTag label="별자리 운세" active={settings.fortuneStar}   onPress={() => toggle('fortuneStar')} />
          <ToggleTag label="뉴스"       active={settings.news}          onPress={() => toggle('news')} />
        </HStack>

        {/* 구분선 */}
        <Box style={{ height: 1, backgroundColor: Colors.light.border, marginVertical: 2 }} />

        {/* 준비물 및 일정 메모 */}
        <VStack space="xs">
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Outfit_600SemiBold',
              color: Colors.light.icon,
            }}
          >
            준비물 및 일정 메모
          </Text>
          <HStack
            style={{
              backgroundColor: '#F7F7F5',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: 'flex-start',
              minHeight: 64,
            }}
          >
            <TextInput
              value={memo}
              onChangeText={setMemo}
              onBlur={handleBlur}
              placeholder="내일 챙겨야 할 물건이나 중요한 일정을 적어주세요."
              placeholderTextColor={Colors.light.icon}
              multiline
              style={{
                flex: 1,
                fontFamily: 'Outfit_400Regular',
                fontSize: 13,
                color: Colors.light.text,
                textAlignVertical: 'top',
                lineHeight: 20,
              }}
            />
            {memo.length > 0 && (
              <Pressable onPress={handleClear} style={{ paddingLeft: 8, paddingTop: 2 }}>
                <X size={14} color={Colors.light.icon} />
              </Pressable>
            )}
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
