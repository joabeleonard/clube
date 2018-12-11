import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Radio, Table } from 'antd'
import './Cliente.css';
import {
  Link,
  withRouter
} from 'react-router-dom';

const FormItem = Form.Item;

const Search = Input.Search;

class Clientes extends Component{

    constructor(){
        super();
        this.state = {
            formLayout: 'vertical',
            search: ''};
    }
    render(){
        const { formLayout } = this.state;

        const layoutProps = { [formLayout]: true };

        const formItemLayout = formLayout === 'horizontal' ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          } : null;
          const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: { span: 14, offset: 4 },
          } : null;

          let button = null

          const columns = [{
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <strong>{text}</strong>,
          }, {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdateUser(record)}>Edit</a>
                <span className="ant-divider" />
                <a onClick={()=>this.handleDeleteUser(record)}>Delete</a>
              </span>
            ),
          }];
        return  <div className="new-client-container">
         <h1 className="page-title">Gerenciamento de Clientes</h1>
         <Form  layout="inline">
         
          <FormItem >
          <Search
      placeholder="Pesquisar"
      onSearch={value => console.log(value)}
      enterButton
    />
          
          </FormItem>
          <FormItem >
          <Button type="primary">
          <Link to="/client/new">Novo Cliente
          </Link>
          </Button>
          </FormItem>
         
        </Form>
        <Table className="tableClient" rowKey={record => record.id}  {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Clientes;