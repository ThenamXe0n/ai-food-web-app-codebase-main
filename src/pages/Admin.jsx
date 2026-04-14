function AdminPage() {
  const [section, setSection] = useState("dashboard");
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
              <button className="btn-primary">+ Add Food</button>
            </div>
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
                  {FOODS.map((f) => (
                    <tr key={f.id}>
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
