// ON 02 캐릭터 선택 (고양이 / 강아지 택 1, 이후 변경 불가)
import Placeholder from '../../components/common/Placeholder';

export default function S12CharacterSelect({ navigation }) {
  return (
    <Placeholder
      id="S12"
      title="캐릭터 선택"
      spec="ON 02 · 진행 2/2"
      navigation={navigation}
      links={[{ label: '다음 → 온보딩 완료', to: 'OnboardingComplete' }]}
    />
  );
}
