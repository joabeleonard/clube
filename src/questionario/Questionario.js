import React, { Component } from 'react';
import {notification, Form, Input, InputNumber, Button, Radio, Table,Popconfirm , Icon} from 'antd'
import { getAllPolls, desativarQuestionarios} from '../util/APIUtils';
import {
    Link,
    withRouter
  } from 'react-router-dom';
import LoadingIndicator  from '../common/LoadingIndicator';
import  { Redirect } from 'react-router-dom'
import { LIST_SIZE } from '../constants';
import './Questionario.css';  


const FormItem = Form.Item;

const Search = Input.Search;
class Questionario extends Component{

    constructor(prop){
        super(prop);

        this.state = {
            questionarios: [],
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
        this.loadQuestionariosList = this.loadQuestionariosList.bind(this);
    }

    loadQuestionariosList(page = 0, size = LIST_SIZE) {
        let promise;

        promise = getAllPolls(page, size);

      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
      
        promise            
        .then(response => {
            const questionarios = this.state.questionarios.slice();
            
            this.setState({
                questionarios: questionarios.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false,
                editableClient: false
            })
            console.log(this.state.questionarios);
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
      }
       
      componentDidMount() {
        this.loadQuestionariosList();
      }

      handleUpdateQustionario = (questionario) =>{
  
        this.setState({
         questionario:questionario,
         editableQuestionario:true
       });
     }
     
     handleDelete = (record) => {
     
       const dataSource = [...this.state.questionarios];
       
       let promise;
       promise = desativarQuestionarios(record);
     
       if(!promise) {
           return;
       }
     
       this.setState({
           isLoading: true
       });
       
       promise            
       .then(response => {
         this.setState({ questionarios: dataSource.filter(item => item.id !== record.id) });
     
         notification.success({
           message: 'Boon',
           description: "Questionario Finalizado com sucesso.",
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

        if (this.state.editableQuestionario === true) {
          return <Redirect to={{
            pathname: '/questionario/new',
            questionario: {...this.state.questionario }
        }} />
        }
        
        const columns = [{
            title: 'Empresa',
            dataIndex: 'empresa.user.name',
            key: 'empresa',
          },{
            title: 'Data de Criação',
            dataIndex: 'creationDateTime',
            key: 'creationDateTime',
          },{
            title: 'Data de Finalização ',
            dataIndex: 'expirationDateTime',
            key: 'expirationDateTime',
          }, {
            title: 'Quantidade de Respostas',
            dataIndex: 'quantRespostas',
            key: 'quantRespostas',
          }, {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>this.handleUpdateQustionario(record)}><Icon type="edit" /></a>
                <span className="ant-divider" />
                
              
            <Popconfirm title="Finalizar Questionario?" onConfirm={() => this.handleDelete(record)}>
              <a href="javascript:;"><Icon type="delete" /></a>
            </Popconfirm>
          
              </span>
            ),
          }];
        return  <div className="new-client-container">
         <h1 className="page-title">Gerenciamento de Questionarios</h1>
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
          <Link to="/poll/new">Novo Questionario
          </Link>
          </Button>
          </FormItem>
         
        </Form>
        <Table className="tableClient"
         rowKey={record => record.id} 
         dataSource={this.state.questionarios}
         rowClassName={() => 'editable-row'}
         bordered
          {...this.state.tableConfig} columns={columns}  />
      </div>
       
       ;
    }
}

export default Questionario;