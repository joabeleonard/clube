import React, { Component } from 'react';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
import LoadingIndicator  from '../common/LoadingIndicator';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart, Pie
  } from 'recharts';
import { getDataReportAvaliacoes, getDataReportVendas } from '../util/APIUtils';

  
  const data = [
    {
      name: 'Jan', Quant: 29, Valor: 433, amt: 2400,
    },
    {
        name: 'Fev', Quant: 35, Valor: 544, amt: 2400,
      },
    {
      name: 'Mar', Quant: 45, Valor: 734, amt: 2210,
    },
    {
      name: 'Abr', Quant: 52, Valor: 655, amt: 2290,
    },
    {
      name: 'Mai', Quant: 77, Valor: 788, amt: 2000,
    },
    {
      name: 'Jun', Quant: 93, Valor: 833, amt: 2181,
    },
    {
      name: 'Jul', Quant: 45, Valor: 874, amt: 2500,
    },
    {
      name: 'Ago', Quant: 59, Valor: 766, amt: 2100,
    },
    {
      name: 'Set', Quant: 99, Valor: 923, amt: 2100,
    },
    {
        name: 'Out', Quant: 222, Valor: 732, amt: 2100,
      },
      {
        name: 'Nov', Quant: 322, Valor: 2222, amt: 2100,
      },
      {
        name: 'Dez', Quant: 290, Valor: 2343, amt: 2100,
      },
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
      console.log("dss");
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
             const categorias = this.state.categorias.slice();
             this.setState({
                 reportVendas: response
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
                    data={data}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Quant" fill="#8884d8" />
                  <Bar dataKey="Valor" fill="#82ca9d" />
                </BarChart>
                </div> 

                 <h1 className="page-title">Avaliação das Empresas</h1>               
                <div className="new-poll-content">
                  <PieChart width={400} height={400}>
                    <Pie dataKey="value" isAnimationActive={false} data={this.state.reportAvaliacoes} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
                    <Tooltip />
                  </PieChart>
                </div>   
            </div>
        );
    }
}

export default Relatorios;