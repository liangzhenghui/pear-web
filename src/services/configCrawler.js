import request from '../utils/request';

const ele_config = 'config_ele_crawler'

export async function eleSmsCode(mobile, pic_code = '', pic_token = '') {
    return request(`/${ele_config}/sms_code?mobile=${mobile}&pic_code=${pic_code}&pic_token=${pic_token}`);
}

export async function elePicCode(mobile) {
    return request(`/${ele_config}/pic_code?mobile=${mobile}`);
}

export async function loginEle(mobile, sms_code, sms_token) {
    return request(`/${ele_config}/login_ele?mobile=${mobile}&sms_code=${sms_code}&sms_token=${sms_token}`);
}


export async function searchRestaurantArea(key) {
    return request(`/${ele_config}/search_address?key=${key}`)
}

export async function restaurantListOfArea(params) {
    return request(`/${ele_config}/get_restaurants`, {
        method: 'POST',
        body: params
    })
}

export async function submitCrawler() {
    return request('/')
}