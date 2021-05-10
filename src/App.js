import Login from './components/login';
import Channel from './components/channel';
import Register from './components/register';
import Home from './components/home';
import NavBar from './components/navbar';
import User from './components/user';
import { useEffect, useState } from "react";
import './styles/App.css';

const { HashRouter, Switch, Route } = require("react-router-dom");

function App() {
  const [apiURL, setApiUrl] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const verifyToken = () => {
    if(localStorage.getItem('token') === null) {
      return;
    }

    fetch('http://localhost:3000/user/verify',{
      method:'GET', 
      headers: { 'Content-Type': 'application/json',
      'Authorization' : 'Bearer ' + localStorage.getItem('token') },
      mode:'cors'
    })
    .then(res => {
      if(res.status === 403 || res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        setLoggedIn(false);
      }
      else {
        setLoggedIn(true);
      }
    }) 
  }

  function setLogin(status) {
    if(status === false) {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      setLoggedIn(false);
    }
    else {
      setLoggedIn(true);
    }
  }

  useEffect(() => {
  }, [loggedIn])

  useEffect(() => {
      setApiUrl("http://localhost:3000");
      verifyToken();
  }, [])

  useEffect(() => {
  }, [apiURL])

  return (
    <div className="App">
      <HashRouter hashType={'slash'}>
        <NavBar setLogin={setLogin} loggedIn={loggedIn}/>
        <Switch>
          <Route path='/' exact><Home apiURL={apiURL === '' ? '' : apiURL}/></Route>
          <Route path='/channel/:id' exact><Channel apiURL={apiURL === '' ? '' : apiURL}/></Route>
          <Route path='/user/:id' exact><User apiURL={apiURL === '' ? '' : apiURL}/></Route>
          <Route path='/register' exact><Register loggedIn={loggedIn} apiURL={apiURL === '' ? '' : apiURL}/></Route>
          <Route path='/login' exact><Login setLogin={setLogin} loggedIn={loggedIn} apiURL={apiURL}/></Route>
          <Route path='/channels' exact><Channel apiURL={apiURL}/></Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
