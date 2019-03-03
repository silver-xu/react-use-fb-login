import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useFacebookLogin } from "./use-fb-login";

const App = () => {
  const facebookProps = {
    appId: "566204683881459",
    language: "EN",
    version: "3.1",
    fields: ["id", "email", "name"],
    onFailure: error => {
      console.log(error);
    }
  };
  const [state, login, logout] = useFacebookLogin(facebookProps);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {state.loaded ? (
          state.currentUser ? (
            <div>Currently logged in as: {state.currentUser.name}</div>
          ) : (
            <div>Not logged in</div>
          )
        ) : (
          <div>Retrieving User from Facebook...</div>
        )}
        <br />
        {state.loaded ? (
          state.isLoggedIn ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={login}>Login</button>
          )
        ) : null}
      </header>
    </div>
  );
};

export default App;
