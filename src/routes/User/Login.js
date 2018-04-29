import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, Modal } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { masks } from 'fecha';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

const modalForgetPass = () => {
  Modal.success({
    width: 450,
    title: "已发送修改密码的邮件到你的邮箱，\n请注意查收",
    okText: "我知道了",
    onOk(){}
  });
}

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };


  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={'account'} onSubmit={this.handleSubmit}>
          {login.status === 'error' &&
            login.type === 'account' &&
            !login.submitting &&
            this.renderMessage('账户或密码错误')}
          <UserName name="account" placeholder="用户名/手机号/邮箱" />
          <Password name="password" placeholder="密码" />
          <div>
            <span>
              <Checkbox defaultChecked={true}></Checkbox>
              <span>自动登录</span>
            </span>
            <a style={{ float: 'right' }} href="#" onClick={modalForgetPass}>忘记密码</a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
