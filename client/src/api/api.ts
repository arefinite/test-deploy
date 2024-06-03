import axios from 'axios';

const api = axios.create({
    // todo: move this value to env variable.
    baseURL: 'http://localhost:4000',
   
});


export const createBook = async (data: FormData) =>
    api.post('/api/v1/ebook', data)