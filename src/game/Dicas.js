import React, { Component } from 'react';
import {notification, Form, Input, InputNumber, Button, Radio, Table,Popconfirm , Icon} from 'antd'
import './Dica.css';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { CLIENT_LIST_SIZE } from '../constants';
import { getAllDicas} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import  { Redirect } from 'react-router-dom'


const FormItem = Form.Item;

const Search = Input.Search;

class Dicas extends Component{

  constructor(props) {
    super(props);
    this.state = {
        dicas: [],
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
    this.loadDicaList = this.loadDicaList.bind(this);
}

loadDicaList(page = 0, size = CLIENT_LIST_SIZE) {
  let promise;
  promise = getAllDicas(page, size);

  if(!promise) {
      return;
  }

  this.setState({
      isLoading: true
  });

  promise            
  .then(response => {
      const dicas = this.state.dicas.slice();
      console.log(response.content);
      this.setState({
          dicas: dicas.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false,
          editableDica: false
      })

  }).catch(error => {
      this.setState({
          isLoading: false
      })
  });  
  
}
 
componentDidMount() {
  this.loadDicaList();
}

handleUpdateDica = (dica) =>{
  
   this.setState({
    dica:dica,
    editableDica:true
  });
}



render(){

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.editableDica === true) {
          return <Redirect to={{
            pathname: '/dica/new',
            dica: {...this.state.dica }
          }} />
        }

        const columns = [{
            title: 'Nivel',
            dataIndex: 'nivelGame.nome',
            key: 'nivel',
          },{
            title: 'Local',
            dataIndex: 'local',
            key: 'local',
          }, {
            title: 'Tempo De Locomoção',
            dataIndex: 'tempoDeLocomocao',
            key: 'tempoDeLocomocao',
          }, {
            title: 'Ordem Dica',
            dataIndex: 'ordemDica',
            key: 'ordemDica',
          }, {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdateDica(record)}><Icon type="edit" /></a>
                <span className="ant-divider" />
          
              </span>
            ),
          }];
        return  <div className="new-Dica-container">
         <h1 className="page-title">Gerenciamento de Dicas - Games</h1>
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
          <Link to="/dica/new">Nova Dica
          </Link>
          </Button>
          </FormItem>
         
        </Form>
        <Table className="tableDica"
         rowKey={record => record.id} 
         dataSource={this.state.dicas}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Dicas;