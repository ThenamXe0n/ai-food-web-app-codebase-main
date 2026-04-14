import { DAYS, PLANNER_DATA } from "../data/sampleData";

function PlannerPage() {
  const today = "Thu";
  return (
    <div className="page">
      <h1 className="section-title">Weekly Meal Planner</h1>
      <p className="section-sub">Drag and drop meals to plan your week • April 7–13, 2026</p>

      <div style={{display:"flex",gap:12,marginBottom:"2rem"}}>
        <button className="btn-primary">✨ Auto-Generate Plan</button>
        <button className="btn-view" style={{padding:"10px 18px"}}>📤 Export Plan</button>
        <button className="btn-view" style={{padding:"10px 18px"}}>🛒 Shopping List</button>
      </div>

      <div className="planner-grid">
        {DAYS.map(day=>(
          <div key={day} className={`day-col${day===today?" day-today":""}`}>
            <div className="day-header">{day}{day===today?" •":""}</div>
            {["Breakfast","Lunch","Dinner"].map(meal=>{
              const filled = (PLANNER_DATA[day]||[]).find(m=>m.meal===meal);
              return (
                <div key={meal} className={`meal-slot${filled?" filled":""}`}>
                  {filled ? (
                    <>
                      <div style={{fontSize:11,color:"var(--text3)",marginBottom:4}}>{meal}</div>
                      <div className="meal-slot-emoji">{filled.emoji}</div>
                      <div className="meal-slot-name">{filled.name}</div>
                      <div className="meal-slot-cal">{filled.cal} kcal</div>
                    </>
                  ) : (
                    <>
                      <div style={{fontSize:18,opacity:0.4}}>+</div>
                      <div style={{fontSize:10}}>{meal}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlannerPage