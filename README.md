# FRAMEWISE — Photography Learning Lab

Phase 3 fixes and upgrades the Depth of Field simulator.

## Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000

## Production checks

```powershell
npm run lint
npm run build
```

## What changed

- Full-width centered responsive layout with no unused white side columns.
- Fixed canvas sizing so the 3D simulator remains visible.
- Live range controls with visible numeric values.
- Animated 3D scene with play/pause and reset controls.
- Separate 3D view and optical side-view diagram.
- Focus plane, near/far depth-of-field bounds, and subject movement.
- Beginner, intermediate, and professional explanations.
- No external image or camera trademark assets are bundled; the Sony Alpha 6700 option is a learning reference profile.
