import axios from "axios";
const API=axios.create({
  baseURL:"http://localhost:5000"
});
export const fetchRecipes=(page = 1, limit = 15) => {
  return API.get(`/recipes?page=${page}&limit=${limit}`);
};
export const searchRecipes=(params) => {
  return API.get(`/recipes/search`, { params });
};