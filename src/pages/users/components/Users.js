import { Table, Popconfirm, Pagination,Button } from 'antd'
import { connect } from 'dva'
import styles from './Users.css';
import { routerRedux } from 'dva/router';
import { PAGE_SIZE } from '../constants';
import UserModal from './UserModal'

const Test = ({ dispatch, list, total, loading, page: current }) => {
  function deleteHandler(id) {
    dispatch({
      type: 'users/remove',
      payload: id
    })
  }
  function createHandler(values) {

    dispatch({
      type: 'users/create',
      payload: values,
    })
  }

  function editHandler(id,values) {
    let data = { id,...values }
    //提交编辑后数据
    //return console.log(data)
    dispatch({
      type: 'users/patch',
      payload: { id, values }
    })
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname :'/users',
      query : { page }
    }))
  }

  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="">{text}</a>,
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: 'Website',
    dataIndex: 'website',
    key: 'address',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span className={styles.operation}>
        <UserModal record={record} onOk={ (values) => editHandler(record.id,values) }>
          <a>Edit</a>
        </UserModal>
        <Popconfirm title='确定删除它？' onConfirm={ () => deleteHandler(record.id) }>
           <a href="">Delete</a>
        </Popconfirm>
    </span>
    ),
  }];
  return (
    <div>
      <div className={styles.create}>
        <UserModal record={{}} onOk={ () => createHandler()}>
          <Button type='primary'>Create User</Button>
        </UserModal>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey='id'
        pagination={false}
      />
      <Pagination
        className="ant-table-pagination"
        total={total}
        current={current}
        pageSize={PAGE_SIZE}
        onChange={pageChangeHandler}
      />
    </div>
  )
}

function mapStateToProps(state) {
  const { list, total, page } = state.users
  return {
    list,
    total,
    page,
    loading: state.loading.models.users,
  }
}

export default connect(mapStateToProps)(Test)
