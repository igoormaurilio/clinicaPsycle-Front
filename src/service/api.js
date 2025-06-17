import axios from 'axios';

const api = axios.create({
  baseURL: 'https://psycle-c8dbgyaqhugahxfe.brazilsouth-01.azurewebsites.net',
});

export default api;
