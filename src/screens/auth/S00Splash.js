// AU 03 자동 로그인 / 토큰 확인 — 앱의 진입 화면 (App.js initialRouteName)
import Placeholder from '../../components/common/Placeholder';

export default function S00Splash({ navigation }) {
  return (
    <Placeholder
      id="S00"
      title="스플래시"
      spec="AU 03 · 토큰 검증"
      navigation={navigation}
      links={[
        { label: '토큰 없음 → 로그인', to: 'Login' },
        { label: '온보딩 미완료 → 관심 영역', to: 'Interests' },
        { label: '온보딩 완료 → 홈', to: 'Main' },
      ]}
    />
  );
}
