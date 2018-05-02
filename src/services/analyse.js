import request from '../utils/request';

export async function dishDistribution(crawlerId) {
  return request(`/analyse/dish_distribution/${crawlerId}`);
}

export async function wordCount(crawlerId) {
  return request(`/analyse/rating_word_cloud/${crawlerId}`);
}

export async function compareTwoCrawler(crawlerId_1, crawlerId_2) {
  return request(`/analyse/compare/${crawlerId_1}/${crawlerId_2}`);
}

export async function compareAll() {
  return request('/analyse/compare_all')
}

export async function getUserAnalyseHistory(analyType = null) {
  if (!analyType) {
    return request(`/analyse/history`)
  }
  return request(`/analyse/history/${analyType}`)
}