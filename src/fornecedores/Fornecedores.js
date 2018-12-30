import React, { Component } from 'react';
import {notification, Form, Input, InputNumber, Button, Radio, Table,Popconfirm } from 'antd'
import { CLIENT_LIST_SIZE } from '../constants';
import { getAllEmpresas, removeEmpresa} from '../util/APIUtils';
import {
    Link,
    withRouter
  } from 'react-router-dom';
  import LoadingIndicator  from '../common/LoadingIndicator';
  import  { Redirect } from 'react-router-dom'
  const FormItem = Form.Item;

  const Search = Input.Search;


class Fornecedores extends Component{


    constructor(props) {
        super(props);
        this.state = {
            emrpesas: [],
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
        this.loadEmpresaList = this.loadEmpresaList.bind(this);
    }

    loadEmpresaList(page = 0, size = CLIENT_LIST_SIZE) {
        let promise;
        promise = getAllEmpresas(page, size);
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
      
        promise            
        .then(response => {
            const empresas = this.state.empresas.slice();
      
            this.setState({
                empresas: empresas.concat(response.content),
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
    componentDidMount() {
        this.loadEmpresaList();
      }

    handleUpdateClient = (empresa) =>{
  
        this.setState({
         empresa:empresa,
         editableClient:true
       });
     }

    handleDelete = (id) => {

        const dataSource = [...this.state.clients];
        
        let promise;
        promise = removeEmpresa(id);
      
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
            message: 'My Pass',
            description: "Empresa Removido com sucesso.",
          });
      
          this.setState({
            isLoading: false
        });
        }).catch(error => {
          console.log(error);
      
              notification.error({
                message: 'My Pass',
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

        if (this.state.editableEmpresa === true) {
          return <Redirect to={{
            pathname: '/empresa/new',
            empresa: {...this.state.empresa }
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
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
          },{
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
          }, {
            title: 'Endereço',
            dataIndex: 'endereco',
            key: 'endereco',
          }, {
            title: 'Detalhes',
            dataIndex: 'detalhes',
            key: 'detalhes',
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
        return  <div className="new-empresas-container">
         <h1 className="page-title">Gerenciamento de Empresas</h1>
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
          <Link to="/empresa/new">Nova Empresa
          </Link>
          </Button>
          </FormItem>
         
        </Form>
        <Table className="tableEmpresa"
         rowKey={record => record.id} 
         dataSource={this.state.empresas}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}


export default Fornecedores;