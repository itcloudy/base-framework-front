import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage  } from 'umi/locale';
import StandardTable from '@/components/StandardTable';

import styles from './SystemApi.less';

import {
  Row,
  Col,
  Card,
} from 'antd';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class SystemApiList extends PureComponent{
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: formatMessage({id:'system.api.name'}),
      dataIndex: 'name',
    },
    {
      title: formatMessage({id:'system.api.address'}),
      dataIndex: 'address',
    },
    {
      title: formatMessage({id:'system.api.method'}),
      dataIndex: 'method',
    },
    {
      title: formatMessage({id:'system.api.display'}),
      dataIndex: 'display',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system_api/fetch',
    });
  }
  render() {
    console.log(list);
    console.log(loading);
    return (
      <PageHeaderWrapper title={formatMessage({ id: 'system.api.list' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SystemApi;