import React, { useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from '../../components/common/ScreenHeader';

const CHARACTER_DATA = {
  cat: {
    id: 'cat',
    name: '고양이',
    image: require('../../../assets/character/cat-1.png'), 
  },
  dog: {
    id: 'dog',
    name: '강아지',
    image: require('../../../assets/character/dog-1.png'),
  },
};

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
      <ScreenHeader navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
          {character?.image && (
            <View style={styles.imageBox}>
              <Image
                source={character.image}
                style={styles.characterImage}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3ECFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  imageBox: {
    width: 200,
    height: 200,
    borderRadius: 24,
    backgroundColor: '#CCDDFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  characterImage: {
    width: 140,
    height: 140,
  },
  mainTitle: {
    fontSize: 26,
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
    fontSize: 14,
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
    backgroundColor: '#4C5F99',
    borderRadius: 12,
    height: 52,
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