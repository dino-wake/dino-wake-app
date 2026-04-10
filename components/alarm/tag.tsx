import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type TagProps = {
  label: string;
};

export function TagActive({ label }: TagProps) {
  return (
    <Box className="rounded-full bg-dino-accent-green-light px-3.5 py-1.5">
      <Text className="text-dino-tag font-semibold text-dino-accent-green-dark">{label}</Text>
    </Box>
  );
}

export function TagInactive({ label }: TagProps) {
  return (
    <Box className="rounded-full border border-dino-border px-3.5 py-1.5">
      <Text className="text-dino-tag font-medium text-dino-text-secondary">{label}</Text>
    </Box>
  );
}
