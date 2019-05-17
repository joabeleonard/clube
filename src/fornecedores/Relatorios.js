import React, { Component } from 'react';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
import LoadingIndicator  from '../common/LoadingIndicator';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
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
class Relatorios extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
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
            </div>
        );
    }
}

export default Relatorios;