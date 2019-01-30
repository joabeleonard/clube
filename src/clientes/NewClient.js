import React, { Component } from 'react';
import { createClient, editClient } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip, Radio, DatePicker } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input
const RadioGroup = Radio.Group;

class NewClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endereco: '',
            cpf: '',
            email:'',
            nome:'',
            senha:'',
            rg:'',
            cep:'',
            sexo:'',
            telefone:'',
            bairro:'',
            numero:'',
            cidade:'',
            estado:'',
            dataNascimento:''
        };

        if(this.props.location.client){

            this.state = {
                endereco: this.props.location.client.empresa,
                cpf: this.props.location.client.cpf,
                email: this.props.location.client.email,
                nome: this.props.location.client.nome,
                senha: this.props.location.client.senha,
                rg:this.props.location.client.rg,
                cep:this.props.location.client.cep,
                sexo:this.props.location.client.sexo,
                telefone:this.props.location.client.telefone,
                bairro:this.props.location.client.bairro,
                numero:this.props.location.client.numero,
                cidade:this.props.location.client.cidade,
                estado:this.props.location.client.estado,
                dataNascimento:this.props.location.client.dataNascimento
            };
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }


    
    handleDatePickerChange(date, dateString) {
        console.log(date, dateString);
        const value = dateString;
        const name = 'dataNascimento';
        
        this.setState({
          [name]: value
        });
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
        let clientData;   

        let promise;
        if(this.props.location.client){
            clientData= {
                cpf:this.state.cpf,
                endereco: this.state.endereco,
                nome: this.state.nome,
                senha: this.state.senha,
                email: this.state.email,
                id:this.props.location.client.id,
                rg:this.state.rg,
                cep:this.state.cep,
                sexo:this.state.sexo,
                telefone:this.state.telefone,
                bairro:this.state.bairro,
                numero:this.state.numero,
                cidade:this.state.cidade,
                estado:this.state.estado,
                dataNascimento:this.state.dataNascimento
            };
            promise = editClient(clientData)
        }else{
             
            clientData= {
                cpf:this.state.cpf,
                endereco: this.state.endereco,
                nome: this.state.nome,
                senha: this.state.senha,
                email: this.state.email,
                rg:this.state.rg,
                cep:this.state.cep,
                sexo:this.state.sexo,
                telefone:this.state.telefone,
                bairro:this.state.bairro,
                numero:this.state.numero,
                cidade:this.state.cidade,
                estado:this.state.estado,
                dataNascimento:this.state.dataNascimento
            };
 
            promise =  createClient(clientData);
        }

        promise
        .then(response => {
            notification.success({
                message: 'Boon',
                description: "Cliente Cadastrado com sucesso.",
              });
            this.props.history.push("/clientes");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'Erro, por favor tente novamente.');    
            } else {
                notification.error({
                    message: 'Boon',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
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
                              <Input placeholder="RG" name="rg"
                               value = {this.state.rg}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                             <DatePicker placeholder="Data de Nascimento" name="dataNascimento"
                               value = {this.state.dataNascimento}
                               onChange={this.handleDatePickerChange} />         
                        </FormItem>
                        <FormItem>
                            <RadioGroup  value = {this.state.sexo}
                               onChange={this.handleInputChange}>
                                <Radio value={1}>Masculino</Radio>
                                <Radio value={2}>Feminino</Radio>
                            </RadioGroup>
                            <Input placeholder="Telefone" name="telefone"
                               value = {this.state.telefone}
                               onChange={this.handleInputChange} />    
                            <Input placeholder="CEP" name="cep"
                               value = {this.state.cep}
                               onChange={this.handleInputChange} />  
                            <Input placeholder="Endereço" name="endereco"
                               value = {this.state.endereco}
                               onChange={this.handleInputChange} /> 
                                <Input placeholder="Número" name="numero"
                               value = {this.state.numero}
                               onChange={this.handleInputChange} /> 
                            <Input placeholder="Complemento" name="complemento"
                               value = {this.state.complemento}
                               onChange={this.handleInputChange} />  
                            <Input placeholder="Bairro" name="bairro"
                               value = {this.state.bairro}
                               onChange={this.handleInputChange} />  
                            <Input placeholder="Estado" name="estado"
                               value = {this.state.estado}
                               onChange={this.handleInputChange} />    
                            <Input placeholder="Cidade" name="cidade"
                               value = {this.state.cidade}
                               onChange={this.handleInputChange} />  

                        </FormItem>
                     
                        <FormItem>
                            <Input type="password" placeholder="Senha" name="senha"
                            onChange={this.handleInputChange} 
                            prefix={<Icon type="lock" />}/>
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




export default NewClient;