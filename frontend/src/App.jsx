import { ArrowRight, BarChart3, Boxes, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Boxes,
    title: 'Modular Setup',
    description: 'Start with a simple React structure that can grow into routed pages, shared components, and API services.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Ready',
    description: 'A clean first screen for an operational app, with focused areas for metrics, actions, and workflow status.',
  },
  {
    icon: ShieldCheck,
    title: 'Practical Defaults',
    description: 'Vite, ESLint, React 19, and lightweight styling are ready for fast local development.',
  },
];

function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Odoo Hackathon 2026</p>
          <h1 id="page-title">Odoo X KSV Frontend</h1>
          <p className="intro-copy">
            A focused React starter for building your hackathon product UI.
          </p>
        </div>

        <button className="primary-action" type="button">
          Start Building
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>

      <section className="feature-grid" aria-label="Frontend foundation">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default App;
