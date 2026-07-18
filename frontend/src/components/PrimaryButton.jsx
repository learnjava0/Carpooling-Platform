import Loader from './Loader';

function PrimaryButton({ children, isLoading = false, ...props }) {
  return (
    <button className="primary-button" disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader label="Please wait" /> : children}
    </button>
  );
}

export default PrimaryButton;
