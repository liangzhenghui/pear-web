import { queryActivities, requestRestaurant } from '../services/api';

export default {
  namespace: 'activities',

  state: {
    crawlers: {
      crawler_total: 0
    },
    actions: {}
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
