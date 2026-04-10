import { Text, TouchableOpacity, View } from 'react-native';
import { TagActive, TagInactive } from './tag';

export function BriefingSection() {
  return (
    <View
      className="rounded-2xl bg-white p-4"
      style={{
        shadowColor: '#262626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center gap-2">
        <Text className="text-[14px] font-bold text-dino-text-primary">브리핑 설정하기</Text>
        <Text className="text-[14px] text-dino-border-strong">|</Text>
        <View className="h-[7px] w-[7px] rounded-full bg-dino-accent-green" />
        <TouchableOpacity>
          <Text className="text-[13px] font-semibold text-dino-accent-green">읽어주기</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-3 flex-row flex-wrap gap-2">
        <TagActive label="날씨" />
        <TagInactive label="띠별 운세" />
        <TagInactive label="별자리 운세" />
        <TagActive label="뉴스" />
      </View>
    </View>
  );
}
