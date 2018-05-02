import React, { Component } from 'react'
import Task from './Task'
import { connect } from 'dva'

class Signle extends Component {

    render() {
        return (
            <Task analyType={1} title="单独分析历史记录" />
        )
    }
}

export default connect()(Signle)