import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';

export default function S11Interests({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [interestText, setInterestText] = useState('');
  const maxLength = 100;

  const handleNext = () => {
    if (!interestText.trim()) {
      return;
    }

    navigation.navigate('CharacterSelect');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >

          <View style={styles.content}>
            <Text style={styles.title}>어떤 습관을 바꾸고 싶으신가요?</Text>
            <Text style={styles.subtitle}>
              건강에 도움이 될 활동을 자유롭게 적어주세요
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                value={interestText}
                onChangeText={setInterestText}
                placeholder="예) 밤에 늦게까지 휴대폰을 봐요"
                placeholderTextColor="#8A94A6"
                multiline={true}
                numberOfLines={4}
                maxLength={maxLength}
                textAlignVertical="top"
              />
            </View>


            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3ECFF',
  },
  inner: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#1B1A18',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 28,
  },
  textArea: {
    backgroundColor: '#F0F5FF',
    borderRadius: 18,
    height: 160,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 15,
    color: '#1B1A18',
  },
  nextButton: {
    backgroundColor: '#3E629F', 
    borderRadius: 24,
    height: 48,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});