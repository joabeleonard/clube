import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
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
    console.log(this.props.currentUser);
    if(this.props.currentUser && this.props.currentUser.perfil === 'ROLE_USER'){
      menuItems = [
        <Menu.Item key="/fornecedores">
        <Link to="/fornecedores">
         <Icon type="tags" />Fornecedores
        </Link>     
       </Menu.Item>,
       <Menu.Item key="/clientes" >
         <Link to="/clientes">
           <Icon type="user" />Clientes
         </Link>
       </Menu.Item>       
      ];
    }

    if(this.props.currentUser && this.props.currentUser.perfil === 'ROLE_ADMIN'){
      menuItems = [
        <Menu.Item key="/empresas">
        <Link to="/empresas">
         <Icon type="tags" />Empresas
        </Link>     
       </Menu.Item>,
       <Menu.Item key="/minhasCompras" >
         <Link to="/minhasCompras">
           <Icon type="user" />Minhas Compras
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