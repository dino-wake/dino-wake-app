import { Colors } from '@/constants/theme';
import { CircleCheck, Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

export default function ResetPasswordScreen() {
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = Math.min(Math.floor(newPw.length / 3), 4);
  const strengthColors = ['#E5E4E1', '#E5E4E1', '#E5E4E1', '#E5E4E1'];
  const fillColors = ['#E05555', '#E8A054', '#3D8A5A', '#3D8A5A'];
  for (let i = 0; i < strength; i++) strengthColors[i] = fillColors[strength - 1];
  const strengthLabel = ['', '약함', '보통', '강함', '매우 강함'][strength];
  const matches = newPw.length > 0 && newPw === confirmPw;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 일러스트 영역 */}
          <VStack style={{ alignItems: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 36, paddingBottom: 20 }}>
            <Box
              style={{
                width: 88,
                height: 88,
                borderRadius: 28,
                backgroundColor: '#DFF0E5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockKeyhole size={40} color="#3D8A5A" />
            </Box>
            <VStack style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 24, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
                비밀번호 재설정
              </Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center', lineHeight: 14 * 1.6 }}>
                {'새로운 비밀번호를 입력해 주세요.\n이전 비밀번호는 사용할 수 없어요.'}
              </Text>
            </VStack>
          </VStack>

          {/* 폼 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 8, gap: 16 }}>
            {/* 새 비밀번호 */}
            <VStack style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                새 비밀번호
              </Text>
              <HStack
                style={{
                  height: 52,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: Colors.light.border,
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  style={{ flex: 1, fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.light.text }}
                  placeholder="새 비밀번호 입력"
                  placeholderTextColor={Colors.light.icon}
                  value={newPw}
                  onChangeText={setNewPw}
                  secureTextEntry={!showNew}
                />
                <Pressable onPress={() => setShowNew((v) => !v)}>
                  {showNew ? <EyeOff size={18} color={Colors.light.icon} /> : <Eye size={18} color={Colors.light.icon} />}
                </Pressable>
              </HStack>

              {/* 강도 바 */}
              <VStack style={{ gap: 8, paddingTop: 4 }}>
                <HStack style={{ justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>
                    비밀번호 강도
                  </Text>
                  {strength > 0 && (
                    <Text style={{ fontSize: 12, fontFamily: 'Outfit_700Bold', color: fillColors[strength - 1] }}>
                      {strengthLabel}
                    </Text>
                  )}
                </HStack>
                <HStack style={{ gap: 4 }}>
                  {strengthColors.map((c, i) => (
                    <Box key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c }} />
                  ))}
                </HStack>
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, lineHeight: 12 * 1.5 }}>
                  영문, 숫자, 특수문자를 포함해 8자 이상 입력하세요.
                </Text>
              </VStack>
            </VStack>

            {/* 비밀번호 확인 */}
            <VStack style={{ gap: 6, paddingTop: 16 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                새 비밀번호 확인
              </Text>
              <HStack
                style={{
                  height: 52,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: matches ? '#3D8A5A' : Colors.light.border,
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  style={{ flex: 1, fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.light.text }}
                  placeholder="비밀번호 재입력"
                  placeholderTextColor={Colors.light.icon}
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                  secureTextEntry={!showConfirm}
                />
                {matches ? (
                  <CircleCheck size={18} color="#3D8A5A" />
                ) : (
                  <Pressable onPress={() => setShowConfirm((v) => !v)}>
                    {showConfirm ? <EyeOff size={18} color={Colors.light.icon} /> : <Eye size={18} color={Colors.light.icon} />}
                  </Pressable>
                )}
              </HStack>
              {matches && (
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
                  비밀번호가 일치합니다.
                </Text>
              )}
            </VStack>
          </VStack>

          {/* 버튼 */}
          <Box style={{ paddingHorizontal: 24, paddingTop: 20 }}>
            <Pressable
              style={{
                height: 56,
                backgroundColor: '#3D8A5A',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3D8A5A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.21,
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>
                비밀번호 변경하기
              </Text>
            </Pressable>
          </Box>

          {/* 뒤로가기 */}
          <HStack style={{ justifyContent: 'center', gap: 4, paddingTop: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
              로그인 화면으로
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                돌아가기
              </Text>
            </Pressable>
          </HStack>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
