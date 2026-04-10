import { type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Box } from "./ui/box";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return <Box style={[{ backgroundColor }, style]} {...otherProps} />;
}
