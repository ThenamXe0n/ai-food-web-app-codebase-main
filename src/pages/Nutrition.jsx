import Stars from "../components/ui/Stars";
import { DAYS, FOODS } from "../data/sampleData";

function NutritionPage() {
  const circumference = 2 * Math.PI * 54;
  const progress = 0.62 * circumference;
  return (
    <div className="page">
      <h1 className="section-title">Nutrition Analysis</h1>
      <p className="section-sub">Your detailed health breakdown for this week</p>

      <div className="nutrition-hero">
        <div className="calorie-ring">
          <svg viewBox="0 0 120 120" style={{transform:"rotate(-90deg)"}}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" strokeWidth="8"
              strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"/>
          </svg>
          <div className="calorie-center">
            <div className="calorie-num">1240</div>
            <div className="calorie-label">of 2000 kcal</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:20,fontWeight:600,marginBottom:4}}>62% of Daily Goal</div>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:"1.5rem"}}>You're on track! You have 760 kcal remaining for today.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[{l:"Protein",v:"68g",pct:57},{l:"Carbs",v:"145g",pct:58},{l:"Fats",v:"42g",pct:65}].map(n=>(
              <div key={n.l} style={{textAlign:"center",background:"var(--surface)",borderRadius:10,padding:14,border:"1px solid var(--border)"}}>
                <div style={{fontSize:20,fontWeight:600,color:"var(--accent)"}}>{n.v}</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>{n.l}</div>
                <div style={{fontSize:11,color:"var(--text2)"}}>{n.pct}% of goal</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {[
          {label:"Avg Daily Calories",val:"1,680",sub:"This week",color:"var(--accent)"},
          {label:"Protein Goal Met",val:"4/7",sub:"days this week",color:"var(--green)"},
          {label:"Health Score",val:"84",sub:"Above average",color:"var(--blue)"},
          {label:"Budget Efficiency",val:"91%",sub:"Within limits",color:"var(--green)"},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color}}>{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card-panel">
        <div className="panel-title">This Week's Meals</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Meal</th><th>Day</th><th>Calories</th><th>Protein</th><th>Health Score</th><th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {FOODS.slice(0,6).map(f=>(
                <tr key={f.id}>
                  <td><span style={{marginRight:8}}>{f.emoji}</span>{f.name}</td>
                  <td>{DAYS[Math.floor(Math.random()*7)]}</td>
                  <td>{f.cal} kcal</td>
                  <td>{f.protein}g</td>
                  <td><span className={`badge ${f.health>85?"badge-green":f.health>70?"badge-amber":"badge-red"}`}>{f.health}/100</span></td>
                  <td><Stars rating={Math.floor(f.rating)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NutritionPage