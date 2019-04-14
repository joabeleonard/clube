import React, { Component } from 'react';
import { getAllEmpresas, pesquisarEmpresa, getCategorias } from '../util/APIUtils';
import Empresa from './Empresa';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification,Form, Input, Select } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';

const Option = Select.Option;


class EmpresaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cupom:[],
            empresas: [],
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
        this.loadEmpresaList = this.loadEmpresaList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.searchHandleSubmit = this.searchHandleSubmit.bind(this);
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
      
    loadEmpresaList(page = 0, size = POLL_LIST_SIZE) {
        let promise = getAllEmpresas(page, size);
  
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

    searchHandleSubmit(event) {
        event.preventDefault();
        
        this.setState({
            isLoading: true
        });
        let promise;

        let page = 0;
        let size = POLL_LIST_SIZE;
        
        promise = pesquisarEmpresa( this.state.nome,
            this.state.categoria, page, size)
        promise
        .then(response => {
            const empresasFilter = [];
            console.log(empresasFilter);
            this.setState({
                empresas: empresasFilter.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Boon',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }


    componentDidMount() {
        this.loadEmpresaList();
        this.loadCategoriaList();

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

    loadCategoriaList(){
        let promise;
           promise = getCategorias();
         
           if(!promise) {
               return;
           }
         
           this.setState({
               isLoading: true
           });
           promise            
           .then(response => {
               const categorias = this.state.categorias.slice();
               this.setState({
                   categorias: response
               })
   
           }).catch(error => {
               console.log(error);
               this.setState({
                   isLoading: false
               })
           });  
           
         }   

    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }


        const empresasViews = [];
        this.state.empresas.forEach((empresa, empresaIndex) => {
            empresasViews.push(<Empresa  currentUser={this.props.currentUser}
                key={empresa.id} 
                empresa={empresa}
                cupom={[]}
                 />)            
        });

        return (

            
            <div className="polls-container">
            <Form layout="inline" onSubmit={this.searchHandleSubmit}>

                 <Form.Item>      
                        <Input  placeholder="Nome" name="nome"
                           value = {this.state.nome}
                          onChange={this.handleInputChange} />
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 120 }} name="categoria"
                        onChange={this.handleInputChangeCategoria}>
                        {this.state.categorias.map(categoria => <Option key={categoria}>{categoria}</Option>)}
                        </Select>
                </Form.Item>

                 <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit" >
                       Pesquisar
                    </Button>
                    </Form.Item>
            </Form>
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