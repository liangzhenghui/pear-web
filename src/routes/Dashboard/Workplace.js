import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Card,
  List,
  Avatar,
  Button,
  Table,
  Divider,
  Progress,
  Icon,
  Popconfirm,
  Spin,
} from 'antd';

import { Radar } from 'components/Charts';
import EditableLinkGroup from 'components/EditableLinkGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { APP_NAME, CRAWLER_TYPES } from '../../utils/const';

import styles from './Workplace.less';

const columns = [
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
  {
    title: '数据类型',
    dataIndex: 'type',
    key: 'type',
    render: text => (
      <p>
        <a href="#">{CRAWLER_TYPES[text]}</a>
      </p>
    ),
  },
  { title: '爬取数据量', dataIndex: 'count', key: 'count' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <div style={{ textAlign: 'center' }}>
        {record.status === 0 ? (
          <Spin />
        ) : (
          <Progress
            type="circle"
            showInfo={true}
            width={50}
            status={record.status === 2 ? 'exception' : 'success'}
          />
        )}
      </div>
    ),
  },
  {
    title: '创建--完成时间',
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
        <Link to="">查看</Link>
        <Link to="">删除</Link>
      </div>
    ),
  },
];

@connect(({ activities, loading, user }) => ({
  activities: activities,
  activitiesLoading: loading.effects['activities/fetchList'],
  user: user.currentUser,
}))
export default class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activities/fetchList',
    });
  }

  componentWillUnmount() {}

  handleCreateEleCrawler = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/configCrawler/ele'));
  };

  handleCreateMeituanCrawler = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/configCrawler/meituan'));
  };

  render() {
    const { activitiesLoading, user } = this.props;

    const { visitor_count, used_days } = user;
    const { crawlers, actions } = this.props.activities;
    const crawlers_data = crawlers.data
      ? crawlers.data.map((value, index) => {
          return {
            ...value,
            key: index,
          };
        })
      : [];

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            className="avatar"
            style={{ backgroundColor: '#87d068', verticalAlign: 'middle', lineHeight: 4 }}
            icon="user"
            src=""
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            亲爱的 <span style={{ color: '#1890ff' }}>{user && user.name}</span> ，欢迎回来！
          </div>
          <div>
            今天是你使用{APP_NAME}的第 <span style={{ color: '#1890ff' }}>{used_days}</span>{' '}
            天，使用愉快！
          </div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>爬虫数</p>
          <p>{crawlers.crawler_total ? crawlers.crawler_total : 0}</p>
        </div>
        <div className={styles.statItem}>
          <p>累计访问次数</p>
          <p>{visitor_count ? visitor_count : 0}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.card_contentBtn}
              style={{ marginBottom: 24 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Button
                className={styles.card_BtnE}
                type="default"
                icon="plus"
                onClick={this.handleCreateEleCrawler}
              >
                新建饿了么爬虫
              </Button>
            </Card>
            <Card
              className={styles.card_contentBtn}
              style={{ marginBottom: 24 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Button
                className={styles.card_BtnM}
                type="default"
                icon="plus"
                onClick={this.handleCreateMeituanCrawler}
              >
                新建美团外卖爬虫
              </Button>
            </Card>
            {/* <Card bodyStyle={{ paddingTop: 12, paddingBottom: 12 }} bordered={false} title="团队">
              <div className={styles.members}>
                <Row gutter={48}>
                  {members.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.link}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.title}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card> */}
          </Col>
          <Col xl={18} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="爬虫列表"
              bordered={false}
              extra={<Link to="/dashboard/monitor">查看全部</Link>}
              loading={activitiesLoading}
              bodyStyle={{ padding: 32 }}
            >
              <Table columns={columns} dataSource={crawlers_data} pagination={false} />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
