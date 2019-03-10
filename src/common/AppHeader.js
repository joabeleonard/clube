import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import {loadCuponsUsados} from '../util/APIUtils';

import { Layout, Menu, Dropdown, Icon,Modal, Button } from 'antd';

const Header = Layout.Header;
    

class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
        this.loadCuponsUsados = this.loadCuponsUsados.bind(this);

        this.state = {
          menuOpen: false,
          visible: false
        }
    }

    componentDidMount() {
      this.loadCuponsUsados();
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    }
  
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
    loadCuponsUsados(){
  
      this.setState({
        isLoading: true
      });
      loadCuponsUsados()
      .then(response => {

        console.log(response);
        this.setState({
          cupom: response,
          visible: true,
          isLoading: false
        });
      }).catch(error => {
        console.log(error);
        this.setState({
          isLoading: false
        });  
      });
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    openMenu() {
      this.setState({ menuOpen: true })
    }
  
    closeMenu() {
      this.setState({ menuOpen: false })
    }
  

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" className="nav-icon" />
              </Link>
            </Menu.Item>,
            <Menu.Item key="/poll/new">
            <Link to="/poll/new">
              <img src={pollIcon} alt="poll" className="poll-icon" />
            </Link>
          </Menu.Item>,
          <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu 
                  currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Logar</Link>
            </Menu.Item>,
            <Menu.Item key="/client/new">
              <Link to="/client/new">Cadastrar</Link>
            </Menu.Item>                  
          ];
        }

        return (

         
            <Header className="app-header">
            <div className="container">
            <Modal title="Avaliacão de Consumo"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
              <div className="app-title" >
             
                <Link to="/">Clube de Vantagens</Link>
                
              </div>

             
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Perfil</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);