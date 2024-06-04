import axios from 'axios';

const api = axios.create({
    
    baseURL: 'https://test-deploy-he88.onrender.com',
   
});


export const createBook = async (data: FormData) =>
    api.post('/api/v1/ebook', data)