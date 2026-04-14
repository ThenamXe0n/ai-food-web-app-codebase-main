import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getProfile } from "../api/apiCollection/authApi";
import { updateProfile } from "../api/apiCollection/userApi";
import { getToken } from "../utils/auth";

function ProfilePage() {
  const diets = ["Vegetarian","Vegan","Keto","Paleo","Mediterranean","Gluten-Free","Dairy-Free","Low-Carb"];
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
      activityLevel: "",
      dietPreferences: [],
      goals: {
        dailyCalories: "",
        proteinGoal: "",
        dailyBudget: "",
      },
      allergies: "",
      mealsLogged: 0,
      weekStreak: 0,
    },
  });

  const diet = watch("dietPreferences") || [];

  useEffect(() => {
    let isMounted = true;
    if (!getToken()) return;
    (async () => {
      try {
        const res = await getProfile();
        if (!isMounted) return;
        const user = res?.data || {};
        reset({
          name: user.name || "",
          email: user.email || "",
          age: user.age ?? "",
          weight: user.weight ?? "",
          height: user.height ?? "",
          gender: user.gender || "",
          activityLevel: user.activityLevel || "",
          dietPreferences: Array.isArray(user.dietPreferences) ? user.dietPreferences : [],
          goals: {
            dailyCalories: user.goals?.dailyCalories ?? "",
            proteinGoal: user.goals?.proteinGoal ?? "",
            dailyBudget: user.goals?.dailyBudget ?? "",
          },
          allergies: user.allergies || "",
          mealsLogged: user.mealsLogged || 0,
          weekStreak: user.weekStreak || 0,
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async (values) => {
    if (!getToken()) return;
    try {
      const goals = {};
      const dailyCalories =
        values.goals?.dailyCalories === "" ? undefined : Number(values.goals?.dailyCalories);
      const proteinGoal =
        values.goals?.proteinGoal === "" ? undefined : Number(values.goals?.proteinGoal);
      const dailyBudget =
        values.goals?.dailyBudget === "" ? undefined : Number(values.goals?.dailyBudget);

      if (Number.isFinite(dailyCalories)) goals.dailyCalories = dailyCalories;
      if (Number.isFinite(proteinGoal)) goals.proteinGoal = proteinGoal;
      if (Number.isFinite(dailyBudget)) goals.dailyBudget = dailyBudget;

      const payload = {
        name: values.name,
        age: values.age === "" ? undefined : Number(values.age),
        weight: values.weight === "" ? undefined : Number(values.weight),
        height: values.height === "" ? undefined : Number(values.height),
        gender: values.gender,
        activityLevel: values.activityLevel,
        dietPreferences: values.dietPreferences || [],
        ...(Object.keys(goals).length ? { goals } : {}),
        allergies: values.allergies,
      };
      await updateProfile(payload);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };
  return (
    <div className="page">
      <h1 className="section-title">Your Profile</h1>
      <p className="section-sub">Manage your preferences and health goals</p>
      <div className="profile-grid">
        <div>
          <div className="profile-card">
            <div className="profile-avatar">AS</div>
            <div className="profile-name">{watch("name") || "—"}</div>
            <div className="profile-email">{watch("email") || ""}</div>
            <button className="btn-view" style={{width:"100%",padding:"10px"}}>Edit Photo</button>
            <div className="profile-stat-row">
              <div className="p-stat"><div className="p-stat-val">{watch("mealsLogged") || 0}</div><div className="p-stat-lab">Meals Logged</div></div>
              <div className="p-stat"><div className="p-stat-val">{watch("weekStreak") || 0}</div><div className="p-stat-lab">Week Streak</div></div>
              <div className="p-stat"><div className="p-stat-val">84</div><div className="p-stat-lab">Health Score</div></div>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-panel" style={{marginBottom:"1.5rem"}}>
              <div className="panel-title">Personal Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" {...register("name")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input className="form-input" inputMode="numeric" {...register("age")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight</label>
                  <input className="form-input" inputMode="numeric" {...register("weight")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Height</label>
                  <input className="form-input" inputMode="numeric" {...register("height")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <input className="form-input" {...register("gender")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  <input className="form-input" {...register("activityLevel")} />
                </div>
              </div>
            </div>
          <div className="card-panel" style={{marginBottom:"1.5rem"}}>
            <div className="panel-title">Diet Preferences</div>
            <div className="diet-chips">
              {diets.map(d=>(
                <button key={d} className={`diet-chip${diet.includes(d)?" active":""}`}
                  type="button"
                  onClick={() =>
                    setValue(
                      "dietPreferences",
                      diet.includes(d) ? diet.filter((x) => x !== d) : [...diet, d]
                    )
                  }>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="card-panel">
            <div className="panel-title">Health Goals</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="form-group">
                <label className="form-label">Daily Calories</label>
                <input className="form-input" inputMode="numeric" {...register("goals.dailyCalories")} />
              </div>
              <div className="form-group">
                <label className="form-label">Protein Goal</label>
                <input className="form-input" inputMode="numeric" {...register("goals.proteinGoal")} />
              </div>
              <div className="form-group">
                <label className="form-label">Daily Budget</label>
                <input className="form-input" inputMode="numeric" {...register("goals.dailyBudget")} />
              </div>
              <div className="form-group">
                <label className="form-label">Allergies</label>
                <input className="form-input" {...register("allergies")} />
              </div>
            </div>
            <button className="btn-primary" style={{marginTop:8}} type="submit" disabled={isSubmitting}>Save Changes</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage