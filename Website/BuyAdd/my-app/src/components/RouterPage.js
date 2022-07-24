import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import App from './App';
import AdUpload from './AdUpload/AdUpload';
import MetamaskTest from './MetaMaskTest/MetaMaskTest';
import Covalent from './CovalentJson/Covalent';
 
class RouterPage extends Component {
  render() {
    return (
      <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/upload">
            <AdUpload />
          </Route>
          <Route path="/metamask">
            <MetamaskTest/>
          </Route>
          <Route path="/covalent">
            <Covalent/>
          </Route>
        </Switch>
      </div>
    </Router>
   );
  }
}
 
export default RouterPage;