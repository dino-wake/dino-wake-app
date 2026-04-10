import { Colors } from '@/constants/theme';
import { Check, Eye, EyeOff, Globe } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  borderColor,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  borderColor?: string;
}) {
  const [showPw, setShowPw] = useState(false);
  return (
    <VStack style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
        {label}
      </Text>
      <HStack
        style={{
          height: 52,
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: borderColor ?? Colors.light.border,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{ flex: 1, fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.light.text }}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.icon}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPw}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPw((v) => !v)}>
            {showPw ? <EyeOff size={18} color={Colors.light.icon} /> : <Eye size={18} color={Colors.light.icon} />}
          </Pressable>
        )}
      </HStack>
    </VStack>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = Math.min(Math.floor(password.length / 3), 4);
  const colors = ['#E5E4E1', '#E5E4E1', '#E5E4E1', '#E5E4E1'];
  const fillColors = ['#E05555', '#E8A054', '#3D8A5A', '#3D8A5A'];
  for (let i = 0; i < strength; i++) colors[i] = fillColors[strength - 1];

  return (
    <VStack style={{ gap: 8 }}>
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>
          비밀번호 강도
        </Text>
        <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: fillColors[Math.max(strength - 1, 0)] }}>
          {['', '약함', '보통', '강함', '매우 강함'][strength]}
        </Text>
      </HStack>
      <HStack style={{ gap: 4, height: 6 }}>
        {colors.map((c, i) => (
          <Box key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c }} />
        ))}
      </HStack>
      <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, lineHeight: 12 * 1.5 }}>
        영문, 숫자, 특수문자를 포함해 8자 이상 입력하세요.
      </Text>
    </VStack>
  );
}

export default function SignupScreen() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 타이틀 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, gap: 4 }}>
            <Text style={{ fontSize: 22, fontFamily: 'Outfit_700Bold', color: Colors.light.text, lineHeight: 22 * 1.4 }}>
              {'다이노와 함께\n새로운 아침을 시작하세요 🦕'}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, lineHeight: 13 * 1.5 }}>
              무료로 계정을 만들고 나만의 공룡을 키워보세요.
            </Text>
          </VStack>

          {/* 폼 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 8, gap: 12 }}>
            <InputField label="닉네임" placeholder="공룡집사" value={nickname} onChangeText={setNickname} />
            <InputField label="이메일" placeholder="example@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" borderColor="#3D8A5A" />
            <InputField label="비밀번호" placeholder="비밀번호 입력" value={password} onChangeText={setPassword} secureTextEntry />
            <PasswordStrengthBar password={password} />
            <InputField label="비밀번호 확인" placeholder="비밀번호 재입력" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry />

            {/* 약관 동의 */}
            <Pressable onPress={() => setAgreed((v) => !v)}>
              <HStack style={{ alignItems: 'center', gap: 10, paddingVertical: 4 }}>
                <Box
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: agreed ? '#3D8A5A' : Colors.light.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {agreed && <Check size={13} color="#FFFFFF" />}
                </Box>
                <HStack style={{ gap: 4, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                    이용약관 및{' '}
                  </Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
                    개인정보처리방침
                  </Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                    에 동의합니다
                  </Text>
                </HStack>
              </HStack>
            </Pressable>
          </VStack>

          {/* 버튼 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 20, gap: 12 }}>
            <Pressable
              style={{
                height: 56,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: Colors.light.border,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <Globe size={20} color={Colors.light.icon} />
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                Google로 계속하기
              </Text>
            </Pressable>

            <HStack style={{ alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>또는</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
            </HStack>

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
                가입하기
              </Text>
            </Pressable>
          </VStack>

          {/* 로그인 링크 */}
          <HStack style={{ justifyContent: 'center', gap: 4, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
              이미 계정이 있으신가요?
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>로그인</Text>
            </Pressable>
          </HStack>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
