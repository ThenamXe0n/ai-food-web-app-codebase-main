import { useEffect, useMemo, useState } from "react";
import { autoGeneratePlan, getCurrentPlan, updateSlot } from "../api/apiCollection/mealPlanApi";
import { getAllFoods } from "../api/apiCollection/foodApi";
import { getToken } from "../utils/auth";

function PlannerPage() {
  const today = "Thu";
  const DAYS = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);
  const [plan, setPlan] = useState(null);
  const [foods, setFoods] = useState([]);
  const [editing, setEditing] = useState(null); // { day, mealType }
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [savingSlot, setSavingSlot] = useState(false);

  const mealsByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((d) => (map[d] = []));
    const meals = plan?.meals || [];
    meals.forEach((m) => {
      if (!m?.day) return;
      if (!map[m.day]) map[m.day] = [];
      map[m.day].push(m);
    });
    return map;
  }, [plan, DAYS]);

  const loadCurrentPlan = async () => {
    if (!getToken()) return;
    try {
      const res = await getCurrentPlan();
      setPlan(res?.data || null);
    } catch (err) {
      // 404 is expected when user has no plan yet
      if (err?.response?.status !== 404) {
        console.error("Failed to load current plan", err);
      }
    }
  };

  useEffect(() => {
    loadCurrentPlan();
    (async () => {
      try {
        const res = await getAllFoods({ limit: 50, sort: "rating" });
        setFoods(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load foods", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAutoGenerate = async () => {
    if (!getToken()) return;
    try {
      const res = await autoGeneratePlan();
      setPlan(res?.data || null);
    } catch (err) {
      console.error("Failed to auto-generate plan", err);
    }
  };

  const openEditor = (day, mealType, filled) => {
    if (!getToken()) return;
    setEditing({ day, mealType });
    const id = filled?.food?._id || filled?.food?.id || "";
    setSelectedFoodId(id);
  };

  const onSaveSlot = async () => {
    if (!getToken()) return;
    if (!editing?.day || !editing?.mealType) return;
    if (!selectedFoodId) return;

    try {
      setSavingSlot(true);
      let planId = plan?._id;
      if (!planId) {
        const created = await autoGeneratePlan();
        const newPlan = created?.data || null;
        setPlan(newPlan);
        planId = newPlan?._id;
      }
      if (!planId) return;

      const res = await updateSlot(planId, {
        day: editing.day,
        mealType: editing.mealType,
        foodId: selectedFoodId,
        portionMultiplier: 1,
      });
      setPlan(res?.data || null);
      setEditing(null);
    } catch (err) {
      console.error("Failed to update slot", err);
    } finally {
      setSavingSlot(false);
    }
  };
  return (
    <div className="page">
      <h1 className="section-title">Weekly Meal Planner</h1>
      <p className="section-sub">Drag and drop meals to plan your week • April 7–13, 2026</p>

      <div style={{display:"flex",gap:12,marginBottom:"2rem"}}>
        <button className="btn-primary" onClick={onAutoGenerate}>✨ Auto-Generate Plan</button>
        <button className="btn-view" style={{padding:"10px 18px"}}>📤 Export Plan</button>
        <button className="btn-view" style={{padding:"10px 18px"}}>🛒 Shopping List</button>
      </div>

      {editing && (
        <div className="card-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="panel-title">
            Set {editing.mealType} for {editing.day}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <select
              className="filter-select"
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
            >
              <option value="">Select a food...</option>
              {foods.map((f) => (
                <option key={f._id || f.id} value={f._id || f.id}>
                  {f.emoji} {f.name}
                </option>
              ))}
            </select>
            <button className="btn-primary" onClick={onSaveSlot} disabled={savingSlot || !selectedFoodId}>
              {savingSlot ? "Saving..." : "Save"}
            </button>
            <button className="btn-view" onClick={() => setEditing(null)} style={{ padding: "10px 18px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="planner-grid">
        {DAYS.map(day=>(
          <div key={day} className={`day-col${day===today?" day-today":""}`}>
            <div className="day-header">{day}{day===today?" •":""}</div>
            {["Breakfast","Lunch","Dinner"].map(meal=>{
              const filled = (mealsByDay[day] || []).find((m) => m.mealType === meal);
              return (
                <div
                  key={meal}
                  className={`meal-slot${filled?" filled":""}`}
                  onClick={() => openEditor(day, meal, filled)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openEditor(day, meal, filled)}
                >
                  {filled ? (
                    <>
                      <div style={{fontSize:11,color:"var(--text3)",marginBottom:4}}>{meal}</div>
                      <div className="meal-slot-emoji">{filled.food?.emoji}</div>
                      <div className="meal-slot-name">{filled.food?.name}</div>
                      <div className="meal-slot-cal">{filled.food?.cal} kcal</div>
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