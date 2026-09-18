import Link from "next/link";

export default function Learn() {
  return (
    <main>
      <div className="siteShell">
        <nav className="nav">
          <Link className="brand" href="/">FRAMEWISE<span>.</span></Link>
          <Link href="/">Home</Link>
        </nav>
        <section className="section">
          <div className="eyebrow">Explore</div>
          <h2>Choose your learning path.</h2>
          <p className="sectionIntro">Start with the fundamentals, then move toward professional decision-making.</p>
          <div className="topicGrid">
            <Link className="topicCard featuredCard" href="/learn/depth-of-field">
              <div className="topicNumber">01 / LIVE</div>
              <h3>Depth of Field</h3>
              <p>Change aperture, focal length and focus distance while watching a 3D scene and optical diagram respond.</p>
              <span className="button primary smallButton">Open simulator ↗</span>
            </Link>
            {["Exposure Triangle", "Focal Length & FOV", "Perspective", "Motion Blur", "Lighting"].map((title) => (
              <div className="topicCard" key={title}>
                <div className="topicNumber">COMING NEXT</div>
                <h3>{title}</h3>
                <p>This lesson is staged for the next module. The learning architecture is ready for expansion.</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}