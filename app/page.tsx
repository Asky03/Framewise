import Link from "next/link";

const topics = [
  ["01", "Depth of Field", "Explore focus distance, aperture and background separation.", "/learn/depth-of-field"],
  ["02", "Exposure Triangle", "Balance aperture, shutter speed and ISO in practical scenes.", "/learn"],
  ["03", "Focal Length", "Understand framing, field of view and perspective.", "/learn"],
  ["04", "Composition", "Experiment with grids, balance, leading lines and space.", "/learn"],
  ["05", "Motion", "Freeze movement, pan and create intentional blur.", "/learn"],
  ["06", "Lighting", "Move light around a subject and observe shadow behavior.", "/learn"]
];

export default function Home() {
  return (
    <main>
      <div className="siteShell">
        <nav className="nav">
          <Link className="brand" href="/">FRAMEWISE<span>.</span></Link>
          <div className="navlinks">
            <Link href="/learn">Lessons</Link>
            <Link href="#topics">Topics</Link>
            <Link className="navCta" href="/learn/depth-of-field">Open simulator ↗</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="heroCopy">
            <div className="eyebrow">Interactive photography laboratory</div>
            <h1>See the picture<br />before you take it.</h1>
            <p>Learn the decisions photographers make through visual, hands-on simulations instead of passive definitions.</p>
            <div className="heroActions">
              <Link className="button primary" href="/learn/depth-of-field">Start experimenting ↗</Link>
              <Link className="textLink" href="/learn">Explore lessons</Link>
            </div>
          </div>
          <div className="heroArt" aria-label="Illustration of a camera overlooking a landscape">
            <div className="artSun" />
            <div className="artHill artHillBack" />
            <div className="artHill artHillFront" />
            <div className="artCamera">
              <div className="cameraLabel">FW / 01</div>
              <div className="cameraLens"><div /></div>
              <div className="cameraGrip" />
            </div>
            <div className="artCaption">OBSERVE · ADJUST · UNDERSTAND</div>
          </div>
        </section>

        <section className="section" id="topics">
          <div className="eyebrow">Learning paths</div>
          <h2>Built around real photographic decisions.</h2>
          <div className="topicGrid">
            {topics.map(([number, title, description, href]) => (
              <Link className="topicCard" href={href} key={title}>
                <div className="topicNumber">{number}</div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="cardArrow">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="footer">FRAMEWISE · Open-source learning prototype</footer>
      </div>
    </main>
  );
}