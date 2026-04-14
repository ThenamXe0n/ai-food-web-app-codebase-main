import axiosInstance from "../axiosInstance";

export async function logMeal(data) {
  try {
    const res = await axiosInstance.post("/meal-logs", data);
    return res.data;
  } catch (err) {
    console.error("logMeal error", err);
    throw err;
  }
}

export async function getTodayLogs() {
  try {
    const res = await axiosInstance.get("/meal-logs/today");
    return res.data;
  } catch (err) {
    console.error("getTodayLogs error", err);
    throw err;
  }
}

export async function getWeeklySummary() {
  try {
    const res = await axiosInstance.get("/meal-logs/weekly-summary");
    return res.data;
  } catch (err) {
    console.error("getWeeklySummary error", err);
    throw err;
  }
}

