 "use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Mode = "beginner" | "intermediate" | "professional";
type Preset = { name: string; aperture: number; focal: number; focus: number; subject: number };

const presets: Preset[] = [
  { name: "Portrait", aperture: 1.8, focal: 85, focus: 3, subject: 3 },
  { name: "Landscape", aperture: 8, focal: 24, focus: 8, subject: 8 },
  { name: "Street", aperture: 4, focal: 35, focus: 5, subject: 5 },
  { name: "Macro", aperture: 5.6, focal: 100, focus: 0.8, subject: 0.8 }
];

function Scene({
  aperture,
  focal,
  focus,
  subject,
  playing
}: {
  aperture: number;
  focal: number;
  focus: number;
  subject: number;
  playing: boolean;
}) {
  const animatedGroup = useRef<THREE.Group>(null);
  const blur = Math.min(0.65, Math.max(0.02, (aperture - 1.4) / 23));
  const cameraFov = Math.max(26, Math.min(62, 48 + (50 - focal) * 0.13));

  useFrame((state, delta) => {
    if (!animatedGroup.current) return;
    const target = playing ? Math.sin(state.clock.elapsedTime * 1.35) * 0.16 : 0;
    animatedGroup.current.position.x = THREE.MathUtils.damp(animatedGroup.current.position.x, target, 4, delta);
    animatedGroup.current.rotation.y = THREE.MathUtils.damp(animatedGroup.current.rotation.y, playing ? Math.sin(state.clock.elapsedTime * 0.8) * 0.06 : 0, 4, delta);
  });

  const objects = useMemo(() => [
    { name: "Foreground", x: -2.6, z: 1.2, size: 1.1, color: "#6c665b", opacity: 1 - blur * 0.55 },
    { name: "Subject", x: 0, z: subject, size: 1.35, color: "#b85c38", opacity: 1 },
    { name: "House", x: 2.4, z: 7, size: 1.9, color: "#8c725a", opacity: 1 - blur * 0.85 },
    { name: "Mountain", x: 4.4, z: 10, size: 2.5, color: "#8c9680", opacity: 1 - blur }
  ], [blur, subject]);

  return (
    <>
      <color attach="background" args={["#d9d2c2"]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[-4, 8, 3]} intensity={3.2} />
      <PerspectiveCamera makeDefault position={[0, 2.8, -10]} fov={cameraFov} />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={16} target={[0, 1.2, 4]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 5]}>
        <planeGeometry args={[20, 28]} />
        <meshStandardMaterial color="#8b9874" roughness={1} />
      </mesh>
      <gridHelper args={[20, 20, "#d8c5a5", "#b9b394"]} position={[0, 0.025, 5]} />
      <group ref={animatedGroup}>
        {objects.map((object) => (
          <group key={object.name} position={[object.x, object.size / 2, object.z]}>
            <mesh scale={object.size}>
              <sphereGeometry args={[0.65, 32, 20]} />
              <meshStandardMaterial color={object.color} transparent opacity={object.opacity} roughness={0.82} />
            </mesh>
            <Text position={[0, object.size + 0.4, 0]} fontSize={0.22} color="#292824" anchorX="center">
              {object.name}
            </Text>
          </group>
        ))}
      </group>
      <mesh position={[0, 1.45, focus]}>
        <boxGeometry args={[6.5, 0.035, 0.035]} />
        <meshBasicMaterial color="#b85c38" />
      </mesh>
      <Text position={[0, 0.18, focus]} fontSize={0.2} color="#b85c38">FOCUS PLANE</Text>
    </>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  left,
  right
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  left: string;
  right: string;
}) {
  return (
    <div className="rangeControl">
      <div className="controlTop"><label>{label}</label><strong>{display}</strong></div>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="rangeLabels"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}

function OpticalDiagram({ focus, aperture, subject }: { focus: number; aperture: number; subject: number }) {
  const dof = Math.max(0.45, (aperture / 2.8) * 0.65 + focus * 0.1);
  const near = Math.max(0.2, focus - dof);
  const far = Math.min(10, focus + dof * 1.5);
  const scale = (distance: number) => 70 + distance * 72;

  return (
    <div className="diagram">
      <div className="diagramHeader">
        <span>Optical diagram — side view</span>
        <span className="diagramBadge">educational approximation</span>
      </div>
      <svg viewBox="0 0 900 260" role="img" aria-label="Side view showing camera, focus plane and depth of field zone">
        <defs>
          <linearGradient id="dofZone" x1="0" x2="1">
            <stop offset="0%" stopColor="#8bcf9b" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#8bcf9b" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#8bcf9b" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <line x1="40" y1="210" x2="860" y2="210" stroke="currentColor" strokeOpacity="0.35" />
        <path d={`M 70 92 L ${scale(near)} 130 L ${scale(far)} 65 L 860 40`} fill="none" stroke="#7ca8b8" strokeOpacity="0.45" strokeWidth="2" />
        <path d={`M 70 112 L ${scale(near)} 150 L ${scale(far)} 95 L 860 80`} fill="none" stroke="#7ca8b8" strokeOpacity="0.45" strokeWidth="2" />
        <rect x={scale(near)} y="38" width={Math.max(20, scale(far) - scale(near))} height="172" fill="url(#dofZone)" stroke="#76c995" strokeDasharray="6 5" />
        <line x1={scale(focus)} y1="28" x2={scale(focus)} y2="210" stroke="#e6b85b" strokeWidth="3" strokeDasharray="4 5" />
        <rect x="42" y="105" width="38" height="50" rx="5" fill="#4d9fc7" />
        <circle cx="80" cy="130" r="12" fill="#202c36" stroke="#b7e4f1" strokeWidth="3" />
        <circle cx={scale(subject)} cy="130" r="16" fill="#b85c38" stroke="#ffd4a4" strokeWidth="3" />
        <circle cx={scale(focus)} cy="130" r="12" fill="#e6b85b" stroke="#fff1cf" strokeWidth="3" />
        <text x="45" y="235" fill="currentColor" fontSize="13">Camera</text>
        <text x={scale(near)} y="25" fill="#76c995" fontSize="13" textAnchor="middle">Near limit</text>
        <text x={scale(focus)} y="18" fill="#e6b85b" fontSize="13" textAnchor="middle">Focus</text>
        <text x={scale(far)} y="25" fill="#76c995" fontSize="13" textAnchor="middle">Far limit</text>
        <text x={scale(subject)} y="165" fill="currentColor" fontSize="13" textAnchor="middle">Subject</text>
        <text x="760" y="235" fill="currentColor" fontSize="13">Distance →</text>
      </svg>
      <div className="diagramLegend">
        <span><i className="legendDot focusDot" /> Focus plane</span>
        <span><i className="legendDot zoneDot" /> Approximate acceptable sharpness zone</span>
        <span><i className="legendDot subjectDot" /> Subject position</span>
      </div>
    </div>
  );
}

export default function DepthOfFieldLab() {
  const [aperture, setAperture] = useState(2.8);
  const [focal, setFocal] = useState(50);
  const [focus, setFocus] = useState(4);
  const [subject, setSubject] = useState(4);
  const [mode, setMode] = useState<Mode>("beginner");
  const [camera, setCamera] = useState("Sony Alpha 6700 reference");
  const [playing, setPlaying] = useState(true);

  const apply = (preset: Preset) => {
    setAperture(preset.aperture);
    setFocal(preset.focal);
    setFocus(preset.focus);
    setSubject(preset.subject);
  };

  const reset = () => apply({ name: "Reset", aperture: 2.8, focal: 50, focus: 4, subject: 4 });

  return (
    <main>
      <div className="siteShell">
        <nav className="nav">
          <Link className="brand" href="/">FRAMEWISE<span>.</span></Link>
          <div className="navlinks"><Link href="/learn">All lessons</Link><Link className="navCta" href="/">Home ↗</Link></div>
        </nav>

        <section className="lesson">
          <div className="lessonHead">
            <div className="eyebrow">Lens & optics · Interactive lesson</div>
            <div className="lessonTitleRow">
              <div><h1>Depth of Field</h1><p>Move the controls and watch both views respond. Drag inside the 3D scene to orbit the camera.</p></div>
              <button className="button outlineButton" onClick={reset}>↺ Reset</button>
            </div>
            <div className="presetBar">
              <span className="presetLabel">Presets</span>
              {presets.map((preset) => <button key={preset.name} className="chip" onClick={() => apply(preset)}>{preset.name}</button>)}
              <button className="chip playChip" onClick={() => setPlaying((current) => !current)}>{playing ? "Ⅱ Pause animation" : "▶ Play animation"}</button>
            </div>
          </div>

          <div className="simulatorShell">
            <div className="simulatorTopline">
              <span>LIVE SIMULATOR</span>
              <span>{camera} · {playing ? "animated" : "paused"}</span>
            </div>
            <div className="simulatorGrid">
              <section className="visualColumn">
                <div className="panel scenePanel">
                  <div className="panelHeading"><span>3D viewfinder</span><span className="readout">f/{aperture.toFixed(1)} · {focal}mm · {focus.toFixed(1)}m</span></div>
                  <div className="canvasFrame">
                    <Canvas dpr={[1, 2]} camera={{ position: [0, 2.8, -10], fov: 48 }} gl={{ antialias: true }}>
                      <Scene aperture={aperture} focal={focal} focus={focus} subject={subject} playing={playing} />
                    </Canvas>
                  </div>
                  <div className="sceneFooter"><span>Orbit: drag · Zoom: wheel</span><span>Focus plane: {focus.toFixed(1)}m</span></div>
                </div>
                <OpticalDiagram focus={focus} aperture={aperture} subject={subject} />
              </section>

              <aside className="panel settingsPanel">
                <div className="panelHeading"><span>Camera settings</span><span className="settingsIcon">✳</span></div>
                <label className="fieldLabel" htmlFor="cameraReference">Camera reference</label>
                <select id="cameraReference" value={camera} onChange={(event) => setCamera(event.target.value)}>
                  <option>Sony Alpha 6700 reference</option>
                  <option>Full-frame reference</option>
                  <option>APS-C generic reference</option>
                  <option>Micro Four Thirds reference</option>
                </select>
                <RangeControl label="Aperture (f-number)" value={aperture} min={1.4} max={16} step={0.1} display={`f/${aperture.toFixed(1)}`} onChange={setAperture} left="f/1.4 · wide" right="f/16 · narrow" />
                <RangeControl label="Focal length" value={focal} min={18} max={200} step={1} display={`${focal}mm`} onChange={setFocal} left="18mm · wide" right="200mm · telephoto" />
                <RangeControl label="Focus distance" value={focus} min={0.8} max={9} step={0.1} display={`${focus.toFixed(1)}m`} onChange={setFocus} left="Close" right="Far" />
                <RangeControl label="Subject position" value={subject} min={0.8} max={10} step={0.1} display={`${subject.toFixed(1)}m`} onChange={setSubject} left="Near" right="Far" />
                <div className="settingDivider" />
                <div className="fieldLabel">Learning level</div>
                <div className="modeSwitch">
                  {(["beginner", "intermediate", "professional"] as Mode[]).map((level) => <button key={level} className={mode === level ? "active" : ""} onClick={() => setMode(level)}>{level}</button>)}
                </div>
                <button className="button primary fullButton" onClick={reset}>Reset settings</button>
              </aside>
            </div>
          </div>

          <section className="insight panel">
            <div className="eyebrow">Learning explanation</div>
            <h2>{mode === "beginner" ? "What is changing?" : mode === "intermediate" ? "Connect the variables" : "Professional context"}</h2>
            {mode === "beginner" && <p>A wider aperture such as f/1.8 generally creates a shallower depth of field. Stopping down toward f/8 usually increases the range that appears acceptably sharp. Focus distance also matters: moving closer makes the sharp zone more limited.</p>}
            {mode === "intermediate" && <p>Aperture is only one variable. Focal length, focus distance, subject distance, sensor format and the circle of confusion influence depth of field. Change one control at a time and compare the 3D view with the side diagram.</p>}
            {mode === "professional" && <p>This simulator is an educational approximation, not a calibrated lens simulator. A production optical model would include sensor dimensions, circle of confusion, aperture diameter, hyperfocal distance, near/far limits and a framing-preservation mode.</p>}
          </section>
        </section>
        <footer className="footer">FRAMEWISE · Interactive optics study · Prototype</footer>
      </div>
    </main>
  );
}