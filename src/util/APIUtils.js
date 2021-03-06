import { API_BASE_URL, POLL_LIST_SIZE,CLIENT_LIST_SIZE,LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response =>           
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllClients(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/clients?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllPersonagens(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/personagens?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getGame() {
   
    return request({
        url: API_BASE_URL + "/dicas/game" ,
        method: 'GET'
    });
}

export function getAllEtapas(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/nivel?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllDicas(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/dicas?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllQuestionarios(page, size) {
    page = page || 0;
    size = size || LIST_SIZE;

    return request({
        url: API_BASE_URL + "/questionarios?page=" + page + "&size=" + size,
        method: 'GET'
    });
}
export function removeClient(id) {
    return request({
       url: API_BASE_URL + "/clients/" + id,
       method: 'DELETE'
   });
}

export function desativarQuestionarios(data) {
     return request({
        url: API_BASE_URL + "/desativar" ,
        method: 'put',
        body: JSON.stringify(data) 
    });
}


export function getExtrato(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/extrato?page=" + page + "&size=" + size,
        method: 'GET'
    });
}


export function getAllEmpresas(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/empresa?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function pesquisarEmpresa(nome, categoria, page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/empresa/empresaSearch?nome=" + nome + "&categoria=" + categoria + "&page=" + page + "&size=" + size,
        method: 'GET'
    });
}


export function removeEmpresa(id) {
     return request({
        url: API_BASE_URL + "/empresa/" + id,
        method: 'DELETE'
    });
}

export function createEmpresa(data) {
    return request({
        url: API_BASE_URL + "/empresa",
        method: 'POST',
        body: JSON.stringify(data)         
    });
}

export function proximaDica(id) {
    return request({
        url: API_BASE_URL + "/dicas/proximaDica?id="+id,
        method: 'get'         
    });
}
export function proximoNivel(id) {
    return request({
        url: API_BASE_URL + "/nivel/proximoNivel?id="+id,
        method: 'get'         
    });
}

export function createCupom(empresa, cliente) {
    return request({
        url: API_BASE_URL + "/cupom/generate?empresa=" + empresa+ "&cliente="+cliente,
        method: 'GET'    
    });
}

export function editCupom(data) {
    return request({
        url: API_BASE_URL + "/cupom/avaliar",
        method: 'PUT',
        body: JSON.stringify(data)         
    });
}

export function editEmpresa(data) {
    return request({
        url: API_BASE_URL + "/empresa",
        method: 'PUT',
        body: JSON.stringify(data)         
    });
}

export function usarCupom(cupom) {
    return request({
        url: API_BASE_URL + "/cupom",
        method: 'PUT',
        body: JSON.stringify(cupom)         
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function createClient(clientData) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(clientData)         
    });
}

export function createPersonagem(personagemData) {
    return request({
        url: API_BASE_URL + "/personagens",
        method: 'POST',
        body: JSON.stringify(personagemData)         
    });
}
export function createNivel(nivelData) {
    return request({
        url: API_BASE_URL + "/nivel",
        method: 'POST',
        body: JSON.stringify(nivelData)         
    });
}
export function createDica(dicaData) {
    return request({
        url: API_BASE_URL + "/dicas",
        method: 'POST',
        body: JSON.stringify(dicaData)         
    });
}
export function editClient(clientData) {
    return request({
        url: API_BASE_URL + "/clients",
        method: 'PUT',
        body: JSON.stringify(clientData)         
    });
}

export function editPersonagem(personagemData) {
    return request({
        url: API_BASE_URL + "/personagens",
        method: 'PUT',
        body: JSON.stringify(personagemData)         
    });
}

export function editNivel(nivelData) {
    return request({
        url: API_BASE_URL + "/nivel",
        method: 'PUT',
        body: JSON.stringify(nivelData)         
    });
}

export function editDica(dicaData) {
    return request({
        url: API_BASE_URL + "/dicas",
        method: 'PUT',
        body: JSON.stringify(dicaData)         
    });
}


export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function getClientByUsername(username) {
    return request({
        url: API_BASE_URL + "/clients/username?username=" + username,
        method: 'GET'
    });
}

export function validarCupom(cupom) {
    return request({
        url: API_BASE_URL + "/cupom?cupom=" + cupom,
        method: 'GET'
    });
}



export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function selectPersonagem(idPersonagem) {
    return request({
        url: API_BASE_URL + "/personagens/selectPersonagem?idPersonagem=" + idPersonagem,
        method: 'GET'
    });
}

export function loadCuponsUsados(){
    return request({
        url: API_BASE_URL + "/cupom/cuponsParaAvaliar",
        method: 'GET'
    });
}

export function getDataReportAvaliacoes(){
    return request({
        url: API_BASE_URL + "/reports/dataReportAvaliacoes",
        method: 'GET'
    });
}

export function getDataReportVendas(){
    return request({
        url: API_BASE_URL + "/reports/dataReportVendas",
        method: 'GET'
    });
}


export function getRankingDot(){
    return request({
        url: API_BASE_URL + "/clients/rankingDot",
        method: 'GET'
    });
}

export function getRankingExperiencia(){
    return request({
        url: API_BASE_URL + "/clients/rankingExperiencia",
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });

}

export function getCategorias() {
    
    return request({
        url: API_BASE_URL + "/empresa/categorias" ,
        method: 'GET'
    });
}

export function getCupomByCliente(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/cupom/cliente/" + username + "?page=" + page + "&size=" + size,
        method: 'GET'
    });

    
}