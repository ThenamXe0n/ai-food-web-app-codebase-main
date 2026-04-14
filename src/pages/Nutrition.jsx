import { useEffect, useState } from "react";
import Stars from "../components/ui/Stars";
import { getAllFoods } from "../api/apiCollection/foodApi";
import { getTodayLogs, getWeeklySummary } from "../api/apiCollection/mealLogApi";
import { getToken } from "../utils/auth";

function NutritionPage() {
  const [foods, setFoods] = useState([]);
  const [today, setToday] = useState(null); // { cal, protein, carbs, fat, spent, calRemaining, ... }
  const [weekly, setWeekly] = useState(null); // weekly summary
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getAllFoods({ limit: 6, sort: "rating" });
        if (!isMounted) return;
        setFoods(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load foods for nutrition table", err);
      }
    })();

    (async () => {
      if (!getToken()) return;
      try {
        const [t, w] = await Promise.all([getTodayLogs(), getWeeklySummary()]);
        if (!isMounted) return;
        setToday(t?.nutrition || null);
        setWeekly(w || null);
      } catch (err) {
        console.error("Failed to load nutrition summary", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const dailyGoal = 2000;
  const calToday = today?.cal ?? 1240;
  const calRemaining = today?.calRemaining ?? Math.max(0, dailyGoal - calToday);
  const pct = Math.min(1, Math.max(0, calToday / dailyGoal));
  const circumference = 2 * Math.PI * 54;
  const progress = pct * circumference;

  const avgDaily = weekly?.avgDaily || null;
  const weeklyTotal = weekly?.weeklyTotal || null;
  const avgDailyCalories = avgDaily?.cal ?? 1680;
  const avgDailyProtein = avgDaily?.protein ?? 68;
  const avgDailySpent = avgDaily?.spent ?? 0;
  const budgetGoal = 600;
  const budgetEfficiency = Math.min(
    100,
    Math.max(0, Math.round(((budgetGoal - Math.min(budgetGoal, avgDailySpent)) / budgetGoal) * 100))
  );
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
            <div className="calorie-num">{Math.round(calToday)}</div>
            <div className="calorie-label">of {dailyGoal} kcal</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:20,fontWeight:600,marginBottom:4}}>{Math.round(pct * 100)}% of Daily Goal</div>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:"1.5rem"}}>You're on track! You have {Math.max(0, Math.round(calRemaining))} kcal remaining for today.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[
              { l: "Protein", v: `${Math.round(today?.protein ?? 68)}g`, pct: today ? Math.round(((today.protein || 0) / 120) * 100) : 57 },
              { l: "Carbs", v: `${Math.round(today?.carbs ?? 145)}g`, pct: today ? Math.round(((today.carbs || 0) / 250) * 100) : 58 },
              { l: "Fats", v: `${Math.round(today?.fat ?? 42)}g`, pct: today ? Math.round(((today.fat || 0) / 65) * 100) : 65 },
            ].map(n=>(
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
          {label:"Avg Daily Calories",val:Math.round(avgDailyCalories).toLocaleString(),sub:"This week",color:"var(--accent)"},
          {label:"Avg Daily Protein",val:`${Math.round(avgDailyProtein)}g`,sub:"This week",color:"var(--green)"},
          {label:"Total Meals Logged",val:String(weekly?.totalMeals ?? 0),sub:"This week",color:"var(--blue)"},
          {label:"Budget Efficiency",val:`${budgetEfficiency}%`,sub:"Avg day vs ₹600",color:"var(--green)"},
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
              {foods.slice(0,6).map(f=>(
                <tr key={f._id || f.id}>
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
        {weeklyTotal && (
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text3)" }}>
            Weekly totals: {Math.round(weeklyTotal.cal)} kcal • {Math.round(weeklyTotal.protein)}g protein • ₹{Math.round(weeklyTotal.spent)}
          </div>
        )}
      </div>
    </div>
  );
}

export default NutritionPage