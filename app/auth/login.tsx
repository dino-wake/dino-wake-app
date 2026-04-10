import { Colors } from '@/constants/theme';
import { Eye, EyeOff, Globe } from 'lucide-react-native';
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
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
          borderColor: Colors.light.border,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            fontFamily: 'Outfit_400Regular',
            fontSize: 14,
            color: Colors.light.text,
          }}
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 히어로 */}
          <VStack style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
            <Text style={{ fontSize: 56, lineHeight: 120 }}>🦕</Text>
            <Text style={{ fontSize: 28, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
              공룡알림
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center' }}>
              다이노와 함께 시작하는 하루
            </Text>
          </VStack>

          {/* 소셜 버튼 */}
          <VStack style={{ paddingHorizontal: 24, gap: 12 }}>
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
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                또는
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
            </HStack>
          </VStack>

          {/* 폼 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 8, gap: 12 }}>
            <InputField
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              label="비밀번호"
              placeholder="비밀번호 입력"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </VStack>

          {/* 비밀번호 찾기 */}
          <Box style={{ paddingHorizontal: 24, paddingTop: 4, alignItems: 'flex-end' }}>
            <Pressable onPress={() => router.push('/auth/forgot-password')}>
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
                비밀번호를 잊으셨나요?
              </Text>
            </Pressable>
          </Box>

          {/* 로그인 버튼 */}
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
                로그인
              </Text>
            </Pressable>
          </Box>

          {/* 회원가입 링크 */}
          <HStack style={{ justifyContent: 'center', gap: 4, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
              아직 계정이 없으신가요?
            </Text>
            <Pressable onPress={() => router.push('/auth/signup')}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                회원가입
              </Text>
            </Pressable>
          </HStack>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
