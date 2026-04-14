import { useEffect, useState } from "react";
import { getFoodById } from "../api/apiCollection/foodApi";

function MealDetailPage({ food, foodId, onBack, onAddToPlan }) {
  const [apiFood, setApiFood] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!foodId && !food?._id && !food?.id) return;

    const id = foodId || food?._id || food?.id;
    (async () => {
      try {
        const res = await getFoodById(id);
        if (!isMounted) return;
        setApiFood(res?.data || null);
      } catch (err) {
        console.error("Failed to load food details", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [foodId, food?._id, food?.id]);

  const shownFood = apiFood || food;
  if (!shownFood) return null;
  const imageUrl = shownFood?.imageUrl
    ? shownFood.imageUrl.startsWith("http")
      ? shownFood.imageUrl
      : `http://localhost:5000${shownFood.imageUrl}`
    : null;
  return (
    <div className="page">
      <button className="btn-view" style={{marginBottom:"1.5rem"}} onClick={onBack}>← Back</button>
      <div className="detail-grid">
        <div>
          <div
            className="detail-hero"
            style={
              imageUrl
                ? {
                    background: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.65)), url(${imageUrl}) center/cover no-repeat`,
                  }
                : undefined
            }
          >
            {!imageUrl && shownFood.emoji}
          </div>
          <h1 className="detail-name">{shownFood.name}</h1>
          <p style={{color:"var(--text2)",fontSize:15,marginBottom:"1.5rem",lineHeight:1.7}}>{shownFood.desc}</p>
          <div className="detail-meta">
            <span className="detail-badge accent">🔥 {shownFood.cal} kcal</span>
            <span className="detail-badge">₹{shownFood.price}</span>
            <span className="detail-badge">⭐ {shownFood.rating}</span>
            <span className="detail-badge">{shownFood.type==="veg"?"🟢 Veg":shownFood.type==="vegan"?"🌿 Vegan":"🔴 Non-veg"}</span>
          </div>

          <div className="card-panel" style={{marginBottom:"1.5rem"}}>
            <div className="panel-title">Nutrition per serving</div>
            {[
              {label:"Protein",val:`${shownFood.protein}g`,pct:shownFood.protein/1.2},
              {label:"Carbohydrates",val:`${shownFood.carbs}g`,pct:shownFood.carbs/2.5},
              {label:"Fats",val:`${shownFood.fat}g`,pct:shownFood.fat/0.65},
            ].map(n=>(
              <div key={n.label} className="nutrient-row">
                <div className="nutrient-label">{n.label}</div>
                <div className="nutrient-bar"><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(n.pct,100)}%`}}/></div></div>
                <div className="nutrient-val">{n.val}</div>
              </div>
            ))}
            <div style={{marginTop:12,padding:"12px",background:"rgba(76,175,125,0.1)",borderRadius:8,fontSize:13,color:"var(--green)"}}>
              ✅ Health Score: {shownFood.health}/100 — {shownFood.health>85?"Excellent choice!":shownFood.health>70?"Good for your goals":"Occasional treat"}
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
              {(shownFood.ingredients || []).map((ing,i)=>(
                <li key={i} className="ingredient-item">
                  <span className="ingredient-name">🔸 {ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-panel">
            <div className="panel-title">Recipe Steps</div>
            <ol className="steps-list">
              {(shownFood.steps || []).map((step,i)=>(
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