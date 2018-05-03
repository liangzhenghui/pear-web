import { eleSmsCode, elePicCode, loginEle, searchRestaurantArea, restaurantListOfArea, commitCrawler, cityName, cities } from '../services/configCrawler';
import { notification } from 'antd'
import { routerRedux } from 'dva/router'

export default {
    namespace: 'configEleCrawler',

    state: {
        needPicCode: false,
        sms_token: null,
        pic_token: null,
        restaurantArea: [],
        restaurantListOfArea: []
    },

    effects: {
        *getEleSmsCode({ payload: { mobile, pic_code, pic_token } }, { call, put }) {
            const resp = yield call(eleSmsCode, mobile, pic_code, pic_token)
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
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
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
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
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
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
        },
        *getRestaurantArea({ payload: { key, lat, lng } }, { call, put }) {
            const resp = yield call(searchRestaurantArea, key, lat, lng)
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
            yield put({
                type: 'clearRestaurants'
            })
            yield put({
                type: 'saveRestaurantArea',
                payload: resp
            })
        },
        *getRestaurantInfo({ payload }, { call, put }) {
            const resp = yield call(restaurantListOfArea, payload)
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
            yield put({
                type: 'saveRestaurantListOfArea',
                payload: resp
            })
        },
        *commitTask({ payload }, { call, put }) {
            const resp = yield call(commitCrawler, payload)
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
            if (resp.success) {
                notification.success(
                    {
                        message: '爬虫任务提交成功'
                    }
                )
                yield put(routerRedux.push('/configCrawler/ele/result'))
            }
        },
        *fetchCities(_, { call, put }) {
            const resp = yield call(cities)
            if (!resp) {
                notification.success({
                    message: '请求出错'
                })
                return
            }
            yield put({
                type: 'saveCities',
                payload: resp
            })
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
        },
        resetStep1(state, action) {
            return {
                ...state,
                needPicCode: false,
                sms_token: null,
                pic_token: null
            }
        },
        saveRestaurantArea(state, action) {
            const area = state.restaurantArea.concat(action.payload)
            return {
                ...state,
                restaurantArea: area,
                restaurantListOfArea: []
            }
        },
        saveRestaurantListOfArea(state, action) {
            const restaurants = state.restaurantListOfArea.concat(action.payload)
            return {
                ...state,
                restaurantListOfArea: restaurants,
            }
        },
        saveCities(state, action) {
            return {
                ...state,
                cities: action.payload
            }
        },
        clearRestaurants(state, action) {
            return {
                ...state,
                restaurantListOfArea: [],
                restaurantArea: []
            }
        }
    }
}
