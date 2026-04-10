import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "nativewind";

import { useAppStateRefetch } from "@/hooks/use-app-state-refetch";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { queryClient } from "@/lib/query-client";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useOnlineManager();
  useAppStateRefetch();

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="system">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
