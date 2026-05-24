import {
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
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAppStateRefetch } from "@/hooks/use-app-state-refetch";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { queryClient } from "@/lib/query-client";
import { requestNotificationPermission } from "@/lib/notifications";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  // fullScreenAction으로 앱 실행 시 라우팅할 alarmId (네비게이션 준비 전에 수신될 수 있어서 state로 보관)
  const [pendingAlarmId, setPendingAlarmId] = useState<string | null>(null);

  useOnlineManager();
  useAppStateRefetch();

  // 알림 권한 요청
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // ── Android: notifee 이벤트 처리 ────────────────────────────────────────────

  // notifee 포그라운드 이벤트 (앱이 실행 중일 때 알림 도착)
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let unsubscribe: (() => void) | undefined;
    import('@notifee/react-native').then(({ default: notifee, EventType }) => {
      unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.DELIVERED || type === EventType.PRESS) {
          const alarmId = detail.notification?.data?.alarmId as string | undefined;
          if (alarmId) {
            router.push({ pathname: '/alarm-ringing', params: { alarmId } });
          }
        }
      });
    });

    return () => unsubscribe?.();
  }, []);

  // notifee 초기 알림 수집 (fullScreenAction으로 앱 실행 시)
  // 네비게이션이 아직 마운트 전일 수 있어서 state에만 저장
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    import('@notifee/react-native').then(({ default: notifee }) => {
      notifee.getInitialNotification().then((initialNotification) => {
        if (initialNotification) {
          const alarmId = initialNotification.notification.data?.alarmId as string | undefined;
          if (alarmId) setPendingAlarmId(alarmId);
        }
      });
    });
  }, []);

  // 네비게이션 준비(fontsLoaded) 후 pendingAlarmId가 있으면 알람 화면으로 이동
  useEffect(() => {
    if (!fontsLoaded || !pendingAlarmId) return;
    router.push({ pathname: '/alarm-ringing', params: { alarmId: pendingAlarmId } });
    setPendingAlarmId(null);
  }, [fontsLoaded, pendingAlarmId]);

  // ── iOS: expo-notifications 이벤트 처리 ─────────────────────────────────────

  // 포그라운드에서 알림 수신 시 알람 울림 화면으로 이동
  useEffect(() => {
    if (Platform.OS === 'android') return;
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const alarmId = notification.request.content.data?.alarmId as string | undefined;
      if (alarmId) {
        router.push({ pathname: "/alarm-ringing", params: { alarmId } });
      }
    });
    return () => sub.remove();
  }, []);

  // 백그라운드/종료 상태에서 알림 탭 시 알람 울림 화면으로 이동
  const lastResponse = Notifications.useLastNotificationResponse();
  const lastResponseRef = useRef<string | null>(null);
  useEffect(() => {
    if (Platform.OS === 'android') return;
    if (!lastResponse) return;
    const requestId = lastResponse.notification.request.identifier;
    if (lastResponseRef.current === requestId) return;
    lastResponseRef.current = requestId;

    const alarmId = lastResponse.notification.request.content.data?.alarmId as string | undefined;
    if (alarmId) {
      router.push({ pathname: "/alarm-ringing", params: { alarmId } });
    }
  }, [lastResponse]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="alarm-ringing" options={{ headerShown: false, presentation: "fullScreenModal" }} />
            <Stack.Screen name="wake-complete" options={{ headerShown: false, presentation: "fullScreenModal" }} />
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
    </GestureHandlerRootView>
  );
}
