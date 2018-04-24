import { queryTags } from '../services/api';
import { queryCrawlers, doDeleteCrawler } from '../services/crawler';
import { notification } from 'antd';

export default {
  namespace: 'monitor',

  state: {
    crawlers: {
      data: [],
      total: 0,
    },
  },

  effects: {
    *fetchCrawlers({ payload: { page, per_page } }, { call, put }) {
      const resp = yield call(queryCrawlers, page, per_page);
      yield put({
        type: 'saveCrawlers',
        payload: resp,
      });
    },
    *deleteCrawler({ crawlerId }, { call, put }) {
      const resp = yield call(doDeleteCrawler, crawlerId);
      notification.success({
        message: '删除成功',
      });
      yield put({
        type: 'updateCrawlers',
        crawlerId,
      });
    },
  },

  reducers: {
    saveCrawlers(state, action) {
      return {
        ...state,
        crawlers: {
          data: action.payload.data,
          total: action.payload.total,
        },
      };
    },
    updateCrawlers(state, { crawlerId }) {
      const { crawlers: { data, total } } = state;
      const finCrawlers = data.filter(item => {
        if (item.id !== crawlerId) {
          return item;
        }
      });
      return {
        ...state,
        crawlers: {
          data: finCrawlers,
          total: total - 1,
        },
      };
    },
  },
};
