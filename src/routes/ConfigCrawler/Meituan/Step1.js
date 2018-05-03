import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './style.less';
import { Spin, Icon, Tabs, Input, notification, Col, Table, Button, message, Row } from 'antd'


const TabPane = Tabs.TabPane

class Step1 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedRestaurants: [],
      inputAddress: null,
      inputLocation: null
    }
  }

  onAddressInput = (e) => {
    this.setState({
      inputAddress: e.target.value
    })
  }

  onLocationInput = (e) => {
    this.setState({
      inputLocation: e.target.value
    })
  }

  commitLocation = () => {
    const { inputAddress, inputLocation } = this.state
    if (!inputAddress) {
      notification.error({
        description: '请输入地点',
        placement: 'bottomRight'
      })
      return
    }
    if (!inputLocation) {
      notification.error({
        description: '请先拾取坐标，然后粘贴坐标到输入框',
        placement: 'bottomRight'
      })
      return
    }
    const { dispatch } = this.props
    dispatch({
      type: 'configMeituanCrawler/fetchRestaurantList',
      address: inputAddress,
      lat_lng: inputLocation
    })
    message.config({
      top: 100
    })
    message.loading('正在爬取商家数据', 0)
  }

  onSelectRestaurants = (_, selectedRows) => {
    this.setState({
      selectedRestaurants: selectedRows
    })
  }

  backMap = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'configMeituanCrawler/backLocationPick'
    })
  }

  commitCrawlerTask = () => {

  }

  render() {
    const { loadingGetRestaurant, step1ActiveKey, restaurantList } = this.props
    const { selectedRestaurants } = this.state
    const baiduMap = (
      <iframe src='http://api.map.baidu.com/lbsapi/getpoint/index.html' width="100%" height="500px"></iframe>
    )
    const restaurantTableColumns = [
      {
        title: '店铺',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '评分',
        dataIndex: 'score',
        key: 'score'
      },
      {
        title: '配送时间',
        dataIndex: 'send_fee',
        key: 'send_fee'
      }, {
        title: 'Logo',
        dataIndex: 'img_src',
        render: (text, record) => (<img src={record.img_src} style={{ width: 60 }} />)
      }
    ]
    const restaurantRowSelection = {
      selectedRestaurants,
      onChange: this.onSelectRestaurants
    }
    return (
      <Fragment>
        <Tabs
          defaultActiveKey={step1ActiveKey}
          activeKey={step1ActiveKey}
          tabPosition='left'
          style={{ height: 700, overflow: 'auto' }}
        >
          <TabPane tab="拾取坐标" key="1">
            <div style={{ textAlign: 'center' }}>
              <h3>在坐标拾取系统搜索关键字，然后点击右侧复制按钮，最后将结果粘贴到下方输入框，提交。</h3>
              {baiduMap}
              <div style={{ margin: '0 0' }}>
                <Input.Group style={{ marginTop: 10 }}>
                  <Col span={5}>
                    <Input placeholder="地点名" onInput={this.onAddressInput} value='成都大学' />
                  </Col>
                  <Col span={8}>
                    <Input placeholder="粘贴坐标"
                      onInput={this.onLocationInput}
                      value='104.195018,30.656917' />
                  </Col>
                  <Col span={8}>
                    <Button onClick={this.commitLocation} type='primary' loading={loadingGetRestaurant}>爬取商家</Button>
                  </Col>
                </Input.Group>
              </div>
            </div>
          </TabPane>

          <TabPane tab="确定商家" key="2">
            <Table
              pagination={{
                pageSize: 6
              }}
              rowSelection={restaurantRowSelection}
              columns={restaurantTableColumns}
              dataSource={restaurantList.data} />
            <Row gutter={24}>
              <Col span={12}>
                <Button type="primary" onClick={this.commitCrawlerTask}>
                  提交任务
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={this.backMap}>重新选择地点</Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

const state2props = ({ configMeituanCrawler, loading }) => {
  return {
    ...configMeituanCrawler,
    loadingGetRestaurant: loading.effects['configMeituanCrawler/fetchRestaurantList']
  }
}

export default connect(state2props)(Step1);
