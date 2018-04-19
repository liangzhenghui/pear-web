import { eleSmsCode, elePicCode, loginEle } from '../services/configCrawler';
import { notification } from 'antd'

export default {
    namespace: 'configEleCrawler',

    state: {
        needPicCode: false
    },

    effects: {
        *getEleSmsCode({ mobile, pic_code, pic_token }, { call, put }) {            
            const resp = yield call(eleSmsCode, mobile, pic_code, pic_token)
            if (resp.success) {
                notification.success({
                    message: '短信验证码获取成功',
                    description: '正在发送到你的手机'
                })
            } else {
                notification.error({
                    message: '获取短信验证码失败'
                })
                yield put({
                    type: 'saveNeedPicCode',
                    payload: true
                })
            }
        }
    },

    reducers: {
        saveNeedPicCode(state, action) {
            return {
                ...state,
                needPicCode: action.payload
            }
        }
    }
}