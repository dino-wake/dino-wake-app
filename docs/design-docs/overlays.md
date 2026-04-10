# 오버레이 컴포넌트 규칙

모달, 액션시트, 드로어, 팝오버 등 오버레이 컴포넌트 사용 규칙.

---

## 컴포넌트 선택 기준

| 상황 | 컴포넌트 |
|------|----------|
| 확인/취소가 필요한 대화상자 | `AlertDialog` |
| 정보 입력 / 복잡한 콘텐츠 | `Modal` |
| 선택지 목록 (하단에서 올라오는) | `Actionsheet` |
| 측면 내비게이션 / 필터 패널 | `Drawer` |
| 특정 요소에 부착된 팝업 | `Popover` |
| 마우스 호버 시 표시되는 짧은 설명 | `Tooltip` |

---

## Modal

일반적인 정보 입력이나 콘텐츠 표시에 사용한다.

```tsx
<Modal isOpen={isOpen} onClose={onClose} size="md">
  <ModalBackdrop />
  <ModalContent>
    <ModalHeader>
      <Heading size="lg">제목</Heading>
      <ModalCloseButton>
        <Icon as={CloseIcon} />
      </ModalCloseButton>
    </ModalHeader>
    <ModalBody>
      <Text size="md">본문 내용</Text>
    </ModalBody>
    <ModalFooter>
      <Button variant="outline" onPress={onClose}>
        <ButtonText>취소</ButtonText>
      </Button>
      <Button onPress={onConfirm}>
        <ButtonText>확인</ButtonText>
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

| prop | 값 |
|------|-----|
| `size` | `xs` \| `sm` \| `md` (기본) \| `lg` \| `full` |

---

## AlertDialog

삭제, 초기화 등 **되돌릴 수 없는 액션** 전 확인에 사용한다.

```tsx
<AlertDialog isOpen={isOpen} onClose={onClose}>
  <AlertDialogBackdrop />
  <AlertDialogContent>
    <AlertDialogHeader>
      <Heading size="lg">알람 삭제</Heading>
    </AlertDialogHeader>
    <AlertDialogBody>
      <Text size="md">이 알람을 삭제하시겠습니까? 되돌릴 수 없습니다.</Text>
    </AlertDialogBody>
    <AlertDialogFooter>
      <Button variant="outline" onPress={onClose}>
        <ButtonText>취소</ButtonText>
      </Button>
      <Button action="negative" onPress={onDelete}>
        <ButtonText>삭제</ButtonText>
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

- 파괴적 액션 버튼은 `action="negative"` 사용
- 취소 버튼을 항상 먼저 배치한다

---

## Actionsheet

하단에서 슬라이드 업 되는 선택 메뉴. 옵션 선택에 사용한다.

```tsx
<Actionsheet isOpen={isOpen} onClose={onClose}>
  <ActionsheetBackdrop />
  <ActionsheetContent>
    <ActionsheetDragIndicatorWrapper>
      <ActionsheetDragIndicator />
    </ActionsheetDragIndicatorWrapper>
    <ActionsheetItem onPress={handleEdit}>
      <ActionsheetItemText>수정</ActionsheetItemText>
    </ActionsheetItem>
    <ActionsheetItem onPress={handleDelete}>
      <ActionsheetItemText className="text-error-600">삭제</ActionsheetItemText>
    </ActionsheetItem>
    <ActionsheetItem onPress={onClose}>
      <ActionsheetItemText>취소</ActionsheetItemText>
    </ActionsheetItem>
  </ActionsheetContent>
</Actionsheet>
```

- `ActionsheetDragIndicator`는 항상 포함한다 (드래그로 닫기 지원)
- 아이템 수가 많으면 `ActionsheetScrollView` 또는 `ActionsheetFlatList` 사용
- `snapPoints` 미사용 시 `ActionsheetContent`에 `className="max-h-[70%]"` 지정

---

## Drawer

측면에서 슬라이드 인 되는 패널. 내비게이션이나 필터 패널에 사용한다.

```tsx
<Drawer
  isOpen={isOpen}
  onClose={onClose}
  size="sm"
  anchor="left"
>
  <DrawerBackdrop />
  <DrawerContent>
    <DrawerHeader>
      <Heading size="lg">메뉴</Heading>
    </DrawerHeader>
    <DrawerBody>
      {/* 내비게이션 항목 */}
    </DrawerBody>
    <DrawerFooter>
      {/* 하단 액션 */}
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

| prop | 값 |
|------|-----|
| `anchor` | `left` (기본) \| `right` \| `top` \| `bottom` |
| `size` | `xs` \| `sm` \| `md` \| `lg` \| `full` |

---

## Popover

특정 트리거 요소에 부착된 팝업. 컨텍스트 정보나 추가 액션에 사용한다.

```tsx
<Popover
  placement="bottom"
  trigger={(triggerProps) => (
    <Button {...triggerProps}>
      <ButtonText>옵션</ButtonText>
    </Button>
  )}
>
  <PopoverBackdrop />
  <PopoverContent>
    <PopoverArrow />
    <PopoverBody>
      <Text size="sm">팝오버 내용</Text>
    </PopoverBody>
  </PopoverContent>
</Popover>
```

| prop | 값 |
|------|-----|
| `placement` | `top` \| `bottom` \| `left` \| `right` + `-left` / `-right` 조합 |

---

## Tooltip

마우스 호버 시 짧은 설명을 표시한다. 모바일에서는 포커스 시 표시된다.

```tsx
<Tooltip
  placement="top"
  trigger={(triggerProps) => (
    <Button {...triggerProps}>
      <ButtonIcon as={InfoIcon} />
    </Button>
  )}
>
  <TooltipContent>
    <TooltipText>도움말 텍스트</TooltipText>
  </TooltipContent>
</Tooltip>
```

- Tooltip 텍스트는 한 줄 이내로 짧게 작성한다
- 긴 설명이 필요하면 Popover를 사용한다

---

## 공통 props

| prop | 설명 |
|------|------|
| `isOpen` | 표시 여부 (제어 컴포넌트) |
| `onClose` | 닫기 콜백 |
| `defaultIsOpen` | 초기 표시 여부 (비제어 컴포넌트) |
| `isKeyboardDismissable` | Esc 키로 닫기 (기본 true) |
| `closeOnOverlayClick` | 백드롭 클릭으로 닫기 (기본 true) |
| `useRNModal` | React Native 네이티브 Modal 사용 |

---

## 접근성 규칙

- 모든 오버레이는 열릴 때 포커스가 내부로 이동해야 한다
- `initialFocusRef`로 첫 포커스 요소를 명시적으로 지정한다
- `finalFocusRef`로 닫힌 후 포커스 복귀 위치를 지정한다
- Esc 키로 닫기를 지원한다 (기본 동작)

```tsx
const initialRef = useRef(null);
const finalRef = useRef(null);

<Modal
  isOpen={isOpen}
  onClose={onClose}
  initialFocusRef={initialRef}
  finalFocusRef={finalRef}
>
  ...
  <InputField ref={initialRef} />
  ...
</Modal>
```
