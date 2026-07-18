function Loader({ label = 'Loading' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span className="loader" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default Loader;
