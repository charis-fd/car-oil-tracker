import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchOilData = () => axios.get(`${API_URL}/api/oils?populate*`);