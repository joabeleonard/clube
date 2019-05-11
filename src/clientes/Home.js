import React, { Component } from 'react';
import {notification, Form,List,Comment, Input, Timeline ,InputNumber, Button, Radio, Table,Popconfirm } from 'antd'
import { CLIENT_LIST_SIZE } from '../constants';
import { getRankingDot, getRankingExperiencia} from '../util/APIUtils';
import {
    Link,
    withRouter
  } from 'react-router-dom';
  import LoadingIndicator  from '../common/LoadingIndicator';
  import  { Redirect } from 'react-router-dom'
import Client from './Cliente';
  const FormItem = Form.Item;

  const Search = Input.Search;


class Home extends Component{


    constructor(props) {
        super(props);
        this.state = {
            user: [],
            clients:[],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false,
            formLayout: 'vertical',
                search: ''
        };
        this.loadRanking = this.loadRanking.bind(this);
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
        this.loadRanking();
      }

    handleUpdateEmpresa = (empresa) =>{
  
        this.setState({
         empresa:empresa,
         editableEmpresa:true
       });
     }

    
      
    render(){
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        const clientsViews = [];
        this.state.clients.forEach((client, clientIndex) => {
            clientsViews.push(<Client 
                key={client.id} 
                client={client} />)            
        });
     
        return  (
            <div className="polls-container">
            {clientsViews}
          
            </div>
        );
    }
}


export default Home;