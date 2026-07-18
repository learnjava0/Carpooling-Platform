function InputField({ icon: Icon, label, error, registration, className = '', ...props }) {
  return (
    <label className={`field ${className}`}>
      {label && <span className="field-label">{label}</span>}
      <div className={`input-shell ${error ? 'input-error' : ''}`}>
        {Icon && <Icon size={17} aria-hidden="true" style={{ flexShrink: 0 }} />}
        <input aria-invalid={Boolean(error)} {...registration} {...props} />
      </div>
      {error && <small className="error-text">{error.message}</small>}
    </label>
  );
}

export default InputField;
