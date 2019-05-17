import React, { Component } from 'react';
import { getExtrato } from '../util/APIUtils';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification,Form, Input, Select, List } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './Cliente.css';

const Option = Select.Option;


class Extratos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cupom:[],
            extrato: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            categorias: [],
            isLoading: false,
            nome: null,
            categoria:''
        };
        this.loadExtratoList = this.loadExtratoList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChangeCategoria = this.handleInputChangeCategoria.bind(this);

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
          [name]: value
        });
      }
      handleInputChangeCategoria(value) {   
        this.setState({
          categoria: value
        });
      }
      
    loadExtratoList(page = 0, size = POLL_LIST_SIZE) {
        let promise = getExtrato(page, size);
  
        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const extrato = this.state.extrato.slice();
            console.log(response);
            this.setState({
                extrato: extrato.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

   

    componentDidMount() {
        this.loadExtratoList();

    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                polls: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });    
            this.loadExtratoList();
        }
    }

    handleLoadMore() {
        this.loadExtratoList(this.state.page + 1);
    }

    handleVoteChange(event, pollIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[pollIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, pollIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Polling App',
                description: "Please login to vote.",          
            });
            return;
        }

        const poll = this.state.polls[pollIndex];
        const selectedChoice = this.state.currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const polls = this.state.polls.slice();
            polls[pollIndex] = response;
            this.setState({
                polls: polls
            });        
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                
            }
        });
    }

    
    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }
        return (
        
            <div className="polls-container">            
                {
                    !this.state.isLoading && this.state.extrato.length === 0 ? (
                        <div className="no-polls-found">
                            <span>Extrato vazio.</span>
                        </div>    
                    ): null
                }  
                 <List
                    size="large"
                    header={<div>Extrato</div>}
                    bordered
                    dataSource={this.state.extrato}
                    renderItem={item => <List.Item><div>{item.data}</div>
                    <div>{item.pontos}</div>
                    <div>{item.pontosExperiencia}</div>
                    <div>{item.descricao}</div></List.Item>}
                    />
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Carregar mais
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(Extratos);