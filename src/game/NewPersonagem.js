import React, { Component } from 'react';
import { createPersonagem, editPersonagem } from '../util/APIUtils';
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

class NewPersonagem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome:'',
            descricao:'',
            hobbie:'',
            
        };

        if(this.props.location.personagem){
            this.state = {
                nome: this.props.location.personagem.nome,
                descricao: this.props.location.personagem.descricao,
                hobbie: this.props.location.client.hobbie
            };
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    
    handleDatePickerChange(date, dateString) {
        console.log(date);
        const value = dateString;
        const name = 'dataNascimento';
        
        this.setState({
          [name]: date
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
        let personagemData; 
        
        this.setState({
            isLoading: true
        });

        let promise;
        if(this.props.location.personagem){
            personagemData= {
                nome: this.state.nome,
                descricao: this.state.descricao,
                hobbie: this.state.hobbie,
                id:this.props.location.personagem.id,
               
            };

            promise = editPersonagem(personagemData)
        }else{
             
            personagemData= {
                nome: this.state.nome,
                descricao: this.state.descricao,
                hobbie: this.state.hobbie
            };
            promise =  createPersonagem(personagemData);
        }

        promise
        .then(response => {

            this.setState({
                isLoading: false
            });
            notification.success({
                message: 'Boon',
                description: "Personagem Cadastrado com sucesso.",
              });
            if(this.props.authenticated){
                this.props.history.push("/personagens");
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
                <h1 className="page-title">Cadastrar Personagem</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                         <FormItem>
                         <Input placeholder="Nome" name="nome"
                          onChange={this.handleInputChange} 
                          />
                         </FormItem>
                         <FormItem>
                              <Input placeholder="Descricao" name="descricao"
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="Hobbie" name="hobbie"
                               value = {this.state.hobbie}
                               onChange={this.handleInputChange} />         
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


export default NewPersonagem;