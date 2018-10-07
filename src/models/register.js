import { register } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (!response) {
        notification.error({
          message: '注册失败',
        });
      }
      if (response.status === 'ok') {
        notification.success({
          message: '注册成功',
        });
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        yield put(routerRedux.push('/dashboard/workplace'));
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority(payload.uId);
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
