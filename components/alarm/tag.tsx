import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type TagProps = {
  label: string;
};

export function TagActive({ label }: TagProps) {
  return (
    <Box className="rounded-full bg-[#7DCBA4] px-3.5 py-1.5">
      <Text className="text-[13px] font-semibold text-[#2B7A4B]">{label}</Text>
    </Box>
  );
}

export function TagInactive({ label }: TagProps) {
  return (
    <Box className="rounded-full border border-dino-border px-3.5 py-1.5">
      <Text className="text-[13px] font-medium text-dino-text-secondary">{label}</Text>
    </Box>
  );
}
