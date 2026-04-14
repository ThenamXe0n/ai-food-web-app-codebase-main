import { useState } from "react";

function LoginPage({ onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? "Welcome back" : "Get started"}</h1>
        <p className="auth-sub">{isLogin ? "Sign in to your NutriAI account" : "Create your personalized nutrition profile"}</p>

        <button className="social-btn">
          <span>G</span> Continue with Google
        </button>
        <button className="social-btn">
          <span>📧</span> Continue with Email Magic Link
        </button>

        <div className="divider">or use password</div>

        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Arjun Sharma" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" />
        </div>

        <button className="auth-submit" onClick={()=>onNavigate("dashboard")}>
          {isLogin ? "Sign In →" : "Create Account →"}
        </button>

        <p className="auth-switch">
          {isLogin ? "New here? " : "Already have an account? "}
          <button className="link-btn" onClick={()=>setIsLogin(l=>!l)}>
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage