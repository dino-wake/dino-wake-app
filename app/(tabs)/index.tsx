import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/alarm/ad-banner';
import { AlarmCard } from '@/components/alarm/alarm-card';
import { BriefingSection } from '@/components/alarm/briefing-section';
import { DinoEggSection } from '@/components/alarm/dino-egg-section';
import { TimeDisplay } from '@/components/alarm/time-display';

const INITIAL_ALARMS = [
  { id: '1', time: '07:00', label: '기상', days: '월  화  수  목  금', enabled: true },
  { id: '2', time: '09:30', label: '주말', days: '토  일', enabled: false },
];

export default function HomeScreen() {
  const [alarms, setAlarms] = useState(INITIAL_ALARMS);

  function handleToggle(id: string, value: boolean) {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: value } : a)));
  }

  function handleDelete(id: string) {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <SafeAreaView className="flex-1 bg-dino-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-10 gap-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-6">
          <TimeDisplay time="17:49" />
        </View>

        <DinoEggSection />

        <BriefingSection />

        <AdBanner title="공룡과 함께 더 건강한 아침을 시작해보세요" />

        <View className="gap-4">
          {alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              time={alarm.time}
              label={alarm.label}
              days={alarm.days}
              enabled={alarm.enabled}
              onToggle={(value) => handleToggle(alarm.id, value)}
              onDelete={() => handleDelete(alarm.id)}
            />
          ))}
        </View>

        <View className="items-center pt-2">
          <TouchableOpacity
            className="h-[52px] w-[52px] items-center justify-center rounded-full bg-dino-accent-orange"
            style={{
              shadowColor: '#D9893A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
