import { Colors } from '@/constants/theme';
import { CircleCheck, KeyRound, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

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
              <KeyRound size={40} color="#3D8A5A" />
            </Box>
            <VStack style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 24, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
                비밀번호 찾기
              </Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center', lineHeight: 14 * 1.6 }}>
                {'가입한 이메일 주소를 입력하면\n비밀번호 재설정 링크를 보내드려요.'}
              </Text>
            </VStack>
          </VStack>

          {/* 이메일 입력 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 8, gap: 6 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
              이메일
            </Text>
            <HStack
              style={{
                height: 52,
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: email ? '#3D8A5A' : Colors.light.border,
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <HStack style={{ alignItems: 'center', gap: 10, flex: 1 }}>
                <Mail size={18} color="#3D8A5A" />
                <TextInput
                  style={{ flex: 1, fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.light.text }}
                  placeholder="example@email.com"
                  placeholderTextColor={Colors.light.icon}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </HStack>
              {email.length > 0 && <CircleCheck size={18} color="#3D8A5A" />}
            </HStack>
            <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, lineHeight: 12 * 1.5 }}>
              가입 시 등록한 이메일 주소를 입력해 주세요.
            </Text>
          </VStack>

          {/* 버튼 */}
          <VStack style={{ paddingHorizontal: 24, paddingTop: 20, gap: 12 }}>
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
                재설정 링크 보내기
              </Text>
            </Pressable>
            <HStack style={{ justifyContent: 'center', gap: 4 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                메일을 받지 못하셨나요?
              </Text>
              <Pressable>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                  다시 보내기
                </Text>
              </Pressable>
            </HStack>
          </VStack>

          {/* 안내 카드 */}
          <Box style={{ paddingHorizontal: 24, paddingTop: 28 }}>
            <Box
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
                이메일을 받지 못하셨나요?
              </Text>
              {[
                '스팸 메일함을 확인해 주세요.',
                '이메일 주소를 다시 확인해 주세요.',
                '몇 분 후 재시도하거나 다시 보내기를 눌러주세요.',
              ].map((step, i) => (
                <HStack key={i} style={{ alignItems: 'center', gap: 12 }}>
                  <Box
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      backgroundColor: '#DFF0E5',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 11, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
                      {i + 1}
                    </Text>
                  </Box>
                  <Text style={{ flex: 1, fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                    {step}
                  </Text>
                </HStack>
              ))}
            </Box>
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
