import React, { Component } from 'react';
import {notification, Form, Input, InputNumber, Button, Radio, Table,Popconfirm , Icon} from 'antd'
import './Etapa.css';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { CLIENT_LIST_SIZE } from '../constants';
import { getAllEtapas} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import  { Redirect } from 'react-router-dom'


const FormItem = Form.Item;

const Search = Input.Search;

class Etapas extends Component{

  constructor(props) {
    super(props);
    this.state = {
        extrato: [],
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
    this.loadEtapaList = this.loadEtapaList.bind(this);
}

loadEtapaList(page = 0, size = CLIENT_LIST_SIZE) {
  let promise;
  promise = getAllEtapas(page, size);

  if(!promise) {
      return;
  }

  this.setState({
      isLoading: true
  });

  promise            
  .then(response => {
      const etapas = this.state.etapas.slice();
      
      this.setState({
          etapas: etapas.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false,
          editableEtapa: false
      })

      console.log(this.state.etapas);
  }).catch(error => {
      this.setState({
          isLoading: false
      })
  });  
  
}
 
componentDidMount() {
  this.loadEtapaList();
}

handleUpdateEtapa = (etapa) =>{
  
   this.setState({
    etapa:etapa,
    editableEtapa:true
  });
}



render(){

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.editableEtapa === true) {
          return <Redirect to={{
            pathname: '/etapa/new',
            etapa: {...this.state.etapa }
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
            title: 'Missão',
            dataIndex: 'missao',
            key: 'missao',
          },{
            title: 'Personagem',
            dataIndex: 'personagem.nome',
            key: 'personagem',
          }, {
            title: 'Ordem',
            dataIndex: 'ordemNivel',
            key: 'ordemNivel',
          }, {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdateEtapa(record)}><Icon type="edit" /></a>
                <span className="ant-divider" />
          
              </span>
            ),
          }];
        return  <div className="new-client-container">
         <h1 className="page-title">Gerenciamento de Etapas - Game</h1>
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
          <Link to="/etapa/new">Nova Etapa
          </Link>
          </Button>
          </FormItem>
         
        </Form>
        <Table className="tableEtapa"
         rowKey={record => record.id} 
         dataSource={this.state.etapas}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Etapas;