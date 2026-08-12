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
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

export default function S11Interests({ navigation }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [interestText, setInterestText] = useState('');
  const maxLength = 100;


  const isValid = interestText.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;

    console.log('선택/입력한 관심 영역:', interestText.trim());

    navigation.navigate('CharacterSelect'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>관심 영역 입력</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.divider} />


          <View style={styles.content}>
            <Text style={styles.title}>어떤 습관을 바꾸고 싶으신가요?</Text>
            <Text style={styles.subtitle}>
              건강에 도움이 될 활동을 자유롭게 적어주세요
            </Text>


            <View style={styles.inputContainer}>
              <Text style={styles.label}>관심 영역</Text>
              
              <TextInput
                style={styles.textArea}
                value={interestText}
                onChangeText={setInterestText}
                placeholder="불규칙한 식습관 / 운동 부족 / 체중 조절 / 불규칙한 수면 / 스트레스"
                multiline={true}
                numberOfLines={4}
                maxLength={maxLength} 
                textAlignVertical="top"
              />


              <Text style={styles.charCount}>
                {interestText.length}/{maxLength}
              </Text>
            </View>


            <TouchableOpacity
              style={[
                styles.nextButton,
                !isValid && styles.nextButtonDisabled, 
              ]}
              onPress={handleNext}
              disabled={!isValid} 
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !isValid && styles.nextButtonTextDisabled,
                ]}
              >
                다음
              </Text>
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
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E232C',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E232C',
  },
  headerRightPlaceholder: {
    width: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF4',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E232C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#1E232C',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    height: 120,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E232C',
  },
  charCount: {
    fontSize: 13,
    color: '#718096',
    marginTop: 8,
    marginBottom: 20,
  },

  nextButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 28,
  },

  nextButtonDisabled: {
    backgroundColor: '#c2c2c2',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#ffffff',
  },
});