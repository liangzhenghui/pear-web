import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Alert,
  Divider,
  Table,
  Row,
  Col,
  Tag,
  Icon,
  notification,
  Popover,
  Spin,
  Select,
  List,
  Modal,
  Tooltip,
} from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';

const Search = Input.Search;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const choiceRestaurant = [
  {
    dataIndex: 'name',
    key: 'name',
    width: 300,
    render: (text, record) => (
      <Popover
        trigger="hover"
        title={record.name}
        placement="right"
        content={
          <div>
            <img
              style={{ maxWidth: 120, maxHeight: 120 }}
              src={`https://fuss10.elemecdn.com/${record.image_path.substring(0, 1)}/${record.image_path.substring(1, 3)}/${record.image_path.substring(3)}.${record.image_path.substring(32)}`}
            />
          </div>
        }
        key={record.id}
      >
        <div className={styles.chioceList}>
          <p style={{ color: '#333', marginBottom: 2 }}>{record.name}</p>
          <p style={{ fontSize: 8, color: '#999', marginBottom: 0 }}>{record.address}</p>
        </div>
      </Popover>
    ),
  },
];

@Form.create()
class Step2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedArea: null,
      selectedRestaurants: [],
      offset: 0,
      limit: 24,
      searchKey: null,
      modalVisible: false,
      selectedCity: null,
      filterCities: [],
      visibleCityListPop: false,
    };
  }

  componentWillMount() {
    const { cities } = this.props
    if (!cities) {
      this.fetchCities();
    }
  }

  handleSearch = value => {
    const { dispatch } = this.props;
    const { selectedCity } = this.state;
    if (!selectedCity) {
      notification.error({
        message: '请先选择城市',
      });
      return;
    }
    this.setState({
      searchKey: value,
    });
    dispatch({
      type: 'configEleCrawler/getRestaurantArea',
      payload: {
        key: value,
        lat: selectedCity.latitude,
        lng: selectedCity.longitude,
      },
    });
  };

  selectCity = city => {
    this.setState({
      selectedCity: city,
      visibleCityListPop: false,
    });
  };

  handleCityListPopVisibleChange = visible => {
    this.setState({
      visibleCityListPop: visible,
    });
  };

  onClickAreaRow = (value, index) => {
    const { dispatch } = this.props;
    this.setState({
      selectedArea: value,
      offset: 0,
    });
    dispatch({
      type: 'configEleCrawler/getRestaurantInfo',
      payload: {
        geohash: value.geohash,
        latitude: value.latitude,
        longitude: value.longitude,
      },
    });
  };

  loadMoreRestaurants = () => {
    const { offset, limit, selectedArea } = this.state;
    const { dispatch } = this.props;
    const newOffset = offset + limit;
    dispatch({
      type: 'configEleCrawler/getRestaurantInfo',
      payload: {
        geohash: selectedArea.geohash,
        latitude: selectedArea.latitude,
        longitude: selectedArea.longitude,
        offset: newOffset,
      },
    });
    this.setState({
      offset: newOffset,
    });
  };

  onClickRestaurantRow = (value, index) => {
    const { selectedRestaurants } = this.state;
    for (const item of selectedRestaurants) {
      if (value.id === item.id) {
        notification.warn({
          message: `${item.name} 已经被选择`,
        });
        return;
      }
    }
    this.setState({ selectedRestaurants: this.state.selectedRestaurants.concat([value]) });
  };

  deleteRstaurant = item => {
    const selectedRestaurants = this.state.selectedRestaurants.filter(
      restaurant => restaurant.id !== item.id
    );
    this.setState({
      selectedRestaurants,
    });
  };

  commitTask = () => {
    const { selectedRestaurants, selectedArea } = this.state;
    if (!selectedArea || selectedRestaurants.length === 0) {
      notification.error({
        message: '请选择商家',
      });
      return;
    }
    const payload = selectedRestaurants.map(item => {
      return {
        latitude: selectedArea.latitude,
        longitude: selectedArea.longitude,
        restaurant: {
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude
        },
      };
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'configEleCrawler/commitTask',
      payload: payload,
    });
  };

  fetchCities = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configEleCrawler/fetchCities',
    });
  };

  setModalVisible = modalVisible => {
    this.setState({ modalVisible });
  };

  filterCities = event => {
    const cityKey = event.target.value;
    const { cities } = this.props;
    const newCities = cities.filter(
      item => item.name.indexOf(cityKey) > -1 || item.pinyin.indexOf(cityKey) > -1
    );
    this.setState({
      filterCities: newCities,
    });
  };

  render() {
    const { dispatch, searchRestaurantLoading, choiceReataurantNameLoading, commitTaskLoading, fetchCitiesLoading, restaurantArea, restaurantListOfArea, cities, } = this.props;
    const {
      selectedArea,
      selectedRestaurants,
      restaurantsPagination,
      filterCities,
      selectedCity,
      visibleCityListPop,
    } = this.state;
    const onPrev = () => {
      dispatch({ type: 'configEleCrawler/resetStep1' });
      dispatch(routerRedux.push('/configCrawler/ele'));
    };
    const choiceArea = [
      {
        title: '选择区域',
        dataIndex: 'city',
        key: 'city',
        width: 300,
        render: (text, record) => (
          <div
            className={
              selectedArea && record.id === selectedArea.id
                ? styles.selectedArea
                : styles.chioceList
            }
          >
            <p style={{ color: '#333', marginBottom: 2 }}>{record.name}</p>
            <p style={{ fontSize: 8, color: '#999', marginBottom: 0 }}>{record.address}</p>
          </div>
        ),
      },
    ];
    return (
      <Form layout="horizontal" className={styles.stepForm} style={{ margin: '60px auto 30px' }}>
        <Form.Item {...formItemLayout} className={styles.stepFormText} wrapperCol={{ span:24 }}>
          <Popover
            title=""
            placement="bottomLeft"
            trigger="click"
            visible={visibleCityListPop}
            onVisibleChange={this.handleCityListPopVisibleChange}
            content={
              <div style={{
                width: 700,
                maxHeight: 400,
                overflow: 'auto',
                overflowX: 'hidden',
                padding: 5
              }}>
                <Search
                  placeholder="输入城市名过滤"
                  style={{ width: 200, marginBottom: 10 }}
                  onChange={this.filterCities}
                />
                <List
                  grid={{ column: 6 }}
                  dataSource={filterCities.length > 0 ? filterCities : cities}
                  renderItem={item => (
                    <List.Item>
                      <Tooltip title={item.name} >
                        <Button type='dashed' onClick={() => this.selectCity(item)}>{item.name.length > 3 ? item.name.substring(0, 3) + '...' : item.name}</Button>
                      </Tooltip>
                    </List.Item>
                  )}
                />
              </div>
            }
          >
            {fetchCitiesLoading ? <Spin /> :
              <Button style={{ width: "14%", }}>{selectedCity ? selectedCity.name : '选择城市'}<span style={{ marginLeft: 5 }} ><Icon type="down" /></span></Button>
            }
          </Popover>
          <Search
            style={{ width: '86%' }}
            // addonBefore={selectedCity ? selectedCity.name : '选择城市'}
            placeholder="输入你要爬取的商圈（可输入省、市、区、县、镇、乡、街道等）"
            onSearch={this.handleSearch}
            enterButton
          />

        </Form.Item>
        {searchRestaurantLoading && (
          <Form.Item>
            <Spin />
          </Form.Item>
        )}
        <Form.Item>
          <Row gutter={16}>
            <Col span={9}>
              {/* 区域列表 */}
              <div className={styles.tableStyle}>
                {restaurantArea.length > 0 && (
                  <Table
                    columns={choiceArea}
                    dataSource={restaurantArea}
                    pagination={false}
                    scroll={{ y: 500 }}
                    size="small"
                    showHeader={false}
                    loading={searchRestaurantLoading}
                    onRow={(record, index) => {
                      return {
                        onClick: () => {
                          this.onClickAreaRow(record, index);
                        },
                      };
                    }}
                  />
                )}
              </div>
            </Col>

            {(restaurantArea.length > 0) & (restaurantListOfArea.length > 0) && (
              <Col span={15}>
                {/* 商家列表 */}
                <Table
                  className={styles.tableStyle}
                  columns={choiceRestaurant}
                  dataSource={restaurantListOfArea}
                  pagination={false}
                  scroll={{ y: 500 }}
                  size="small"
                  showHeader={false}
                  loading={choiceReataurantNameLoading}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        this.onClickRestaurantRow(record, index);
                      },
                    };
                  }}
                  footer={() => (
                    <Button
                      style={{ margin: '0 141px' }}
                      onClick={this.loadMoreRestaurants}
                      loading={choiceReataurantNameLoading}
                      disabled={restaurantListOfArea.length === 0}
                    >
                      点击加载更多
                    </Button>
                  )}
                />
              </Col>
            )}
          </Row>
        </Form.Item>

        <Form.Item>
          {selectedRestaurants.map(item => {
            return (
              <Tag color="blue" key={item.id} closable onClose={() => this.deleteRstaurant(item)}>
                {item.name}
              </Tag>
            );
          })}
        </Form.Item>
        <Form.Item style={{ margin: '0 269px' }}>
          <Button
            type="primary"
            onClick={this.commitTask}
            loading={commitTaskLoading}
            style={{ marginRight: 16 }}
          >
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const state2props = state => {
  return {
    ...state.configEleCrawler,
    searchRestaurantLoading: state.loading.effects['configEleCrawler/getRestaurantArea'],
    choiceReataurantNameLoading: state.loading.effects['configEleCrawler/getRestaurantInfo'],
    commitTaskLoading: state.loading.effects['configEleCrawler/commitTask'],
    fetchCitiesLoading: state.loading.effects['configEleCrawler/fetchCities'],
  };
};

export default connect(state2props)(Step2);
