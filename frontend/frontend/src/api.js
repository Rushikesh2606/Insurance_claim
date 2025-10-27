import axios from "axios";
const base = "http://localhost:5000/api";

export const getClaims = () => axios.get(`${base}/claims`).then((r) => r.data);
export const getStatusSummary = () =>
  axios.get(`${base}/claims/status-summary`).then((r) => r.data);
export const seedDb = () => axios.post(`${base}/claims/seed`).then((r) => r.data);