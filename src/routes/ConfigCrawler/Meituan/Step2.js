import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class Step2 extends React.PureComponent {
  render() {
    const { dispatch } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/configCrawler/meituan/step1'));
    };
    const onBack = () => {
      dispatch(routerRedux.push('/'));
    };
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          再提交一个
        </Button>
        <Button onClick={onBack}>查看任务</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description=""
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect()(Step2);
