import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  Spin,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TagCloud,
  TimelineChart,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Analysis.less';
import DescriptionList from '../../components/DescriptionList';
import spider from '../../assets/spider.jpg';
import ReactEcharts from 'echarts-for-react';
import { queryCrawlers } from '../../services/crawler';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Description } = DescriptionList;

@connect(({ chart, loading }) => ({
  chart,
  loadingWordCount: loading.effects['chart/fetchWordCount'],
}))
export default class Analysis extends Component {
  componentDidMount() {
    const { crawlerId } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetchCrawler',
      crawlerId,
    });
    dispatch({
      type: 'chart/fetchDishDistribution',
      crawlerId,
    });
    dispatch({
      type: 'chart/fetchWordCount',
      crawlerId,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  render() {
    const { chart, loadingWordCount } = this.props;
    const { crawlerData, analyDish, wordCount } = chart;

    if (!crawlerData || !analyDish) {
      return (
        <div>
          <Spin />
        </div>
      );
    }

    const { crawler, dish, rate, restaurant } = crawlerData;
    const { price_dis, rate_count_dis, rate_dis, sales_dis, rate_date_dis } = analyDish;

    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 8,
      style: { marginBottom: 24 },
    };

    const pageHeaderContent = (
      <DescriptionList size="small" col="3">
        <Description term="创建时间">{crawler.created}</Description>
        <Description term="完成时间">{crawler.finished}</Description>
        <Description term="数据量">{crawler.count}</Description>
        <Description term="平台">{crawler.source === 1 ? '饿了么' : '美团'}</Description>
        <Description term="商家">{restaurant.name}</Description>
      </DescriptionList>
    );

    const rateDistribution = rate_dis.map(item => {
      return {
        x: item.food_name,
        y: item.value,
      };
    });

    let ratePercent = {};
    rate_dis.map(item => {
      const scrore = item.value;
      const count = ratePercent[scrore];
      if (count !== undefined) {
        ratePercent[scrore] = ratePercent[scrore] + 1;
      } else {
        ratePercent[scrore] = 1;
      }
    });

    const ratePercentDistribution = Object.keys(ratePercent).map(key => {
      return {
        name: `${key}分`,
        value: ratePercent[key],
      };
    });

    const dishTableColumns = [
      {
        title: '菜名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: '平均评分',
        dataIndex: 'rating',
        key: 'rating',
        sorter: (a, b) => a.rating - b.rating,
      },
      {
        title: '月销量',
        dataIndex: 'moth_sales',
        key: 'moth_sales',
        sorter: (a, b) => a.moth_sales - b.moth_sales,
      },
    ];

    // 销量分布
    const salesOption = {
      title: {
        text: '各商品月销量',
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: sales_dis.map(item => {
          return item.food_name;
        }),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: sales_dis.map(item => {
          return item.food_name;
        }),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '月销量',
          type: 'bar',
          data: sales_dis.map(item => {
            return item.value;
          }),
        },
      ],
    };

    // 评分统计分布
    const rateScoreOption = {
      title: {
        text: '商品平均评分分布',
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true },
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}个商品 ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 20,
        data: ratePercentDistribution.map(item => {
          return item.name;
        }),
      },
      series: [
        {
          name: '评价得分',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: ratePercentDistribution,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    // 评论数随价格分布
    const rateCountWithPriceOption = {
      title: {
        text: '评论数随价格分布',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          name: '商品价格',
          data: price_dis.map(item => {
            return item.name;
          }),
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '评论数',
          min: 0,
          interval: 100,
          axisLabel: {
            formatter: '{value} 条',
          },
        },
      ],
      series: [
        {
          name: '评论数',
          type: 'line',
          data: price_dis.map(item => {
            return item.value;
          }),
        },
      ],
    };

    // 评论数随时间分布
    const rateCountWithDateOption = {
      title: {
        text: '评论数随日期分布',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          name: '日期',
          data: Object.keys(rate_date_dis),
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '评论数',
          min: 0,
          interval: 100,
          axisLabel: {
            formatter: '{value} 条',
          },
        },
      ],
      series: [
        {
          name: '评论数',
          type: 'line',
          data: Object.keys(rate_date_dis).map(key => {
            return rate_date_dis[key];
          }),
        },
      ],
    };

    return (
      <PageHeaderLayout
        title={`爬虫号: ${crawler.id}`}
        logo={<img src={spider} alt="spider" />}
        content={pageHeaderContent}
        extraContent={
          <div style={{ textAlign: 'center' }}>
            <img alt="" src={crawler.restaurant.image} style={{ width: 100 }} />
          </div>
        }
      >
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="月销量"
              action={
                <Tooltip title="月销量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={restaurant.sales}
              footer={
                <div>
                  <Field label="平均评分" value={`${restaurant.score} 分`} />
                </div>
              }
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="近3月评价数"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(rate.total).format('0,0')}
              footer={<Field label="月评价量" value={numeral(rate.total / 3).format('0,0')} />}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="商品种类"
              action={
                <Tooltip title="商家的商品种类数">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(dish.total).format('0,0')}
              footer={<Field label="最热销商品" value={sales_dis[0].food_name} />}
              contentHeight={46}
            />
          </Col>
        </Row>

        <Row style={{ marginBottom: 20 }}>
          <Card>
            <Table columns={dishTableColumns} dataSource={dish.data} />
          </Card>
        </Row>

        <Row style={{ marginBottom: 20 }}>
          <Card>
            <ReactEcharts option={salesOption} style={{ height: 600 }} />
          </Card>
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Card>
            <ReactEcharts option={rateScoreOption} style={{ height: 600 }} />
          </Card>
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Card>
            <ReactEcharts option={rateCountWithPriceOption} style={{ height: 600 }} />
          </Card>
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Card>
            <ReactEcharts option={rateCountWithDateOption} style={{ height: 600 }} />
          </Card>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Card loading={loadingWordCount}>
            <TagCloud
              data={Object.keys(wordCount).map(key => {
                return {
                  name: key,
                  value: wordCount[key] * 10000 + 20,
                };
              })}
              height={200}
            />
          </Card>
        </Row>
      </PageHeaderLayout>
    );
  }
}
