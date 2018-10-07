import React, { Component } from 'react'
import { connect } from 'dva';
import { Spin, Card, Avatar, Icon } from 'antd';


class UserInfo extends Component {

    render() {
        const { user } = this.props

        return (<div>
            {user ?
                <Card style={{ width: 400, margin: "50px auto" }} bodyStyle={{ textAlign: 'center' }} extra={<a>编辑</a>}>
                    <Avatar size="large" style={{ backgroundColor: '#87d068' }}><Icon type="user" /></Avatar>
                    <p style={{ marginTop: 20 }}>用户名: {user.name}</p>
                    <p>手机号: {user.mobile}</p>
                    <p>邮  箱: {user.email}</p>
                    <p>密  码: ******</p>
                </Card>
                : <Spin />}
        </div>)
    }
}

export default connect(({ user }) => ({
    user: user.currentUser
}))(UserInfo);