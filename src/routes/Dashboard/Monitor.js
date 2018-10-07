import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Tooltip,
  Table,
  Spin,
  Progress,
  Icon,
  Pagination,
  Button,
  Popconfirm,
  Tag,
  Divider,
  notification
} from 'antd';
import numeral from 'numeral';
import { Pie, WaterWave, Gauge, TagCloud } from 'components/Charts';
import styles from './Monitor.less';
import { CRAWLER_TYPES } from '../../utils/const';
import { Link, routerRedux } from 'dva/router';
import vs from '../../assets/vs.png'

@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
  crawlerListoading: loading.effects['monitor/fetchCrawlers'],
  crawlerDeleteLoading: loading.effects['monitor/deleteCrawler'],
}))
export default class Monitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      crawlerPage: 1,
      crawlerPerPage: 8,
      selectedCrawlers: []
    };
  }

  componentDidMount() {
    this.fetchCrawlers(this.state.crawlerPage, this.state.crawlerPerPage);
  }

  fetchCrawlers = (page, perPage) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetchCrawlers',
      payload: {
        page: page,
        per_page: perPage,
      },
    });
    this.setState({
      selectedCrawlers: []
    })
  };

  handleCrawlerTablePageChange = (page, pageSize) => {
    this.setState({
      crawlerPage: page,
    });
    this.fetchCrawlers(page, pageSize);
  };

  handleDeleteCrawler = crawlerId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/deleteCrawler',
      crawlerId,
    });
  };

  fetchCrawlerStatus = crawlerId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetchCrawlerStatus',
      crawlerId,
    });
  };

  onSelectCrawler = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedCrawlers: selectedRows })
  }

  goProAnaly = () => {
    const { selectedCrawlers } = this.state
    const { dispatch } = this.props
    dispatch(routerRedux.push(`/analy/pro/${selectedCrawlers[0].id}/${selectedCrawlers[1].id}`))
  }

  render() {
    const { monitor, loading, crawlerListoading, dispatch } = this.props;
    const { crawlerPage, crawlerPerPage, selectedCrawlers } = this.state;
    const { crawlers } = monitor;
    const crawlerColumns = [
      { title: '序号', dataIndex: 'id', key: 'id' },
      {
        title: '爬取平台',
        dataIndex: 'type',
        key: 'source',
        render: text => <p>{text % 2 == 0 ? '美团外卖' : '饿了么'}</p>,
      },
      {
        title: '商家名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <p>
            <Link to={`/analy/normal/${record.id}`}> {record.restaurant && record.restaurant.name}</Link>
          </p>
        ),
      },
      { title: '爬取数据量', dataIndex: 'count', key: 'count' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <div>
            {record.status === 0 ? (
              <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
            ) : (
                <Progress
                  type="circle"
                  showInfo={true}
                  percent={100}
                  width={30}
                  status={record.status === 2 ? 'exception' : 'success'}
                />
              )}
          </div>
        ),
      },
      {
        title: '创建->完成时间',
        dataIndex: 'finished',
        key: 'finished',
        render: (text, record) => {
          return (
            <div>
              {record.created}
              <div>
                <Icon type="arrow-down" />
              </div>
              {record.finished}
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <div>
            <Button
              disabled={record.status !== 1}
              onClick={() => {
                dispatch(routerRedux.push(`/analy/normal/${record.id}`));
              }}
              type="primary"
              style={{ marginRight: 10 }}
            >
              查看
            </Button>
            <Popconfirm
              title="确定删除?(会删除爬取到的数据)"
              onConfirm={() => this.handleDeleteCrawler(record.id)}
            >
              {/* 0是进行中，1是成功，2是失败 */}
              <Button disabled={record.status === 0}>删除</Button>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const crawlerSelection = {
      selectedCrawlers,
      onChange: this.onSelectCrawler,
      hideDefaultSelections: true
    }

    return (
      <Fragment>
        <Card>
          {selectedCrawlers && selectedCrawlers.length == 2 ?
            <div>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center' }}>
                  <img
                    style={{ width: 200, height: 200 }}
                    src={selectedCrawlers[0].restaurant.image} />
                  <h2 style={{ marginTop: 16 }}>{selectedCrawlers[0].restaurant.name}</h2>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center' }}>
                  <img src={vs} style={{ width: 150, height: 150, margin: "24px 0" }} />
                  <p style={{ marginTop: 16 }}>平台：{selectedCrawlers[0].restaurant.source === 1 ? '饿了么' : '美团'} / {selectedCrawlers[1].restaurant.source === 1 ? '饿了么' : '美团'}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center' }}>
                  <img
                    style={{ width: 200, height: 200 }}
                    src={selectedCrawlers[1].restaurant.image} />
                  <h2 style={{ marginTop: 16 }}>{selectedCrawlers[1].restaurant.name}</h2>
                </Col>
              </Row>
              <div style={{ textAlign: 'center' }}>
                <Button type="primary" style={{ width: 300 }} onClick={this.goProAnaly}>对比分析</Button>
              </div>
            </div> :
            <h3>选择单个商家进行单独分析，选择两个商家进行对比分析</h3>
          }
        </Card>
        <Row style={{ marginTop: 20 }}>
          <Card
            title="爬虫列表"
            bordered={false}
            loading={crawlerListoading}
            bodyStyle={{ padding: 32 }}
            extra={
              <div>
                <Button
                  loading={crawlerListoading}
                  type="primary"
                  shape="circle"
                  icon="reload"
                  onClick={() => this.fetchCrawlers(crawlerPage, crawlerPerPage)}
                />
              </div>
            }
          >
            <Table
              columns={crawlerColumns}
              dataSource={crawlers.data}
              pagination={{
                pageSize: crawlerPerPage,
                total: crawlers.total,
                current: crawlerPage,
                defaultCurrent: crawlerPage,
                onChange: this.handleCrawlerTablePageChange,
              }}
              rowSelection={crawlerSelection}
            />
            <Divider style={{ margin: '40px 0 24px' }} />
            <div>
              <h3>说明</h3>
              <p>
                点击 [店铺名] 或 [查看] 可进入店铺详情分析。
                选择两家店铺可进行[对比分析]。
              </p>
            </div>
          </Card>
        </Row>
      </Fragment>
    );
  }
}
