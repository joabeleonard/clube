import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Radio, Table } from 'antd'

const FormItem = Form.Item;

class Clientes extends Component{

    constructor(){
        super();
        this.state = {
            formLayout: 'inline',
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
        return  <div>
         <Form {...layoutProps}>
          <FormItem
            {...formItemLayout} >
         
          </FormItem>
          <FormItem
            label="Username"
            {...formItemLayout}
          >
            <Input type="text" value={this.search} placeholder="Pesquisa"/>
            <Button type="primary" shape="circle" icon="search" />

          </FormItem>
          <FormItem
            label="Age"
            {...formItemLayout}
          >
        
          </FormItem>
          <FormItem {...buttonItemLayout}>
            {button}
          </FormItem>
        </Form>
        <Table rowKey={record => record.id}  {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Clientes;