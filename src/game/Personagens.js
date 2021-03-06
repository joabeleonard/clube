import React, { Component } from 'react';
import {notification, Form, Input, InputNumber, Button, Radio, Table,Popconfirm , Icon} from 'antd'
import './Personagem.css';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { CLIENT_LIST_SIZE } from '../constants';
import { getAllClients, removeClient, getAllPersonagens} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import  { Redirect } from 'react-router-dom'


const FormItem = Form.Item;

const Search = Input.Search;

class Personagens extends Component{

  constructor(props) {
    super(props);
    this.state = {
        personagens: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false,
        formLayout: 'vertical',
        search: ''
    };
    this.loadPersonagensList = this.loadPersonagensList.bind(this);
}

loadPersonagensList(page = 0, size = CLIENT_LIST_SIZE) {
  let promise;
  promise = getAllPersonagens(page, size);

  if(!promise) {
      return;
  }

  this.setState({
      isLoading: true
  });

  promise            
  .then(response => {
      const personagens = this.state.personagens.slice();
      this.setState({
          personagens: personagens.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false,
          editablePersonagem: false
      })

  }).catch(error => {
      this.setState({
          isLoading: false
      })
  });  
  
}
 
componentDidMount() {
  this.loadPersonagensList();
}

handleUpdatePersonagem = (personagem) =>{
  
   this.setState({
    personagem:personagem,
    editablePersonagem:true
  });
}

render(){

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.editablePersonagem === true) {
          return <Redirect to={{
            pathname: '/personagem/new',
            personagem: {...this.state.personagem }
          }} />
        }

        const columns = [{
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
          },{
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
          }, {
            title: 'Robbies',
            dataIndex: 'hobbie',
            key: 'hobbie',
          }, {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdatePersonagem(record)}><Icon type="edit" /></a>
          
              </span>
            ),
          }];
        return  <div className="new-client-container">
         <h1 className="page-title">Gerenciamento de Personagens</h1>
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
          <Link to="/personagem/new">Novo Personagens
          </Link>
          </Button>
          </FormItem>
         
        </Form>
        <Table className="tableClient"
         rowKey={record => record.id} 
         dataSource={this.state.personagens}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Personagens;