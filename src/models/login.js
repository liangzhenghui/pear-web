import { routerRedux } from 'dva/router';
import { accountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { notification } from 'antd';
import { cookie } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (!response) {
        notification.error({
          message: '登录失败',
        });
        return
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // 登录成功
      if (response.status === 'ok') {
        cookie.set('u_id', response.user.id);
        reloadAuthorized();
        notification.success({
          message: '登录成功',
        });
        yield put(routerRedux.push('/dashboard/workplace'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // 得到路径名
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // 在url中添加参数
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, action) {
      const { payload } = action;
      setAuthority(null);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
