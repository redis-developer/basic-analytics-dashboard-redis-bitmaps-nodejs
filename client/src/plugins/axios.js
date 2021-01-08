import globalAxios from 'axios';
import { apiUrl } from '@/config';

const axios = globalAxios.create({
    baseURL: apiUrl
});

export default axios;
