import React, { Component } from 'react';
import './Cliente.css';
import { getCupomByCliente } from '../util/APIUtils';
import { CLIENT_LIST_SIZE } from '../constants';
import LoadingIndicator  from '../common/LoadingIndicator';
import  { Redirect } from 'react-router-dom'
import { Table,Popconfirm } from 'antd'


class CuponsList extends Component{

    constructor(props) {
      super(props);
      this.state = {
        cupons: [],
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
    }

    componentDidMount() {
        this.loadCuponsList();
    }

    loadCuponsList(page = 0, size = CLIENT_LIST_SIZE) {
        let promise;
        promise = getCupomByCliente(this.props.currentUser.username, page, size);
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
      
        promise            
        .then(response => {
            const cupons = this.state.cupons.slice();
            this.setState({
                cupons: cupons.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false,
                editableClient: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
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

          let button = null

          const columns = [{
            title: 'Empresa',
            dataIndex: 'empresa.user.name',
            key: 'empresa',
          }, {
            title: 'Data Geração',
            dataIndex: 'dataGeracao',
            key: 'data',
          }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
          }, {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdateClient(record)}>Avaliar</a>
                <span className="ant-divider" />
                
              
            <Popconfirm title="Comfima exclusão?" onConfirm={() => this.handleDelete(record.id)}>
              <a href="javascript:;">Apagar</a>
            </Popconfirm>
          
              </span>
            ),
          }];
        return  <div className="new-client-container">
         <h1 className="page-title">Histórico de Cupons</h1>
        
        <Table className="tableCupons"
         rowKey={record => record.id} 
         dataSource={this.state.cupons}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default CuponsList;