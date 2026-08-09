import { EmotionCluster } from "./EmotionCluster";

export function FeelingSection({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <section className="today-section feeling-section" id="feeling" data-section="feeling">
      <EmotionCluster value={value} onChange={onChange} />
    </section>
  );
}
