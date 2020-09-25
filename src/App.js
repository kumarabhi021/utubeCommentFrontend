import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { useGoogleLogin } from "react-google-login";

const clientId =
  "400905271083-3vand57i3q59oks52jcunoa40ure8pm3.apps.googleusercontent.com";

function App() {
  const onSuccess = (res) => {
    console.log(res);
  };

  const onFailure = (res) => {
    console.log("login failed ", res);
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: "offline",
  });

  return (
    <div>
      <button onClick={signIn} className="button">
        <span className="buttonText">Sign in with Google</span>
      </button>
    </div>
  );
}

export default App;
