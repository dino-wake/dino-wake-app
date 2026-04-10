import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type AdBannerProps = {
  title: string;
};

export function AdBanner({ title }: AdBannerProps) {
  return (
    <Box
      className="overflow-hidden rounded-2xl bg-dino-warm-bg flex-row items-center px-4"
      style={{ height: 100 }}
    >
      <Box className="flex-1 gap-1">
        <Box className="self-start rounded bg-dino-neutral px-1.5 py-0.5">
          <Text className="text-dino-badge font-bold text-white">AD</Text>
        </Box>
        <Text
          className="text-dino-body font-semibold text-dino-text-primary"
          style={{ width: 200, lineHeight: 21 }}
          numberOfLines={3}
        >
          {title}
        </Text>
      </Box>
      <Text className="text-dino-emoji">🦖</Text>
    </Box>
  );
}
