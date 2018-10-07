import React, { Component } from 'react'
import Task from './Task'
import { connect } from 'dva'

export default connect()(class Multi extends Component {

    render() {
        return (
            <Task analyType={2} title="对比分析历史记录" />
        )
    }
})
