import { useI18n } from "../i18n";

type QuietSectionProps = { id: string; kicker: string; title: string; prompt: string; children: React.ReactNode };

function QuietSection({ id, kicker, title, prompt, children }: QuietSectionProps) {
  return (
    <section className="today-section quiet-section" id={id} data-section={id}>
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p className="quiet-prompt">{prompt}</p>
      {children}
    </section>
  );
}

export function NotesSection({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useI18n();
  return <QuietSection id="notes" kicker={t("today.notes.kicker")} title={t("today.notes.title")} prompt={t("today.notes.prompt")}>
    <textarea className="notes-input" aria-label={t("today.notes.label")} onChange={(event) => onChange(event.target.value)} placeholder={t("today.notes.placeholder")} rows={4} value={value} />
  </QuietSection>;
}
