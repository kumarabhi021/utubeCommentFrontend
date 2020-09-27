import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useGoogleLogin } from "react-google-login";

const clientId =
  "400905271083-3vand57i3q59oks52jcunoa40ure8pm3.apps.googleusercontent.com";

console.log(clientId);

function App() {
  let [showLogin, setShowLogin] = useState(true);
  let [showSubscribe, setShowSubscribe] = useState(false);
  let [url, setUrl] = useState("");
  let videoId;
  let [keywords, setKeywords] = useState([]);
  let [showKeywords, setShowKeywords] = useState(false);
  let tempKeyword;
  const onSuccess = (res) => {
    console.log(res.tokenId);
    console.log(res.profileObj.name);
    setShowLogin(false);
    setShowSubscribe(true);
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
    scope: "https://www.googleapis.com/auth/youtube.readonly",
  });

  let handleSubscribe = () => {
    // handel the subscribe.
    console.log(url);
    videoId = url.split("v=")[1].substring(0, 11);
    console.log(videoId);
  };

  let handleAddKeywords = () => {
    console.log("keyword :", keywords);
    console.log("tempkeyword :", tempKeyword);
    setKeywords((keywords) => keywords.concat(tempKeyword));
    setShowKeywords(true);
    document.getElementById("keywordinput").value = "";
  };
  return (
    <React.Fragment>
      {showLogin && (
        <div>
          <button onClick={signIn} className="button">
            <span className="buttonText">Sign in with Google</span>
          </button>
        </div>
      )}
      {showSubscribe && (
        <div>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              placeholder="enter the youtube livestream URL here"
            />
          </label>
          {showKeywords && (
            <div>comment Keywords entered :{keywords.toString()}</div>
          )}
          <br></br>
          <label>
            <input
              id="keywordinput"
              type="text"
              value={tempKeyword}
              onChange={(e) => {
                tempKeyword = e.target.value;
                console.log(tempKeyword);
              }}
              placeholder="enter the keywords here"
            />
          </label>
          <button onClick={handleAddKeywords} className="button">
            <span className="buttonText">Add keywords</span>
          </button>
          <br></br>

          <button onClick={handleSubscribe} className="button">
            <span className="buttonText">subscribe</span>
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
