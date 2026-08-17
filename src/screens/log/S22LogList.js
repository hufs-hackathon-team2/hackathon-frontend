// LG 03 기록 목록 조회 + LG 04 기록 수정 및 삭제
import { ScrollView, View, Text, StyleSheet, Pressable, Alert, ActivityIndicator} from 'react-native';
import LogItem from '../../components/log/LogItem';
import { getDateDisplay, getTimeDisplay, getDateDifference } from '../../lib/date';
import { getLogs, deleteLog, PAGE_SIZE } from '../../lib/api/logs';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';



export default function S22LogList({ navigation }) {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadLogs = () => {
    setLoading(true);
    setError(false);

    getLogs(1)
      .then((data) => {
        setLogs(data);
        setPage(1);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const loadMore = () => {
    const next = page + 1;

    getLogs(next)
      .then((data) => {
        setLogs(logs.concat(data));
        setPage(next);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch(() => Alert.alert('더 불러오지 못했어요', '잠시 후 다시 시도해주세요'));
  };

  useEffect(() => {
    loadLogs();

    // 기록을 새로 쓰고 돌아왔을 때 다시 받아온다
    const unsubscribe = navigation.addListener('focus', loadLogs);
    return unsubscribe;
  }, [navigation]);

  const removeLog = (logId) => {
    deleteLog(logId)
      .then(() => setLogs(logs.filter((log) => log.log_id !== logId)))
      .catch(() => Alert.alert('삭제하지 못했어요', '잠시 후 다시 시도해주세요'));
  };


  // PLUS Log 는 하루에 하나만 쓸 수 있다
  const wroteToday = logs.length > 0 &&
    getDateDifference(new Date(logs[0].created_at), new Date()) === 0;


  const handleDelete = (logid) => {
      Alert.alert('이 기록을 삭제할까요?', '', [
          {text: '취소', style: 'cancel'},
          {text: '삭제', style: 'destructive', onPress: () => removeLog(logid)}
      ]);
  }


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
        <View style={styles.titleRow}>
          <Text style={styles.logtitle}>PLUS Log 기록</Text>

          <Pressable
            style={[styles.addButton, wroteToday && styles.addButtonDisabled]}
            onPress={() => navigation.navigate('LogNew')}
            disabled={wroteToday}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.description}>지금까지 남긴 건강 행동이에요</Text>

        {wroteToday && (
          <Text style={styles.wroteTodayText}>오늘은 이미 기록했어요</Text>
        )}
      </View>


      {logs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 이번 사이클에 남긴 기록이 없어요</Text>
        </View>
      ) : (
        logs.map((log) => (
          <LogItem
            key={log.log_id}
            date={getDateDisplay(new Date(log.created_at))}
            time={getTimeDisplay(new Date(log.created_at))}
            content={log.content}
            onDelete={() => handleDelete(log.log_id)}
          />
        ))
      )}


    {hasMore && (
      <Pressable style={styles.moreButton} onPress={loadMore}>
        <Text style={styles.moreButtonText}>더보기</Text>
      </Pressable>
    )}

    </ScrollView>
  );
}




const styles = StyleSheet.create({
  
  container: {
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  logtitle:{
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 20,
  },

  description:{
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
    marginTop: 5,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: COLORS.navigate,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  addButtonText: {
    fontFamily: FONT.regular,
    fontSize: 26,
    lineHeight: 30,
    color: COLORS.navigateText,
  },

  wroteTodayText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginTop: 6,
  },

  logItem: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },

  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },
  moreButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  moreButtonText: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.textSub,
    marginBottom: 16,
  },
  retryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },

})