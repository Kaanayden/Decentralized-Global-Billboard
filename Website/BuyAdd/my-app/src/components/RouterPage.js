import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import App from './App';
import AdUpload from './AdUpload/AdUpload';
 
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
        </Switch>
      </div>
    </Router>
   );
  }
}
 
export default RouterPage;