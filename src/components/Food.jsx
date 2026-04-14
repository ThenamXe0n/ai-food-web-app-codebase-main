import { useState } from "react";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import RecommendationsPage from "../pages/Recommendations";
import MealDetailPage from "../pages/MealDetails";
import PlannerPage from "../pages/Planner";
import NutritionPage from "../pages/Nutrition";
import ProfilePage from "../pages/Profile";
import AdminPage from "../pages/Admin";
import Chatbot from "./ChatBot";
// ─── APP ─────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedFood, setSelectedFood] = useState(null);
  const [liked, setLiked] = useState([]);

  const navigate = (p) => { setPage(p); setSelectedFood(null); window.scrollTo(0,0); };
  const viewFood = (f) => { setSelectedFood(f); setPage("detail"); window.scrollTo(0,0); };
  const toggleLike = (id) => setLiked(l => l.includes(id) ? l.filter(x=>x!==id) : [...l,id]);

  const navItems = [
    {id:"home",label:"Home"},
    {id:"recommendations",label:"Recommendations"},
    {id:"planner",label:"Meal Planner"},
    {id:"nutrition",label:"Nutrition"},
    {id:"profile",label:"Profile"},
    {id:"admin",label:"Admin"},
  ];

  return (
    <>
      <nav className="nav">
        <div className="nav-logo" onClick={()=>navigate("home")}>
          <span>🍽️</span> NutriAI
        </div>
        <div className="nav-links">
          {navItems.map(n=>(
            <button key={n.id} className={`nav-link${page===n.id||( page==="detail"&&n.id==="recommendations")?" active":""}`} onClick={()=>navigate(n.id)}>
              {n.label}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <button className="btn-view" style={{padding:"6px 14px",fontSize:13}} onClick={()=>navigate("login")}>Sign In</button>
          <div className="nav-avatar" onClick={()=>navigate("profile")}>AS</div>
        </div>
      </nav>

      <main className="main">
        {page === "home" && <HomePage onNavigate={navigate} onViewFood={viewFood} liked={liked} onLike={toggleLike}/>}
        {page === "login" && <LoginPage onNavigate={navigate}/>}
        {page === "dashboard" && <DashboardPage onNavigate={navigate} onViewFood={viewFood} liked={liked} onLike={toggleLike}/>}
        {page === "recommendations" && <RecommendationsPage onViewFood={viewFood} liked={liked} onLike={toggleLike}/>}
        {page === "detail" && <MealDetailPage food={selectedFood} onBack={()=>navigate("recommendations")} onAddToPlan={()=>navigate("planner")}/>}
        {page === "planner" && <PlannerPage/>}
        {page === "nutrition" && <NutritionPage/>}
        {page === "profile" && <ProfilePage/>}
        {page === "admin" && <AdminPage/>}
      </main>

      <Chatbot/>
    </>
  );
}
