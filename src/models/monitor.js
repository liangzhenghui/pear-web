import { queryTags } from '../services/api';
import { queryCrawlers } from '../services/crawler'

export default {
  namespace: 'monitor',

  state: {
    tags: [],
    crawlers: {
      data: [],
      total: 0,
      page: 1,
      per_page: 10
    }
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      })
    },
    *fetchCrawlers({ payload: { page, per_page } }, { call, put }) {
      const resp = yield call(queryCrawlers, page, per_page)
      yield put({
        type: 'saveCrawlers',
        payload: resp
      })
    }
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    saveCrawlers(state, action) {
      return {
        ...state,
        crawlers: {
          data: action.payload.data,
          total: action.payload.total,
          page: action.payload.page,
          per_page: action.payload.per_page
        }
      };
    }
  },
};
