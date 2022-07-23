import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import App from './App';
import AdUpload from './AdUpload/AdUpload';
<<<<<<< HEAD
import MetamaskTest from './MetaMaskTest/MetaMaskTest';
=======
import MetaConnect from './MetaMask/MetaMask';
>>>>>>> bb8de8964bc6e0e7ea5c1878b5b1211d5bbca2ed
 
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
<<<<<<< HEAD
          <Route path="/metamask">
            <MetamaskTest/>
=======
          <Route path='/MetaMask'>
            <MetaConnect/>
>>>>>>> bb8de8964bc6e0e7ea5c1878b5b1211d5bbca2ed
          </Route>
        </Switch>
      </div>
    </Router>
   );
  }
}
 
export default RouterPage;