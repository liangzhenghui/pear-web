import React, { Component } from 'react'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import { Card, List, Row, Col, Tag, Avatar, Icon, Button } from 'antd'
import ReactEcharts from 'echarts-for-react';

class Task extends Component {

    componentWillMount() {
        const { dispatch, analyType } = this.props
        dispatch({
            type: 'chart/fetchHistory',
            analyType: analyType
        })
    }

    jumpToAnalyse = (path) => {
        const { dispatch } = this.props
        dispatch(routerRedux.push(path))
    }

    render() {
        const histoyData = this.props.data
        const { loading, title } = this.props

        return (
            <div>
                <Card style={{ marginBottom: 20 }} bodyStyle={{ textAlign: "center" }}>
                    <h3>进入监控列表，分析更多商家</h3>
                    <Button type='primary'>
                        <Link to="/dashboard/monitor">进入</Link>
                    </Button>
                </Card>
                <Card title={title || "数据分析历史记录"} loading={loading}>
                    {
                        histoyData &&
                        <List
                            dataSource={histoyData}
                            renderItem={item => {
                                const { data, created, type, id, key, crawler_one } = item
                                if (type === 1) {
                                    const { sales_dis } = data
                                    // 销量统计
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
                                                itemStyle: {
                                                    color: '#69c0ff'
                                                }
                                            },
                                        ],
                                    }
                                    return (
                                        <Card key={key} style={{ marginBottom: 10 }}
                                            title={<div>
                                                {id}
                                                <Avatar src={data.restaurant.image} shape="square" style={{ marginLeft: 3, marginRight: 5 }} />{data.restaurant.name}
                                                <Tag color="blue">单独分析</Tag>
                                                <Tag>{created}</Tag>
                                            </div>}
                                            extra={<Button onClick={() => this.jumpToAnalyse(`/analy/normal/${crawler_one}`)}>查看更多</Button>}
                                        >
                                            <Row>
                                                <ReactEcharts option={salesOption} style={{ height: 300, marginTop: 10 }} />
                                            </Row>
                                        </Card>)
                                } else if (type === 2) {
                                    const { crawler_1, crawler_2, sales_compare_with_same_price } = data
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

                                                data: sales_compare_with_same_price.a.map(item => {
                                                    return item.value
                                                })
                                            },
                                            {
                                                name: crawler_2.restaurant.name,
                                                type: 'line',

                                                data: sales_compare_with_same_price.b.map(item => {
                                                    return item.value
                                                }),
                                                xAxisIndex: 1,
                                                yAxisIndex: 1
                                            }
                                        ]
                                    }
                                    return (
                                        <Card key={key} style={{ marginBottom: 10 }}
                                            title={<div>
                                                {id}
                                                <Avatar src={crawler_1.restaurant.image} shape="square" style={{ marginLeft: 3, marginRight: 5 }} />
                                                {crawler_1.restaurant.name}
                                                <Icon type="minus" />
                                                <Avatar src={crawler_2.restaurant.image} shape="square" style={{ marginLeft: 3, marginRight: 5 }} />
                                                {crawler_2.restaurant.name}
                                                <Tag color="purple">对比分析</Tag>
                                                <Tag>{created}</Tag>
                                            </div>}
                                            extra={<Link to={`pro/${crawler_1.id}/${crawler_2.id}`} replace={true}>查看更多</Link>}
                                        >
                                            <Row gutter={5}>
                                                <ReactEcharts option={compareSalesOption} style={{ height: 300, marginTop: 10 }} />
                                            </Row>
                                        </Card>)
                                }
                                return <div key={key}></div>
                            }}
                        />
                    }
                </Card>
            </div>
        )
    }
}


const state2props = (state) => {
    return {
        ...state.chart.history,
        loading: state.loading.effects['chart/fetchHistory']
    }
}

export default connect(state2props)(Task)
