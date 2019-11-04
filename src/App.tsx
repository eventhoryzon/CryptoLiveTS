import React, { Component } from "react";
import Header from "./Component/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/style.css";
const Body = require("./Component/Body").default;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header branding="CryptoLive" navbar-nav mr-auto />
        <div className="container">
          <Body />
        </div>
      </div>
    );
  }
}
export default App;
