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
} from 'antd';
import numeral from 'numeral';
import { Pie, WaterWave, Gauge, TagCloud } from 'components/Charts';
import NumberInfo from 'components/NumberInfo';
import CountDown from 'components/CountDown';
import ActiveChart from 'components/ActiveChart';
import Authorized from '../../utils/Authorized';
import styles from './Monitor.less';
import { CRAWLER_TYPES } from '../../utils/const';
import { Link, routerRedux } from 'dva/router';

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

  render() {
    const { monitor, loading, crawlerListoading, dispatch } = this.props;
    const { crawlerPage, crawlerPerPage } = this.state;
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
            <a href="#"> {record.restaurant && record.restaurant.name}</a>{' '}
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
                dispatch(routerRedux.push(`/dashboard/analysis/${record.id}`));
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
              <Button disabled={record.status === 0}>删除</Button>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <Fragment>
        <Row style={{ marginBottom: 20 }}>
          <Card
            title="爬虫列表"
            bordered={false}
            loading={crawlerListoading}
            bodyStyle={{ padding: 32 }}
            extra={
              <Button
                loading={crawlerListoading}
                type="primary"
                shape="circle"
                icon="reload"
                onClick={() => this.fetchCrawlers(crawlerPage, crawlerPerPage)}
              />
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
            />
          </Card>
        </Row>
      </Fragment>
    );
  }
}
