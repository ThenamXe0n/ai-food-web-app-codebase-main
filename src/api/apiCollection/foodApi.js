import axiosInstance from "../axiosInstance";

export async function getAllFoods(params) {
  try {
    const res = await axiosInstance.get("/foods", { params });
    return res.data;
  } catch (err) {
    console.error("getAllFoods error", err);
    throw err;
  }
}

export async function getTrendingFoods() {
  try {
    const res = await axiosInstance.get("/foods/trending");
    return res.data;
  } catch (err) {
    console.error("getTrendingFoods error", err);
    throw err;
  }
}

export async function getFoodById(id) {
  try {
    const res = await axiosInstance.get(`/foods/${id}`);
    return res.data;
  } catch (err) {
    console.error("getFoodById error", err);
    throw err;
  }
}

export async function getByIngredients(items) {
  try {
    const res = await axiosInstance.get("/foods/by-ingredients", {
      params: { items },
    });
    return res.data;
  } catch (err) {
    console.error("getByIngredients error", err);
    throw err;
  }
}

export async function rateFood(id, rating) {
  try {
    const res = await axiosInstance.post(`/foods/${id}/rate`, { rating });
    return res.data;
  } catch (err) {
    console.error("rateFood error", err);
    throw err;
  }
}

export async function createFood(data) {
  try {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    const res = await axiosInstance.post("/foods", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return res.data;
  } catch (err) {
    console.error("createFood error", err);
    throw err;
  }
}

