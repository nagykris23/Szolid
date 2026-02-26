import "./Rolunk.css";

export default function Rolunk() {
  return (
    <div className="rolunk-page">


      <section className="rolunk-hero">
        <div className="rolunk-hero-overlay" />
        <div className="rolunk-hero-content">
          <span className="rolunk-eyebrow">A mi történetünk</span>
          <h1>Rólunk</h1>
        </div>
      </section>


      <section className="rolunk-body">
        <div className="rolunk-body-inner">
          <p className="rolunk-lead">
            Az Oxi Essence egy szenvedélyből született magyar illatmárka. Hisszük, hogy az illat a lélek tükre — és hogy a prémium minőség mindenkinek jár.
          </p>
          <p>
            2020-ban alakultunk azzal a céllal, hogy természetes alapanyagokból készült, kézzel alkotott parfümöket hozzunk el a magyar vásárlóknak. Minden palackba tudást, gondoskodást és szenvedélyt öntünk.
          </p>
          <p>
            Termékeink 100%-ban Magyarországon készülnek, kizárólag minőségi, etikusan beszerzett alapanyagokból. Büszkék vagyunk arra, hogy egyre több elégedett vásárló választja az Oxi Essence illatait.
          </p>
        </div>
      </section>

      <section className="rolunk-team">
        <div className="rolunk-team-inner">
          <h2>A csapat</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">NK</div>
              <h3>Nagy Kristóf</h3>
              <span>Frontend fejlesztő</span>
            </div>
            <div className="team-card">
              <div className="team-avatar">RT</div>
              <h3>Rácz Tibor Máté</h3>
              <span>Backend fejlesztő</span>
            </div>
          </div>
        </div>
      </section>


      <section className="rolunk-cta">
        <h2>Fedezd fel kollekciónkat</h2>
        <div className="rolunk-cta-btns">
          <a href="/parfumok" className="rolunk-btn-primary">PARFÜMÖK</a>
          <a href="/kollekciok" className="rolunk-btn-secondary">KOLLEKCIÓK</a>
        </div>
      </section>

    </div>
  );
}
