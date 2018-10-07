import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './style.less';
import { Spin, Icon, Tabs, Input, notification, Col, Table, Button, message, Row, List } from 'antd'


const TabPane = Tabs.TabPane

class Step1 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedRestaurants: [],
      inputAddress: null,
      inputLocation: null,
      addLocations: []
    }
  }
  // e：输入框输入时的事件
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
    const location = {
      'address': inputAddress,
      'lng_lat': inputLocation
    }
    const { addLocations } = this.state
    let flag = false
    addLocations.forEach(item => {
      if (item.address === inputAddress && item.lng_lat === inputLocation) {
        flag = true
        return
      }
    })
    if (flag) {
      notification.info({
        message: `${inputAddress} 已经添加`,
        placement: 'bottomRight'
      })
      return
    }
    this.setState({
      addLocations: addLocations.concat([location])
    })
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
    const { addLocations } = this.state
    if (addLocations.length < 1) {
      notification.error({
        message: '已添加坐标为空',
        placement: 'bottomRight',
        description: '请先添加坐标'
      })
      return
    }
    const { dispatch } = this.props
    dispatch({
      type: 'configMeituanCrawler/commitCrawlerTask',
      payload: addLocations
    })
  }

  removeAddedLocation = (item) => {
    const { addLocations } = this.state
    this.setState({
      addLocations: addLocations.filter(location => !(location.address === item.address && location.lng_lat === item.lng_lat))
    })
  }

  render() {
    const { loadingGetRestaurant, restaurantList, loadingCommitTask } = this.props
    const { selectedRestaurants, addLocations } = this.state
    const baiduMap = (
      <iframe src='http://api.map.baidu.com/lbsapi/getpoint/index.html' width="100%" height="600px"></iframe>
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
        <div style={{ textAlign: 'center' }}>
          <h3>在坐标拾取系统搜索关键字，然后点击右侧复制按钮，最后将结果粘贴到下方输入框，提交。</h3>
          <Row gutter={10}>
            <Col xs={24} sm={24} md={24} lg={18}>
              {baiduMap}
            </Col>
            <Col xs={24} sm={24} md={24} lg={6}>
              <div style={{ padding: 5, maxHeight: 600, overflow: 'auto' }}>
                <Input.Group style={{ marginBottom: 10 }}>
                  <Col span={8}>
                    <Input placeholder="地点名" onInput={this.onAddressInput} />
                  </Col>
                  <Col span={12}>
                    <Input placeholder="粘贴坐标"
                      onInput={this.onLocationInput} />
                  </Col>
                  <Col span={4}>
                    <Button onClick={this.commitLocation} size='small' type='primary' loading={loadingGetRestaurant}>添加</Button>
                  </Col>
                </Input.Group>
                <List
                  header={<h3>已添加坐标</h3>}
                  size="small"
                  bordered
                  dataSource={addLocations}
                  renderItem={
                    item => (<List.Item>{`${item.address}: ${item.lng_lat}`} <Button size='small' onClick={() => this.removeAddedLocation(item)}>删除</Button></List.Item>)
                  }
                />
              </div>
            </Col>
          </Row>
          <Button style={{ marginTop: 10 }} size='large' type="primary"
            loading={loadingCommitTask}
            onClick={this.commitCrawlerTask}>提交</Button>
        </div>
      </Fragment>
    );
  }
}

const state2props = ({ configMeituanCrawler, loading }) => {
  return {
    ...configMeituanCrawler,
    loadingGetRestaurant: loading.effects['configMeituanCrawler/fetchRestaurantList'],
    loadingCommitTask: loading.effects['configMeituanCrawler/commitCrawlerTask']
  }
}

export default connect(state2props)(Step1);
