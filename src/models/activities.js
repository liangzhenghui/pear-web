import { queryActivities, requestRestaurant } from '../services/api';
import { compareAll } from '../services/analyse'

export default {
  namespace: 'activities',

  state: {
    crawlers: {
      crawler_total: 0
    },
    actions: {},
    compareData: {}
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchCompareAllData(_, { call, put }) {
      const resp = yield call(compareAll)
      yield put({
        type: 'saveCompareAllData',
        payload: resp
      })
    }
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveCompareAllData(state, { payload }) {
      return {
        ...state,
        compareData: payload
      }
    }
  },
};
