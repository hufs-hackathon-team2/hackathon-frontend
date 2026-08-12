import React, { useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function S13OnboardingComplete({ route, navigation }) {
  // (임시) 캐릭터 선택에서 전달받은 캐릭터 데이터
  const { selectedCharacter } = route.params || {};


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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>온보딩 완료 안내 화면</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.cardContainer}>

          <View style={styles.imageBox}>
            {selectedCharacter?.image ? (
              <Image
                source={selectedCharacter.image}
                style={styles.characterImage}
                resizeMode="contain"
              />
            ) : (

              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>Image</Text>
              </View>
            )}
          </View>

          <Text style={styles.mainTitle}>준비 완료!</Text>
          <Text style={styles.mainSubtitle}>
            첫 Healthy Cycle이 시작되었어요.
          </Text>
        </View>


        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>이번 사이클에서 할 수 있는 것</Text>
          <Text style={styles.infoText}>
            작은 건강 행동을 기록하고 캐릭터를 함께 성장시키세요
          </Text>
          <Text style={styles.infoText}>
            매주 활동을 분석한 위클리 카드를 받아보세요
          </Text>
          <Text style={styles.infoText}>
            작심삼일 퀘스트로 습관을 천천히 만들어 보세요
          </Text>
        </View>


        <View style={styles.encouragementBox}>
          <Text style={styles.encouragementTextPrimary}>
            캐릭터가 기다리고 있어요
          </Text>
          <Text style={styles.encouragementTextSecondary}>
            지금 바로 행동을 기록해 보세요
          </Text>
        </View>


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
    backgroundColor: '#FFFFFF',
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },

  cardContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  imageBox: {
    width: '100%',
    height: 160,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E232C',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#4A5568',
  },

  infoCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E232C',
    marginBottom: 14,
  },
  infoText: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 4,
  },

  encouragementBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    marginBottom: 28,
  },
  encouragementTextPrimary: {
    fontSize: 13,
    color: '#4A5568',
    marginBottom: 4,
  },
  encouragementTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E232C',
  },

  startButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});