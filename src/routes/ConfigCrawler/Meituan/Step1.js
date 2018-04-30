import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './style.less';
import { Spin, Icon } from 'antd'


class Step1 extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <div style={{ width: '100%', height: 300, textAlign: 'center', paddingTop: 50 }}>
          <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
          <h2>敬请期待</h2>
          <Link to="/dashboard/workplace">返回首页</Link>
        </div>
      </Fragment>
    );
  }
}

const state2props = () => {
  return {
  }
}

export default connect(state2props)(Step1);
