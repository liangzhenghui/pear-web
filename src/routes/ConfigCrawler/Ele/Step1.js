import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Row, Col, notification, Alert } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import { cookie } from '../../../utils/utils'
import { transpileModule } from 'typescript';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

// @使Form.create()成为装饰器函数，被这个函数修饰的类、组件就能拥有ant design提供的对表单填入数据的正确性验证
@Form.create()
class Step1 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mobileNotMatch: true
    };
  }


  handleMobileInput = event => {
    const mobile = event.target.value;
    if (mobile.length === 11) {
      this.setState({
        mobileNotMatch: false,
      });
    } else {
      this.setState({
        mobileNotMatch: true,
      });
    }
  };

  jumpToNextStep = () => {
    const { dispatch } = this.props
    dispatch(routerRedux.push('/configCrawler/ele/confirm'))
  }

  render() {
    const {
      form,
      dispatch,
      needPicCode,
      loginLoading,
      getEleSmsCodeLoading,
      getElePicCodeLoading,
    } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { sms_token, pic_base64 } = this.props;
    const { mobileNotMatch } = this.state;
    const ele_login_account = cookie.get('ele_login_account');

    const onValidateForm = () => {
      validateFields((err, values) => {
        const payload = {
          mobile: values.mobile,
          sms_code: values.sms_code,
          sms_token: this.props.sms_token,
        };
        if (!err) {
          dispatch({
            type: 'configEleCrawler/loginEle',
            payload: payload,
          });
        }
      });
    };

    const handleGetSmsCode = () => {
      let fileds = ['mobile'];
      if (needPicCode) {
        fileds.push('pic_code');
      }
      validateFields(fileds, (err, values) => {
        if (!err) {
          const payload = {
            mobile: values.mobile,
          };
          if (needPicCode) {
            payload['pic_code'] = values.pic_code;
            payload['pic_token'] = this.props.pic_token;
          }
          dispatch({
            type: 'configEleCrawler/getEleSmsCode',
            payload: payload,
          });
        }
      });
    };

    const refreshPicCode = () => {
      validateFields(['mobile'], (err, values) => {
        if (!err) {
          const payload = {
            mobile: values.mobile,
          };
          dispatch({
            type: 'configEleCrawler/getPicCode',
            payload: payload,
          });
        }
      });
    };
    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          hideRequiredMark
          style={{ margin: '60px auto 60px' }}
        >
          <Form.Item {...formItemLayout} label="手机号">
            {getFieldDecorator('mobile', {
              // required:必填字段
              rules: [{ required: true, message: '请输入手机号' }],
            })(
              <Input
                placeholder={ele_login_account || "手机号"}
                onChange={this.handleMobileInput}
              />
            )}
            {mobileNotMatch ? (
              <Alert
                message={mobileNotMatch ? 'error' : 'success'}
                type={mobileNotMatch ? 'error' : 'success'}
                showIcon
              />
            ) : (
                ''
              )}
          </Form.Item>
          {needPicCode && (
            <Form.Item {...formItemLayout} label="图片验证码">
              <Row gutter={16}>
                <Col span={16}>
                  {getFieldDecorator('pic_code', {
                    rules: [{ required: true, message: '请输入图片验证码' }],
                  })(<Input placeholder="图片验证码" />)}
                </Col>
                <Col span={4}>
                  <Button
                    loading={getElePicCodeLoading}
                    onClick={refreshPicCode}
                  >
                    获取/刷新
                  </Button>
                </Col>
                <Col span={4}>
                  <img style={{ marginLeft: 8 }} src={pic_base64} />
                </Col>
              </Row>
            </Form.Item>
          )}
          <Form.Item {...formItemLayout} label="验证码">
            <Row gutter={16}>
              <Col span={19}>
                {getFieldDecorator('sms_code', {
                  rules: [{ required: true, message: '请输入短信验证码' }],
                })(<Input placeholder="短信验证码" />)}
              </Col>
              <Col span={4}>
                <Button
                  disabled={mobileNotMatch}
                  loading={getEleSmsCodeLoading}
                  onClick={handleGetSmsCode}
                >
                  获取验证码
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Row gutter={8}>
              <Col span={8}>
                <Button
                  type="primary"
                  onClick={onValidateForm}
                  loading={loginLoading}
                  htmlType="submit"
                >
                  登录并进入下一步
            </Button>
              </Col>
              {ele_login_account &&
                <Col span={8}>
                  <Button
                    type="dashed"
                    onClick={this.jumpToNextStep}>
                    上次已登录跳到下一步
            </Button>
                </Col>}
            </Row>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>登录饿了么平台</h4>
          <p>
            Spider平台不会存储任何你的饿了么用户信息。这里要求登录，只是为了登录饿了么拿到获取数据的权限。
          </p>
        </div>
      </Fragment>
    );
  }
}

// 将models里面的状态转换成属性
const state2props = ({ configEleCrawler, loading }) => {
  return {
    ...configEleCrawler,
    loginLoading: loading.effects['configEleCrawler/loginEle'],
    getEleSmsCodeLoading: loading.effects['configEleCrawler/getEleSmsCode'],
    getElePicCodeLoading: loading.effects['configEleCrawler/getPicCode'],
  };
};

export default connect(state2props)(Step1);
