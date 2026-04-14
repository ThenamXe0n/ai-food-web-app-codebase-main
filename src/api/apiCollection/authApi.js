import axiosInstance from "../axiosInstance";

export async function login(data) {
  try {
    const res = await axiosInstance.post("/users/login", data);
    return res.data;
  } catch (err) {
    console.error("login error", err);
    throw err;
  }
}

export async function register(data) {
  try {
    const res = await axiosInstance.post("/users/register", data);
    return res.data;
  } catch (err) {
    console.error("register error", err);
    throw err;
  }
}

export async function getProfile() {
  try {
    const res = await axiosInstance.get("/users/me");
    return res.data;
  } catch (err) {
    console.error("getProfile error", err);
    throw err;
  }
}

