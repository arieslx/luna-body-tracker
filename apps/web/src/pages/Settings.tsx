import { useRef, useState } from "react";
import { exportMarkdown, parseJsonl, writeJsonl } from "@luna-body-tracker/import-export";
import { systemModuleDefinitions } from "@luna-body-tracker/schema";
import { useLunaRecords } from "../data/record-context";
import { toLocalDateKey } from "../data/dates";
import { useI18n } from "../i18n";

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function Settings({ onBack }: { onBack: () => void }) {
  const { records, weeklyFocus, replaceRecords, setWeeklyFocus } = useLunaRecords();
  const { locale, setLocale, t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState("");
  const dailyRecords = [...records.values()].sort((a, b) => a.date.localeCompare(b.date));
  const stamp = toLocalDateKey();

  function exportJsonl() {
    download(`luna-backup-${stamp}.jsonl`, `${writeJsonl({
      moduleDefinitions: systemModuleDefinitions,
      dailyRecords,
      settings: [{ weeklyFocus }]
    })}\n`, "application/x-ndjson");
  }

  function exportMd() {
    download(`luna-journal-${stamp}.md`, exportMarkdown({ moduleDefinitions: systemModuleDefinitions, dailyRecords }), "text/markdown");
  }

  async function importFile(file: File) {
    try {
      const snapshot = parseJsonl(await file.text());
      const conflicts = snapshot.dailyRecords.filter((record) => records.has(record.date));
      const fresh = snapshot.dailyRecords.length - conflicts.length;
      setImportMessage(`${fresh} 个新日期 · ${conflicts.length} 个同日记录`);
      if (conflicts.length && !window.confirm(`有 ${conflicts.length} 天已存在记录。要用备份替换这些日期吗？`)) return;
      await replaceRecords(snapshot.dailyRecords);
      const importedFocus = snapshot.settings.find((setting) => Array.isArray(setting.weeklyFocus))?.weeklyFocus;
      if (Array.isArray(importedFocus)) setWeeklyFocus(importedFocus.filter((metric): metric is typeof weeklyFocus[number] => typeof metric === "string" && ["mood", "food", "sleep", "movement", "water", "body", "notes"].includes(metric)).slice(0, 3));
      setImportMessage(`已恢复 ${snapshot.dailyRecords.length} 天记录`);
    } catch (error) {
      setImportMessage(error instanceof Error ? `无法导入：${error.message}` : "无法导入这个文件");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="settings-page">
      <button className="settings-back" onClick={onBack} type="button"><span aria-hidden="true">←</span> {t("settings.back")}</button>
      <header><p className="section-kicker">{t("settings.kicker")}</p><h1>{t("settings.title")}</h1><p>{t("settings.intro")}</p></header>
      <section className="language-section" aria-label={t("settings.language")}>
        <span>{t("settings.language")}</span>
        <div>
          <button aria-pressed={locale === "zh-CN"} className={locale === "zh-CN" ? "is-active" : ""} onClick={() => setLocale("zh-CN")} type="button">{t("settings.chinese")}</button>
          <button aria-pressed={locale === "en"} className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")} type="button">{t("settings.english")}</button>
        </div>
      </section>
      <section className="export-section">
        <div className="export-heading"><h2>{t("settings.backup")}</h2><small>{t("settings.days", { count: dailyRecords.length })}</small></div>
        <div className="export-grid">
          <button onClick={exportMd} type="button">
            <span className="export-file-icon">MD</span><strong>Markdown</strong><small>{t("settings.readable")}</small><i>↓</i>
          </button>
          <button onClick={exportJsonl} type="button">
            <span className="export-file-icon">{`{ }`}</span><strong>JSONL</strong><small>{t("settings.complete")}</small><i>↓</i>
          </button>
        </div>
        <button className="import-data-button" onClick={() => inputRef.current?.click()} type="button">{t("settings.restore")}</button>
        <input ref={inputRef} accept=".jsonl,.txt,application/x-ndjson,text/plain" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); }} type="file" />
        {importMessage && <p className="import-message" role="status">{importMessage}</p>}
        <p className="export-note">{t("settings.localNote")}</p>
      </section>
    </section>
  );
}
