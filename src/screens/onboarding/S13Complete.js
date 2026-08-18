import React, { useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function S13Complete({ route, navigation }) {
  const { character } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleStart = () => {
    console.log('온보딩 완료! 메인 홈 화면으로 이동');
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
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
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
  startButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: '600',
  },
});