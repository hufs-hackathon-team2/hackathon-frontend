// ST 01 설정 화면 + ST 02 알림 수신 설정 + AU 04 로그아웃 + AU 06 회원 탈퇴
import Placeholder from '../../components/common/Placeholder';

export default function S70Settings({ navigation }) {
  return (
    <Placeholder
      id="S70"
      title="설정"
      spec="ST 01 · ST 02 · AU 04 · AU 06"
      navigation={navigation}
      links={[{ label: '로그아웃 → 로그인', to: 'Login' }]}
    />
  );
}
