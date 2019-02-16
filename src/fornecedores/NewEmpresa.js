import React, { Component } from 'react';
import { createEmpresa, editEmpresa, getCategorias } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip, Cascader  } from 'antd';
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
            detalhes: '',
            categorias: [],
            razaoSocial:'',
            cnpj:'',
            categoria:'',
            dotBack:'',
            logradouro:'',
            numero:'',
            complemento:'',
            bairro:'',
            estado:'',
            cidade:''
        };

        if(this.props.location.empresa){

            this.state = {
                detalhes:  this.props.location.empresa.detalhes
                ,
                desconto: this.props.location.empresa.desconto
                ,
                email:  this.props.location.empresa.user.email,
                nome: this.props.location.empresa.user.name,
                razaoSocial:this.props.location.empresa.razaoSocial,
                cnpj:this.props.location.empresa.cnpj,
                categoria:this.props.location.empresa.categoria,
                dotBack:this.props.location.empresa.dotBack,
                logradouro:this.props.location.empresa.logradouro,
                numero:this.props.location.empresa.numero,
                complemento:this.props.location.empresa.complemento,
                bairro:this.props.location.empresa.bairro,
                estado:this.props.location.empresa.estado,
                cidade:this.props.location.empresa.cidade
            };
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadCategoriaList();
        
    }

    loadCategoriaList(){
     let promise;
        promise = getCategorias();
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
           
            const categorias = this.state.categorias.slice();
            this.setState({
                categorias: response
            })

            console.log(response);
        }).catch(error => {
            console.log(error);
            this.setState({
                isLoading: false
            })
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
        let empresaData;
        
        let promise;
        if(this.props.location.empresa){
            empresaData= {
                desconto:this.state.desconto,
                detalhes: this.state.detalhes,
                nome: this.state.nome,
                email:this.state.email,
                id:this.props.location.empresa.id,
                razaoSocial:this.state.razaoSocial,
                cnpj:this.state.cnpj,
                categoria:this.state.categoria,
                dotBack:this.state.dotBack,
                logradouro:this.state.logradouro,
                numero:this.state.numero,
                complemento:this.state.complemento,
                bairro:this.state.bairro,
                estado:this.state.estado,
                cidade:this.state.cidade
            };
            promise = editEmpresa(empresaData)
        }else{
             
            empresaData= {
                desconto:this.state.desconto,
                detalhes: this.state.detalhes,
                nome: this.state.nome,
                email:this.state.email,
                razaoSocial:this.state.razaoSocial,
                cnpj:this.state.cnpj,
                categoria:this.state.categoria,
                dotBack:this.state.dotBack,
                logradouro:this.state.logradouro,
                numero:this.state.numero,
                complemento:this.state.complemento,
                bairro:this.state.bairro,
                estado:this.state.estado,
                cidade:this.state.cidade
            };
 
            promise =  createEmpresa(empresaData);
        }

        console.log(empresaData);
        promise
        .then(response => {
            notification.success({
                message: 'Boon',
                description: "Empresa Cadastrada com sucesso.",
              });
            this.props.history.push("/empresas");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Boon',
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
                         <Input placeholder="Nome Fantasia" name="nome"
                           value = {this.state.nome}
                          onChange={this.handleInputChange} 
                          />
                        
                         <Input placeholder="Razão Social" name="razaoSocial"
                           value = {this.state.razaoSocial}
                          onChange={this.handleInputChange} 
                          />
                       
                            <Input placeholder="CNPJ" name="cnpj"
                            value = {this.state.cnpj}
                            onChange={this.handleInputChange}   />
                        

                          <Select
                            style={{ width: 120 }} name="categoria"
                            onChange={this.handleInputChange}>
                            {this.state.categorias.map(categoria => <Option key={categoria}>{categoria}</Option>)}
                            </Select>
                       
                            <Input placeholder="Email" name="email"
                            value = {this.state.email}
                            onChange={this.handleInputChange} 
                            />
                       
                              <Input placeholder="Desconto" name="desconto"
                                value = {this.state.desconto}
                               onChange={this.handleInputChange} />         
                        
                              <Input placeholder="DotBack" name="dotBack"
                                value = {this.state.dotBack}
                               onChange={this.handleInputChange} />         
                       

                                 <Input placeholder="Logradouro" name="logradouro"
                               value = {this.state.logradouro}
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