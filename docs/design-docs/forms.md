# 폼 컴포넌트 규칙

---

## 기본 원칙

- 모든 폼 필드는 반드시 `FormControl`로 감싼다
- `FormControl`이 접근성 컨텍스트(label 연결, 오류 상태 전파)를 담당한다
- 오류 상태는 `isInvalid` prop으로 전달하고, `FormControlError`로 메시지를 표시한다

---

## FormControl 구조

```tsx
<FormControl isInvalid={!!error} isRequired={required} isDisabled={disabled}>
  <FormControlLabel>
    <FormControlLabelText>레이블</FormControlLabelText>
  </FormControlLabel>

  {/* 입력 컴포넌트 */}

  <FormControlHelper>
    <FormControlHelperText>도움말 텍스트</FormControlHelperText>
  </FormControlHelper>
  <FormControlError>
    <FormControlErrorIcon as={AlertCircleIcon} />
    <FormControlErrorText>{error}</FormControlErrorText>
  </FormControlError>
</FormControl>
```

---

## 텍스트 입력 (Input)

```tsx
<FormControl isInvalid={!!error}>
  <FormControlLabel>
    <FormControlLabelText>이메일</FormControlLabelText>
  </FormControlLabel>
  <Input variant="outline" size="md">
    <InputSlot className="pl-3">
      <InputIcon as={MailIcon} />
    </InputSlot>
    <InputField
      type="email"
      placeholder="example@email.com"
      value={value}
      onChangeText={onChange}
    />
  </Input>
  <FormControlError>
    <FormControlErrorIcon as={AlertCircleIcon} />
    <FormControlErrorText>{error}</FormControlErrorText>
  </FormControlError>
</FormControl>
```

| prop | 값 |
|------|-----|
| `variant` | `outline` (기본) \| `underlined` \| `rounded` |
| `size` | `sm` \| `md` (기본) \| `lg` \| `xl` |

---

## 멀티라인 입력 (Textarea)

```tsx
<FormControl isInvalid={!!error}>
  <FormControlLabel>
    <FormControlLabelText>메모</FormControlLabelText>
  </FormControlLabel>
  <Textarea size="md">
    <TextareaInput
      placeholder="내용을 입력하세요"
      value={value}
      onChangeText={onChange}
    />
  </Textarea>
</FormControl>
```

기본 높이는 100px이며, `className="h-[200px]"`로 재정의 가능하다.

---

## 체크박스 (Checkbox)

다중 선택. `CheckboxGroup`으로 상태를 통합 관리한다.

```tsx
<FormControl>
  <FormControlLabel>
    <FormControlLabelText>알림 방식</FormControlLabelText>
  </FormControlLabel>
  <CheckboxGroup value={selected} onChange={setSelected}>
    <VStack space="sm">
      <Checkbox value="push">
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>푸시 알림</CheckboxLabel>
      </Checkbox>
      <Checkbox value="sound">
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>소리</CheckboxLabel>
      </Checkbox>
    </VStack>
  </CheckboxGroup>
</FormControl>
```

---

## 라디오 (Radio)

단일 선택. `RadioGroup`으로 상태를 통합 관리한다.

```tsx
<FormControl>
  <FormControlLabel>
    <FormControlLabelText>반복 주기</FormControlLabelText>
  </FormControlLabel>
  <RadioGroup value={repeat} onChange={setRepeat}>
    <VStack space="sm">
      <Radio value="daily">
        <RadioIndicator>
          <RadioIcon as={CircleIcon} />
        </RadioIndicator>
        <RadioLabel>매일</RadioLabel>
      </Radio>
      <Radio value="weekly">
        <RadioIndicator>
          <RadioIcon as={CircleIcon} />
        </RadioIndicator>
        <RadioLabel>매주</RadioLabel>
      </Radio>
    </VStack>
  </RadioGroup>
</FormControl>
```

---

## 스위치 (Switch)

```tsx
<FormControl>
  <HStack space="sm" className="items-center justify-between">
    <FormControlLabel>
      <FormControlLabelText>알람 활성화</FormControlLabelText>
    </FormControlLabel>
    <Switch
      value={enabled}
      onToggle={() => setEnabled(!enabled)}
    />
  </HStack>
</FormControl>
```

---

## 슬라이더 (Slider)

```tsx
<FormControl>
  <FormControlLabel>
    <FormControlLabelText>볼륨</FormControlLabelText>
  </FormControlLabel>
  <Slider
    minValue={0}
    maxValue={100}
    value={volume}
    onChange={setVolume}
    size="md"
  >
    <SliderTrack>
      <SliderFilledTrack />
    </SliderTrack>
    <SliderThumb />
  </Slider>
</FormControl>
```

---

## 공통 상태 props

| prop | 설명 |
|------|------|
| `isInvalid` | 유효성 오류 상태 |
| `isDisabled` | 비활성화 |
| `isReadOnly` | 읽기 전용 |
| `isRequired` | 필수 입력 |

---

## 금지 사항

| 금지 | 이유 |
|------|------|
| `FormControl` 없이 Input 단독 사용 | 접근성 label 연결 누락 |
| 오류를 색상만으로 표시 | 색약 사용자 식별 불가 |
| `FormControlError`에 `FormControlErrorIcon` 누락 | 시각적 단서 부족 |
