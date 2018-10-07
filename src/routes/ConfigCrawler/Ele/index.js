import React, { Component, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';
import styles from './style.less';

const { Step } = Steps;

export default class ConfigCrawlerEle extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { match: { params: { source } } } = this.props;
  }

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <PageHeaderLayout
        title="配置饿了么爬虫"
        content="使用饿了么平台账号登录，然后选择希望爬取的商家"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="登录饿了么" />
              <Step title="选择商家" />
              <Step title="完成" />
            </Steps>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              {/* 重定向 */}
              <Redirect exact from="/configCrawler/ele" to="/configCrawler/ele/info" />
              <Route render={NotFound} />
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
