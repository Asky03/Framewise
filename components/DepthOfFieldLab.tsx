 "use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
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
  playing,
  cameraHeight,
  cameraAngle
}: {
  aperture: number;
  focal: number;
  focus: number;
  subject: number;
  playing: boolean;
  cameraHeight: number;
  cameraAngle: number;
}) {
  const animatedGroup = useRef<THREE.Group>(null);

  const blur = Math.min(
    0.65,
    Math.max(0.02, (aperture - 1.4) / 23)
  );

  const cameraFov = Math.max(
    26,
    Math.min(62, 48 + (50 - focal) * 0.13)
  );

  const cameraRadius = 10;
  const angleInRadians = THREE.MathUtils.degToRad(cameraAngle);

  const cameraPosition: [number, number, number] = [
    Math.sin(angleInRadians) * cameraRadius,
    2.8 + cameraHeight,
    -Math.cos(angleInRadians) * cameraRadius
  ];

  useFrame((state, delta) => {
    if (!animatedGroup.current) return;

    const movement = playing
      ? Math.sin(state.clock.elapsedTime * 1.35) * 0.16
      : 0;

    const rotation = playing
      ? Math.sin(state.clock.elapsedTime * 0.8) * 0.06
      : 0;

    animatedGroup.current.position.x = THREE.MathUtils.damp(
      animatedGroup.current.position.x,
      movement,
      4,
      delta
    );

    animatedGroup.current.rotation.y = THREE.MathUtils.damp(
      animatedGroup.current.rotation.y,
      rotation,
      4,
      delta
    );
  });

  const getOpacity = (distance: number) => {
    const difference = Math.abs(distance - focus);
    return Math.max(0.42, 1 - difference * blur * 0.12);
  };

  return (
    <>
      <color attach="background" args={["#d9d2c2"]} />

      <ambientLight intensity={1.8} />

      <directionalLight
        position={[-4, 8, 3]}
        intensity={3.2}
      />

      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={16}
        target={[0, 1.5, 4]}
      />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 5]}
      >
        <planeGeometry args={[22, 28]} />
        <meshStandardMaterial
          color="#8b9874"
          roughness={1}
        />
      </mesh>

      <gridHelper
        args={[20, 20, "#d8c5a5", "#b9b394"]}
        position={[0, 0.025, 5]}
      />

      <group ref={animatedGroup}>

        {/* Foreground rock */}
        <group position={[-3, 0.65, 1.2]}>
          <mesh scale={[1.3, 0.8, 1]}>
            <dodecahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial
              color="#625e52"
              transparent
              opacity={getOpacity(1.2)}
              roughness={0.9}
            />
          </mesh>

          <Html
            position={[0, 1.3, 0]}
            center
            sprite
            distanceFactor={10}
          >
            <div className="sceneLabel">Foreground rock</div>
          </Html>
        </group>

        {/* Person / subject */}
        <group position={[0, 0, subject]}>

          {/* Legs */}
          <mesh position={[-0.18, 0.45, 0]}>
            <capsuleGeometry args={[0.09, 0.65, 8, 16]} />
            <meshStandardMaterial color="#292c38" />
          </mesh>

          <mesh position={[0.18, 0.45, 0]}>
            <capsuleGeometry args={[0.09, 0.65, 8, 16]} />
            <meshStandardMaterial color="#292c38" />
          </mesh>

          {/* Body */}
          <mesh position={[0, 1.35, 0]}>
            <capsuleGeometry args={[0.32, 0.85, 8, 16]} />
            <meshStandardMaterial color="#b85c38" />
          </mesh>

          {/* Head */}
          <mesh position={[0, 2.25, 0]}>
            <sphereGeometry args={[0.28, 24, 18]} />
            <meshStandardMaterial color="#c58c68" />
          </mesh>

          {/* Hair */}
          <mesh position={[0, 2.46, 0]}>
            <sphereGeometry args={[0.29, 24, 12]} />
            <meshStandardMaterial color="#302820" />
          </mesh>

          {/* Arms */}
          <mesh
            position={[-0.43, 1.35, 0]}
            rotation={[0, 0, -0.18]}
          >
            <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
            <meshStandardMaterial color="#c58c68" />
          </mesh>

          <mesh
            position={[0.43, 1.35, 0]}
            rotation={[0, 0, 0.18]}
          >
            <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
            <meshStandardMaterial color="#c58c68" />
          </mesh>

          <Html
            position={[0, 3, 0]}
            center
            sprite
            distanceFactor={10}
          >
            <div className="sceneLabel subjectLabel">
              Subject
            </div>
          </Html>
        </group>

        {/* House */}
        <group position={[2.8, 0, 7]}>

          {/* House body */}
          <mesh position={[0, 1.35, 0]}>
            <boxGeometry args={[2.6, 2.7, 2.1]} />
            <meshStandardMaterial
              color="#a95d35"
              transparent
              opacity={getOpacity(7)}
              roughness={0.9}
            />
          </mesh>

          {/* Roof */}
          <mesh
            position={[0, 3.15, 0]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <coneGeometry args={[2.15, 1.25, 4]} />
            <meshStandardMaterial
              color="#5b3929"
              transparent
              opacity={getOpacity(7)}
              roughness={0.9}
            />
          </mesh>

          {/* Door */}
          <mesh position={[0, 0.75, -1.08]}>
            <boxGeometry args={[0.55, 1.35, 0.06]} />
            <meshStandardMaterial color="#e6d6b8" />
          </mesh>

          {/* Window */}
          <mesh position={[0.75, 1.65, -1.08]}>
            <boxGeometry args={[0.45, 0.45, 0.06]} />
            <meshStandardMaterial color="#d9e5e0" />
          </mesh>

          <Html
            position={[0, 4.1, 0]}
            center
            sprite
            distanceFactor={10}
          >
            <div className="sceneLabel">
              House
            </div>
          </Html>
        </group>

        {/* Mountain */}
        <group position={[5, 0, 10]}>

          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[3.4, 5, 4]} />
            <meshStandardMaterial
              color="#7f8c83"
              transparent
              opacity={getOpacity(10)}
              roughness={1}
            />
          </mesh>

          <mesh position={[-2.3, 1.5, 0.5]}>
            <coneGeometry args={[2.4, 3, 4]} />
            <meshStandardMaterial
              color="#9ba594"
              transparent
              opacity={getOpacity(10)}
              roughness={1}
            />
          </mesh>

          <Html
            position={[0, 5.5, 0]}
            center
            sprite
            distanceFactor={10}
          >
            <div className="sceneLabel">
              Mountain
            </div>
          </Html>
        </group>
      </group>

      {/* Focus plane */}
      <mesh position={[0, 1.5, focus]}>
        <boxGeometry args={[7, 0.035, 0.035]} />
        <meshBasicMaterial color="#b85c38" />
      </mesh>

      <Html
        position={[0, 0.2, focus]}
        center
        sprite
        distanceFactor={10}
      >
        <div className="focusLabel">
          FOCUS PLANE
        </div>
      </Html>
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

// New camera controls
const [cameraHeight, setCameraHeight] = useState(0);
const [cameraAngle, setCameraAngle] = useState(0);
  const [mode, setMode] = useState<Mode>("beginner");
  const [camera, setCamera] = useState("Sony Alpha 6700 reference");
  const [playing, setPlaying] = useState(true);

  const apply = (preset: Preset) => {
    setAperture(preset.aperture);
    setFocal(preset.focal);
    setFocus(preset.focus);
    setSubject(preset.subject);
  };

  const reset = () => {
  apply({
    name: "Reset",
    aperture: 2.8,
    focal: 50,
    focus: 4,
    subject: 4
  });

  setCameraHeight(0);
  setCameraAngle(0);
};

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
                <RangeControl
  label="Camera height"
  value={cameraHeight}
  min={-2}
  max={3}
  step={0.1}
  display={`${cameraHeight.toFixed(1)}m`}
  onChange={setCameraHeight}
  left="Low angle"
  right="High angle"
/>

<RangeControl
  label="Camera angle"
  value={cameraAngle}
  min={-45}
  max={45}
  step={1}
  display={`${cameraAngle}°`}
  onChange={setCameraAngle}
  left="Left"
  right="Right"
/>
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