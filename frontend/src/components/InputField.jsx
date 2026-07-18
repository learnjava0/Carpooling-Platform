function InputField({
  icon: Icon,
  label,
  error,
  registration,
  className = '',
  ...props
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <div className={`input-shell ${error ? 'input-error' : ''}`}>
        {Icon && <Icon size={18} aria-hidden="true" />}
        <input aria-invalid={Boolean(error)} {...registration} {...props} />
      </div>
      {error && <small className="error-text">{error.message}</small>}
    </label>
  );
}

export default InputField;
