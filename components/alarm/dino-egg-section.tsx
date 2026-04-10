import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export function DinoEggSection() {
  return (
    <VStack className="items-center" space="md">
      <Image
        source={require("@/assets/images/dino_egg.png")}
        size="none"
        className="h-[134px] w-[127px]"
        resizeMode="contain"
        alt="dino egg"
        width={127}
        height={134}
      />
      <Box className="rounded-full bg-[#E0F5EC] px-4 py-1.5">
        <Text
          className="font-semibold text-[#7DCBA4]"
          style={{ fontSize: 12, letterSpacing: 2 }}
        >
          DREAMING...
        </Text>
      </Box>
    </VStack>
  );
}
