import { useState } from "react";
import { useForm } from "react-hook-form";
import { login, register } from "../api/apiCollection/authApi";
import { setToken } from "../utils/auth";

function LoginPage({ onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = isLogin
        ? { email: values.email, password: values.password }
        : { name: values.name, email: values.email, password: values.password };

      const res = isLogin ? await login(payload) : await register(payload);
      if (res?.token) setToken(res.token);
      onNavigate("dashboard");
    } catch (err) {
      console.error(isLogin ? "Login failed" : "Register failed", err);
    }
  };
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="Arjun Sharma"
                {...rhfRegister("name")}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              placeholder="you@example.com"
              {...rhfRegister("email", { required: true })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              {...rhfRegister("password", { required: true })}
            />
          </div>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </form>

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