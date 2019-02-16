import React, { Component } from 'react';
import {notification, Form, Input, InputNumber, Button, Radio, Table,Popconfirm } from 'antd'
import './Cliente.css';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { CLIENT_LIST_SIZE } from '../constants';
import { getAllClients, removeClient} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import  { Redirect } from 'react-router-dom'


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
          isLoading: false,
          editableClient: false
      })

      console.log(this.state.clients);
  }).catch(error => {
      this.setState({
          isLoading: false
      })
  });  
  
}
 
componentDidMount() {
  this.loadClientList();
}

handleUpdateClient = (client) =>{
  
   this.setState({
    client:client,
    editableClient:true
  });
}

handleDelete = (id) => {

  const dataSource = [...this.state.clients];
  
  let promise;
  promise = removeClient(id);

  if(!promise) {
      return;
  }

  this.setState({
      isLoading: true
  });
  
  promise            
  .then(response => {
    console.log(response);
    this.setState({ clients: dataSource.filter(item => item.id !== id) });

    notification.success({
      message: 'Boon',
      description: "Cliente Removido com sucesso.",
    });

    this.setState({
      isLoading: false
  });
  }).catch(error => {
    console.log(error);

        notification.error({
          message: 'Boon',
          description: 'Ocorreu um erro. Por favor tente novamente!'
      }); 
      this.setState({
          isLoading: false
      });
  });  
   
}

render(){

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.editableClient === true) {
          return <Redirect to={{
            pathname: '/client/new',
            client: {...this.state.client }
        }} />
        }

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
            title: 'Nome',
            dataIndex: 'user.name',
            key: 'nome',
          },{
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
          }, {
            title: 'Pontos - Experiência',
            dataIndex: 'pontosExperiencia',
            key: 'pontosExperiencia',
          }, {
            title: 'Pontos',
            dataIndex: 'pontos',
            key: 'pontos',
          }, {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdateClient(record)}>Editar</a>
                <span className="ant-divider" />
                
              
            <Popconfirm title="Comfima exclusão?" onConfirm={() => this.handleDelete(record.id)}>
              <a href="javascript:;">Apagar</a>
            </Popconfirm>
          
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
        <Table className="tableClient"
         rowKey={record => record.id} 
         dataSource={this.state.clients}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Clientes;