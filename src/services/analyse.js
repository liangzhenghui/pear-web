import request from '../utils/request';

export async function dishDistribution(crawlerId) {
  return request(`/analyse/dish_distribution/${crawlerId}`);
}

export async function wordCount(crawlerId) {
  return request(`/analyse/rating_word_cloud/${crawlerId}`);
}
