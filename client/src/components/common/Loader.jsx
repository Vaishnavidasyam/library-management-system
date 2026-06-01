const Loader = ({ height = '280px' }) => (
  <div className="loader-shell" style={{ minHeight: height }}>
    <div className="loader-ring" />
  </div>
);

export default Loader;
