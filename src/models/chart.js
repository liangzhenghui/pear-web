import { fakeChartData } from '../services/api';
import { queryCrawler } from '../services/crawler';
import { dishDistribution, wordCount } from '../services/analyse';

export default {
  namespace: 'chart',

  state: {
    loading: false,
    crawlerData: null,
    analyDish: null,
    wordCount: {},
  },

  effects: {
    *fetchCrawler({ crawlerId }, { call, put }) {
      const resp = yield call(queryCrawler, crawlerId);
      yield put({
        type: 'saveCrawler',
        crawlerData: resp,
      });
    },
    *fetchDishDistribution({ crawlerId }, { call, put }) {
      const resp = yield call(dishDistribution, crawlerId);
      yield put({
        type: 'saveAnalyDish',
        analyDish: resp,
      });
    },
    *fetchWordCount({ crawlerId }, { call, put }) {
      const resp = yield call(wordCount, crawlerId);
      yield put({
        type: 'saveWordCount',
        wordCount: resp,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
        crawlerData: null,
        analyDish: null,
        wordCount: {},
      };
    },
    saveCrawler(state, { crawlerData }) {
      return {
        ...state,
        crawlerData,
      };
    },
    saveAnalyDish(state, { analyDish }) {
      return {
        ...state,
        analyDish,
      };
    },
    saveWordCount(state, { wordCount }) {
      return {
        ...state,
        wordCount,
      };
    },
  },
};
