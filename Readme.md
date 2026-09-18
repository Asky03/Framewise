# FRAMEWISE — Interactive Photography Learning Lab

FRAMEWISE is an open-source, hands-on photography learning platform that helps users understand camera settings through interactive simulations.

Instead of only reading theory, learners can adjust camera parameters and observe how those changes affect a virtual scene.

## Features

* Interactive Depth of Field simulator
* 3D viewfinder scene
* Optical side-view diagram
* Aperture, focal length, focus distance, and subject position controls
* Portrait, Landscape, Street, and Macro presets
* Beginner, Intermediate, and Professional learning modes
* Responsive design for desktop and mobile
* Sony Alpha 6700 reference profile for educational purposes

## Tech Stack

* Next.js
* React
* TypeScript
* Three.js
* React Three Fiber
* React Three Drei
* CSS

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Run production checks

```bash
npm run lint
npm run build
```

## Project Structure

```text
app/
  learn/
  page.tsx
  globals.css

components/
  DepthOfFieldLab.tsx

docs/
  SECURITY.md
```

## Roadmap

* [ ] More accurate depth-of-field calculations
* [ ] Exposure Triangle simulator
* [ ] Shutter speed and motion blur simulation
* [ ] Focal length and perspective simulator
* [ ] Lighting and composition labs
* [ ] Accessibility improvements
* [ ] Mobile interaction improvements
* [ ] Community contributions

## Disclaimer

The camera profiles and optical simulations are educational approximations. They are not intended to replace official camera manuals or calibrated optical tools.

Sony Alpha 6700 is referenced for educational comparison. This project does not claim affiliation with Sony.

## Contributing

Contributions, bug reports, suggestions, and educational improvements are welcome.

Please read `CONTRIBUTING.md` before submitting a pull request.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
