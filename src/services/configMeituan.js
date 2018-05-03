import request from '../utils/request';

const mt_config = 'config_mt_crawler'

export async function getRestaurantList(address, lat_lng) {
    return request(`/${mt_config}/restaurant_list?address=${address}&lat_lng=${lat_lng}`)
}

