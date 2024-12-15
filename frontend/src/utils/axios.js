import axios from 'axios';
export default axios.create({
  baseURL: import.meta.env.MODE === 'development' ? null : 'https://api.quackprep.com/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
