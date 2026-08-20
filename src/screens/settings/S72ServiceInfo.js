// ST 01 서비스 안내
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';
import { SERVICE_INFO } from '../../lib/api/mock/settings';

export default function S72ServiceInfo({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>서비스 안내</Text>

        {SERVICE_INFO.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}

        <Pressable style={({ pressed }) => [styles.confirmButton, pressed && PRESSED]} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmText}>확인했어요</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    paddingHorizontal: SPACE.screen,
    paddingBottom: 30,
    flexGrow: 1,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    padding: SPACE.card,
    marginBottom: 12,
  },

  cardTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginBottom: 6,
  },

  cardBody: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    lineHeight: 20,
  },

  confirmButton: {
    backgroundColor: COLORS.navigate,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    marginTop: 20,
  },

  confirmText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
    textAlign: 'center',
  },
});
