import request from '../utils/request';

export async function queryCrawlers(page = 1, per_page = 6) {
  return request(`/crawler_tasks?page=${page}&per_page=${per_page}`);
}

export async function doDeleteCrawler(crawlerId) {
  return request(`/crawler_tasks/${crawlerId}`, {
    method: 'DELETE',
  });
}

export async function queryCrawlerStatus(crawlerId) {
  return request(`crawler_tasks/status/${crawlerId}`);
}

export async function queryCrawler(crawlerId) {
  return request(`crawler_tasks/${crawlerId}`);
}
