import { useState } from "react";
import { FOODS } from "../data/sampleData";
import FoodCard from "../components/cards/FoodCard";

function RecommendationsPage({ onViewFood, liked, onLike }) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("rating");
  const [ingredients, setIngredients] = useState("");

  const filtered = FOODS
    .filter(f => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchCuisine = cuisine === "All" || f.cuisine === cuisine;
      const matchType = type === "All" || f.type === type;
      return matchSearch && matchCuisine && matchType;
    })
    .sort((a,b) => sort === "rating" ? b.rating-a.rating : sort === "cal" ? a.cal-b.cal : a.price-b.price);

  return (
    <div className="page">
      <h1 className="section-title">AI Recommendations</h1>
      <p className="section-sub">Personalized meals matched to your profile</p>

      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"20px",marginBottom:"2rem"}}>
        <div style={{fontSize:13,color:"var(--text2)",marginBottom:8}}>🥚 Enter available ingredients for smart suggestions</div>
        <div style={{display:"flex",gap:8}}>
          <input className="search-input" placeholder="e.g. rice, eggs, onion, tomato..." value={ingredients} onChange={e=>setIngredients(e.target.value)} style={{flex:1}}/>
          <button className="btn-primary">Find Recipes</button>
        </div>
      </div>

      <div className="filter-row">
        <input className="search-input" placeholder="🔍 Search meals..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:280}}/>
        <select className="filter-select" value={cuisine} onChange={e=>setCuisine(e.target.value)}>
          <option>All</option><option>Indian</option><option>Continental</option><option>Brazilian</option>
        </select>
        <select className="filter-select" value={type} onChange={e=>setType(e.target.value)}>
          <option>All</option><option value="veg">Veg</option><option value="vegan">Vegan</option><option value="non-veg">Non-veg</option>
        </select>
        <select className="filter-select" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="rating">Top Rated</option><option value="cal">Low Calories</option><option value="price">Budget</option>
        </select>
        <span style={{fontSize:13,color:"var(--text3)",marginLeft:"auto"}}>{filtered.length} results</span>
      </div>

      <div className="cards-grid">
        {filtered.map(f=>(
          <FoodCard key={f.id} food={f} onView={onViewFood} liked={liked.includes(f.id)} onLike={onLike}/>
        ))}
      </div>
    </div>
  );
}
export default RecommendationsPage