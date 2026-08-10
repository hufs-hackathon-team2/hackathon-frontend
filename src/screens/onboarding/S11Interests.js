// ON 01 관심 영역 선택
import Placeholder from '../../components/common/Placeholder';

export default function S11Interests({ navigation }) {
  return (
    <Placeholder
      id="S11"
      title="관심 영역 선택"
      spec="ON 01 · 진행 1/2"
      navigation={navigation}
      links={[{ label: '다음 → 캐릭터 선택', to: 'CharacterSelect' }]}
    />
  );
}
