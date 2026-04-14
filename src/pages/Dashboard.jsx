import { FOODS } from "../data/sampleData";

function DashboardPage({ onNavigate, onViewFood, liked, onLike }) {
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
          <div className="stat-value stat-accent">1,240</div>
          <div className="stat-sub">of 2,000 kcal goal</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: "62%" }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Protein</div>
          <div className="stat-value stat-green">68g</div>
          <div className="stat-sub">of 120g goal</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill green" style={{ width: "57%" }} />
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
          <div className="stat-value">₹380</div>
          <div className="stat-sub">of ₹600 daily limit</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div
              className="progress-fill"
              style={{ width: "63%", background: "var(--green)" }}
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
            {FOODS.filter((f) => f.type === "veg" || f.type === "vegan")
              .slice(0, 4)
              .map((f) => (
                <FoodCard
                  key={f.id}
                  food={f}
                  onView={onViewFood}
                  liked={liked.includes(f.id)}
                  onLike={onLike}
                />
              ))}
          </div>
        </div>
        <div>
          <div className="card-panel">
            <div className="panel-title">Today's Nutrition</div>
            {[
              { label: "Calories", val: "1,240 / 2,000", pct: 62, color: "" },
              {
                label: "Carbohydrates",
                val: "145 / 250g",
                pct: 58,
                color: "blue",
              },
              { label: "Protein", val: "68 / 120g", pct: 57, color: "green" },
              { label: "Fats", val: "42 / 65g", pct: 65, color: "" },
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
