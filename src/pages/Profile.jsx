import { useState } from "react";

function ProfilePage() {
  const [diet, setDiet] = useState(["Vegetarian"]);
  const diets = ["Vegetarian","Vegan","Keto","Paleo","Mediterranean","Gluten-Free","Dairy-Free","Low-Carb"];
  return (
    <div className="page">
      <h1 className="section-title">Your Profile</h1>
      <p className="section-sub">Manage your preferences and health goals</p>
      <div className="profile-grid">
        <div>
          <div className="profile-card">
            <div className="profile-avatar">AS</div>
            <div className="profile-name">Arjun Sharma</div>
            <div className="profile-email">arjun@example.com</div>
            <button className="btn-view" style={{width:"100%",padding:"10px"}}>Edit Photo</button>
            <div className="profile-stat-row">
              <div className="p-stat"><div className="p-stat-val">42</div><div className="p-stat-lab">Meals Logged</div></div>
              <div className="p-stat"><div className="p-stat-val">7</div><div className="p-stat-lab">Week Streak</div></div>
              <div className="p-stat"><div className="p-stat-val">84</div><div className="p-stat-lab">Health Score</div></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card-panel" style={{marginBottom:"1.5rem"}}>
            <div className="panel-title">Personal Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[["Full Name","Arjun Sharma"],["Age","28"],["Weight","72 kg"],["Height","175 cm"],["Gender","Male"],["Activity Level","Moderately Active"]].map(([l,v])=>(
                <div key={l} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" defaultValue={v}/>
                </div>
              ))}
            </div>
          </div>
          <div className="card-panel" style={{marginBottom:"1.5rem"}}>
            <div className="panel-title">Diet Preferences</div>
            <div className="diet-chips">
              {diets.map(d=>(
                <button key={d} className={`diet-chip${diet.includes(d)?" active":""}`}
                  onClick={()=>setDiet(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="card-panel">
            <div className="panel-title">Health Goals</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[["Daily Calories","2000 kcal"],["Protein Goal","120 g"],["Daily Budget","₹600"],["Allergies","None"]].map(([l,v])=>(
                <div key={l} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" defaultValue={v}/>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:8}}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage