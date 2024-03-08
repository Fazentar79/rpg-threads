import PropTypes from "prop-types";

export default function ButtonPost({ children, disabled }) {
  return (
    <button
      className={`bg-white relative z-10 m-3 p-3 shadow-lg shadow-black rounded-full disabled:cursor-not-allowed disabled:opacity-90 cursor-pointer hover:scale-110 duration-150`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

ButtonPost.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};
