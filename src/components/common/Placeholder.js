import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PRESSED } from '../../lib/theme';

/**
 * 아직 안 만든 화면용 임시 컴포넌트.
 * 담당자가 자기 화면을 작업할 때 이걸 지우고 진짜 UI 로 교체하면 된다.
 *
 * links: [{ label: '버튼이름', to: '라우트이름' }] — 라우팅이 뚫렸는지 걸어보는 용도
 */
export default function Placeholder({ id, title, spec, navigation, links = [] }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.id}>{id}</Text>
      <Text style={styles.title}>{title}</Text>
      {spec ? <Text style={styles.spec}>{spec}</Text> : null}

      <View style={styles.links}>
        {links.map((link) => (
          <Pressable
            key={link.to}
            style={({ pressed }) => [styles.button, pressed && PRESSED]}
            onPress={() => navigation.navigate(link.to)}
          >
            <Text style={styles.buttonText}>{link.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  id: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B6B70',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
  },
  spec: {
    fontSize: 13,
    color: '#6B6B70',
    marginTop: 4,
  },
  links: {
    marginTop: 32,
    width: '100%',
    maxWidth: 320,
    gap: 8,
  },
  button: {
    backgroundColor: '#F7F7F8',
    borderWidth: 1,
    borderColor: '#E0E0E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});
