import React, { Component } from 'react';
import './Client.css';
import { Avatar, Icon, notification, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import LoadingIndicator  from '../common/LoadingIndicator';
import {selectPersonagem} from '../util/APIUtils';

import { Radio, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
const RadioGroup = Radio.Group;

class NivelHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };

        this.handleSelectNivel = this.handleSelectNivel.bind(this);

    }

    handleSelectNivel(event) {
        event.preventDefault();
        let promise;

        this.setState({
            isLoading: true
        });
       
        promise =  selectPersonagem(this.props.nivel.id);
        promise
        .then(response => {
          
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
                    message: 'Boon',
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
                                style={{ backgroundColor: getAvatarColor(this.props.nivel.nome)}} >
                                {this.props.nivel.nome[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                Descrição:{this.props.nivel.descricao}
                            </span>
                            <span className="poll-creator-username">
                                Missão:{this.props.nivel.missao}
                            </span>
                           
                    </div>
                    <div className="poll-choices">
                       
                       <Form onSubmit={this.props.handleSubmitResposta}>
                           <FormItem>
                           <Input placeholder="Resposta" name="tentativaResposta"
                           value = {this.props.tentativaResposta}
                           onChange={this.props.handleInputChange} /> 
                             <Button 
                                htmlType="submit" 
                                size="large" 
                                className="vote-button"  >Responder</Button>
                              
                           </FormItem>
                          
                       </Form>
                    </div>
                </div>

                 <div className="poll-footer">
                  <Button className="vote-button"  onClick={this.props.handleOpenDica}>Continuar</Button>
                  <Button className="vote-button"  onClick={this.props.handleProximaDica}>Proxima Dica</Button>
                  
                </div>         
            </div>
        );
    }
}

export default NivelHome;