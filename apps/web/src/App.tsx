import { useState } from "react";
import { LunaTabs, type TabId } from "./components/LunaTabs";
import { Settings } from "./pages/Settings";
import { Today } from "./pages/Today";
import { Weeks } from "./pages/Weeks";
import { useLunaRecords } from "./data/record-context";

export function App() {
  const [tab, setTab] = useState<TabId>("today");
  const { status, retry } = useLunaRecords();

  return (
    <main className="prototype-stage">
      <div className="phone-shell">
        <div className={`local-save-state is-${status}`} role="status">
          {status === "loading" && "正在打开今天…"}
          {status === "saved" && "已保存在此设备"}
          {status === "error" && <button type="button" onClick={retry}>保存遇到问题 · 重试</button>}
        </div>
        {tab === "today" && <Today onOpenSettings={() => setTab("settings")} />}
        {tab === "weeks" && <Weeks />}
        {tab === "settings" && <Settings onBack={() => setTab("today")} />}
        {tab !== "settings" && <LunaTabs active={tab} onChange={setTab} />}
      </div>
    </main>
  );
}
