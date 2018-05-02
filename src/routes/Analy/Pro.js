import React, { Component } from 'react'
import styles from './Pro.less'
import { connect } from 'dva'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import { Card, Row, Col, Avatar, Spin, notification, Button, Icon } from 'antd'
import vs from '../../assets/vs.png'
import { Redirect } from 'react-router';
import ReactEcharts from 'echarts-for-react'
import DescriptionList from '../../components/DescriptionList'
import { routerRedux, Link } from 'dva/router'

const { Description } = DescriptionList

class AnalysisPro extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { crawlerId_1, crawlerId_2 } = this.props.match.params
        const { dispatch } = this.props
        if (crawlerId_1 && crawlerId_2) {
            dispatch({
                type: 'chart/doCompareTwoCrawler',
                crawlerId_1,
                crawlerId_2
            })
        }
    }

    render() {
        const {
            sales_compare_with_same_price,
            rate_compare_with_same_price,
            crawler_1,
            crawler_2,
            loadingData } = this.props
        if (loadingData == null || loadingData || !crawler_1 || !crawler_2) {
            return <Spin />
        }
        const pageHeaderContent = (
            <div style={{ marginTop: 16 }}>
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center' }}>
                        <img
                            style={{ width: 200, height: 200 }}
                            src={crawler_1.restaurant.image} />
                        <h2 style={{ marginTop: 16 }}>{crawler_1.restaurant.name}</h2>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center' }}>
                        <img src={vs} style={{ width: 150, height: 150, margin: "24px 0" }} />
                        <p style={{ marginTop: 16 }}>平台：{crawler_1.restaurant.source === 1 ? '饿了么' : '美团'} / {crawler_2.restaurant.source === 1 ? '饿了么' : '美团'}</p>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center' }}>
                        <img
                            style={{ width: 200, height: 200 }}
                            src={crawler_2.restaurant.image} />
                        <h2 style={{ marginTop: 16 }}>{crawler_2.restaurant.name}</h2>
                    </Col>
                </Row>
            </div>
        )

        const compareMonthSales = {
            title: {
                text: '月销量对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '12%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                name: '销量/个',
                type: 'value',
                boundaryGap: false,
                max: Math.max(crawler_1.restaurant.sales, crawler_2.restaurant.sales) + 20

            },
            yAxis: {
                type: 'category',
                name: '商家名称',
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            series: [
                {
                    name: "月销量",
                    type: 'bar',
                    barWidth: 24,
                    data: [crawler_1.restaurant.sales, crawler_2.restaurant.sales],
                    itemStyle: { color: "#597ef7" }
                },

            ]
        }

        const compareDishsLength = {
            title: {
                text: '商品数量对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '12%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                name: '数目/个',
                type: 'value',
                boundaryGap: false,
                max: Math.max(crawler_1.dishes.length, crawler_2.dishes.length) + 20
            },
            yAxis: {
                type: 'category',
                name: '商家名称',
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            series: [
                {
                    name: "商品数量",
                    type: 'bar',
                    barWidth: 24,
                    data: [crawler_1.dishes.length, crawler_2.dishes.length],
                    itemStyle: { color: "#ff7a45" }
                },
            ]
        }

        const getResurantAveragePrice = (restaurantDishes) => {
            /**
             * 获取商家商品平均价格
             * restaurantDishes 商家的所有商品 list
             * return 平均价格
             */
            let sum = 0
            for (const dish of restaurantDishes) {
                sum += dish.price
            }
            return (sum / restaurantDishes.length).toFixed(2) //精度为小数点后两位
        }
        const compareAveragePrice = {
            title: {
                text: '平均价格对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '12%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                name: '价格/元',
                type: 'value',
                boundaryGap: false,
                max: Math.max(getResurantAveragePrice(crawler_1.dishes), getResurantAveragePrice(crawler_2.dishes)) + 4
            },
            yAxis: {
                type: 'category',
                name: '商家名称',
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            series: [
                {
                    name: "平均价格",
                    type: 'bar',
                    barWidth: 24,
                    data: [getResurantAveragePrice(crawler_1.dishes), getResurantAveragePrice(crawler_2.dishes)],
                    itemStyle: { color: "#ffa940" }
                },
            ]
        }

        const compareSendFee = {
            title: {
                text: '起送费对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '12%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                name: '价格/元',
                type: 'value',
                boundaryGap: false,
                max: Math.max(crawler_1.restaurant.send_fee, crawler_2.restaurant.send_fee) + 20
            },
            yAxis: {
                type: 'category',
                name: '商家名称',
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            series: [
                {
                    name: "起送费",
                    type: 'bar',
                    barWidth: 24,
                    data: [crawler_1.restaurant.send_fee, crawler_2.restaurant.send_fee],
                    itemStyle: { color: "#ffcd3d" }
                },
            ]
        }

        const compareArriveTime = {
            title: {
                text: '平均配送时间对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '12%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                name: '时间/分',
                type: 'value',
                boundaryGap: false,
                max: Math.max(crawler_1.restaurant.arrive_time, crawler_2.restaurant.arrive_time) + 20
            },
            yAxis: {
                type: 'category',
                name: '商家名称',
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            series: [
                {
                    name: "平均配送时间",
                    type: 'bar',
                    barWidth: 24,
                    data: [crawler_1.restaurant.arrive_time, crawler_2.restaurant.arrive_time],
                    itemStyle: { color: "#36cfc9" }
                },
            ]
        }

        const compareScore = {
            title: {
                text: '平均评分对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '12%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                name: '评分/分',
                type: 'value',
                boundaryGap: false,
                max: Math.max(crawler_1.restaurant.score, crawler_2.restaurant.score) + 20
            },
            yAxis: {
                type: 'category',
                name: '商家名称',
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            series: [
                {
                    name: "平均评分",
                    type: 'bar',
                    barWidth: 24,
                    data: [crawler_1.restaurant.score, crawler_2.restaurant.score],
                    itemStyle: { color: "#40a9ff" }
                },
            ]
        }

        // 商品销量与价格对比
        const compareSalesOption = {
            title: {
                text: '商品销量与价格对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            legend: {
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            grid: [
                {
                    left: '5%',
                    right: '5%',
                    height: '35%'
                },
                {
                    left: '5%',
                    right: '5%',
                    top: '55%',
                    height: '35%'
                },
            ],
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: [{
                name: '价格/元',
                type: 'category',
                boundaryGap: false,
                data: sales_compare_with_same_price.a.map(item => {
                    return item.price
                })
            },
            {
                name: '价格/元',
                type: 'category',
                boundaryGap: false,
                data: sales_compare_with_same_price.b.map(item => {
                    return item.price
                }),
                gridIndex: 1,
                position: 'top'
            }],
            yAxis: [{
                type: 'value',
                name: `${crawler_1.restaurant.name}月销量`
            },
            {
                type: 'value',
                name: `${crawler_2.restaurant.name}月销量`,
                gridIndex: 1,
                inverse: true
            }],
            series: [
                {
                    name: crawler_1.restaurant.name,
                    type: 'line',
                    color: '#ff85c0',
                    symbol: 'circle',
                    // smooth: true,
                    data: sales_compare_with_same_price.a.map(item => {
                        return item.value
                    }),
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: crawler_2.restaurant.name,
                    type: 'line',
                    color: '#5cdbd3',
                    symbol: 'circle',
                    data: sales_compare_with_same_price.b.map(item => {
                        return item.value
                    }),
                    lineStyle: {
                        width: 3
                    },
                    xAxisIndex: 1,
                    yAxisIndex: 1
                }
            ]
        }

        // 商品评分与价格对比
        const compareRateOption = {
            title: {
                text: '商品评分与价格对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            legend: {
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            grid: [
                {
                    left: '5%',
                    right: '5%',
                    height: '35%'
                },
                {
                    left: '5%',
                    right: '5%',
                    top: '55%',
                    height: '35%'
                },
            ],
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: [{
                name: '价格/元',
                type: 'category',
                boundaryGap: false,
                data: sales_compare_with_same_price.a.map(item => {
                    return item.price
                })
            },
            {
                name: '价格/元',
                type: 'category',
                boundaryGap: false,
                data: sales_compare_with_same_price.b.map(item => {
                    return item.price
                }),
                gridIndex: 1,
                position: 'top'
            }],
            yAxis: [{
                type: 'value',
                name: `${crawler_1.restaurant.name}商品评分`
            },
            {
                type: 'value',
                name: `${crawler_2.restaurant.name}商品评分`,
                gridIndex: 1,
                inverse: true
            }],
            series: [
                {
                    name: crawler_1.restaurant.name,
                    type: 'line',
                    color: '#ffa39e',
                    symbol: 'circle',
                    data: rate_compare_with_same_price.a.map(item => {
                        return item.value
                    }),
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: crawler_2.restaurant.name,
                    type: 'line',
                    color: '#95de64',
                    symbol: 'circle',
                    data: rate_compare_with_same_price.b.map(item => {
                        return item.value
                    }),
                    lineStyle: {
                        width: 3
                    },
                    xAxisIndex: 1,
                    yAxisIndex: 1
                }
            ]
        }

        return (
            <PageHeaderLayout content={pageHeaderContent}>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Card bodyStyle={{ maxHeight: 250 }}>
                            <ReactEcharts option={compareMonthSales} style={{ height: 200 }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Card bodyStyle={{ maxHeight: 250 }}>
                            <ReactEcharts option={compareDishsLength} style={{ height: 200 }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Card bodyStyle={{ maxHeight: 250 }}>
                            <ReactEcharts option={compareAveragePrice} style={{ height: 200 }} />
                        </Card>
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: 24 }}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Card bodyStyle={{ maxHeight: 250 }}>
                            <ReactEcharts option={compareSendFee} style={{ height: 200 }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Card bodyStyle={{ maxHeight: 250 }}>
                            <ReactEcharts option={compareArriveTime} style={{ height: 200 }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Card bodyStyle={{ maxHeight: 250 }}>
                            <ReactEcharts option={compareScore} style={{ height: 200 }} />
                        </Card>
                    </Col>
                </Row>

                <Row style={{ marginTop: 24 }} >
                    <Card>
                        <ReactEcharts option={compareSalesOption} style={{ height: 600 }} />
                    </Card>
                </Row>
                <Row style={{ marginTop: 24 }}>
                    <Card>
                        <ReactEcharts option={compareRateOption} style={{ height: 600 }} />
                    </Card>
                </Row>
            </PageHeaderLayout>
        )
    }
}

const state2proprs = ({ chart, loading }) => {
    return {
        ...chart.compareData,
        loadingData: loading.effects['chart/doCompareTwoCrawler']
    }
}

const dispatch2props = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(state2proprs, dispatch2props)(AnalysisPro)