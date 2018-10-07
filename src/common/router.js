import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'global', 'login'], () =>
        import('../layouts/BasicLayout')
      ),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['activities', 'chart', 'user'], () =>
        import('../routes/Dashboard/Workplace')
      ),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/userInfo':{
      component: dynamicWrapper(app, ['user'], () => import('../routes/User/Info')),
    },
    '/configCrawler/ele': {
      component: dynamicWrapper(app, ['configEleCrawler'], () =>
        import('../routes/ConfigCrawler/Ele')
      ),
    },
    '/configCrawler/meituan': {
      component: dynamicWrapper(app, ['configMeituanCrawler'], () =>
        import('../routes/ConfigCrawler/Meituan')
      ),
    },
    '/configCrawler/ele/info': {
      name: '登录饿了么',
      component: dynamicWrapper(app, ['configEleCrawler'], () =>
        import('../routes/ConfigCrawler/Ele/Step1')
      ),
    },
    '/configCrawler/ele/confirm': {
      name: '选择商家',
      component: dynamicWrapper(app, ['configEleCrawler'], () =>
        import('../routes/ConfigCrawler/Ele/Step2')
      ),
    },
    '/configCrawler/ele/result': {
      name: '提交爬虫任务',
      component: dynamicWrapper(app, ['configEleCrawler'], () =>
        import('../routes/ConfigCrawler/Ele/Step3')
      ),
    },
    '/configCrawler/meituan/step1': {
      name: '配置美团外卖爬虫',
      component: dynamicWrapper(app, ['configMeituanCrawler'], () =>
        import('../routes/ConfigCrawler/Meituan/Step1')
      ),
    },
    '/analy/normal/:crawlerId': {
      name: '新建单独分析',
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Analy/Normal')),
    },
    '/analy/pro/:crawlerId_1/:crawlerId_2': {
      name: '新建对比分析',
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Analy/Pro')),
    },
    '/analy/single': {
      name: '单独分析',
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Analy/SingleTask')),
    },
    '/analy/multi': {
      name: '对比分析',
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Analy/MultiTask')),
    }
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
