import request from '../utils/request';

export async function queryCrawlers(page = 1, per_page = 6) {
    return request(`/crawler_tasks?page=${page}&per_page=${per_page}`)
}