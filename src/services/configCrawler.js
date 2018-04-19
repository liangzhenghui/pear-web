import request from '../utils/request';

export async function eleSmsCode(mobile, pic_code = null, pic_token = null) {
    return request(`/configEle/sms_code/?mobile=${mobile}&pic_code=${pic_code}&pic_token=${pic_token}`);
}

export async function elePicCode(mobile) {
    return request(`/configEle/pic_code/${mobile}`);
}

export async function loginEle(mobile, sms_code, sms_token) {
    return request(`/configEle/sms_code/?mobile=${mobile}&sms_code=${sms_code}&sms_token=${sms_token}`);
}

export async function loginMeituan() {
    return request('/configMeituan/sms_code');
}