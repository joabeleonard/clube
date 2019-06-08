import React, { Component } from 'react';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
import LoadingIndicator  from '../common/LoadingIndicator';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart, Pie
  } from 'recharts';
import { getDataReportAvaliacoes, getDataReportVendas } from '../util/APIUtils';

  
  const data = [
    {
      name: 'Jan', quant: 29, valor: 433
    },
    {
        name: 'Fev', quant: 35, valor: 544
      }
  ];  

  const data01 = [
    { name: 'Nota 1', value: 400 }, { name: 'Nota 2', value: 300 },
    { name: 'Nota 3', value: 300 }, { name: 'Nota 4', value: 200 },
    { name: 'Nota 5', value: 278 }
  ];
class Relatorios extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            reportAvaliacoes:[],
            reportVendas: []
        };
    }

    componentDidMount() {
      this.loadDataReportVendas();
      this.loadDataReportAvaliacoes();
    }
    
    loadDataReportVendas(){
      let promise;
         promise = getDataReportVendas();
       
         if(!promise) {
             return;
         }
       
         this.setState({
             isLoading: true
         });
         promise            
         .then(response => {
             console.log(response);
             this.setState({
                 reportVendas: response
             });
             this.setState({
              isLoading: false
          })
 
         }).catch(error => {
             console.log(error);
             this.setState({
                 isLoading: false
             })
         });  
         
       }   

       
    loadDataReportAvaliacoes(){
      let promise;
         promise = getDataReportAvaliacoes();
       
         if(!promise) {
             return;
         }
       
         this.setState({
             isLoading: true
         });
         promise            
         .then(response => {
            console.log(response);
             this.setState({
                 reportAvaliacoes: response
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

        return (

            <div className="new-poll-container">
                <h1 className="page-title">Relatórios gerenciais</h1>               
                <div className="new-poll-content">
                <BarChart
                    width={500}
                    height={300}
                    data={this.state.reportVendas}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quant" fill="#8884d8" />
                  <Bar dataKey="valor" fill="#82ca9d" />
                </BarChart>
                </div> 

                 <h1 className="page-title">Avaliação das Empresas</h1>               
                <div className="new-poll-content">
                  <PieChart width={400} height={400}>
                    <Pie dataKey="value" isAnimationActive={false} 
                    data={this.state.reportAvaliacoes} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
                    <Tooltip />
                  </PieChart>
                </div>   
            </div>
        );
    }
}

export default Relatorios;