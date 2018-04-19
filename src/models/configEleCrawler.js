import { eleSmsCode, elePicCode, loginEle } from '../services/configCrawler';
import { notification } from 'antd'
import { routerRedux } from 'dva/router'

export default {
    namespace: 'configEleCrawler',

    state: {
        needPicCode: false,
        sms_token: null,
        pic_token: null
    },

    effects: {
        *getEleSmsCode({ payload: { mobile, pic_code, pic_token } }, { call, put }) {
            const resp = yield call(eleSmsCode, mobile, pic_code, pic_token)
            if (resp.success) {
                notification.success({
                    message: '短信验证码获取成功',
                    description: '正在发送到你的手机'
                })
                yield put({
                    type: 'saveSmsToken',
                    payload: resp.ele_sms_token
                })
            } else {
                notification.error({
                    message: '获取短信验证码失败',
                    description: '需要输入图片验证码'
                })
                yield put({
                    type: 'saveNeedPicCode',
                    payload: true
                })
            }
        },
        *loginEle({ payload: { mobile, sms_code, sms_token } }, { call, put }) {
            const resp = yield call(loginEle, mobile, sms_code, sms_token)
            if (resp.success) {
                notification.success({
                    message: '登录饿了么成功',
                })
                yield put(routerRedux.push('/configCrawler/ele/confirm'))
            } else {
                notification.error({
                    message: '登录饿了么失败'
                })
            }
        },
        *getPicCode({ payload: { mobile } }, { call, put }) {
            const resp = yield call(elePicCode, mobile)
            if (resp.success) {
                yield put({
                    type: 'savePicCode',
                    payload: resp
                })
            } else {
                notification.error({
                    message: '图片验证码获取失败'
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
        },
        saveSmsToken(state, action) {
            return {
                ...state,
                sms_token: action.payload
            }
        },
        savePicCode(state, { payload }) {
            return {
                ...state,
                pic_token: payload.ele_image_token,
                pic_base64: payload.ele_image_base64
            }
        }
    }
}