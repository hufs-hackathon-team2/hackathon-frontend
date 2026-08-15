// LG 03 기록 목록 조회 + LG 04 기록 수정 및 삭제
import { ScrollView, View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import LogItem from '../../components/log/LogItem';
import { getDateDisplay, getTimeDisplay } from '../../lib/date';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const now = Date.now();
const HOUR = 60 * 60 * 1000;

const Mock_Logs = [
  { id: 1, content: '점심 먹고 30분 산책했다', createdAt: new Date(now - 2 * HOUR) },
  { id: 2, content: '자기 전 스트레칭 10분',   createdAt: new Date(now - 30 * HOUR) },
  { id: 3, content: '계단으로 5층까지 올라갔다', createdAt: new Date(now - 72 * HOUR) },
  { id: 4, content: '콜라 대신에 바나나 우유를 마셨다', createdAt: new Date(now - 102 * HOUR) },
  { id: 5, content: '치킨이 먹고 싶어서 피자를 먹었다', createdAt: new Date(now - 172 * HOUR) },
  { id: 6, content: '운동하려 설치다가 다쳐버렸다', createdAt: new Date(now - 272 * HOUR) },
  { id: 7, content: '마라탕탕후루후루', createdAt: new Date(now - 372 * HOUR) },
  { id: 8, content: '새로운 기록', createdAt: new Date(now - 472 * HOUR) },
  { id: 9, content: '오디세이는 용산 아이맥스 7층', createdAt: new Date(now - 572 * HOUR) },
  { id: 10, content: '페이지네이션을 위한 로그', createdAt: new Date(now - 672 * HOUR) },
  { id: 11, content: '야구는 질병이다', createdAt: new Date(now - 772 * HOUR) },
  { id: 12, content: '페이지네이션을 위한 로그2', createdAt: new Date(now - 872 * HOUR) },
  { id: 13, content: '중커톤이 다이어트다', createdAt: new Date(now - 972 * HOUR) },
  { id: 14, content: '모두들 헬플리하세요', createdAt: new Date(now - 1072 * HOUR) },
];



export default function S22LogList({ navigation }) {
    const insets = useSafeAreaInsets();
    const [logs, setLogs] = useState(Mock_Logs);
    const [visibleCount, setVisibleCount] = useState(10);

    const removeLog = (id) => {
      setLogs(logs.filter((log) => log.id !==id));
    }


    const handleDelete = (id) => {
        Alert.alert('이 기록을 삭제할까요?', '', [
            {text: '취소', style: 'cancel'},
            {text: '삭제', style: 'destructive', onPress: () => removeLog(id)}
        ]);
    }
  
  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>
      <View>
        <Text style={styles.header}>PLUS Log</Text>
      </View>

      <View>
        <Text style={styles.logtitle}>이번 사이클 기록</Text>
        <Text style={styles.description}>지금까지 남긴 건강 행동이에요</Text>
      </View>

      <Pressable style={styles.logButton} onPress={() => navigation.navigate('LogNew')}>
        <Text style={styles.logButtonText}>PLUS Log 작성하기</Text>
      </Pressable>


      {logs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 이번 사이클에 남긴 기록이 없어요</Text>
        </View>
      ) : (
        logs.slice(0, visibleCount).map((log) => (
          <LogItem
            key={log.id}
            date={getDateDisplay(log.createdAt)}
            time={getTimeDisplay(log.createdAt)}
            content={log.content}
            onDelete={() => handleDelete(log.id)}
          />
        ))
      )}


    {visibleCount < logs.length && (
      <Pressable style={styles.moreButton} onPress={() => setVisibleCount(visibleCount + 10)}>
        <Text style={styles.moreButtonText}>더보기</Text>
      </Pressable>
    )}

    </ScrollView>
  );
}




const styles = StyleSheet.create({
  
  container: {
    padding: 20,
  },

  header:{
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },

  logtitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },

  description:{
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  logButton: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
  },
  logButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  logItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  moreButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 12,
    marginVertical: 10,
  },
  moreButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 15,
  },
})