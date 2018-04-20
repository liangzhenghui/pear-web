import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Table, Row, Col, Tag, Icon, notification, Popover } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';

const Search = Input.Search;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const choiceRestaurant = [{
  dataIndex: 'name',
  key: 'name',
  width: 300,
  render: (text, record) =>
    <Popover trigger='hover' title={record.name}
      placement="right"
      content={<div>
        <img style={{ maxWidth: 120, maxHeight: 120 }}
          src={`https://fuss10.elemecdn.com/${record.image_path.substring(0, 1)}/${record.image_path.substring(1, 3)}/${record.image_path.substring(3)}.${record.image_path.substring(32)}`} />
      </div>}
    >
      <div className={styles.chioceList}>
        <p style={{ color: "#333", marginBottom: 2 }}>{record.name}</p>
        <p style={{ fontSize: 8, color: "#999", marginBottom: 0 }}>{record.address}</p>
      </div>
    </Popover>
}]


@Form.create()
class Step2 extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      selectedArea: -1,
      selectedRestaurants: []
    }
  }

  handleSearch = (value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'configEleCrawler/getRestaurantArea',
      payload: {
        key: value
      }
    })
  }

  onClickAreaRow = (value, index) => {
    const { dispatch } = this.props
    this.setState({
      selectedArea: value.id
    })
    dispatch({
      type: 'configEleCrawler/getRestaurantInfo',
      payload: {
        geohash: value.geohash,
        latitude: value.latitude,
        longitude: value.longitude
      }
    })
  }

  onClickRestaurantRow = (value, index) => {
    const { selectedRestaurants } = this.state
    for (const item of selectedRestaurants) {
      if (value.id === item.id) {
        notification.warn({
          message: `${item.name} 已经被选择`
        })
        return
      }
    }
    this.setState({ 'selectedRestaurants': this.state.selectedRestaurants.concat([value]) })
  }

  deleteRstaurant = (item) => {
    const selectedRestaurants = this.state.selectedRestaurants.filter(restaurant => restaurant.id !== item.id)
    this.setState({
      selectedRestaurants
    })
  }

  render() {
    const { form, data, dispatch, submitting, searchRestaurantLoading, choiceReataurantNameLoading, restaurantArea, restaurantListOfArea } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { selectedArea, selectedRestaurants } = this.state

    const onPrev = () => {
      dispatch({ type: 'configEleCrawler/resetStep1' })
      dispatch(routerRedux.push('/configCrawler/ele'));
    };
    const choiceArea = [{
      title: '选择区域',
      dataIndex: 'city',
      key: 'restaurantArea',
      width: 300,
      render: (text, record) => <div className={record.id === selectedArea ? styles.selectedArea : styles.chioceList}>
        <p style={{ color: "#333", marginBottom: 2 }}>{record.name}</p>
        <p style={{ fontSize: 8, color: "#999", marginBottom: 0 }}>{record.address}</p>
      </div>
    }];
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };

    return (
      <Form layout="horizontal" className={styles.stepForm}
        style={{ margin: "60px auto 60px" }}>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="搜索商家">
          <Search
            placeholder="输入你要爬取的商家名/地址/"
            onSearch={this.handleSearch}
            enterButton />
        </Form.Item>

        <Form.Item>
          <Row gutter={16}>
            <Col span={9}>
              {/* 区域列表 */}
              <div className={styles.tableStyle}>
                <Table columns={choiceArea} dataSource={restaurantArea}
                  pagination={false} scroll={{ y: 500 }}
                  size="small"
                  showHeader={false}
                  loading={searchRestaurantLoading}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        this.onClickAreaRow(record, index)
                      }
                    }
                  }}
                >
                </Table>
              </div>
            </Col>

            <Col span={15}>
              {/* 商家列表 */}
              <Table
                className={styles.tableStyle}
                columns={choiceRestaurant} dataSource={restaurantListOfArea}
                pagination={false} scroll={{ y: 500 }}
                size="small"
                showHeader={false}
                loading={choiceReataurantNameLoading}
                onRow={(record, index) => {
                  return {
                    onClick: () => {
                      this.onClickRestaurantRow(record, index)
                    }
                  }
                }}
              >
              </Table>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          {selectedRestaurants.map(item => {
            return <Tag color='blue' key={item.id} closable onClose={() => this.deleteRstaurant(item)}>{item.name}</Tag>
          })}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const state2props = (state) => {
  return {
    ...state.configEleCrawler,
    searchRestaurantLoading: state.loading.effects['configEleCrawler/getRestaurantArea'],
    choiceReataurantNameLoading: state.loading.effects['configEleCrawler/getRestaurantInfo']
  }
}

export default connect(state2props)(Step2);
