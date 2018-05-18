import { getRestaurantList, commitCrawler } from '../services/configMeituan'
import { notification, message } from 'antd'
import { routerRedux } from 'dva/router'

export default {
    namespace: 'configMeituanCrawler',
    state: {},
    effects: {
        *commitCrawlerTask({ payload }, { call, put }) {
            const resp = yield call(commitCrawler, payload)
            if (!resp) {
                return
            }
            if (resp.success) {
                notification.success({
                    message: '提交成功'
                })
                yield put(routerRedux.push('/configCrawler/meituan/step2'))
            }
        }
    },
    reducers: {
        clear(state, action) {
            return {
                ...state
            }
        }
    }
}