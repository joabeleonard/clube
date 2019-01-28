import React, { Component } from 'react';
import { validarCupom} from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';  
import { Form, Input, Button, Icon, Select, Col, notification, Tooltip } from 'antd';
import LoadingIndicator  from '../common/LoadingIndicator';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class ValidarCupom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codigo:'',
            cupom: '',
            isLoading: false
        };

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

        this.setState({
            isLoading: true
        });
        
       
        validarCupom(this.state.codigo)
        .then(response => {

            this.setState({
                cupom: response,
                isLoading: false
            });
            notification.success({
                message: 'Boon',
                description: "Cupom Válido.",
              });
        }).catch(error => {

            this.setState({
                isLoading: false
            });

            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'Por favor, autentique-se no sistema.');    
            } else {
                if(error.status === 204) {
                    notification.error({
                        message: 'Boon',
                        description: error.message || 'Código Inválido!'
                    });    
                }else{
                    notification.error({
                        message: 'Boon',
                        description: error.message || 'Erro! Tente Novamento!'
                    });  
                }
                         
            }
        });
    }

    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }
        return (

            <div className="new-poll-container">
                <h1 className="page-title">Válidar Cupom</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                         <FormItem>
                         <Input placeholder="Cupom" name="codigo"
                          onChange={this.handleInputChange} 
                          />
                         </FormItem>
                       
                        <FormItem className="poll-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="create-poll-form-button">Buscar</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}

export default ValidarCupom;