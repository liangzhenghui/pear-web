import { fakeChartData } from '../services/api';
import { queryCrawler } from '../services/crawler';
import { dishDistribution, wordCount, compareTwoCrawler, getUserAnalyseHistory } from '../services/analyse';

export default {
  namespace: 'chart',

  state: {
    loading: false,
    crawlerData: null,
    analyDish: null,
    wordCloudImages: null,
    compareData: {},
    history: null
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
    *fetchWordCloud({ crawlerId }, { call, put }) {
      const resp = yield call(wordCount, crawlerId);
      yield put({
        type: 'saveWordCloud',
        wordCloudImages: resp,
      });
    },
    *doCompareTwoCrawler({ crawlerId_1, crawlerId_2 }, { call, put }) {
      const resp = yield call(compareTwoCrawler, crawlerId_1, crawlerId_2)
      yield put({
        type: 'saveCompare',
        payload: resp
      })
    },
    *fetchHistory({ analyType }, { call, put }) {
      const resp = yield call(getUserAnalyseHistory, analyType)
      yield put({
        type: 'saveHistory',
        payload: resp
      })
    }
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
        crawlerData: null,
        analyDish: null,
        wordCloudImages: null,
        compareData: {}
      };
    },
    saveCrawler(state, { crawlerData }) {
      return {
        ...state,
        crawlerData
      };
    },
    saveAnalyDish(state, { analyDish }) {
      return {
        ...state,
        analyDish
      };
    },
    saveWordCloud(state, { wordCloudImages }) {
      return {
        ...state,
        wordCloudImages
      };
    },
    saveCompare(state, { payload }) {
      return {
        ...state,
        compareData: payload
      }
    },
    saveHistory(state, { payload }) {
      return {
        ...state,
        history: payload
      }
    }
  },
};
