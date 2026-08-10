// AU 01 회원가입 (이메일)
import Placeholder from '../../components/common/Placeholder';

export default function S02Signup({ navigation }) {
  return (
    <Placeholder
      id="S02"
      title="회원가입"
      spec="AU 01"
      navigation={navigation}
      links={[{ label: '가입 완료 → 관심 영역', to: 'Interests' }]}
    />
  );
}
