import axiosInstance from "../axiosInstance";

export async function getCurrentPlan() {
  try {
    const res = await axiosInstance.get("/meal-plans/current");
    return res.data;
  } catch (err) {
    console.error("getCurrentPlan error", err);
    throw err;
  }
}

export async function autoGeneratePlan() {
  try {
    const res = await axiosInstance.post("/meal-plans/auto-generate");
    return res.data;
  } catch (err) {
    console.error("autoGeneratePlan error", err);
    throw err;
  }
}

export async function updateSlot(id, data) {
  try {
    const res = await axiosInstance.put(`/meal-plans/${id}/slot`, data);
    return res.data;
  } catch (err) {
    console.error("updateSlot error", err);
    throw err;
  }
}

