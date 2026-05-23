import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type DinoEggSectionProps = {
  nextAlarmLabel: string;
};

export function DinoEggSection({ nextAlarmLabel }: DinoEggSectionProps) {
  return (
    <VStack className="items-center" space="md">
      <Image
        source={require("@/assets/images/dino_egg.png")}
        size="none"
        resizeMode="contain"
        alt="dino egg"
        style={{ width: 127, height: 134 }}
      />
      <Box className="rounded-full bg-dino-mint-light px-4 py-1.5">
        <Text className="text-dino-label tracking-dino-caps font-semibold text-dino-mint">
          {nextAlarmLabel}
        </Text>
      </Box>
    </VStack>
  );
}
