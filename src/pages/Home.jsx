import { useEffect, useState } from "react";
import { getTrendingFoods } from "../api/apiCollection/foodApi";
import FoodCard from "../components/cards/FoodCard";

function HomePage({ onNavigate, onViewFood, liked, onLike }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getTrendingFoods();
        if (!isMounted) return;
        setFoods(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load trending foods", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  const filters = ["All","Veg","Vegan","Non-veg","Low-Cal","Budget"];
  const filtered = foods.filter(f => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Veg") return f.type === "veg";
    if (activeFilter === "Vegan") return f.type === "vegan";
    if (activeFilter === "Non-veg") return f.type === "non-veg";
    if (activeFilter === "Low-Cal") return f.cal < 350;
    if (activeFilter === "Budget") return f.price < 160;
    return true;
  });

  return (
    <>
      <div className="hero">
        <div className="hero-tag">✨ AI-Powered Meal Recommendations</div>
        <h1>Find Your<br/><em>Perfect Meal</em></h1>
        <p>Personalized food suggestions based on your health goals, budget, and available ingredients.</p>
        <div className="hero-search">
          <input placeholder="Search for any dish, cuisine, or ingredient..." />
          <button className="btn-primary" onClick={()=>onNavigate("recommendations")}>Search</button>
        </div>
        <div className="hero-filters">
          {filters.map(f=>(
            <button key={f} className={`filter-chip${activeFilter===f?" active":""}`} onClick={()=>setActiveFilter(f)}>
              {f==="Veg"?"🟢":f==="Vegan"?"🌿":f==="Non-veg"?"🔴":f==="Low-Cal"?"🔥":f==="Budget"?"💰":"✨"} {f}
            </button>
          ))}
        </div>
      </div>

      <div className="page">
        <h2 className="section-title">Trending Today</h2>
        <p className="section-sub">Handpicked by our AI based on what's popular right now</p>
        <div className="cards-grid">
          {filtered.slice(0,8).map(f=>(
            <FoodCard key={f._id || f.id} food={f} onView={onViewFood} liked={liked.includes(f._id || f.id)} onLike={onLike}/>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage