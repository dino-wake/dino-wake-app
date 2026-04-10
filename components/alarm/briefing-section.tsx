import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { TagActive, TagInactive } from './tag';

export function BriefingSection() {
  return (
    <Box
      className="rounded-2xl bg-background-0 p-4"
      style={{
        shadowColor: '#262626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <VStack space="sm">
        <HStack className="items-center" space="sm">
          <Text className="text-[14px] font-bold text-dino-text-primary">브리핑 설정하기</Text>
          <Text className="text-[14px] text-dino-border-strong">|</Text>
          <Box className="h-[7px] w-[7px] rounded-full bg-dino-accent-green" />
          <Pressable>
            <Text className="text-[13px] font-semibold text-dino-accent-green">읽어주기</Text>
          </Pressable>
        </HStack>
        <HStack className="flex-wrap" space="sm">
          <TagActive label="날씨" />
          <TagInactive label="띠별 운세" />
          <TagInactive label="별자리 운세" />
          <TagActive label="뉴스" />
        </HStack>
      </VStack>
    </Box>
  );
}
