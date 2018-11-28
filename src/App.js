import React, { Component } from "react";
import "./App.css";
// import "materialize-css";
// import "materialize-css/dist/css/materialize.min.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//components
import AdminCalendar from "./components/AdminCalendar";
import NavBar from "./components/NavBar";
import UserDash from "./components/UserDash";
import AttendLunch from "./components/AttendLunch";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="page-body">
            <NavBar />
            <Switch>
              <Route exact path="/" component={AdminCalendar} />
              <Route path="/userdash" component={UserDash} />
              <Route path="/attendlunch" component={AttendLunch} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
