import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

// 返回当前用户的累计访问次数
export async function queryCurrent() {
  return request('/user');
}
