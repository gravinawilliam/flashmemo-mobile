import axios from "axios";

export const api = axios.create({
  baseURL: 'https://flashmemo-server-production.up.railway.app',
});
