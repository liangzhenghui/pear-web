import request from '../utils/request';

const mt_config = 'config_mt_crawler'

export async function getRestaurantList(address, lat_lng) {
    return request(`/${mt_config}/restaurant_list?address=${address}&lat_lng=${lat_lng}`)
}

export async function commitCrawler(locations) {
    return request(`/${mt_config}/commit_crawler`, {
        method: 'POST',
        body: locations
    })
}