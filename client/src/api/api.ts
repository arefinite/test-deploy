import axios from 'axios';

const api = axios.create({
    
    baseURL: 'http://localhost:4000' || '',
   
});


export const createBook = async (data: FormData) =>
    api.post('/api/v1/ebook', data)