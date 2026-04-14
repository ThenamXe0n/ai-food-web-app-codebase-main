import { useEffect, useState } from "react";
import FoodCard from "../components/cards/FoodCard";
import { getTrendingFoods } from "../api/apiCollection/foodApi";
import { getTodayLogs } from "../api/apiCollection/mealLogApi";
import { getToken } from "../utils/auth";

function DashboardPage({ onNavigate, onViewFood, liked, onLike }) {
  const [nutrition, setNutrition] = useState(null);
  const [recommendedFoods, setRecommendedFoods] = useState([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await getTrendingFoods();
        if (!isMounted) return;
        setRecommendedFoods(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load recommended foods", err);
      }
    })();

    (async () => {
      if (!getToken()) return;
      try {
        const res = await getTodayLogs();
        if (!isMounted) return;
        setNutrition(res?.nutrition || null);
      } catch (err) {
        console.error("Failed to load today's logs", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const calGoal = 2000;
  const proteinGoal = 120;
  const budgetGoal = 600;

  const calToday = nutrition?.cal ?? 1240;
  const proteinToday = nutrition?.protein ?? 68;
  const spentToday = nutrition?.spent ?? 380;

  const calPct = Math.min(100, Math.max(0, Math.round((calToday / calGoal) * 100)));
  const proteinPct = Math.min(
    100,
    Math.max(0, Math.round((proteinToday / proteinGoal) * 100))
  );
  const budgetPct = Math.min(100, Math.max(0, Math.round((spentToday / budgetGoal) * 100)));

  return (
    <div className="page">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="section-title">Good afternoon, Arjun 👋</h1>
        <p className="section-sub">
          Here's your nutrition snapshot for today — Thursday, April 11
        </p>
      </div>

      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-label">Calories Today</div>
          <div className="stat-value stat-accent">{Math.round(calToday).toLocaleString()}</div>
          <div className="stat-sub">of {calGoal.toLocaleString()} kcal goal</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${calPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Protein</div>
          <div className="stat-value stat-green">{Math.round(proteinToday)}g</div>
          <div className="stat-sub">of {proteinGoal}g goal</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill green" style={{ width: `${proteinPct}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Water Intake</div>
          <div className="stat-value" style={{ color: "var(--blue)" }}>
            1.8L
          </div>
          <div className="stat-sub">of 2.5L goal</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill blue" style={{ width: "72%" }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Budget Spent</div>
          <div className="stat-value">₹{Math.round(spentToday)}</div>
          <div className="stat-sub">of ₹{budgetGoal} daily limit</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div
              className="progress-fill"
              style={{ width: `${budgetPct}%`, background: "var(--green)" }}
            />
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button
          className="quick-btn"
          onClick={() => onNavigate("recommendations")}
        >
          <div className="quick-btn-icon">🤔</div>
          <div className="quick-btn-title">What should I eat today?</div>
          <div className="quick-btn-sub">AI suggests based on your goals</div>
        </button>
        <button
          className="quick-btn"
          onClick={() => onNavigate("recommendations")}
        >
          <div className="quick-btn-icon">🥚</div>
          <div className="quick-btn-title">Use my ingredients</div>
          <div className="quick-btn-sub">Enter what you have at home</div>
        </button>
        <button className="quick-btn" onClick={() => onNavigate("planner")}>
          <div className="quick-btn-icon">📅</div>
          <div className="quick-btn-title">Plan this week</div>
          <div className="quick-btn-sub">Auto-generate your meal plan</div>
        </button>
        <button className="quick-btn" onClick={() => onNavigate("nutrition")}>
          <div className="quick-btn-icon">📊</div>
          <div className="quick-btn-title">View nutrition report</div>
          <div className="quick-btn-sub">Detailed weekly analysis</div>
        </button>
      </div>

      <div className="dash-two-col">
        <div>
          <h2
            className="section-title"
            style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}
          >
            Recommended for You
          </h2>
          <p className="section-sub">
            Based on your veg preferences and calorie goal
          </p>
          <div
            className="cards-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            }}
          >
            {recommendedFoods.slice(0, 4).map((f) => (
              <FoodCard
                key={f._id || f.id}
                food={f}
                onView={onViewFood}
                liked={liked.includes(f._id || f.id)}
                onLike={onLike}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="card-panel">
            <div className="panel-title">Today's Nutrition</div>
            {[
              {
                label: "Calories",
                val: `${Math.round(calToday)} / ${calGoal}`,
                pct: calPct,
                color: "",
              },
              {
                label: "Carbohydrates",
                val: nutrition ? `${Math.round(nutrition.carbs)} / 250g` : "145 / 250g",
                pct: nutrition ? Math.min(100, Math.round((nutrition.carbs / 250) * 100)) : 58,
                color: "blue",
              },
              {
                label: "Protein",
                val: `${Math.round(proteinToday)} / ${proteinGoal}g`,
                pct: proteinPct,
                color: "green",
              },
              {
                label: "Fats",
                val: nutrition ? `${Math.round(nutrition.fat)} / 65g` : "42 / 65g",
                pct: nutrition ? Math.min(100, Math.round((nutrition.fat / 65) * 100)) : 65,
                color: "",
              },
              { label: "Fiber", val: "18 / 30g", pct: 60, color: "green" },
            ].map((n) => (
              <div key={n.label} className="nutrient-row">
                <div className="nutrient-label">{n.label}</div>
                <div className="nutrient-bar">
                  <div className="progress-bar">
                    <div
                      className={`progress-fill${n.color ? " " + n.color : ""}`}
                      style={{ width: `${n.pct}%` }}
                    />
                  </div>
                </div>
                <div className="nutrient-val">{n.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
