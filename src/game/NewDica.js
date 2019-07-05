import React, { Component } from 'react';
import { createDica, editDica } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewDica.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { formatDateTime } from '../util/Helpers';
import LoadingIndicator  from '../common/LoadingIndicator';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input
const RadioGroup = Radio.Group;

const dateFormat = 'YYYY/MM/DD';

class NewDica extends Component {
    constructor(props) {
        super(props);
        this.state = {
            niveis: [],
            nivelId:'',
            local: '',
            tempoDeLocomocao:'',
            quemEstaComADica:'',
            dica:'',
            ordemDica:''
        };

        if(this.props.location.dica){
            console.log(this.props.location.dica);
            this.state = {
                local: this.props.location.dica.local,
                tempoDeLocomocao: this.props.location.dica.email,
                quemEstaComADica: this.props.location.dica.quemEstaComADica,
                dica: this.props.location.dica.dica,
                ordemDica:this.props.location.dica.ordemDica,
                };
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNivelChange = this.handleNivelChange.bind(this);

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
        let dicaData; 
        
        this.setState({
            isLoading: true
        });

        let promise;
        if(this.props.location.dica){
            dicaData= {
                local:this.state.local,
                tempoDeLocomocao: this.state.tempoDeLocomocao,
                quemEstaComADica: this.state.quemEstaComADica,
                dica: this.state.email,
                id:this.props.location.dica.id,
                nivelGame:this.state.nivelGame,
                ordemDica:this.state.ordemDica,
               
            };

            promise = editDica(dicaData)
        }else{
             
            dicaData= {
                local:this.state.local,
                tempoDeLocomocao: this.state.tempoDeLocomocao,
                quemEstaComADica: this.state.quemEstaComADica,
                dica: this.state.email,
                nivelGame:this.state.nivelGame,
                ordemDica:this.state.ordemDica,
            };
            promise =  createDica(dicaData);
        }

        promise
        .then(response => {

            this.setState({
                isLoading: false
            });
            notification.success({
                message: 'Boon',
                description: "Dica Cadastrada com sucesso.",
              });
            if(this.props.authenticated){
                this.props.history.push("/dicas");
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

    handleNivelChange(value) {
        this.setState({
            nivelId: value
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
                <h1 className="page-title">Cadastrar Dica</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                         <FormItem>
                         <Input placeholder="Local" name="local"
                          onChange={this.handleInputChange} 
                          />
                         </FormItem>
                         <FormItem>
                              <Input placeholder="Tempo De Locomoção" name="tempoDeLocomocao"
                               onChange={this.handleInputChange} />         
                        </FormItem>
                        <FormItem>
                              <Input placeholder="Quem Esta Com a Dica" name="quemEstaComADica"
                               value = {this.state.quemEstaComADica}
                               onChange={this.handleInputChange} />         
                        </FormItem>
                       
                        <FormItem>
                        <Input placeholder="Dica" name="dica"
                               value = {this.state.dica}
                               onChange={this.handleInputChange} />          
                        </FormItem>
                        <FormItem>
                             <Select
                                placeholder="Selecione  nivel"
                                style={{ width: 120 }} name="Nível"
                                onChange={this.handleNivelChange}>
                                {this.state.niveis.map(nivel => <Option key={nivel.id} >{nivel.nome}</Option>)}
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




export default NewDica;