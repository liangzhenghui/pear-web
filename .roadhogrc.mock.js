import mockjs from 'mockjs';
import { format, delay } from 'roadhog-api-doc';
import { API_HOST } from './src/utils/const';

export default ({
    'GET /api/(.*)': API_HOST,
    'POST /api/(.*)': API_HOST,
    'PATCH /api/(.*)': API_HOST,
    'DELETE /api/(.*)': API_HOST,
    'PUT /api/(.*)': API_HOST,
    'OPTIONS /api/(.*)': API_HOST
});