import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "nativewind";

import { useAppStateRefetch } from "@/hooks/use-app-state-refetch";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { queryClient } from "@/lib/query-client";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useOnlineManager();
  useAppStateRefetch();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="system">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="alarm-ringing" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
            <Stack.Screen name="my-page" options={{ headerShown: false }} />
            <Stack.Screen name="dino-skin" options={{ headerShown: false }} />
            <Stack.Screen name="point-history" options={{ headerShown: false }} />
            <Stack.Screen name="weather-detail" options={{ headerShown: false }} />
            <Stack.Screen name="emotion-dial" options={{ headerShown: false }} />
            <Stack.Screen name="terms" options={{ headerShown: false }} />
            <Stack.Screen name="privacy" options={{ headerShown: false }} />
            <Stack.Screen name="app-version" options={{ headerShown: false }} />
            <Stack.Screen name="temp/sitemap" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
