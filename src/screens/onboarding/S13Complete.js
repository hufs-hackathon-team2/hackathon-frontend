import React, { useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { completeOnboarding } from '../../lib/api/onboarding';
import { saveOnboarded } from '../../lib/api/token';

export default function S13Complete({ route, navigation }) {
  const { character, characterName } = route.params || {};
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 온보딩이 끝나는 시점은 여기다. 다음에 앱을 켜면 스플래시가 이 값을 보고 홈으로 보낸다.
  const handleStart = async () => {
    setSaving(true);
    try {
      await completeOnboarding();
      await saveOnboarded(true);
    } catch {
      Alert.alert('시작하지 못했어요', '잠시 후 다시 시도해주세요.');
      setSaving(false);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {character?.image && (
          <View style={styles.imageBox}>
            <Image

                source={character.image}

                style={[styles.characterImage,
                  {transform: [
                    {scale: 1.05},
                    {translateX: 12}
                  ]}
                ]}
                resizeMode="contain"
              />
            </View>
          )}

        <Text style={styles.mainTitle}>준비 완료!</Text>

        {characterName && (                                             
          <Text style={styles.characterName}>{characterName}</Text>     
        )} 

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            작은 건강 행동을 기록하고 캐릭터를 함께 성장시키세요
          </Text>
          <Text style={styles.descriptionText}>
            매주 활동을 분석한 위클리 카드를 받아보세요
          </Text>
          <Text style={styles.descriptionText}>
            작심삼일 퀘스트로 습관을 천천히 만들어 보세요
          </Text>
        </View>

        <Text style={styles.encouragementText}>
          캐릭터가 기다리고 있어요
        </Text>

        <TouchableOpacity
          style={[styles.startButton, saving && styles.startButtonDisabled]}
          onPress={handleStart}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Text style={styles.startButtonText}>
            {saving ? '준비 중...' : '시작하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3ECFF', 
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imageBox: {
    width: 160, 
    height: 160,
    borderRadius: 20,
    backgroundColor: '#CCDDFF', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  characterImage: {
    width: 100, 
    height: 100,
  },
  characterName: {                                                      
    fontSize: 18,                                                       
    fontWeight: 'bold',                                                 
    color: '#3E629F',                                                   
    marginBottom: 20,                                                   
    textAlign: 'center',                                                
  },     
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#757575', 
    textAlign: 'center',
    lineHeight: 20,
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B1A18', 
    marginBottom: 28,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#3E629F', 
    borderRadius: 15, 
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  startButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: '600',
  },
});