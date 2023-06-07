import axios from "axios";

export const api = axios.create({
  baseURL: 'https://flashmemo-server-production-334e.up.railway.app',
});
