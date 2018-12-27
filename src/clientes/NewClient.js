import React, { Component } from 'react';
import { createClient, editClient } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input



class NewClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endereco: {
                text: ''
            },
            cpf: {
                text: ''
            },
            email: {
                text: ''
            },
            nome: {
                text: ''
            },
            senha: {
                text: ''
            },

            choices: [{
                text: ''
            }, {
                text: ''
            }],
            pollLength: {
                days: 1,
                hours: 0
            }
        };

        if(this.props.location.client){
            console.log("CPF:"+this.props.location.client.cpf);

            this.state = {
                endereco: {
                    text: this.props.location.client.id
                },
                cpf: this.props.location.client.cpf
                ,
                email: {
                    text: ''
                },
                nome: {
                    text: ''
                },
                senha: {
                    text: ''
                },
            };
        }
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleChoiceChange = this.handleChoiceChange.bind(this);
        this.handlePollDaysChange = this.handlePollDaysChange.bind(this);
        this.handlePollHoursChange = this.handlePollHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }


    
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    this.setState({
      [name]: value
    });
  }

    addChoice(event) {
        const choices = this.state.choices.slice();        
        this.setState({
            choices: choices.concat([{
                text: ''
            }])
        });
    }

    removeChoice(choiceNumber) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber+1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let clientData;
        

        let promise;
        if(this.props.location.client){
            clientData= {
                cpf:this.state.cpf,
                endereco: this.state.endereco.text,
                nome: this.state.nome,
                senha: this.state.senha,
                email: this.state.email,
                id:this.props.location.client.id
            };
            promise = editClient(clientData)
        }else{
             
            clientData= {
                cpf:this.state.cpf,
                endereco: this.state.endereco.text,
                nome: this.state.nome,
                senha: this.state.senha,
                email: this.state.email
            };
 
            promise =  createClient(clientData);
        }

        console.log(clientData);
        promise
        .then(response => {
            notification.success({
                message: 'My pass',
                description: "Cliente Cadastrado com sucesso.",
              });
            this.props.history.push("/clientes");
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

    handleQuestionChange(event) {
        const value = event.target.value;
        this.setState({
            endereco: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }

    validateChoice = (choiceText) => {
        if(choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleChoiceChange(event, index) {
        const choices = this.state.choices.slice();
        const value = event.target.value;

        choices[index] = {
            text: value,
            ...this.validateChoice(value)
        }

        this.setState({
            choices: choices
        });
    }


    handlePollDaysChange(value) {
        const pollLength = Object.assign(this.state.pollLength, {days: value});
        this.setState({
            pollLength: pollLength
        });
    }

    handlePollHoursChange(value) {
        const pollLength = Object.assign(this.state.pollLength, {hours: value});
        this.setState({
            pollLength: pollLength
        });
    }

    isFormInvalid() {
        if(this.state.endereco.validateStatus !== 'success') {
            return true;
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
                <h1 className="page-title">Cadastrar Cliente</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                         <FormItem>
                         <Input placeholder="Nome" name="nome"
                          onChange={this.handleInputChange} 
                          />
                         </FormItem>
                         <FormItem>
                              <Input placeholder="E-mail" name="email"
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="CPF" name="cpf"
                               value = {this.state.cpf}
                               onChange={this.handleInputChange} />         
                        </FormItem>
        <FormItem>
            <Input type="password" placeholder="Senha" name="senha"
             onChange={this.handleInputChange} 
             prefix={<Icon type="lock" />}/>
        </FormItem>
                        <FormItem validateStatus={this.state.endereco.validateStatus}
                            help={this.state.endereco.errorMsg} className="poll-form-row">
                        <TextArea 
                            placeholder="Endereço"
                            style = {{ fontSize: '16px' }} 
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "endereco"
                            value = {this.state.endereco.text}
                            onChange = {this.handleQuestionChange} />
                        </FormItem>
                       
                        <FormItem className="poll-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-poll-form-button">Salvar</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}




export default NewClient;