import React, { Component } from 'react';
import {  editNivel, getAllPersonagens, createNivel } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPersonagem.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { formatDateTime } from '../util/Helpers';
import LoadingIndicator  from '../common/LoadingIndicator';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input
const RadioGroup = Radio.Group;

const dateFormat = 'YYYY/MM/DD';

class NewEtapa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personagens: [],
            personagemId: null,
            descricao: '',
            missao: '',
                resposta:'',
                premio:'',
                ordemNivel:'',
                personagem:''
        };

        if(this.props.location.etapa){
            this.state = {
                personagens: [],
                nome: this.props.location.etapa.nome,
                descricao: this.props.location.etapa.descricao,
                personagem:this.props.location.etapa.personagem,
                premio:this.props.location.etapa.premio,
                ordemNivel:this.props.location.etapa.ordemNivel,
                resposta:this.props.location.etapa.resposta,
                missao:this.props.location.etapa.missao,
             };
        }
        this.handlePersonagemChange = this.handlePersonagemChange.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.loadPersonagensList();
    }

    loadPersonagensList(){
  
        let promise;
           promise = getAllPersonagens();
         
           if(!promise) {
               return;
           }
         
           this.setState({
               isLoading: true
           });
           promise            
           .then(response => {
            console.log(response);
               const personagens = this.state.personagens.slice();
               this.setState({
                personagens: response.content,
                   isLoading: false
               })
   
              
           }).catch(error => {
               console.log(error);
               this.setState({
                   isLoading: false
               })
           });  
           
         }
   
    
         handlePersonagemChange(value) {
            this.setState({
                personagemId: value
            });
        }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    //console.log(value+ name);
    this.setState({
      [name]: value
    });
  }

    handleSubmit(event) {
        event.preventDefault();
        let etapaData; 
        
        this.setState({
            isLoading: true
        });

        let promise;
        if(this.props.location.etapa){
            etapaData= {
                personagemId : this.state.personagemId,
                nome: this.state.nome,
                descricao: this.state.descricao,
                missao: this.state.missao,
                resposta:this.state.resposta,
                premio:this.state.premio,
                ordemNivel:this.state.ordemNivel,
                id:this.props.location.etapa.id,
            };

            promise = editNivel(etapaData)
        }else{
             
            etapaData= {
                nome: this.state.nome,
                descricao: this.state.descricao,
                missao: this.state.missao,
                resposta:this.state.resposta,
                premio:this.state.premio,
                ordemNivel:this.state.ordemNivel,
                personagemId:this.state.personagemId};
            promise =  createNivel(etapaData);
        }

        promise
        .then(response => {

            this.setState({
                isLoading: false
            });
            notification.success({
                message: 'Boon',
                description: "Niveis Cadastrado com sucesso.",
              });

              if(this.props.authenticated){
                this.props.history.push("/etapas");
            }else{
                this.props.history.push("/login");
            }
           
        }).catch(error => {

            this.setState({
                isLoading: false
            });
            notification.error({
                message: 'Boon',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            }); 
        });
    }

  

    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }
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
                <h1 className="page-title">Cadastrar Etapa (Game)</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                         <FormItem>
                         <Input placeholder="Nome" name="nome"
                          value = {this.state.nome}
                          onChange={this.handleInputChange} 
                          />
                         </FormItem>
                         <FormItem>
                              <Input placeholder="Descrição" name="descricao"
                               value = {this.state.descricao}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="Missão" name="missao"
                               value = {this.state.missao}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="Resposta" name="resposta"
                               value = {this.state.resposta}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="Premio" name="premio"
                               value = {this.state.premio}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="Ordem" name="ordemNivel"
                               value = {this.state.ordemNivel}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                       
                        <FormItem>
                             <Select 
                                placeholder="Selecione  o personagem"
                                style={{ width: 120 }} name="Personagem"
                                onChange={this.handlePersonagemChange}>
                                {this.state.personagens.map(personagem => <Option key={personagem.id} >{personagem.nome}</Option>)}
                            </Select>
                       
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




export default NewEtapa;