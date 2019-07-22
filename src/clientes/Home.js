import React, { Component } from 'react';
import {notification, Form,List,Comment, Input, Timeline ,InputNumber, Button, Radio, Table,Popconfirm } from 'antd'
import { CLIENT_LIST_SIZE } from '../constants';
import { getRankingDot,proximoNivel,proximaDica, getRankingExperiencia, getAllPersonagens,selectPersonagem, getGame} from '../util/APIUtils';
import {
    Link,
    withRouter
  } from 'react-router-dom';
  import LoadingIndicator  from '../common/LoadingIndicator';
  import  { Redirect } from 'react-router-dom'
import Client from './Cliente';
import PersonagemHome from './PersonagemHome';
import NivelHome from './NivelHome';
import DicaHome from './DicaHome';

const FormItem = Form.Item;

  const Search = Input.Search;


class Home extends Component{


    constructor(props) {
        super(props);
        this.state = {
            dica:null,
            user: [],
            clients:[],
            personagens:[],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false,
            formLayout: 'vertical',
            gameViews : [],
            visualizarDica: false,
            tentativaResposta: ''

        };
        //this.loadRanking = this.loadRanking.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadPersonagens = this.loadPersonagens.bind(this);
        this.loadGame = this.loadGame.bind(this);
        
    }

    handleOpenDica(event, dica){
        this.setState({ visualizarDica: true});
    }

    handleProximaDica(event){
        event.preventDefault();
        
        this.setState({
            isLoading: true
        });

        let promise;
        
            promise = proximaDica(this.state.dica.id);
            promise.then(response => {

                this.setState({
                    dica: response,
                    isLoading: false
                });
            notification.success({
                message: 'Boon',
                description: "Nova Dica.",
              });
                       
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

    handleOpenNivel(event){
        this.setState({ visualizarDica: false});

    }
    
    handleSubmitResposta(event) {
        event.preventDefault();
        
        this.setState({
            isLoading: true
        });

        let promise;
        if(this.state.tentativaResposta == this.state.dica.nivelGame.resposta){
            promise = proximoNivel(this.state.dica.nivel.id);
            promise.then(response => {

                this.setState({
                    dica: response,
                    isLoading: false
                });
            notification.success({
                message: 'Boon',
                description: "Nivel alterado com sucesso.",
              });
                       
        }).catch(error => {

            this.setState({
                isLoading: false
            });
            notification.error({
                message: 'Boon',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            }); 
        });
        }else{

            this.setState({
                isLoading: false
            });
            notification.success({
                message: 'Boon',
                description: "Resposta errada, vá para o proxima dica.",
              });   
        }
        
    }

    
    handleSelectPersonagem(event, idPersonagem) {
        event.preventDefault();
        let promise;

        this.setState({
            isLoading: true
        });
       console.log(idPersonagem);
     
        promise =  selectPersonagem(idPersonagem);
        promise
        .then(response => {
            notification.success({
                message: 'Boon',
                description: "Jogo Iniciado.",
              });
              this.setState({
                dica: response,
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


    loadGame() {
        let promise;
        promise = getGame();
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {

            this.setState({
                dica: response,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
      }


    loadPersonagens() {
        let promise;
        promise = getAllPersonagens();
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            const personagens = this.state.personagens.slice();

          console.log(response);

            this.setState({
                personagens: personagens.concat(response.content),
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
      }

    loadRanking() {
        let promise;
        promise = getRankingDot();
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            const clients = this.state.clients.slice();

          console.log(response);

            this.setState({
                clients: clients.concat(response),
                isLoading: false,
                editableEmpresa: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
      }
    componentDidMount() {
        //this.loadRanking();
        this.loadPersonagens();
        this.loadGame();
      }

    handleUpdateEmpresa = (empresa) =>{
  
        this.setState({
         empresa:empresa,
         editableEmpresa:true
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
      
    render(){
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        //const clientsViews = [];
        //this.state.clients.forEach((client, clientIndex) => {
            //clientsViews.push(<Client 
                //key={client.id} 
                //client={client} />)            
        //});
        this.state.gameViews = [];

        if(this.state.visualizarDica ){
            this.state.gameViews.push(<DicaHome 
                handleOpenNivel= {(event) => this.handleOpenNivel(event)}
                key={this.state.dica.id}  
                dica={this.state.dica} />)
        }
        if(!this.state.visualizarDica && this.state.dica != null ){
            this.state.gameViews.push(<NivelHome 
                    key={this.state.dica.nivelGame.id} 
                    handleProximaDica={(event) => this.handleProximaDica(event)}
                    handleOpenDica={(event) => this.handleOpenDica(event,this.state.dica)}
                    handleInputChange={(event) => this.handleInputChange(event)}
                    handleSubmitResposta={(event) => this.handleSubmitResposta(event)}
                    nivel={this.state.dica.nivelGame} 
                    tentativaResposta={this.state.tentativaResposta}/>)
        }
        if(this.state.dica == null){
            this.state.personagens.forEach((personagem, personagemIndex) => {
                this.state.gameViews.push(<PersonagemHome 
                    handleSelectPersonagem={(event) => this.handleSelectPersonagem(event,personagem.id)}
                    key={personagem.id} 
                    personagem={personagem} />)            
            });
        }
        
        return  (
            <div className="polls-container">
            {this.state.gameViews}
          
            </div>
        );
    }
}


export default Home;