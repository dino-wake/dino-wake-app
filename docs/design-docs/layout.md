# 레이아웃 및 컴포넌트 구성 규칙

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

```tsx
// 수직 레이아웃
<VStack space="md">
  <Heading size="2xl">제목</Heading>
  <Text size="md">본문</Text>
</VStack>

// 수평 레이아웃
<HStack space="sm" className="items-center">
  <Icon as={BellIcon} />
  <Text>알림</Text>
</HStack>

// 그리드 (웹 + 네이티브 모두 지원)
<Grid _extra={{ className: "grid-cols-12" }}>
  <GridItem _extra={{ className: "col-span-6" }}>
    <Box />
  </GridItem>
</Grid>
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

## 타이포그래피

| 컴포넌트 | 용도 | DOM 매핑 |
|----------|------|----------|
| `Heading` | 제목, 섹션 헤더 | size에 따라 h1~h6 |
| `Text` | 본문, 설명 | p / span |
| `Link` + `LinkText` | 내비게이션 링크 | a |

**Heading size → HTML 요소 매핑**

| size | 요소 |
|------|------|
| `5xl`, `4xl`, `3xl` | h1 |
| `2xl` | h2 |
| `xl` | h3 |
| `lg` | h4 |
| `md` | h5 |
| `sm`, `xs` | h6 |

```tsx
// ❌ 금지 — 제목에 Text 사용
<Text className="text-2xl font-bold">페이지 제목</Text>

// ✅ 올바름 — 시맨틱 Heading 사용
<Heading size="3xl">페이지 제목</Heading>

// 본문
<Text size="md" className="text-typography-600">설명 텍스트</Text>

// 보조 텍스트
<Text size="sm" className="text-typography-500">부가 정보</Text>
```

---

## 아이콘

아이콘은 반드시 아래 두 소스 중 하나에서만 가져온다.

```tsx
// Gluestack 내장 아이콘
import { BellIcon, CheckIcon, CloseIcon } from "@/components/ui/icon";

// Lucide 아이콘
import { Bell } from "lucide-react-native";

// 사용
<Icon as={BellIcon} size="md" />
<Icon as={Bell} className="text-primary-500" />
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
