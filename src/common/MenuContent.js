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
    if(this.props.currentUser) {
      return (
        <div className="container">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="/fornecedores">
             <Link to="/fornecedores">
              <Icon type="tags" />Fornecedores
             </Link>
              
            </Menu.Item>
            <Menu.Item key="/clientes" >
              <Link to="/clientes">
                <Icon type="user" />Clientes
              </Link>
            </Menu.Item>
          
           
          </Menu>
        </div>
      );
    }else{
      return "";
    }
  }
}

export default MenuContent;