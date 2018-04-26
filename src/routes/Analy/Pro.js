import React, { Component } from 'react'
import styles from './Pro.less'
import { connect } from 'dva'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import { Card, Row, Col, Avatar, Spin } from 'antd'
import vs from '../../assets/vs.png'
import { Redirect } from 'react-router';
import ReactEcharts from 'echarts-for-react'
import DescriptionList from '../../components/DescriptionList'

const { Description } = DescriptionList

class AnalysisPro extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const { crawlerId_1, crawlerId_2 } = this.props.match.params
        const { dispatch } = this.props
        dispatch({
            type: 'chart/doCompareTwoCrawler',
            crawlerId_1,
            crawlerId_2
        })
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
            <div>
                <Row gutter={24}>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <img
                            style={{ width: 200 }}
                            src={crawler_1.restaurant.image} />
                        <h2>{crawler_1.restaurant.name}</h2>
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <img src={vs} style={{ width: 100, marginTop: 30 }} />
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <img
                            style={{ width: 200 }}
                            src={crawler_2.restaurant.image} />
                        <h2>{crawler_2.restaurant.name}</h2>
                    </Col>
                </Row>
                <DescriptionList size="samll" col="3">
                    <Description term="平台:">
                        {crawler_1.restaurant.source === 1 ? '饿了么' : '美团'} / {crawler_2.restaurant.source === 1 ? '饿了么' : '美团'}
                    </Description>
                    <Description term="月销量对比">
                        {crawler_1.restaurant.sales} / {crawler_2.restaurant.sales}
                    </Description>
                    <Description term="评分对比">
                        {crawler_1.restaurant.score} / {crawler_2.restaurant.score}
                    </Description>
                    <Description term="商品数对比">
                        {crawler_1.dishes.length} / {crawler_2.dishes.length}
                    </Description>
                    <Description term="配送时间对比">
                        {crawler_1.restaurant.arrive_time} / {crawler_2.restaurant.arrive_time}
                    </Description>
                    <Description term="起送费对比">
                        {crawler_1.restaurant.send_fee} / {crawler_2.restaurant.send_fee}
                    </Description>
                </DescriptionList>
            </div>
        )

        const compareSalesOption = {
            title: {
                text: '商品销量与价格对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            grid: {
                left: '3%',
                right: '4%',
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
                type: 'category',
                boundaryGap: false,
                data: sales_compare_with_same_price.a.map(item => {
                    return item.price
                })
            },
            yAxis: {
                type: 'value',
                name: '月销量',
                max: sales_compare_with_same_price.max_sale + 20
            },
            series: [
                {
                    name: crawler_1.restaurant.name,
                    type: 'line',
                    stack: '月销量',
                    data: sales_compare_with_same_price.a.map(item => {
                        return item.value
                    })
                },
                {
                    name: crawler_2.restaurant.name,
                    type: 'line',
                    stack: '月销量',
                    data: sales_compare_with_same_price.b.map(item => {
                        return item.value
                    })
                }
            ]
        }
        const compareRateOption = {
            title: {
                text: '商品评分与价格对比'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [crawler_1.restaurant.name, crawler_2.restaurant.name]
            },
            grid: {
                left: '3%',
                right: '4%',
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
                type: 'category',
                boundaryGap: false,
                data: rate_compare_with_same_price.a.map(item => {
                    return item.price
                })
            },
            yAxis: {
                type: 'value',
                name: '平均评分',
                max: 6
            },
            series: [
                {
                    name: crawler_1.restaurant.name,
                    type: 'line',
                    stack: '平均评分',
                    data: rate_compare_with_same_price.a.map(item => {
                        return item.value
                    })
                },
                {
                    name: crawler_2.restaurant.name,
                    type: 'line',
                    stack: '平均评分',
                    data: rate_compare_with_same_price.b.map(item => {
                        return item.value
                    })
                }
            ]
        }

        return (
            <PageHeaderLayout
                content={pageHeaderContent}>
                <Row>
                    <Card>
                        <ReactEcharts option={compareSalesOption} style={{ height: 300 }} />
                    </Card>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Card>
                        <ReactEcharts option={compareRateOption} style={{ height: 300 }} />
                    </Card>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Card>
                        <ReactEcharts option={compareRateOption} style={{ height: 300 }} />
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