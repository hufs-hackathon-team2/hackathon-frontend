// LG 03 기록 목록 조회 + LG 04 기록 수정 및 삭제
import { ScrollView, View, Text, StyleSheet, Pressable, Alert, ActivityIndicator} from 'react-native';
import LogItem from '../../components/log/LogItem';
import { getDateDisplay, getTimeDisplay } from '../../lib/date';
import { getLogs, deleteLog } from '../../lib/api/logs';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function S22LogList({ navigation }) {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const loadLogs = () => {
    setLoading(true);
    setError(false);

    getLogs()
      .then((data) => setLogs(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const removeLog = (logId) => {
    deleteLog(logId)
      .then(() => setLogs(logs.filter((log) => log.log_id !== logId)))
      .catch(() => Alert.alert('삭제하지 못했어요', '잠시 후 다시 시도해주세요'));
  };


  const handleDelete = (logid) => {
      Alert.alert('이 기록을 삭제할까요?', '', [
          {text: '취소', style: 'cancel'},
          {text: '삭제', style: 'destructive', onPress: () => removeLog(logid)}
      ]);
  }


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>기록을 불러오지 못했어요</Text>
        <Pressable style={styles.retryButton} onPress={loadLogs}>
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </View>
    );
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
            key={log.log_id}
            date={getDateDisplay(new Date(log.created_at))}
            time={getTimeDisplay(new Date(log.created_at))}
            content={log.content}
            onDelete={() => handleDelete(log.log_id)}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
  },
  retryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    fontSize: 15,
    color: '#666',
  },

})