import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import {loadCuponsUsados, editCupom} from '../util/APIUtils';

import { Layout, Menu, Dropdown, Icon,Modal, notification,Form, Input,Upload } from 'antd';
import StarRatingComponent from 'react-star-rating-component';


const Header = Layout.Header;
    
const FormItem = Form.Item;

const { TextArea } = Input
const Dragger = Upload.Dragger;

const uploadProps   = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:5000/api/arquivo/upload',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      notification.success({
        message: 'Boon',
        description: "Arquivo enviado com sucesso.",
      });

      uploadProps.name = info.file.name;

    } else if (status === 'error') {
      notification.error(`${info.file.name} file upload failed.`);
    }
  }
};

class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
        this.loadCuponsUsados = this.loadCuponsUsados.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
          cupom: [],
          menuOpen: false,
          visible: false,
          rating: 1,
          avaliacao: null
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
      e.preventDefault();
      let promise;

      this.setState({
          isLoading: true
      });
     
      this.state.cupom.descricaoAvaliacao = this.state.avaliacao;
      this.state.cupom.nomeArquivoComprovante = uploadProps.name;
      promise =  editCupom(this.state.cupom);
      promise
      .then(response => {
          notification.success({
              message: 'Boon',
              description: "Avaliação realizada com sucessos.",
            });
            this.setState({
              isLoading: false,
              visible: false
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

  handleInputChange(event) {
    const value = event.target.value;
    this.setState({
        avaliacao:value
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

    onStarClick(nextValue, prevValue, name) {
      this.setState({rating: nextValue});
      this.state.cupom.notaAvaliacao=nextValue;
    }
  


    render() {
        let menuItems;

        const { rating } = this.state;

        if(this.props.currentUser) {
          menuItems = [
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" className="nav-icon" />
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
              <h2>Avaliação da empresa: {this.state.cupom.empresa}</h2>
              <StarRatingComponent 
              name="rate1" 
              starCount={10}
              value={rating}
              onStarClick={this.onStarClick.bind(this)} />

                        <FormItem>
                          <TextArea 
                            placeholder="Qual sua avaliação?"
                            style = {{ fontSize: '16px' }} 
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "avaliacao"
                            value = {this.state.avaliacao}
                            onChange = {this.handleInputChange} />
                        </FormItem>

                        <Dragger {...uploadProps} reName={this.state.cupom.codigo} >
                          <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                          </p>
                          <p className="ant-upload-text">Clique ou arraste o arquivo para essa area </p>
                          <p className="ant-upload-hint">Adicione um arquivo que comprove o uso do cupom.</p>
                        </Dragger>
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