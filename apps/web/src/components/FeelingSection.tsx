import { MoodCluster } from "./MoodCluster";

export function FeelingSection({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <section className="today-section feeling-section" id="feeling" data-section="feeling">
      <MoodCluster value={value} onChange={onChange} />
    </section>
  );
}
