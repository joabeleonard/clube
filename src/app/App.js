import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import PollList from '../poll/PollList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import MenuContent from '../common/MenuContent';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import NewClient from '../clientes/NewClient';
import NewEmpresa from '../fornecedores/NewEmpresa';
import ValidarCupom from '../fornecedores/ValidarCupom';


import Clientes from '../clientes/Clientes';
import Fornecedores from '../fornecedores/Fornecedores';





import { Layout, notification } from 'antd';
import EmpresaList from '../fornecedores/EmpresaList';
import CuponsList from '../clientes/CuponsList';
const { Content } = Layout;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Boon',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Boon',
      description: "Autenticação ocorreu com sucesso.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated} 
            currentUser={this.state.currentUser} 
            onLogout={this.handleLogout} />
      
          <Content className="app-content">
            <div className="container">
            
            <MenuContent  currentUser={this.state.currentUser} />
              <Switch>      
                <Route exact path="/" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}>
                </Route>
                <Route path="/login" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username" 
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/empresas" component={Fornecedores} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/empresaList" component={EmpresaList} handleLogout={this.handleLogout} currentUser={this.state.currentUser}></PrivateRoute>

                <PrivateRoute authenticated={this.state.isAuthenticated} path="/empresa/new" component={NewEmpresa} handleLogout={this.handleLogout}></PrivateRoute>
                

                <PrivateRoute authenticated={this.state.isAuthenticated} path="/validarCodigo" component={ValidarCupom} handleLogout={this.handleLogout}></PrivateRoute>

                <PrivateRoute authenticated={this.state.isAuthenticated} path="/clientes" component={Clientes} handleLogout={this.handleLogout}></PrivateRoute>
                <Route  path="/client/new" authenticated={this.state.isAuthenticated} component={NewClient} ></Route>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/minhasCompras" component={CuponsList} handleLogout={this.handleLogout} currentUser={this.state.currentUser} ></PrivateRoute>
               
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);
