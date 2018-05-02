import { isUrl } from '../utils/utils';
import e_logo from '../assets/e_Logo.png';
import m_logo from '../assets/m_Logo.png';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'dashboard/workplace'
  },
  {
    name: '监控台',
    icon: 'dashboard',
    path: 'dashboard/monitor'
  },
  {
    name: '新建饿了么爬虫',
    icon: e_logo,
    path: 'configCrawler/ele'
  },
  {
    name: '新建美团外卖爬虫',
    icon: m_logo,
    path: 'configCrawler/meituan'
  },
  {
    name: '单独分析',
    icon: 'line-chart',
    path: '/analy/single'
  },
  {
    name: '对比分析',
    icon: 'bar-chart',
    path: '/analy/multi'
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
