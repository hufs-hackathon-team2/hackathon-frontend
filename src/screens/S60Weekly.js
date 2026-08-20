import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { getWeeklyData } from '../lib/api/weekly';
import { getErrorMessage } from '../lib/api/error';
import { getRoom } from '../lib/api/characters';
import CharacterRoomCard from '../components/home/CharacterRoomCard';

export default function S60Weekly({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [weeklyData, setWeeklyData] = useState(null);
  const [room, setRoom] = useState(null);

  const cardCaptureRef = useRef(null);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      setIsError(false);

      const [weeklyRes, roomRes] = await Promise.allSettled([getWeeklyData(), getRoom()]);

      if (weeklyRes.status === 'rejected') throw weeklyRes.reason;

      setWeeklyData(weeklyRes.value);
      setRoom(roomRes.status === 'fulfilled' ? roomRes.value : null);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);

      if (!permission.granted) {
        Alert.alert('권한 필요', '이미지를 저장하려면 사진 저장 권한이 필요합니다.');
        return;
      }

      const uri = await captureRef(cardCaptureRef, {
        format: 'png',
        quality: 1.0,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('저장 완료', '위클리 카드가 갤러리에 저장되었습니다.');
    } catch (error) {
      console.error(error);
      Alert.alert('저장 실패', '이미지를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureRef(cardCaptureRef, {
        format: 'png',
        quality: 1.0,
      });

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '이번 주 위클리 카드 공유',
      });
    } catch (error) {
      console.error(error);
      Alert.alert('공유 실패', '이미지 공유 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3E629F" />
      </View>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyMessageText}>
              데이터를 불러올 수 없습니다.{'\n'}잠시 후 다시 시도해 주세요.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!weeklyData || !weeklyData.is_generated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyMessageText}>
              이번 주는 기록이 적어 카드를 만들지 못했어요
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          <View ref={cardCaptureRef} collapsable={false} style={styles.captureArea}>
            <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>

            {room && (
              <CharacterRoomCard
                characterType={room.character_type}
                currentStage={room.current_stage}
                assets={room.assets}
              />
            )}

            <View style={styles.summaryCardBlock}>
              <Text style={styles.blockTitle}>한 주 요약</Text>

              {weeklyData.weekly_summary ? (
                <Text style={styles.weeklySummaryText}>{weeklyData.weekly_summary}</Text>
              ) : null}

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>PLUS Log</Text>
                  <Text style={styles.summaryValue}>{weeklyData.plus_log_count}개</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>성공 퀘스트</Text>
                  <Text style={styles.summaryValue}>{weeklyData.success_quest_count}개</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>활동일</Text>
                  <Text style={styles.summaryValue}>{weeklyData.active_days}일</Text>
                </View>
              </View>

              {weeklyData.rest_NT_content ? (
                <View style={styles.restNtBox}>
                  <Text style={styles.restNtText}>{weeklyData.rest_NT_content}</Text>
                </View>
              ) : null}
            </View>

          </View>

          <View style={styles.cardBlock}>
            <Text style={styles.shareBlockTitle}>카드 저장 · 공유</Text>
            <Text style={styles.shareBlockSubTitle}>
              이번 주 카드를 간직하거나 공유해보세요
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSaveImage}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>저장</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>공유</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3ECFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3ECFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  captureArea: {
    backgroundColor: '#E3ECFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    marginHorizontal: -16,
    borderRadius: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  summaryCardBlock: {
    backgroundColor: '#E8EFE9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  weeklySummaryText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  cardBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1A18',
  },
  restNtBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D2D8D3',
  },
  restNtText: {
    fontSize: 13,
    color: '#4B6351',
    lineHeight: 18,
  },
  shareBlockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B1A18',
    textAlign: 'center',
    marginBottom: 4,
  },
  shareBlockSubTitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B1A18',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});