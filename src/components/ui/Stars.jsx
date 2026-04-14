function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${rating >= i ? " on" : ""}`}>★</span>
      ))}
    </div>
  );
}

export default Stars