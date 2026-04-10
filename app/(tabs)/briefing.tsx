import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BriefingScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText type="title">브리핑</ThemedText>
    </ThemedView>
  );
}
