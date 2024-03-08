import PropTypes from "prop-types";

export default function ButtonSubscription({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-200 px-5 py-3 rounded-md disabled:cursor-not-allowed disabled:opacity-90 cursor-pointer hover:bg-gray-100 duration-150 w-full`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

ButtonSubscription.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
