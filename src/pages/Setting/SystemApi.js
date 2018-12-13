import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Divider,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {  formatMessage ,FormattedMessage } from 'umi/locale';
import styles from './SystemApi.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const CreateForm = Form.create()(props=>{
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return(
    <Modal
      destroyOnClose
      title={formatMessage({id:'system.api.modal.create'})}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={<FormattedMessage id="system.api.name" />}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 1 }],
        })(<Input placeholder={formatMessage({ id: 'global.input' })} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={<FormattedMessage id="system.api.address" />}>
        {form.getFieldDecorator('address', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 1 }],
        })(<Input placeholder={formatMessage({ id: 'global.input' })} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={<FormattedMessage id="system.api.method" />}>
        {form.getFieldDecorator('method', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 1 }],
        })(<Select placeholder={formatMessage({ id: 'global.select' })} style={{ width: '100%' }}>
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">POST</Option>
                  <Option value="DELETE">POST</Option>
                </Select>)}
      </FormItem>
    </Modal>
  );
})
 
/* eslint react/no-multi-comp:0 */
@connect(({ system_api, loading }) => ({
  system_api,
  loading: loading.models.system_apix,
}))
@Form.create()
class SystemApi extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
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
    {
      title: formatMessage({id:'system.api.operation'}),
      render: (text, record) => {
        if (record.is_active === true){
          return (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}><FormattedMessage id="system.api.update" defaultMessage="修改" /></a>
              <Divider type="vertical" />
              <a onClick={() => this.handleActiveAction(false, record)}><FormattedMessage id="system.api.forbidden" defaultMessage="禁用" /></a>
            </Fragment>
          )
        }else{
          return (
            <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}><FormattedMessage id="system.api.update" defaultMessage="修改" /></a>
            <Divider type="vertical" />
            <a onClick={() => this.handleActiveAction(true, record)}><FormattedMessage id="system.api.enable" defaultMessage="启用" /></a>
          </Fragment>
          )
        }
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system_api/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'system_api/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'system_api/fetch',
      payload: {},
    });
  };

 

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'system_api/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'system_api/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleActiveAction = (active,id)=>{

  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system_api/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system_api/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'system.api.name' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'global.input' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'global.status' })}>
              {getFieldDecorator('is_active')(
                <Select placeholder={formatMessage({ id: 'global.select' })} style={{ width: '100%' }}>
                  <Option value="0"><FormattedMessage id="system.api.enable" /></Option>
                  <Option value="1"><FormattedMessage id="system.api.forbidden" /></Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
              <FormattedMessage id="global.search" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              <FormattedMessage id="global.delete" />
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

 

  renderForm() {
    return   this.renderSimpleForm();
  }

  render() {
    const {
      system_api: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove"><FormattedMessage id="global.delete" /></Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title={formatMessage({ id: 'system.api.list' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              <FormattedMessage id="global.create" />
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                    <FormattedMessage id="global.more.operation" /> <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default SystemApi;
