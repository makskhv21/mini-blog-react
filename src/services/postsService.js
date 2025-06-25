import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export const getPosts = async (start = 0, limit = 10) => {
  const res = await axios.get(`${BASE_URL}?_start=${start}&_limit=${limit}`);
  return res.data;
};

export const createPost = async (postData) => {
  const res = await axios.post(BASE_URL, postData);
  return res.data;
};
