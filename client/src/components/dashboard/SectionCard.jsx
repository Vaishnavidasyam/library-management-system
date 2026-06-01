const SectionCard = ({ title, subtitle, children, action }) => (
  <section className="glass-card section-card">
    <div className="section-card-header">
      <div>
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default SectionCard;
