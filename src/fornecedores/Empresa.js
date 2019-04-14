import React, { Component } from 'react';
import './Empresa.css';
import {Form, Avatar, Icon, notification, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import { createCupom } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';



import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


class Empresa extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            codigo: '',
            visible:false,
            isLoading:false
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let promise;

        this.setState({
            isLoading: true
        });
        promise =  createCupom(this.props.empresa.id,this.props.currentUser.id );
        promise
        .then(response => {
            notification.success({
                message: 'Boon',
                description: "Cupom Gerado com Sucesso.",
              });
              console.log(response);
              this.setState({
                visible:true,
                isLoading: false,
                codigo:response.codigo
            });
            
        }).catch(error => {
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

    calculatePercentage = (choice) => {
        if(this.props.poll.totalVotes === 0) {
            return 0;
        }
        return (choice.voteCount*100)/(this.props.poll.totalVotes);
    };

    isSelected = (choice) => {
        return this.props.poll.selectedChoice === choice.id;
    }

    getWinningChoice = () => {
        return this.props.poll.choices.reduce((prevChoice, currentChoice) => 
            currentChoice.voteCount > prevChoice.voteCount ? currentChoice : prevChoice, 
            {voteCount: -Infinity}
        );
    }

    getTimeRemaining = (poll) => {
        const expirationTime = new Date(poll.expirationDateTime).getTime();
        const currentTime = new Date().getTime();
    
        var difference_ms = expirationTime - currentTime;
        var seconds = Math.floor( (difference_ms/1000) % 60 );
        var minutes = Math.floor( (difference_ms/1000/60) % 60 );
        var hours = Math.floor( (difference_ms/(1000*60*60)) % 24 );
        var days = Math.floor( difference_ms/(1000*60*60*24) );
    
        let timeRemaining;
    
        if(days > 0) {
            timeRemaining = days + " days left";
        } else if (hours > 0) {
            timeRemaining = hours + " hours left";
        } else if (minutes > 0) {
            timeRemaining = minutes + " minutes left";
        } else if(seconds > 0) {
            timeRemaining = seconds + " seconds left";
        } else {
            timeRemaining = "less than a second left";
        }
        
        return timeRemaining;
    }

    handleOk = (e) => {
        this.setState({
          visible: false,
        });
      }

      handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }

    render() {
      
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }
        return (
            <div className="poll-content">
                <div className="poll-header">

            <Modal title="Cupom gerado."
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                    <h2>Seu cupom é: {this.state.codigo}</h2>
                    
            </Modal>
                    <div className="poll-creator-info">
                        <Link className="creator-link" to={'/users/'}>
                            <Avatar className="poll-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.empresa.user.name)}} >
                                {this.props.empresa.user.name[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                {this.props.empresa.user.name}
                            </span>
                            <span className="poll-creation-date">
                                Desconto: {this.props.empresa.desconto}%
                            </span>
                           
                        </Link>
                    </div>
                   
                </div>
                <div className="poll-choices">
                       {this.props.empresa.detalhes}
                </div>
                <Form onSubmit={this.handleSubmit}>
                    <div className="poll-footer">
                    <FormItem className="poll-form-row">
                         <Button className="go-back-btn" type="primary"
                          htmlType="submit" size="large">
                            Gerar Código
                         </Button>
                         </FormItem>
                    </div>
                </Form>

            </div>
        );
    }
}

function CompletedOrVotedPollChoice(props) {
    return (
        <div className="cv-poll-choice">
            <span className="cv-poll-choice-details">
                <span className="cv-choice-percentage">
                    {Math.round(props.percentVote * 100) / 100}%
                </span>            
                <span className="cv-choice-text">
                    {props.choice.text}
                </span>
                {
                    props.isSelected ? (
                    <Icon
                        className="selected-choice-icon"
                        type="check-circle-o"
                    /> ): null
                }    
            </span>
            <span className={props.isWinner ? 'cv-choice-percent-chart winner': 'cv-choice-percent-chart'} 
                style={{width: props.percentVote + '%' }}>
            </span>
        </div>
    );
}


export default Empresa;