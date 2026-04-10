# 레이아웃 및 컴포넌트 구성 규칙

---

## Import 경로

모든 Gluestack UI 컴포넌트는 `@/components/ui/*`에서 가져온다. `react-native`의 기본 컴포넌트를 직접 사용하지 않는다.

```tsx
// ❌ 금지
import { View, Text, TouchableOpacity, Image } from 'react-native';

// ✅ 올바름
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Image } from '@/components/ui/image';
```

**예외**: `SafeAreaView`, `ScrollView`, `Switch`는 아래 지침을 따른다.

---

## 레이아웃 프리미티브

| 컴포넌트 | 역할 | 비고 |
|----------|------|------|
| `Box` | 범용 컨테이너 (View / div) | 기본 레이아웃 단위 |
| `HStack` | 수평 배치 | `space` prop으로 간격 지정 |
| `VStack` | 수직 배치 | `space` prop으로 간격 지정 |
| `Center` | 수평·수직 중앙 정렬 | |
| `Grid` / `GridItem` | 12컬럼 그리드 (웹) | 네이티브는 flexbox fallback |
| `ScrollView` | 스크롤 컨테이너 | 내부 스타일은 `contentContainerClassName` |

### HStack / VStack space 값

| prop | gap |
|------|-----|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 20px |
| `2xl` | 24px |

```tsx
// 수직 레이아웃
<VStack space="md">
  <Heading size="2xl">제목</Heading>
  <Text size="md">본문</Text>
</VStack>

// 수평 레이아웃
<HStack space="sm" className="items-center">
  <Bell size={16} color="#3D8A5A" />
  <Text>알림</Text>
</HStack>

// 태그 줄바꿈 레이아웃
<HStack className="flex-wrap" space="sm">
  <TagActive label="날씨" />
  <TagInactive label="뉴스" />
</HStack>

// 그리드 (웹 + 네이티브 모두 지원)
<Grid _extra={{ className: "grid-cols-12" }}>
  <GridItem _extra={{ className: "col-span-6" }}>
    <Box />
  </GridItem>
</Grid>
```

---

## 카드 (Card)

카드 형태 UI에는 두 가지 방식을 사용한다.

### Gluestack Card 컴포넌트

```tsx
import { Card } from '@/components/ui/card';

// variant: elevated(흰 배경+기본), outline(테두리), filled(회색 배경)
// size: sm(p-3), md(p-4), lg(p-6)
<Card variant="elevated" size="md">
  <Text>카드 내용</Text>
</Card>
```

### Box + 직접 스타일 (커스텀 radius/shadow 필요 시)

카드 radius가 `rounded-2xl`이거나 그림자를 세밀하게 제어해야 할 때 사용한다.

```tsx
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';

<Box
  className="rounded-2xl bg-background-0 p-4"
  style={{
    shadowColor: '#1A1918',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  }}
>
  <VStack space="xs">
    {/* 내용 */}
  </VStack>
</Box>
```

> `bg-background-0`는 라이트 모드에서 #FFFFFF, 다크 모드에서 다크 카드 배경으로 자동 전환된다.

---

## 인터랙션 (Pressable)

터치 이벤트는 `TouchableOpacity` 대신 `Pressable`을 사용한다.

```tsx
import { Pressable } from '@/components/ui/pressable';

// 기본
<Pressable onPress={handlePress}>
  <Text>클릭</Text>
</Pressable>

// 비활성화 상태 자동 스타일 (opacity 0.4)
<Pressable onPress={handlePress} disabled>
  <Text>비활성</Text>
</Pressable>

// 원형 버튼 (FAB 패턴)
<Pressable
  className="h-[52px] w-[52px] items-center justify-center rounded-full bg-dino-accent-orange"
  style={{ elevation: 4 }}
  onPress={handleAdd}
>
  <Plus size={24} color="#FFFFFF" />
</Pressable>
```

---

## Switch

```tsx
import { Switch } from '@/components/ui/switch';

<Switch
  value={enabled}
  onValueChange={setEnabled}
  trackColor={{ false: '#E5E4E1', true: '#7DCBA4' }}
  thumbColor="#FFFFFF"
/>
```

---

## 아이콘

