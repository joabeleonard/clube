import React, { Component } from 'react';
import './Client.css';
import { Avatar, Icon, notification } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import LoadingIndicator  from '../common/LoadingIndicator';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class PersonagemHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    isSelected = (choice) => {
        return this.props.poll.selectedChoice === choice.id;
    }

    getWinningChoice = () => {
        return this.props.poll.choices.reduce((prevChoice, currentChoice) => 
            currentChoice.voteCount > prevChoice.voteCount ? currentChoice : prevChoice, 
            {voteCount: -Infinity}
        );
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
                                style={{ backgroundColor: getAvatarColor(this.props.personagem.nome)}} >
                                {this.props.personagem.nome[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                Descrição:{this.props.personagem.descricao}
                            </span>
                            <span className="poll-creator-username">
                                Hobbie:{this.props.personagem.hobbie}
                            </span>
                            
                    </div>
                  
                </div>

                 <div className="poll-footer">
                  <Button className="vote-button"  onClick={this.props.handleSelectPersonagem}>Selecionar</Button>
                  
                </div>         
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


export default PersonagemHome;