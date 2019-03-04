# useFacebookLogin for React Hooks

useFacebookLogin allows you to use the latest React Hook to login / logout using Facebook Logins.

## Installation

```shell
npm install react-use-fb-login --save
```

## Fork
https://github.com/silver-xu/react-use-fb-login


## Issue tracking
https://github.com/silver-xu/react-use-fb-login/issues


## Usage:

```js
import React from "react";
import { useFacebookLogin } from "react-use-fb-login";

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
  const [{ loaded, currentUser, isLoggedIn }, login, logout] = useFacebookLogin(
    facebookProps
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loaded ? (
          currentUser ? (
            <div>Currently logged in as: {currentUser.name}</div>
          ) : (
            <div>Not logged in</div>
          )
        ) : (
          <div>Retrieving User from Facebook...</div>
        )}
        <br />
        {loaded ? (
          isLoggedIn ? (
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

```
I appreciate my wife to letting me using our precious family time to work on this project.
