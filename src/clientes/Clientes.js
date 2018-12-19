import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Radio, Table } from 'antd'
import './Cliente.css';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { CLIENT_LIST_SIZE } from '../constants';
import { getAllClients} from '../util/APIUtils';


const FormItem = Form.Item;

const Search = Input.Search;

class Clientes extends Component{

  constructor(props) {
    super(props);
    this.state = {
        clients: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        currentVotes: [],
        isLoading: false,
        formLayout: 'vertical',
            search: ''
    };
    this.loadClientList = this.loadClientList.bind(this);
}

loadClientList(page = 0, size = CLIENT_LIST_SIZE) {
  let promise;
  promise = getAllClients(page, size);

  if(!promise) {
      return;
  }

  this.setState({
      isLoading: true
  });

  promise            
  .then(response => {
      const clients = this.state.clients.slice();

      this.setState({
          clients: clients.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
            isLoading: false
      })
  }).catch(error => {
      this.setState({
          isLoading: false
      })
  });  
  
}
 
componentDidMount() {
  this.loadClientList();
}
    render(){
      console.log("Teste"+this.state.clients);
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
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
          }, {
            title: 'Ativo',
            dataIndex: 'ativo',
            key: 'ativo',
          }, {
            title: 'Pontos',
            dataIndex: 'pontos',
            key: 'pontos',
          }, {
            title: 'Ações',
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
        <Table className="tableClient" rowKey={record => record.id} dataSource={this.state.clients} {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Clientes;