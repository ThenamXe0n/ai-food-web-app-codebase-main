import Stars from "../ui/Stars";

function FoodCard({ food, onView, liked, onLike }) {
  return (
    <div className="food-card">
      <div className="food-card-img" style={{background: `linear-gradient(135deg, #1a1a1a 0%, #252525 100%)`}}>
        <span>{food.emoji}</span>
        <span className="food-card-badge">🔥 {food.health}% healthy</span>
        <button className={`food-card-like${liked ? " liked" : ""}`} onClick={(e)=>{e.stopPropagation();onLike(food.id);}}>
          {liked ? "♥" : "♡"}
        </button>
      </div>
      <div className="food-card-body">
        <div className="food-card-name">{food.name}</div>
        <div className="food-card-meta">
          <span className="meta-item">🔥 {food.cal} kcal</span>
          <span className="meta-dot"/>
          <span className="meta-item">{food.type === "veg" ? "🟢 Veg" : food.type === "vegan" ? "🌿 Vegan" : "🔴 Non-veg"}</span>
          <span className="meta-dot"/>
          <Stars rating={Math.floor(food.rating)}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {food.tags.map(t=>(
            <span key={t} style={{fontSize:10,padding:"3px 8px",borderRadius:100,background:"rgba(232,168,56,0.1)",color:"var(--accent)",border:"1px solid rgba(232,168,56,0.2)"}}>{t}</span>
          ))}
        </div>
        <div className="food-card-footer">
          <span className="food-card-price">₹{food.price}</span>
          <button className="btn-view" onClick={()=>onView(food)}>View Details</button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard