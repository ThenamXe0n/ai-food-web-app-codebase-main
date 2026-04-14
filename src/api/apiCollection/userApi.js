import axiosInstance from "../axiosInstance";

export async function updateProfile(data) {
  try {
    const res = await axiosInstance.put("/users/me", data);
    return res.data;
  } catch (err) {
    console.error("updateProfile error", err);
    throw err;
  }
}

export async function toggleLike(foodId) {
  try {
    const res = await axiosInstance.post(`/users/me/likes/${foodId}`);
    return res.data;
  } catch (err) {
    console.error("toggleLike error", err);
    throw err;
  }
}

export async function getLikes() {
  try {
    const res = await axiosInstance.get("/users/me/likes");
    return res.data;
  } catch (err) {
    console.error("getLikes error", err);
    throw err;
  }
}

