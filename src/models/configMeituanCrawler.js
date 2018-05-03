import { getRestaurantList } from '../services/configMeituan'
import { notification, message } from 'antd'

export default {
    namespace: 'configMeituanCrawler',
    state: {
        step1ActiveKey: '1',
        restaurantList: []
    },
    effects: {
        *fetchRestaurantList({ address, lat_lng }, { call, put }) {
            const resp = yield call(getRestaurantList, address, lat_lng)
            message.destroy()
            if (!resp || !resp.success) {
                notification.error({
                    description: resp && resp.msg || '获取商家列表失败',
                    placement: 'bottomRight'
                })
            } else {
                yield put({
                    type: 'saveRestaurantList',
                    payload: resp
                })
                notification.success({
                    description: `获取到 ${resp.data.length} 个商家`,
                    placement: 'bottomRight'
                })
            }
        }
    },
    reducers: {
        saveRestaurantList(state, { payload }) {
            return {
                ...state,
                restaurantList: payload,
                step1ActiveKey: '2'
            }
        },
        clear(state, action) {
            return {
                ...state,
                step1ActiveKey: '1',
                restaurantList: []
            }
        },
        backLocationPick(state, { action }) {
            return {
                ...state,
                step1ActiveKey: '1'
            }
        }
    }
}