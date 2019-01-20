import React, { Component } from 'react';
import { getAllEmpresas, getUserCreatedPolls, getUserVotedPolls } from '../util/APIUtils';
import Empresa from './Empresa';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';

class EmpresaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empresas: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.loadEmpresaList = this.loadEmpresaList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadEmpresaList(page = 0, size = POLL_LIST_SIZE) {
        let promise = getAllEmpresas(page, size);;
  
        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const empresas = this.state.empresas.slice();

            this.setState({
                empresas: empresas.concat(response.content),
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
        this.loadEmpresaList();
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
            this.loadPollList();
        }
    }

    handleLoadMore() {
        this.loadPollList(this.state.page + 1);
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
        console.log("Teste" + this.state.polls);

        const empresasViews = [];
        this.state.empresas.forEach((empresa, empresaIndex) => {
            empresasViews.push(<Empresa  currentUser={this.props.currentUser}
                key={empresa.id} 
                empresa={empresa}
                 />)            
        });

        return (
            <div className="polls-container">
                {empresasViews}
                {
                    !this.state.isLoading && this.state.empresas.length === 0 ? (
                        <div className="no-polls-found">
                            <span>Empresas não encontradas.</span>
                        </div>    
                    ): null
                }  
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

export default withRouter(EmpresaList);