아이콘은 반드시 아래 두 소스 중 하나에서만 가져온다.

```tsx
// Lucide 아이콘 — 직접 사용 (color prop으로 색상 지정)
import { Bell, Trash2, Plus } from 'lucide-react-native';

<Bell size={24} color="#3D8A5A" />
<Trash2 size={18} color="#9C9B99" />

// Gluestack Icon 래퍼 — SVG 경로 기반 커스텀 아이콘에 사용
import { Icon, BellIcon, CheckIcon } from '@/components/ui/icon';

<Icon as={BellIcon} size="md" className="text-primary-500" />
```

> Lucide 아이콘은 `color` prop으로 색상을 설정한다. Gluestack `Icon` 래퍼의 `className="text-*"`는 Lucide에 적용되지 않으므로 직접 사용한다.

---

## 이미지

```tsx
import { Image } from '@/components/ui/image';

// 사이즈 preset 사용
<Image source={{ uri: '...' }} size="xl" alt="설명" />

// 커스텀 크기 (size="none" + className)
<Image
  source={require('@/assets/images/dino_egg.png')}
  size="none"
  className="h-[134px] w-[127px]"
  resizeMode="contain"
  alt="공룡알"
/>
```

---

## 타이포그래피

| 컴포넌트 | 용도 | DOM 매핑 |
|----------|------|----------|
| `Heading` | 제목, 섹션 헤더 | size에 따라 h1~h6 |
| `Text` | 본문, 설명 | p / span |
| `Link` + `LinkText` | 내비게이션 링크 | a |

**Text size 값**

| size | 클래스 |
|------|--------|
| `2xs` | text-2xs (10px) |
| `xs` | text-xs (12px) |
| `sm` | text-sm (14px) |
| `md` | text-base (16px, 기본값) |
| `lg` | text-lg (18px) |
| `xl` | text-xl (20px) |

```tsx
// ❌ 금지 — 제목에 Text 사용
<Text className="text-2xl font-bold">페이지 제목</Text>

// ✅ 올바름 — 시맨틱 Heading 사용
<Heading size="3xl">페이지 제목</Heading>

// 본문
<Text size="md" className="text-typography-600">설명 텍스트</Text>

// 보조 텍스트
<Text size="sm" className="text-typography-500">부가 정보</Text>

// Dino 텍스트 — 토큰 우선 사용
<Text className="text-dino-text-primary font-bold">주요 텍스트</Text>
<Text className="text-dino-text-secondary">보조 텍스트</Text>
<Text className="text-dino-text-tertiary">힌트 텍스트</Text>
```

---

## 컴포넌트 구성 원칙

### 1. 컨테이너 + 콘텐츠 패턴

Gluestack 컴포넌트는 부모-자식 구조로 구성된다. 자식 스타일은 부모 props에서 흘러내린다.

```tsx
// ❌ 잘못된 구성 — ButtonText 없이 Button만 사용
<Button>확인</Button>

// ✅ 올바른 구성
<Button>
  <ButtonText>확인</ButtonText>
  <ButtonIcon as={CheckIcon} />
</Button>
```

### 2. Slot 기반 구성

Header / Body / Footer 슬롯을 가진 컴포넌트는 반드시 해당 슬롯 컴포넌트를 사용한다.

```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalBackdrop />
  <ModalContent>
    <ModalHeader>제목</ModalHeader>
    <ModalBody>내용</ModalBody>
    <ModalFooter>액션</ModalFooter>
  </ModalContent>
</Modal>
```

### 3. 직접 부모-자식 제약

`GridItem`은 `Grid`의 **직접 자식**이어야 한다. 사이에 HOC를 두지 않는다.

```tsx
// ❌ 금지
<Grid>
  <SomeWrapper>
    <GridItem />
  </SomeWrapper>
</Grid>

// ✅ 올바름
<Grid>
  <GridItem />
</Grid>
```

---

## 로딩 상태

데이터 로딩 중에는 Skeleton 컴포넌트를 사용한다.

```tsx
<VStack space="md">
  <Skeleton variant="rounded" className="h-4 w-3/4" />
  <SkeletonText _lines={3} gap={2} />
</VStack>
```
