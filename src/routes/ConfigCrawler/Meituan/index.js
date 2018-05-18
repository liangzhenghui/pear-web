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
    // 根据‘/’将字符串拆分成几个部分
    const pathList = pathname.split('/');
    
    switch (pathList[pathList.length - 1]) {
      case 'step1':
        return 0;
      case 'step2':
        return 1;
      case 'step3':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <PageHeaderLayout
        title="配置爬虫"
        content="使用美团外卖平台账号登录，然后选择希望爬取的商家"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="确定商圈" />
              <Step title="确认爬取配置" />
              <Step title="提交" />
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
              <Redirect exact from="/configCrawler/meituan" to="/configCrawler/meituan/step1" />
              <Route render={NotFound} />
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
