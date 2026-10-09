import { useState, useEffect } from "react";
import {
  Shield, ShieldCheck, Video, Wifi, Mic, Moon, TrendingUp, BellOff, Check,
  AlertTriangle, Lock, Thermometer, Droplets, Sun, Phone, Volume2, Router,
  Siren, ListChecks, History, BellRing, RefreshCw, User, Circle,
} from "lucide-react";

const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.7);
    setTimeout(() => ctx.close(), 900);
  } catch { /* audio unavailable */ }
}

const NAV = ["Live Feed", "Settings"];

/* ---------- small shared pieces ---------- */
const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/70 ${className}`}>{children}</div>
);

const Dot = ({ className }) => <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${className}`} />;

function Header({ isAlert, tab, setTab }) {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Shield className="h-5 w-5 text-emerald-800" /> NurseryCam
          </div>
          <nav className="hidden items-center gap-2 text-sm font-medium text-slate-600 md:flex">
            {NAV.map((n, i) => (
              <button
                key={n}
                onClick={() => setTab(i)}
                className={`rounded-full px-4 py-1.5 transition ${
                  tab === i ? (isAlert ? "bg-red-100 text-red-800" : "bg-emerald-300/80 text-emerald-900") : "hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="h-3 w-10 rounded-full bg-slate-100 shadow-inner">
            <span className="ml-4 mt-[3px] block h-1.5 w-1.5 rounded-full bg-emerald-800" />
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-white shadow-md">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}

function AlertBanner({ muteLeft }) {
  return (
    <div className="bg-red-700 text-white shadow-lg">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-6 py-2.5 text-sm font-bold">
        <span className="flex items-center gap-2 uppercase">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          {muteLeft > 0 ? `Local alarm muted • Re-arms in ${fmt(muteLeft)} • Visual monitoring active` : "Local alarm sounding • Crib audio siren active (82 dB)"}
        </span>
        <span className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-white/90 px-3 py-0.5 text-red-700">Zone 1: Nursery Main</span>
          P2P Low-Latency Alert Hub
        </span>
      </div>
    </div>
  );
}

/* ---------- live feed ---------- */
function Feed({ isAlert }) {
  const scene = isAlert
    ? "from-rose-200/60 via-rose-100/40 to-slate-500"
    : "from-slate-500 via-slate-400 to-slate-600";
  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-800 shadow-2xl shadow-slate-400/50">
      {/* stand-in for the <video> / <img> stream */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scene} ${isAlert ? "" : "grayscale"}`}>
        <div className="absolute inset-[12%] rounded-[3rem] bg-slate-100/80 shadow-inner" />
        <div
          className={`absolute left-1/2 top-1/2 h-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-xl ${
            isAlert ? "w-[48%] rotate-90 scale-x-90" : "w-[16%]"
          }`}
        />
      </div>

      {/* top-left */}
      <div className="absolute left-4 top-4 flex flex-col gap-2 text-white">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-bold backdrop-blur">
          <Dot className={isAlert ? "animate-pulse bg-red-500" : "bg-red-500"} />
          {isAlert ? "LIVE ALERT" : "LIVE"}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-sm drop-shadow">
          <Circle className="h-4 w-4 fill-red-500 text-red-500" /> Rec
        </span>
      </div>

      {/* top-right */}
      <div className="absolute right-4 top-4">
        {isAlert ? (
          <span className="flex items-center gap-1.5 rounded-full bg-red-700 px-3 py-1 text-xs font-bold uppercase text-white shadow-lg">
            <AlertTriangle className="h-3.5 w-3.5" /> Critical hazard detected <Lock className="ml-1 h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Video className="h-3.5 w-3.5" /> 04:38 AM <span className="text-emerald-300">• 1080p Local Stream</span>
          </span>
        )}
      </div>

      {/* hazard bounding box */}
      {isAlert && (
        <div className="absolute left-[33%] top-[34%] h-[48%] w-[35%] animate-pulse rounded-lg border-2 border-dashed border-red-600 bg-red-500/10">
          <span className="absolute -top-3 left-4 flex items-center gap-1 rounded bg-red-700 px-2 py-0.5 text-[11px] font-bold text-white">
            <RefreshCw className="h-3 w-3" /> <AlertTriangle className="h-3 w-3" /> HAZARD: PRONE POSITION (FACE-DOWN)
          </span>
          <span className="absolute -bottom-3 right-0 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
            <span className="text-red-300">Confidence: 98.4%</span> • SpO2 Est: Normal
          </span>
        </div>
      )}

      {/* bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-slate-900/80 to-transparent p-4 text-white">
        {isAlert ? (
          <div className="flex items-center gap-3 rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <span className="flex items-center gap-1"><Thermometer className="h-3.5 w-3.5 text-emerald-300" /> 68.4°F</span>|
            <span className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-sky-300" /> 46% RH</span>|
            <span className="text-red-300">Motion Burst + Rustle</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-lg"><Dot className="bg-emerald-400" /> Crib Cam 01</div>
            <div className="ml-4 text-xs font-medium text-slate-200">Direct LAN Stream • Zero Cloud Transit</div>
          </div>
        )}
        {isAlert ? (
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1.5 text-xs font-semibold">
            <Dot className="animate-pulse bg-red-500" /> Continuous Edge Inference Active
          </span>
        ) : (
          <div className="flex items-center gap-3 rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-bold backdrop-blur">
            <Mic className="h-3.5 w-3.5 text-emerald-300" />
            <Wifi className="h-3.5 w-3.5 text-emerald-300" /> 98%
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- status strip ---------- */
function StatusStrip() {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-sky-50 p-5 shadow-md shadow-slate-200/70">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-emerald-900 shadow-md">
        <Check className="h-6 w-6" strokeWidth={3} />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">Baby is safe. Sleeping on back. Crib is clear.</p>
        <p className="text-sm text-slate-600">Real-time AI posture &amp; airway verification active. Last checked 2 seconds ago.</p>
      </div>
    </div>
  );
}

function ActionRequired({ elapsed, muted }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-red-100 p-6 shadow-lg shadow-red-200/60 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        <span className="mt-1 h-12 w-12 shrink-0 animate-pulse rounded-full bg-red-700 shadow-lg shadow-red-400/50" />
        <div>
          <p className="text-xs text-slate-600">
            <span className="mr-2 rounded bg-red-700 px-2 py-0.5 font-bold uppercase text-white">Action required</span>
            Triggered {elapsed}s ago • 04:31:08 AM
          </p>
          <h2 className="mt-1 text-xl font-bold text-red-800">Baby rolled onto stomach (prone position)</h2>
          <p className="mt-1 text-sm text-slate-700">
            Please enter the nursery and adjust your baby onto their back immediately to ensure an unobstructed airway.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700"><Volume2 className="h-3.5 w-3.5" /> {muted ? "Local hub chime muted" : "Local hub chime ringing"}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-700"><Siren className="h-3.5 w-3.5" /> Airway obstruction verification in progress</p>
        </div>
      </div>
      <div className="rounded-2xl bg-white px-6 py-3 text-center shadow-md">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Elapsed time</p>
        <p className="font-mono text-4xl font-bold text-red-700">{fmt(elapsed)}</p>
        <p className="text-xs text-slate-500">Continuous Alert</p>
      </div>
    </div>
  );
}

function QuickControls() {
  const items = [
    { icon: Sun, label: "Crib Lighting", value: "Auto-Soft Lit (15%)" },
    { icon: Mic, label: "Two-Way Intercom", value: "Channel Open" },
    { icon: Router, label: "Direct LAN Stream", value: "192.168.1.15" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md shadow-slate-200/70">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700"><Icon className="h-5 w-5" /></span>
          <div><p className="text-[11px] text-slate-500">{label}</p><p className="text-sm font-semibold text-slate-900">{value}</p></div>
        </div>
      ))}
    </div>
  );
}

function MuteAcknowledge({ muteLeft, onMute, onChime, talking, onTalk }) {
  const muted = muteLeft > 0;
  return (
    <Card className="p-5">
      <button
        onClick={onMute}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold text-white shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
          muted ? "bg-slate-700 shadow-slate-300 hover:bg-slate-800" : "bg-red-700 shadow-red-300 hover:bg-red-800"
        }`}
      >
        {muted ? <BellOff className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
        {muted ? `MUTED • UNMUTE (${fmt(muteLeft)})` : "MUTE ALARM & ACKNOWLEDGE"}
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">
        Disables local hub buzzer for 3 minutes. Visual monitoring remains active. Local hardware fail-safe re-arms automatically.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-medium text-slate-700">
        <button onClick={onChime} className="flex items-center justify-center gap-2 rounded-lg bg-sky-100 py-2 hover:bg-sky-200"><Volume2 className="h-4 w-4" /> Test Chime</button>
        <button onClick={onTalk} className={`flex items-center justify-center gap-2 rounded-lg py-2 ${talking ? "bg-emerald-200 text-emerald-900" : "bg-sky-100 hover:bg-sky-200"}`}>
          <Phone className="h-4 w-4" /> {talking ? "Talking… (tap to end)" : "Intercom Talk"}
        </button>
      </div>
    </Card>
  );
}

/* ---------- side panels ---------- */
function SafetyChecks({ isAlert }) {
  const rows = isAlert
    ? [
        { t: "Posture Tracking", s: "Prone / Abdomen down", v: "UNSAFE", tone: "bad" },
        { t: "Crib Environment", s: "No pillows or loose fabric", v: "CLEAR", tone: "good" },
        { t: "Airway Monitor", s: "Micro-chest movement scan", v: "VERIFYING", tone: "wait" },
      ]
    : [
        { t: "Posture Tracking", s: "Supine position verified", v: "Active", tone: "good" },
        { t: "Crib Environment", s: "Zero obstructions detected", v: "Clear", tone: "good" },
        { t: "Airway Monitor", s: "Normal rhythmic breathing", v: "Active", tone: "good" },
      ];
  const bg = { bad: "bg-red-100", good: "bg-slate-50", wait: "bg-slate-50" };
  const dot = { bad: "bg-red-600", good: "bg-emerald-700", wait: "bg-slate-500" };
  const txt = { bad: "text-red-700 font-bold text-lg", good: "text-emerald-800 font-semibold text-sm", wait: "text-slate-600 font-semibold text-sm" };
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          {isAlert ? <ListChecks className="h-5 w-5 text-slate-600" /> : <ShieldCheck className="h-5 w-5 text-emerald-700" />}
          Local Safety Checks
        </h3>
        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${isAlert ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-800"}`}>
          {isAlert ? "1 Failure" : "Automated"}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.t} className={`flex items-center justify-between rounded-2xl p-4 ${bg[r.tone]}`}>
            <div className="flex items-start gap-3">
              {isAlert && <Dot className={`mt-1.5 ${dot[r.tone]}`} />}
              <div>
                <p className={`text-sm font-semibold ${r.tone === "bad" ? "text-red-800" : "text-slate-900"}`}>{r.t}</p>
                <p className={`text-xs ${r.tone === "bad" ? "text-red-700" : "text-slate-600"}`}>{r.s}</p>
              </div>
            </div>
            <span className={`flex items-center gap-1.5 rounded-full ${isAlert ? "" : "bg-white px-3 py-0.5 shadow-sm"} ${txt[r.tone]}`}>
              {!isAlert && <Dot className={dot[r.tone]} />}{r.v}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SleepLog({ isAlert }) {
  const entries = isAlert
    ? [
        { time: "JUST NOW • 04:31 AM", text: "ALERT: Posture changed to stomach-sleeping. Rapid 180° rollover detected by bed sensor mesh.", bad: true },
        { time: "10 mins ago • 04:21 AM", text: "Baby settled and is sleeping on their back." },
        { time: "1 hour ago • 03:30 AM", text: "Fell asleep quietly (Supine posture confirmed)." },
      ]
    : [
        { time: "Current Time", text: "Crib is clear of loose items", dot: "bg-emerald-700" },
        { time: "10 mins ago", text: "Baby rolled onto their back", dot: "bg-blue-500", link: true },
        { time: "1 hour ago", text: "Fell asleep", dot: "bg-slate-300" },
      ];
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Moon className="h-5 w-5 text-slate-600" /> Tonight's Sleep Log</h3>
        <span className="text-xs text-slate-500">{isAlert ? "Today, Oct 24" : "Local Storage"}</span>
      </div>
      <ul className="space-y-3">
        {entries.map((e, i) => (
          <li key={i} className={`flex gap-3 ${isAlert ? `rounded-2xl p-3 ${e.bad ? "bg-red-100" : "bg-slate-50"}` : ""}`}>
            {!isAlert && <Dot className={`mt-1.5 ${e.dot}`} />}
            {isAlert && (e.bad ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" /> : <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />)}
            <div>
              <p className={`text-xs ${e.bad ? "font-bold text-red-700" : "text-slate-500"}`}>{e.time}</p>
              <p className={`text-sm ${e.bad ? "font-medium text-red-800" : e.link ? "text-blue-600" : "text-slate-700"}`}>{e.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Patterns({ isAlert, roomMuted, onRoomMute }) {
  if (!isAlert) {
    return (
      <>
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900"><TrendingUp className="h-5 w-5 text-emerald-700" /> All-Time Sleep Patterns</h3>
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm font-semibold text-slate-900">
                <span>Around Current Time (4:00 – 5:00 AM)</span><span className="text-xs text-emerald-700">92% match</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Usually in deep REM sleep • Minimal movement expected</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm font-semibold text-slate-900"><span>Next Anticipated Transition</span><span className="text-xs text-slate-500">Avg 6:15 AM</span></div>
              <p className="mt-1 text-sm text-slate-600">Typical wake window &amp; gentle stirring begins</p>
            </div>
          </div>
        </Card>
        <button onClick={onRoomMute} aria-pressed={roomMuted} className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold shadow-md shadow-slate-200/70 ${roomMuted ? "bg-slate-800 text-white" : "bg-white text-slate-800 hover:bg-slate-50"}`}>
          <BellOff className="h-4 w-4" /> {roomMuted ? "Room Alarm Muted (tap to unmute)" : "Mute Room Alarm"}
        </button>
        <p className="px-4 text-center text-xs text-slate-500">Audio alarm will still sound locally on the monitor hub in emergency.</p>
      </>
    );
  }
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><TrendingUp className="h-5 w-5 text-slate-600" /> Pattern Disruption</h3>
        <span className="text-xs font-semibold text-red-700">0% Historical Fit</span>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
          <span>Window: 04:00 - 05:00 AM</span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Unusual</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">Abnormal Movement Detected: Baby shifted from supine to prone position (0% historical match for this time window over past 21 nights).</p>
      </div>
      <div className="mt-4 flex items-end justify-between text-[11px]">
        <span className="text-slate-500">Rest Baseline</span>
        <svg viewBox="0 0 200 40" className="h-10 w-48" fill="none" strokeLinejoin="round">
          <path d="M0 30 L90 30 L100 28 L110 30 L125 8 L135 34 L145 14 L155 30 L200 30" stroke="#b91c1c" strokeWidth="2" />
        </svg>
        <span className="font-semibold text-red-700">Motion Outlier Spike</span>
      </div>
    </Card>
  );
}

/* ---------- Sensors / Audio & Sleep / LAN Settings tabs ---------- */
const Toggle = ({ on, onChange, label, sub }) => (
  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      {sub && <p className="text-xs text-slate-600">{sub}</p>}
    </div>
    <button
      role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-emerald-600" : "bg-slate-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  </div>
);

const Stat = ({ icon: Icon, label, value, sub }) => (
  <Card className="flex items-center gap-4">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-700"><Icon className="h-6 w-6" /></span>
    <div><p className="text-xs text-slate-500">{label}</p><p className="text-3xl font-semibold text-slate-900">{value}</p><p className="text-xs text-slate-600">{sub}</p></div>
  </Card>
);

function OtherTab({ tab }) {
  const [sensors, setSensors] = useState({ temp: 68.4, rh: 46, motion: 3 });
  const [level, setLevel] = useState(12);
  const [volume, setVolume] = useState(60);
  const [quality, setQuality] = useState("1080p");
  const [prefs, setPrefs] = useState({ whiteNoise: false, cry: true, nightLight: true, encrypt: true, discover: true });
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const id = setInterval(() => {
      setSensors((s) => ({
        temp: +(s.temp + (Math.random() - 0.5) * 0.2).toFixed(1),
        rh: Math.round(Math.min(60, Math.max(35, s.rh + (Math.random() - 0.5) * 2))),
        motion: Math.round(Math.random() * 8),
      }));
      setLevel(Math.round(8 + Math.random() * 14));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  if (tab === 1)
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <Stat icon={Thermometer} label="Room temperature" value={`${sensors.temp}°F`} sub="Comfort range 68–72°F" />
        <Stat icon={Droplets} label="Humidity" value={`${sensors.rh}% RH`} sub="Comfort range 40–50%" />
        <Stat icon={Wifi} label="Motion level" value={`${sensors.motion}/10`} sub="Bed sensor mesh • live" />
      </div>
    );

  if (tab === 2)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Mic className="h-5 w-5 text-slate-600" /> Room audio</h3>
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Sound level</span><span>{level} dB</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${level * 3}%` }} /></div>
          </div>
          <label className="block text-sm font-semibold text-slate-900">
            Hub speaker volume: {volume}%
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(+e.target.value)} className="mt-2 w-full accent-emerald-700" />
          </label>
          <Toggle on={prefs.whiteNoise} onChange={set("whiteNoise")} label="White noise" sub="Plays from the nursery hub" />
          <Toggle on={prefs.cry} onChange={set("cry")} label="Cry detection alerts" sub="Processed on-device" />
        </Card>
        <Card className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Moon className="h-5 w-5 text-slate-600" /> Sleep summary</h3>
          {[["Fell asleep", "03:30 AM"], ["Longest stretch", "2h 41m"], ["Position changes", "2"], ["Typical wake window", "6:15 AM"]].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-2xl bg-slate-50 p-4 text-sm"><span className="text-slate-600">{k}</span><span className="font-semibold text-slate-900">{v}</span></div>
          ))}
          <Toggle on={prefs.nightLight} onChange={set("nightLight")} label="Auto soft night light" sub="15% brightness" />
        </Card>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Router className="h-5 w-5 text-slate-600" /> Local network</h3>
        {[["Camera address", "192.168.1.15"], ["Stream", "Direct LAN • Peer-to-peer"], ["Cloud transit", "None"]].map(([k, v]) => (
          <div key={k} className="flex justify-between rounded-2xl bg-slate-50 p-4 text-sm"><span className="text-slate-600">{k}</span><span className="font-semibold text-slate-900">{v}</span></div>
        ))}
        <label className="block text-sm font-semibold text-slate-900">
          Stream quality
          <select value={quality} onChange={(e) => setQuality(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <option>1080p</option><option>720p</option><option>480p (low bandwidth)</option>
          </select>
        </label>
      </Card>
      <Card className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Lock className="h-5 w-5 text-slate-600" /> Privacy</h3>
        <Toggle on={prefs.encrypt} onChange={set("encrypt")} label="Encrypt LAN stream" sub="Keys stay on this network" />
        <Toggle on={prefs.discover} onChange={set("discover")} label="Local device discovery" sub="Let the hub find the camera" />
      </Card>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <OtherTab tab={1} />
      <OtherTab tab={2} />
      <OtherTab tab={3} />
    </div>
  );
}

/* ---------- page ---------- */
export default function NurseryCamDashboard() {
  const [isAlert, setIsAlert] = useState(false);
  const [tab, setTab] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [muteLeft, setMuteLeft] = useState(0);
  const [roomMuted, setRoomMuted] = useState(false);
  const [talking, setTalking] = useState(false);
  const muted = muteLeft > 0;

  // Spacebar toggles state (ignored while typing or on form controls)
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (e.code === "Space" && !["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(tag)) {
        e.preventDefault();
        setIsAlert((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset alert-only state whenever the mode flips
  useEffect(() => { setElapsed(0); setMuteLeft(0); setTalking(false); }, [isAlert]);

  // Alert clock: elapsed time up, mute countdown down
  useEffect(() => {
    if (!isAlert) return;
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
      setMuteLeft((m) => Math.max(0, m - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isAlert]);

  // Audible chime while alert is active and not muted
  useEffect(() => {
    if (!isAlert || muted) return;
    playChime();
    const id = setInterval(playChime, 2000);
    return () => clearInterval(id);
  }, [isAlert, muted]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isAlert ? "bg-red-50/40" : "bg-slate-50"}`}>
      {/* hidden toggle: tab to it or click the invisible bottom-left corner */}
      <button
        aria-label="Toggle alert state"
        onClick={() => setIsAlert((v) => !v)}
        className="fixed bottom-0 left-0 z-50 h-6 w-6 opacity-0 focus:opacity-100"
      />

      <Header isAlert={isAlert} tab={tab} setTab={setTab} />
      {isAlert && <AlertBanner muteLeft={muteLeft} />}

      <main className="mx-auto max-w-[1280px] space-y-6 px-6 py-6">
        {tab !== 0 ? (
          <SettingsView />
        ) : (
          <>
            <Feed isAlert={isAlert} />
            {!isAlert ? (
              <>
                <StatusStrip />
                <div className="grid items-start gap-6 lg:grid-cols-3">
                  <SafetyChecks isAlert={false} />
                  <SleepLog isAlert={false} />
                  <div className="space-y-4">
                    <Patterns isAlert={false} roomMuted={roomMuted} onRoomMute={() => setRoomMuted((v) => !v)} />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-6">
                  <ActionRequired elapsed={elapsed} muted={muted} />
                  <QuickControls />
                  <MuteAcknowledge
                    muteLeft={muteLeft}
                    onMute={() => setMuteLeft(muted ? 0 : 180)}
                    onChime={playChime}
                    talking={talking}
                    onTalk={() => setTalking((v) => !v)}
                  />
                </div>
                <div className="space-y-6">
                  <SafetyChecks isAlert />
                  <SleepLog isAlert />
                  <Patterns isAlert />
                </div>
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
}
