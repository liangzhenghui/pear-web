import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tooltip, Table, Spin, Progress, Icon, Pagination } from 'antd';
import numeral from 'numeral';
import { Pie, WaterWave, Gauge, TagCloud } from 'components/Charts';
import NumberInfo from 'components/NumberInfo';
import CountDown from 'components/CountDown';
import ActiveChart from 'components/ActiveChart';
import Authorized from '../../utils/Authorized';
import styles from './Monitor.less';
import { CRAWLER_TYPES } from '../../utils/const'

const { Secured } = Authorized;

const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});

const crawlerColumns = [
  { title: '序号', dataIndex: 'id', key: 'id' },
  {
    title: '爬取平台', dataIndex: 'type', key: 'source', render: (text) =>
      <p>{text % 2 == 0 ? '美团外卖' : '饿了么'}</p>
  },
  { title: '商家名称', dataIndex: 'name', key: 'name', render: (text, record) => <p><a href="#"> {record.restaurant.name}</a> </p> },
  { title: '数据类型', dataIndex: 'type', key: 'type', render: (text) => <p><a href="#">{CRAWLER_TYPES[text]}</a></p> },
  { title: '爬取数据量', dataIndex: 'count', key: 'count' },
  {
    title: '状态', dataIndex: 'status', key: 'status', render: (text, record) =>
      <div style={{ textAlign: 'center' }}>
        {record.status === 0 ? <Spin /> :
          <Progress type="circle" showInfo={true} width={50} status={record.status === 2 ? 'exception' : 'success'} />
        }
      </div>
  },
  {
    title: '创建--完成时间', dataIndex: 'finished', key: 'finished', render: (text, record) => {
      return <div>{record.created}<div><Icon type="arrow-down" /></div>{record.finished}</div>
    }
  },
  { title: '操作', dataIndex: 'action', key: 'action' }
]

@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
  crawlerListoading: loading.effects['monitor/fetchCrawlers']
}))
export default class Monitor extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      crawlerPage: 1,
      crawlerPerPage: 5
    }
  }

  componentDidMount() {
    const { crawlerPage, crawlerPerPage } = this.state
    this.fetchCrawlers(crawlerPage, crawlerPerPage)
  }

  fetchCrawlers = (page, perPage) => {
    const { dispatch } = this.props
    dispatch({
      type: 'monitor/fetchCrawlers',
      payload: {
        page: page,
        per_page: perPage
      }
    })
  }

  handleCrawlerTablePageChange = (page, pageSize) => {    
    this.setState({
      crawlerPage: page
    })
    this.fetchCrawlers(page, pageSize)
  }

  render() {
    const { monitor, loading, crawlerListoading } = this.props;
    const { crawlerPage, crawlerPerPage } = this.state
    const { tags, crawlers } = monitor;

    return (
      <Fragment>
        <Row style={{ marginBottom: 20 }}>
          <Card
            title="爬虫列表"
            bordered={false}
            loading={crawlerListoading}
            bodyStyle={{ padding: 32 }}
          >
            <Table
              columns={crawlerColumns}
              dataSource={crawlers.data}
              pagination={{
                pageSize: crawlers.per_page,
                total: crawlers.total,
                current: crawlerPage,
                defaultCurrent: crawlerPage,
                onChange: this.handleCrawlerTablePageChange
              }}
            />
          </Card>
        </Row>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="活动实时交易情况" bordered={false}>
              <Row>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="今日交易总额"
                    suffix="元"
                    total={numeral(124543233).format('0,0')}
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo subTitle="销售目标完成率" total="92%" />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo subTitle="活动剩余时间" total={<CountDown target={targetTime} />} />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="每秒交易总额"
                    suffix="元"
                    total={numeral(234).format('0,0')}
                  />
                </Col>
              </Row>
              <div className={styles.mapChart}>
                <Tooltip title="等待后期实现">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/HBWnDEUXCnGnGrRfrpKa.png"
                    alt="map"
                  />
                </Tooltip>
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card title="活动情况预测" style={{ marginBottom: 24 }} bordered={false}>
              <ActiveChart />
            </Card>
            <Card
              title="券核效率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <Gauge title="跳出率" height={180} percent={87} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={12} lg={24} sm={24} xs={24}>
            <Card title="各品类占比" bordered={false} className={styles.pieCard}>
              <Row style={{ padding: '16px 0' }}>
                <Col span={8}>
                  <Pie
                    animate={false}
                    percent={28}
                    subTitle="中式快餐"
                    total="28%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#5DDECF"
                    percent={22}
                    subTitle="西餐"
                    total="22%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#2FC25B"
                    percent={32}
                    subTitle="火锅"
                    total="32%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24}>
            <Card
              title="热门搜索"
              loading={loading}
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={tags} height={161} />
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24}>
            <Card
              title="资源剩余"
              bodyStyle={{ textAlign: 'center', fontSize: 0 }}
              bordered={false}
            >
              <WaterWave height={161} title="补贴资金剩余" percent={34} />
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
