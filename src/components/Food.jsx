import { useEffect, useState } from "react";
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
import { getLikes, toggleLike } from "../api/apiCollection/userApi";
import { getToken, removeToken } from "../utils/auth";
// ─── APP ─────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [liked, setLiked] = useState([]);
  const [isAuthed, setIsAuthed] = useState(!!getToken());

  const loadLikes = async () => {
    if (!getToken()) return;
    try {
      const res = await getLikes();
      const ids = Array.isArray(res?.data) ? res.data.map((f) => f?._id).filter(Boolean) : [];
      setLiked(ids);
    } catch (err) {
      console.error("Failed to load likes", err);
    }
  };

  useEffect(() => {
    loadLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (p) => {
    // Refresh auth-dependent state after login/register navigation
    loadLikes();
    setIsAuthed(!!getToken());
    setPage(p);
    setSelectedFood(null);
    setSelectedFoodId(null);
    window.scrollTo(0, 0);
  };
  const viewFood = (f) => {
    const id = f?._id || f?.id;
    setSelectedFood(f);
    setSelectedFoodId(id || null);
    setPage("detail");
    window.scrollTo(0,0);
  };
  const onToggleLike = async (id) => {
    if (!id) return;
    if (!getToken()) return;
    try {
      const res = await toggleLike(id);
      const likedFoods = Array.isArray(res?.likedFoods) ? res.likedFoods : [];
      setLiked(likedFoods);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const onLogout = () => {
    removeToken();
    setLiked([]);
    setIsAuthed(false);
    navigate("home");
  };

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
          {isAuthed ? (
            <button
              className="btn-view"
              style={{ padding: "6px 14px", fontSize: 13 }}
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button className="btn-view" style={{padding:"6px 14px",fontSize:13}} onClick={()=>navigate("login")}>Sign In</button>
          )}
          <div className="nav-avatar" onClick={()=>navigate("profile")}>AS</div>
        </div>
      </nav>

      <main className="main">
        {page === "home" && <HomePage onNavigate={navigate} onViewFood={viewFood} liked={liked} onLike={onToggleLike}/>}
        {page === "login" && <LoginPage onNavigate={navigate}/>}
        {page === "dashboard" && <DashboardPage onNavigate={navigate} onViewFood={viewFood} liked={liked} onLike={onToggleLike}/>}
        {page === "recommendations" && <RecommendationsPage onViewFood={viewFood} liked={liked} onLike={onToggleLike}/>}
        {page === "detail" && <MealDetailPage food={selectedFood} foodId={selectedFoodId} onBack={()=>navigate("recommendations")} onAddToPlan={()=>navigate("planner")}/>}
        {page === "planner" && <PlannerPage/>}
        {page === "nutrition" && <NutritionPage/>}
        {page === "profile" && <ProfilePage/>}
        {page === "admin" && <AdminPage/>}
      </main>

      <Chatbot/>
    </>
  );
}
