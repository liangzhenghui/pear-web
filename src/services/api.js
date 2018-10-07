import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

// 返回当前用户的爬虫数据
export async function queryActivities() {
  return request('/user/activity');
}

export async function accountLogin(params) {
  return request('/auth/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/auth/signup', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}



