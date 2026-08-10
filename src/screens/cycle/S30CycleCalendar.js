// CY 02 사이클 달력 시각화 (휴식기 밴드 표시)
import Placeholder from '../../components/common/Placeholder';

export default function S30CycleCalendar({ navigation }) {
  return (
    <Placeholder
      id="S30"
      title="사이클 달력"
      spec="CY 02"
      navigation={navigation}
      links={[
        { label: '사이클 분석 결과', to: 'CycleAnalysis' },
        { label: '사이클 히스토리', to: 'CycleHistory' },
      ]}
    />
  );
}
