import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import { getClientByUsername } from '../util/APIUtils';
import { Statistic, Row, Col, Icon } from 'antd';


class LinkCadastro extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            client: null,
            isLoading: false,
            codigoIndicacao:''
        };
    }

    componentDidMount() {
        this.getClientByUsername();
    }

    getClientByUsername() {
        let promise;
        promise = getClientByUsername(this.props.currentUser.username);
      
        if(!promise) {
            return;
        }
      
        this.setState({
            isLoading: true
        });
      
        promise            
        .then(response => {
            this.setState({
                client : response,
                isLoading: false,
                codigoIndicacao:response.codigoIndicacao
            })

            console.log(response);
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }


    render(){

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        return( 
        <div className="new-poll-container">
            <h1 className="page-title">Compartilhe o link</h1>
            <div className="new-poll-content">
            <Row gutter={16}>
                <Col span={16}>
                <Statistic title="Compartilhe e ganhe dinheiro." value={this.state.codigoIndicacao} prefix={<Icon type="share-alt" />} />
                </Col>
            </Row>
            </div>
        </div>
        );
    }
}

export default LinkCadastro;