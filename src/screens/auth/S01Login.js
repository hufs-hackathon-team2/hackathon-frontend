// AU 02 로그인
import Placeholder from '../../components/common/Placeholder';

export default function S01Login({ navigation }) {
  return (
    <Placeholder
      id="S01"
      title="로그인"
      spec="AU 02"
      navigation={navigation}
      links={[
        { label: '회원가입', to: 'Signup' },
        { label: '비밀번호를 잊으셨나요?', to: 'ResetPassword' },
        { label: '로그인 성공 → 홈', to: 'Main' },
      ]}
    />
  );
}
