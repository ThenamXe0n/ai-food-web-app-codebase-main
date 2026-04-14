function MealDetailPage({ food, onBack, onAddToPlan }) {
  if (!food) return null;
  return (
    <div className="page">
      <button className="btn-view" style={{marginBottom:"1.5rem"}} onClick={onBack}>← Back</button>
      <div className="detail-grid">
        <div>
          <div className="detail-hero">{food.emoji}</div>
          <h1 className="detail-name">{food.name}</h1>
          <p style={{color:"var(--text2)",fontSize:15,marginBottom:"1.5rem",lineHeight:1.7}}>{food.desc}</p>
          <div className="detail-meta">
            <span className="detail-badge accent">🔥 {food.cal} kcal</span>
            <span className="detail-badge">₹{food.price}</span>
            <span className="detail-badge">⭐ {food.rating}</span>
            <span className="detail-badge">{food.type==="veg"?"🟢 Veg":food.type==="vegan"?"🌿 Vegan":"🔴 Non-veg"}</span>
          </div>

          <div className="card-panel" style={{marginBottom:"1.5rem"}}>
            <div className="panel-title">Nutrition per serving</div>
            {[
              {label:"Protein",val:`${food.protein}g`,pct:food.protein/1.2},
              {label:"Carbohydrates",val:`${food.carbs}g`,pct:food.carbs/2.5},
              {label:"Fats",val:`${food.fat}g`,pct:food.fat/0.65},
            ].map(n=>(
              <div key={n.label} className="nutrient-row">
                <div className="nutrient-label">{n.label}</div>
                <div className="nutrient-bar"><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(n.pct,100)}%`}}/></div></div>
                <div className="nutrient-val">{n.val}</div>
              </div>
            ))}
            <div style={{marginTop:12,padding:"12px",background:"rgba(76,175,125,0.1)",borderRadius:8,fontSize:13,color:"var(--green)"}}>
              ✅ Health Score: {food.health}/100 — {food.health>85?"Excellent choice!":food.health>70?"Good for your goals":"Occasional treat"}
            </div>
          </div>

          <button className="btn-primary" style={{width:"100%",padding:"13px"}} onClick={onAddToPlan}>
            + Add to Meal Plan
          </button>
        </div>

        <div>
          <div className="card-panel" style={{marginBottom:"1.5rem"}}>
            <div className="panel-title">Ingredients</div>
            <ul className="ingredients-list">
              {food.ingredients.map((ing,i)=>(
                <li key={i} className="ingredient-item">
                  <span className="ingredient-name">🔸 {ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-panel">
            <div className="panel-title">Recipe Steps</div>
            <ol className="steps-list">
              {food.steps.map((step,i)=>(
                <li key={i} className="step-item">
                  <div className="step-num">{i+1}</div>
                  <div className="step-text">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}


export default MealDetailPage