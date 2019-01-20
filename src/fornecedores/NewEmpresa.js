import React, { Component } from 'react';
import { createEmpresa, editEmpresa } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class NewEmpresa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: '',
            email:'',
            desconto: '',
            detalhes: ''
        };

        if(this.props.location.empresa){

            this.state = {
                detalhes:  this.props.location.empresa.detalhes
                ,
                desconto: this.props.location.empresa.desconto
                ,
                email:  this.props.location.empresa.user.email,
                nome: this.props.location.empresa.user.name
            };
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    this.setState({
      [name]: value
    });
  }

    handleSubmit(event) {
        event.preventDefault();
        let empresaData;
        
        let promise;
        if(this.props.location.empresa){
            empresaData= {
                desconto:this.state.desconto,
                detalhes: this.state.detalhes,
                nome: this.state.nome,
                email:this.state.email,
                id:this.props.location.empresa.id
            };
            promise = editEmpresa(empresaData)
        }else{
             
            empresaData= {
                desconto:this.state.desconto,
                detalhes: this.state.detalhes,
                nome: this.state.nome,
                email:this.state.email
            };
 
            promise =  createEmpresa(empresaData);
        }

        console.log(empresaData);
        promise
        .then(response => {
            notification.success({
                message: 'My pass',
                description: "Empresa Cadastrada com sucesso.",
              });
            this.props.history.push("/empresas");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateQuestion = (questionText) => {
        if(questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

 

    render() {
        const choiceViews = [];
        
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };

        return (
            <div className="new-poll-container">
                <h1 className="page-title">Cadastrar Empresa</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                         <FormItem>
                         <Input placeholder="Nome" name="nome"
                           value = {this.state.nome}
                          onChange={this.handleInputChange} 
                          />
                         </FormItem>
                         <FormItem>
                            <Input placeholder="Email" name="email"
                            value = {this.state.email}
                            onChange={this.handleInputChange} 
                            />
                         </FormItem>
                         <FormItem>
                              <Input placeholder="Desconto" name="desconto"
                                value = {this.state.desconto}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                      
                        <FormItem className="poll-form-row">
                        <TextArea 
                            placeholder="Detalhes"
                            style = {{ fontSize: '16px' }} 
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "detalhes"
                            value = {this.state.detalhes}
                            onChange = {this.handleInputChange} />
                        </FormItem>
                       
                        <FormItem className="poll-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="create-poll-form-button">Salvar</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}




export default NewEmpresa;