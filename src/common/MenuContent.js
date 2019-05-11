import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {loadCuponsUsados} from '../util/APIUtils';

import {
  Link,
  withRouter
} from 'react-router-dom';

class MenuContent extends Component {
  state = {
    current: 'mail',
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }


  render() {

    let menuItems;
    if(this.props.currentUser && this.props.currentUser.perfil === 'ROLE_ADMIN'){
      menuItems = [
        <Menu.Item key="/empresas">
        <Link to="/empresas">
         <Icon type="tags" />Empresas
        </Link>     
       </Menu.Item>,
       <Menu.Item key="/clientes" >
         <Link to="/clientes">
           <Icon type="user" />Clientes
         </Link>
       </Menu.Item>,  
       <Menu.Item key="/questionarios" >
       <Link to="/questionarios">
       <Icon type="question-circle" />Questionarios
       </Link>
     </Menu.Item>     
      ];
    }

    if(this.props.currentUser && this.props.currentUser.perfil === 'ROLE_USER'){
      menuItems = [
        <Menu.Item key="/empresaList">
        <Link to="/empresaList">
         <Icon type="tags" />Empresas
        </Link>     
       </Menu.Item>,
       <Menu.Item key="/minhasCompras" >
         <Link to="/minhasCompras">
           <Icon type="user" />Minhas Compras
         </Link>
       </Menu.Item>,   
       <Menu.Item key="/extrato" >
       <Link to="/extrato">
       <Icon type="profile" />Extrato
       </Link>
     </Menu.Item>,
       <Menu.Item key="/compartilharLink" >
       <Link to="/compartilharLink">
        <Icon type="share-alt" />Compartilhar Link
       </Link>
     </Menu.Item>       
      ];
    }

    if(this.props.currentUser && this.props.currentUser.perfil === 'ROLE_ENTERPRISE'){
      menuItems = [
        <Menu.Item key="/validarCodigo">
        <Link to="/validarCodigo">
         <Icon type="tags" />Validar Código
        </Link>     
       </Menu.Item>,
       <Menu.Item key="/relatorios" >
         <Link to="/relatorios">
           <Icon type="user" />Relatório
         </Link>
       </Menu.Item>       
      ];
    }
    if(this.props.currentUser) {
      return (
        <div className="container">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
             {menuItems} 
          </Menu>
        </div>
      );
    }else{
      return "";
    }
  }
}

export default MenuContent;