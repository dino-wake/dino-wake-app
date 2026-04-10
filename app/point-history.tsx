import { Colors } from '@/constants/theme';
import { Bell, ChevronLeft, LayoutGrid, ShoppingBag, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

const ACCENT_GREEN = '#3D8A5A';
const MINT_LIGHT = '#DFF0E5';
const ACCENT_ORANGE = '#E8A054';
const ORANGE_LIGHT = '#FFF0E8';

type TabKey = 'all' | 'earn' | 'use';

type HistoryRow = {
  id: string;
  icon: 'bell' | 'layout-grid' | 'shopping-bag';
  title: string;
  date: string;
  amount: string;
  type: 'earn' | 'use';
};

const MARCH_ROWS: HistoryRow[] = [
  { id: 'r1', icon: 'bell', title: '알람 해제 보상', date: '3월 4일 · 07:02', amount: '+10 P', type: 'earn' },
  { id: 'r2', icon: 'layout-grid', title: '브리핑 청취 보상', date: '3월 4일 · 07:05', amount: '+20 P', type: 'earn' },
  { id: 'r3', icon: 'shopping-bag', title: '불꽃 다이노 스킨 구매', date: '3월 3일 · 14:22', amount: '-500 P', type: 'use' },
];

const FEBRUARY_ROWS: HistoryRow[] = [
  { id: 'r4', icon: 'bell', title: '알람 해제 보상', date: '2월 10일 · 07:00', amount: '+10 P', type: 'earn' },
  { id: 'r5', icon: 'shopping-bag', title: '클래식 다이노 스킨 구매', date: '2월 9일 · 10:15', amount: '-450 P', type: 'use' },
  { id: 'r6', icon: 'layout-grid', title: '브리핑 청취 보상', date: '2월 8일 · 08:05', amount: '+20 P', type: 'earn' },
];

function RowIcon({ name, type }: { name: HistoryRow['icon']; type: HistoryRow['type'] }) {
  const bgColor = type === 'earn' ? MINT_LIGHT : ORANGE_LIGHT;
  const color = type === 'earn' ? ACCENT_GREEN : ACCENT_ORANGE;
  const size = 18;
  return (
    <Box
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {name === 'bell' && <Bell size={size} color={color} />}
      {name === 'layout-grid' && <LayoutGrid size={size} color={color} />}
      {name === 'shopping-bag' && <ShoppingBag size={size} color={color} />}
    </Box>
  );
}

function HistoryCard({ rows }: { rows: HistoryRow[] }) {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {rows.map((row, i) => (
        <View key={row.id}>
          <HStack style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', gap: 14 }}>
            <RowIcon name={row.icon} type={row.type} />
            <VStack style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>{row.title}</Text>
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>{row.date}</Text>
            </VStack>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Outfit_700Bold',
                color: row.type === 'earn' ? ACCENT_GREEN : ACCENT_ORANGE,
              }}
            >
              {row.amount}
            </Text>
          </HStack>
          {i < rows.length - 1 && (
            <View style={{ height: 1, backgroundColor: Colors.light.border, marginHorizontal: 0 }} />
          )}
        </View>
      ))}
    </Box>
  );
}

export default function PointHistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  function filterRows(rows: HistoryRow[]) {
    if (activeTab === 'all') return rows;
    return rows.filter((r) => r.type === activeTab);
  }

  const marchRows = filterRows(MARCH_ROWS);
  const februaryRows = filterRows(FEBRUARY_ROWS);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {/* Header */}
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>포인트 내역</Text>
        <View style={{ flex: 1 }} />
        <View style={{ width: 36 }} />
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <Box style={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 4 }}>
          <Box
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: ACCENT_GREEN,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 6,
            }}
          >
            {/* Top: balance */}
            <Box
              style={{
                backgroundColor: ACCENT_GREEN,
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 16,
              }}
            >
              <VStack style={{ gap: 4 }}>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: '#FFFFFF99' }}>보유 포인트</Text>
                <HStack style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 40,
                      fontFamily: 'Outfit_700Bold',
                      color: '#FFFFFF',
                      letterSpacing: -1,
                      lineHeight: 48,
                    }}
                  >
                    1,240
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'Outfit_600SemiBold',
                      color: '#FFFFFFCC',
                      paddingBottom: 4,
                    }}
                  >
                    P
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: '#FFFFFF20', marginHorizontal: 0 }} />

            {/* Bottom: earned/used */}
            <HStack
              style={{
                backgroundColor: '#2B7A4B',
                paddingHorizontal: 24,
                paddingVertical: 16,
              }}
            >
              <VStack style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: '#FFFFFF80' }}>총 적립</Text>
                <HStack style={{ alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={14} color="#7DCBA4" />
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>+2,800 P</Text>
                </HStack>
              </VStack>

              <View style={{ width: 1, height: 36, backgroundColor: '#FFFFFF20', alignSelf: 'center' }} />

              <VStack style={{ flex: 1, gap: 4, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: '#FFFFFF80' }}>총 사용</Text>
                <HStack style={{ alignItems: 'center', gap: 4 }}>
                  <TrendingDown size={14} color="#FFB888" />
                  <Text style={{ fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>-1,560 P</Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        </Box>

        {/* Filter Tabs */}
        <HStack style={{ paddingHorizontal: 20, paddingBottom: 16, gap: 8 }}>
          {([
            { key: 'all', label: '전체' },
            { key: 'earn', label: '적립' },
            { key: 'use', label: '사용' },
          ] as { key: TabKey; label: string }[]).map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 100,
                backgroundColor: activeTab === tab.key ? ACCENT_GREEN : '#FFFFFF',
                borderWidth: activeTab === tab.key ? 0 : 1.5,
                borderColor: Colors.light.border,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: activeTab === tab.key ? 'Outfit_600SemiBold' : 'Outfit_500Medium',
                  color: activeTab === tab.key ? '#FFFFFF' : Colors.light.icon,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </HStack>

        {/* History List */}
        <VStack style={{ paddingHorizontal: 20, gap: 12 }}>
          {marchRows.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: Colors.light.icon,
                  letterSpacing: 0.4,
                }}
              >
                2026년 3월
              </Text>
              <HistoryCard rows={marchRows} />
            </>
          )}

          {februaryRows.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: Colors.light.icon,
                  letterSpacing: 0.4,
                }}
              >
                2026년 2월
              </Text>
              <HistoryCard rows={februaryRows} />
            </>
          )}
        </VStack>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
