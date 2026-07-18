import Loader from './Loader';

function PrimaryButton({ children, isLoading = false, ...props }) {
  return (
    <button
      className="btn btn-primary"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader label="Please wait" /> : children}
    </button>
  );
}

export default PrimaryButton;
