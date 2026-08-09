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
  return <QuietSection id="notes" kicker="leave it here" title="Notes" prompt="A thought, a detail, or nothing at all.">
    <textarea className="notes-input" aria-label="Notes for today" onChange={(event) => onChange(event.target.value)} placeholder="Today felt…" rows={4} value={value} />
  </QuietSection>;
}
