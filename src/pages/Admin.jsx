import { useEffect, useState } from "react";
import { createFood, getAllFoods } from "../api/apiCollection/foodApi";
import { getToken } from "../utils/auth";

function AdminPage() {
  const [section, setSection] = useState("dashboard");
  const [foods, setFoods] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [foodImageFile, setFoodImageFile] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: "",
    emoji: "🍽️",
    desc: "",
    imageUrl: "",
    cal: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "veg",
    cuisine: "",
    price: "",
    health: "",
    tags: "",
    ingredients: "",
    steps: "",
  });

  const loadFoods = async () => {
    try {
      const res = await getAllFoods({ limit: 50, sort: "rating" });
      setFoods(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load foods for admin table", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getAllFoods({ limit: 50, sort: "rating" });
        if (!isMounted) return;
        setFoods(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load foods for admin table", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (key) => (e) => {
    const value = e?.target?.value;
    setFoodForm((p) => ({ ...p, [key]: value }));
  };

  const onCreateFood = async (e) => {
    e.preventDefault();
    if (!getToken()) return;

    try {
      setIsCreating(true);

      const toNum = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));
      const tags = foodForm.tags
        ? foodForm.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const ingredients = foodForm.ingredients
        ? foodForm.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const steps = foodForm.steps
        ? foodForm.steps.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: foodForm.name.trim(),
        emoji: foodForm.emoji || "🍽️",
        desc: foodForm.desc.trim(),
        imageUrl: foodForm.imageUrl?.trim() || undefined,
        cal: toNum(foodForm.cal),
        protein: toNum(foodForm.protein) ?? 0,
        carbs: toNum(foodForm.carbs) ?? 0,
        fat: toNum(foodForm.fat) ?? 0,
        type: foodForm.type,
        cuisine: foodForm.cuisine.trim(),
        price: toNum(foodForm.price),
        health: toNum(foodForm.health),
        tags,
        ingredients,
        steps,
      };

      if (foodImageFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (Array.isArray(v)) {
            fd.append(k, JSON.stringify(v));
            return;
          }
          fd.append(k, String(v));
        });
        fd.append("image", foodImageFile);
        await createFood(fd);
      } else {
        await createFood(payload);
      }
      setShowAddFood(false);
      setFoodImageFile(null);
      setFoodForm({
        name: "",
        emoji: "🍽️",
        desc: "",
        imageUrl: "",
        cal: "",
        protein: "",
        carbs: "",
        fat: "",
        type: "veg",
        cuisine: "",
        price: "",
        health: "",
        tags: "",
        ingredients: "",
        steps: "",
      });
      await loadFoods();
    } catch (err) {
      console.error("Failed to create food", err);
    } finally {
      setIsCreating(false);
    }
  };
  const adminNav = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "foods", label: "🍽️ Food Database" },
    { id: "users", label: "👥 Users" },
    { id: "ai", label: "🤖 AI Model" },
  ];
  return (
    <div className="admin-grid">
      <div className="admin-sidebar">
        <div
          style={{
            padding: "0 20px 16px",
            fontSize: 12,
            color: "var(--text3)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Admin Panel
        </div>
        {adminNav.map((n) => (
          <button
            key={n.id}
            className={`admin-nav-item${section === n.id ? " active" : ""}`}
            onClick={() => setSection(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>
      <div className="admin-content">
        {section === "dashboard" && (
          <>
            <h2
              className="section-title"
              style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}
            >
              Admin Overview
            </h2>
            <p className="section-sub">Platform metrics and AI model health</p>
            <div className="dash-grid" style={{ marginBottom: "2rem" }}>
              {[
                {
                  label: "Total Users",
                  val: "12,847",
                  sub: "+142 today",
                  color: "var(--accent)",
                },
                {
                  label: "Meals in DB",
                  val: "3,420",
                  sub: "48 added this week",
                  color: "var(--green)",
                },
                {
                  label: "AI Accuracy",
                  val: "94.2%",
                  sub: "Collaborative filter",
                  color: "var(--blue)",
                },
                {
                  label: "Daily Active",
                  val: "2,103",
                  sub: "+8% vs last week",
                  color: "var(--green)",
                },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.color }}>
                    {s.val}
                  </div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {section === "foods" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h2
                  className="section-title"
                  style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}
                >
                  Food Database
                </h2>
                <p className="section-sub" style={{ marginBottom: 0 }}>
                  Manage all food items
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() => setShowAddFood((v) => !v)}
              >
                + Add Food
              </button>
            </div>

            {showAddFood && (
              <div
                className="card-panel"
                style={{ marginBottom: "1.5rem" }}
              >
                <div className="panel-title">Add Food</div>
                <form onSubmit={onCreateFood}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        className="form-input"
                        value={foodForm.name}
                        onChange={updateField("name")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Emoji</label>
                      <input
                        className="form-input"
                        value={foodForm.emoji}
                        onChange={updateField("emoji")}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Description</label>
                      <input
                        className="form-input"
                        value={foodForm.desc}
                        onChange={updateField("desc")}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Image URL (optional)</label>
                      <input
                        className="form-input"
                        value={foodForm.imageUrl}
                        onChange={updateField("imageUrl")}
                        placeholder="http://... or /uploads/..."
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Upload Image (optional)</label>
                      <input
                        className="form-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFoodImageFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cuisine</label>
                      <input
                        className="form-input"
                        value={foodForm.cuisine}
                        onChange={updateField("cuisine")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select
                        className="filter-select"
                        value={foodForm.type}
                        onChange={updateField("type")}
                      >
                        <option value="veg">veg</option>
                        <option value="vegan">vegan</option>
                        <option value="non-veg">non-veg</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Calories</label>
                      <input
                        className="form-input"
                        inputMode="numeric"
                        value={foodForm.cal}
                        onChange={updateField("cal")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price (₹)</label>
                      <input
                        className="form-input"
                        inputMode="numeric"
                        value={foodForm.price}
                        onChange={updateField("price")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Protein (g)</label>
                      <input
                        className="form-input"
                        inputMode="numeric"
                        value={foodForm.protein}
                        onChange={updateField("protein")}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Carbs (g)</label>
                      <input
                        className="form-input"
                        inputMode="numeric"
                        value={foodForm.carbs}
                        onChange={updateField("carbs")}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fat (g)</label>
                      <input
                        className="form-input"
                        inputMode="numeric"
                        value={foodForm.fat}
                        onChange={updateField("fat")}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Health (0-100)</label>
                      <input
                        className="form-input"
                        inputMode="numeric"
                        value={foodForm.health}
                        onChange={updateField("health")}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Tags (comma separated)</label>
                      <input
                        className="form-input"
                        value={foodForm.tags}
                        onChange={updateField("tags")}
                        placeholder="Budget, Quick"
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Ingredients (comma separated)</label>
                      <input
                        className="form-input"
                        value={foodForm.ingredients}
                        onChange={updateField("ingredients")}
                        placeholder="rice, eggs, onion"
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">Steps (one per line)</label>
                      <textarea
                        className="form-input"
                        value={foodForm.steps}
                        onChange={updateField("steps")}
                        rows={4}
                        style={{ resize: "vertical" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button
                      className="btn-primary"
                      type="submit"
                      disabled={isCreating}
                    >
                      {isCreating ? "Saving..." : "Save Food"}
                    </button>
                    <button
                      className="btn-view"
                      type="button"
                      onClick={() => setShowAddFood(false)}
                      style={{ padding: "10px 18px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Cuisine</th>
                    <th>Type</th>
                    <th>Calories</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((f) => (
                    <tr key={f._id || f.id}>
                      <td>
                        <span style={{ marginRight: 8 }}>{f.emoji}</span>
                        {f.name}
                      </td>
                      <td>{f.cuisine}</td>
                      <td>
                        <span
                          className={`badge ${f.type === "veg" ? "badge-green" : f.type === "vegan" ? "badge-amber" : "badge-red"}`}
                        >
                          {f.type}
                        </span>
                      </td>
                      <td>{f.cal}</td>
                      <td>₹{f.price}</td>
                      <td>
                        <span className="badge badge-green">Active</span>
                      </td>
                      <td>
                        <button
                          className="btn-view"
                          style={{ fontSize: 11, padding: "4px 10px" }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {section === "users" && (
          <>
            <h2
              className="section-title"
              style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}
            >
              User Management
            </h2>
            <p className="section-sub">Monitor and manage user accounts</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Diet</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Arjun Sharma",
                    "Priya Patel",
                    "Rohan Gupta",
                    "Sneha Kumar",
                    "Amit Verma",
                  ].map((name, i) => (
                    <tr key={i}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#000",
                            }}
                          >
                            {name[0]}
                          </div>
                          {name}
                        </div>
                      </td>
                      <td style={{ color: "var(--text3)" }}>
                        {name.toLowerCase().replace(" ", ".")}@email.com
                      </td>
                      <td>{["Veg", "Non-veg", "Vegan", "Veg", "Keto"][i]}</td>
                      <td>
                        {
                          [
                            "Jan 2026",
                            "Feb 2026",
                            "Mar 2026",
                            "Apr 2026",
                            "Apr 2026",
                          ][i]
                        }
                      </td>
                      <td>
                        <span
                          className={`badge ${i < 4 ? "badge-green" : "badge-amber"}`}
                        >
                          {i < 4 ? "Active" : "New"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {section === "ai" && (
          <>
            <h2
              className="section-title"
              style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}
            >
              AI Model Settings
            </h2>
            <p className="section-sub">
              Configure and monitor recommendation engine
            </p>
            <div className="dash-grid" style={{ marginBottom: "2rem" }}>
              {[
                {
                  label: "Collaborative Filter",
                  val: "94.2%",
                  sub: "Accuracy score",
                },
                {
                  label: "Content-Based",
                  val: "91.8%",
                  sub: "Precision score",
                },
                { label: "NLP Model", val: "v2.4", sub: "GPT fine-tuned" },
                {
                  label: "Last Trained",
                  val: "3d ago",
                  sub: "Auto-retrain weekly",
                },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value stat-accent">{s.val}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card-panel">
              <div className="panel-title">Model Configuration</div>
              {[
                ["Recommendation Algorithm", "Hybrid (CF + CBF)"],
                ["Min Confidence Score", "0.72"],
                ["Max Daily Suggestions", "12"],
                ["Personalization Weight", "0.85"],
              ].map(([l, v]) => (
                <div key={l} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" defaultValue={v} />
                </div>
              ))}
              <button className="btn-primary">Update Model Config</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default AdminPage;
