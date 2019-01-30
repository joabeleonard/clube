import React, { Component } from 'react';
import './Empresa.css';
import {Form, Avatar, Icon, notification } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import { usarCupom } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';



import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


class Cupom extends Component {

    
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let promise;

        this.setState({
            isLoading: true
        });
       
        console.log(this.props.cupom);
        promise =  usarCupom(this.props.cupom);
        promise
        .then(response => {
            notification.success({
                message: 'Boon',
                description: "Cupom Validado com Sucesso.",
              });
              this.setState({
                isLoading: false
            });
        }).catch(error => {
            this.setState({
                isLoading: false
            });
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'Você deve estar autenticado.');    
            } else {
                notification.error({
                    message: 'My pass',
                    description: error.message || 'Descupe! Ocorreu um erro. Tente novamente!'
                });              
            }
        });
    }

  
    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }
        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="poll-creator-info">
                    <Avatar className="poll-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.cupom.userName)}} >
                                {this.props.cupom.userName[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                {this.props.cupom.userName}
                            </span>
                            <span className="poll-creation-date">
                                Código: {this.props.cupom.codigo}
                            </span>
                    </div>
                   
                </div>
                <div className="poll-choices">
                       {this.props.cupom.dataGeracao}
                </div>
                <Form onSubmit={this.handleSubmit}>
                    <div className="poll-footer">
                    <FormItem className="poll-form-row">
                         <Button className="go-back-btn" type="primary"
                          htmlType="submit" size="large">
                            Confirmar Consumo
                         </Button>
                         </FormItem>
                    </div>
                </Form>

            </div>
        );
    }
}



export default Cupom;