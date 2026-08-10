// ON 03 온보딩 완료 처리 + NT 00 푸시 권한 요청
import Placeholder from '../../components/common/Placeholder';

export default function S13Complete({ navigation }) {
  return (
    <Placeholder
      id="S13"
      title="온보딩 완료"
      spec="ON 03 · NT 00"
      navigation={navigation}
      links={[{ label: '시작하기 → 홈', to: 'Main' }]}
    />
  );
}
