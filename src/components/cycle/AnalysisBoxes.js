import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getSticker } from '../../lib/assets';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';

const QUEST_PAGE = 5;

const CHIP_COLORS = [
  COLORS.chip1,
  COLORS.chip2,
  COLORS.chip3,
  COLORS.chip4,
  COLORS.chip5,
];

export function ActivityChipBox({ title, items, unlocked }) {

  const list = (items ?? []).filter((item) => item?.plus_log_content?.trim());

  return (
    <View style={styles.activityBox}>
      <Text style={styles.informTitle}>{title}</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 기록이 충분하지 않아요</Text>
      ) : (
        <View style={styles.activityList}>
          {list.map((item, i) => (
            <View
              key={item.plus_log_content}
              style={[styles.activityRow, { backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }]}
            >
              <Image source={getSticker(item.asset)} style={styles.activityIcon} resizeMode="contain" />

              <Text style={styles.activityText} numberOfLines={3}>
                {item.plus_log_content}
              </Text>

              <Text style={styles.activityCount}>{item.plus_log_count ?? 0}회</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function CompletedQuestBox({ quests, unlocked }) {
  const list = (quests ?? []).filter((name) => name?.trim());
  const [shown, setShown] = useState(QUEST_PAGE);

  const visible = list.slice(0, shown);
  const hasMore = list.length > shown;

  return (
    <View style={styles.insightBox}>
      <Text style={styles.informTitle}>완료한 퀘스트</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 완료한 퀘스트가 없어요</Text>
      ) : (
        <>
          <View style={styles.suggestList}>
            {visible.map((name, i) => (
              <View key={i} style={styles.suggestRow}>
                <Text style={styles.questCheck}>✓</Text>
                <Text style={styles.suggestText}>{name}</Text>
              </View>
            ))}
          </View>

          {hasMore && (
            <Pressable
              style={({ pressed }) => [styles.moreButton, pressed && PRESSED]}
              onPress={() => setShown(shown + QUEST_PAGE)}
            >
              <Text style={styles.moreButtonText}>더보기</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

export function AnalysisBox({ title, lines, unlocked, dotColor }) {

  const list = (lines ?? []).filter((line) => line?.trim());

  return (
    <View style={styles.insightBox}>
      <Text style={styles.informTitle}>{title}</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 기록이 충분하지 않아요</Text>
      ) : (
        <View style={styles.suggestList}>
          {list.map((line, i) => (
            <View key={i} style={styles.suggestRow}>
              <View style={[styles.suggestDot, { backgroundColor: dotColor }]} />
              <Text style={styles.suggestText}>{line}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  insightBox: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardAlt,
  },

  activityBox: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
  },

  informTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
    paddingVertical: 4,
  },

  suggestList: {
    marginTop: 10,
    gap: 10,
  },

  suggestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  suggestDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginTop: 5,
  },

  questCheck: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.primary,
    lineHeight: 15,
  },

  suggestText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.text,
    lineHeight: 15,
  },

  lockText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    fontStyle: 'italic',
  },

  activityList: {
    gap: 8,
    marginTop: 10,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.button,
  },

  activityIcon: {
    width: 20,
    height: 20,
  },

  activityText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.text,
    lineHeight: 18,
  },

  activityCount: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

  moreButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },

  moreButtonText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },
});
