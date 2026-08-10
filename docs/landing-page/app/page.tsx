const GithubIcon = () => (
  <span className="github-icon" aria-hidden="true">⌘</span>
);

function SignalOrbit() {
  return (
    <div className="signal-orbit" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="moon" />
      <div className="signal-dot dot-one" />
      <div className="signal-dot dot-two" />
      <div className="signal-dot dot-three" />
      <div className="pulse">⌁</div>
      <span className="mini-label label-mood">MOOD</span>
      <span className="mini-label label-sleep">SLEEP</span>
      <span className="mini-label label-water">WATER</span>
    </div>
  );
}

function MiniTracker() {
  const items = [
    ["心情", "轻盈", "●"],
    ["睡眠", "7h", "☾"],
    ["饮水", "2杯", "○"],
    ["运动", "散步", "↗"],
  ];
  return (
    <div className="mini-tracker" aria-hidden="true">
      <div className="mini-top"><span>今天</span><span>07 · 25</span></div>
      <div className="tracker-grid">
        {items.map(([label, value, icon]) => (
          <div className="tracker-item" key={label}>
            <span className="tracker-icon">{icon}</span>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportVisual() {
  return (
    <div className="export-visual" aria-hidden="true">
      <div className="export-file file-back">MD</div>
      <div className="export-file file-front">JSONL</div>
      <div className="export-arrow">↘</div>
    </div>
  );
}

function AiVisual() {
  return (
    <div className="ai-visual" aria-hidden="true">
      <div className="ai-bubble big">本周睡眠更稳定</div>
      <div className="ai-bubble small">压力峰值出现在周三</div>
      <div className="ai-spark">✦</div>
    </div>
  );
}

function DeviceVisual() {
  return (
    <div className="device-visual" aria-hidden="true">
      <div className="product-preview preview-week">
        <div className="preview-bar">
          <span>luna body tracker</span>
          <span>WEEK</span>
        </div>
        <strong>2026/06/15 — 06/21</strong>
        <div className="week-table">
          {["Mon", "Tue", "Wed", "Thu"].map((day, index) => (
            <div className="week-row" key={day}>
              <b>{day}</b>
              <span className={index === 0 ? "week-filled" : ""}>Mood</span>
              <span>Sleep</span>
              <span>Water</span>
            </div>
          ))}
        </div>
      </div>

      <div className="product-preview preview-daily">
        <div className="preview-bar">
          <span>luna body tracker</span>
          <span>RECORD</span>
        </div>
        <strong>2026/06/15 Mon</strong>
        <div className="daily-grid">
          <div className="ui-panel ui-mood">
            <b>Mood</b>
            <span>🙂 Soft smile</span>
          </div>
          <div className="ui-side">
            <span className="ui-water">Water　▰ ▰ □ □</span>
            <span className="ui-sleep">Sleep　22 23 1 2</span>
          </div>
          <div className="ui-panel ui-food"><b>Food Pool</b><span>🥬　🥩　🍚　🥚</span></div>
          <div className="ui-panel ui-exercise"><b>Exercise</b><span>🏃 Aerobic　✦ walk</span></div>
        </div>
      </div>

      <span className="device-caption">DAILY / WEEKLY VIEW</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <a className="brand" href="#top" aria-label="Luna 首页">
            <span className="brand-mark">◐</span> LUNA
          </a>
          <div className="nav-links">
            <a href="#features">功能</a>
            <a className="nav-github" href="https://github.com/arieslx/luna-body-tracker" target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>
          </div>
        </nav>

        <div className="hero-inner" id="top">
          <span className="eyebrow">LOCAL-FIRST · OPEN SOURCE</span>
          <h1>听见身体的<br/><em>细微信号</em></h1>
          <p className="hero-copy">
            Luna 是一个属于你的身心记录系统。记下情绪、睡眠、饮食与身体节律，
            在不交出数据的前提下，看见长期模式。
          </p>
          <SignalOrbit />
          <div className="hero-actions">
            <a className="button primary" href="https://github.com/arieslx/luna-body-tracker" target="_blank" rel="noreferrer">
              在 GitHub 查看 <span>↗</span>
            </a>
            <a className="text-link" href="#features">了解它如何工作 ↓</a>
          </div>
        </div>
        <div className="hero-foot">
          <span>你的身体</span><i /><span>你的模式</span><i /><span>你的数据</span>
        </div>
      </section>

      <section className="product-showcase" aria-labelledby="product-showcase-title">
        <div className="showcase-heading">
          <span className="section-index">PRODUCT / A DAY WITH LUNA</span>
          <h2 id="product-showcase-title">每一种身体信号，<br/>都在同一处被看见。</h2>
          <p>从情绪与睡眠，到饮水、运动和身体状态。Luna 用安静一致的界面，陪你完成每天的自我观察。</p>
        </div>
        <div className="showcase-gallery">
          <figure>
            <img
              alt="Luna 的心情、睡眠和饮食记录界面，展示在三台相同尺寸的移动设备上"
              height="1086"
              loading="lazy"
              src="/luna-showcase-mood-sleep-food.png"
              width="1448"
            />
          </figure>
          <figure>
            <img
              alt="Luna 的饮水、运动和身体记录界面，展示在三台相同尺寸的移动设备上"
              height="1086"
              loading="lazy"
              src="/luna-showcase-water-movement-body.png"
              width="1448"
            />
          </figure>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading">
          <span className="section-index">01 / WHAT LUNA DOES</span>
          <h2>不是打卡工具。<br/>是你的个人数据协议。</h2>
          <p>把日常里散落的信号，整理成可回看、可迁移、可被你理解的长期记录。</p>
        </div>

        <div className="bento">
          <article className="card card-daily">
            <div>
              <span className="card-number">01</span>
              <h3>每天，轻轻记一下</h3>
              <p>心情、压力、排便、饮食、饮水、睡眠、运动与生理周期。一次记录，不需要完美。</p>
            </div>
            <MiniTracker />
          </article>

          <article className="card card-local">
            <div className="privacy-seal" aria-hidden="true"><span>LOCAL</span><strong>只在<br/>本地</strong></div>
            <div>
              <span className="card-number">02</span>
              <h3>数据先留在你身边</h3>
              <p>默认保存在本地。没有账号系统，也没有第三方云端自动同步。</p>
            </div>
          </article>

          <article className="card card-export">
            <div>
              <span className="card-number">03</span>
              <h3>随时带走</h3>
              <p>导出为开放、稳定的 JSONL 与可阅读的 Markdown。</p>
            </div>
            <ExportVisual />
          </article>

          <article className="card card-ai">
            <div>
              <span className="card-number">04</span>
              <h3>让 AI 看见模式，<br/>而不是窥见生活</h3>
              <p>通过受控接口读取、校验与总结；AI 不直接接触底层存储。</p>
            </div>
            <AiVisual />
          </article>

          <article className="card card-modules">
            <div className="module-visual" aria-hidden="true">
              <span>睡眠</span><span>心情</span><span>饮水</span><span className="custom">＋ 你的模块</span>
            </div>
            <div>
              <span className="card-number">05</span>
              <h3>长成你的样子</h3>
              <p>保留稳定的系统模板，也能创建属于自己的记录模块。</p>
            </div>
          </article>

          <article className="card card-devices">
            <div>
              <span className="card-number">06</span>
              <h3>在你顺手的地方记录</h3>
              <p>Chrome 扩展、PWA、可选自托管同步，以及低压力的掌上设备原型。</p>
            </div>
            <DeviceVisual />
          </article>
        </div>
      </section>

      <footer>
        <div>
          <span className="footer-mark">◐</span>
          <h2>从今天的一条记录开始。</h2>
        </div>
        <a className="button light" href="https://github.com/arieslx/luna-body-tracker" target="_blank" rel="noreferrer">
          打开开源项目 <span>↗</span>
        </a>
        <p>Open source under Apache-2.0 · Built for humans & AI agents</p>
      </footer>
    </main>
  );
}
