import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useGoogleLogin } from "react-google-login";

const clientId =
  "400905271083-3vand57i3q59oks52jcunoa40ure8pm3.apps.googleusercontent.com";

console.log(clientId);

function App() {
  let [username, setUsername] = useState("");
  let tokenId;
  let [showLogin, setShowLogin] = useState(true);
  let [showSubscribe, setShowSubscribe] = useState(false);
  let [url, setUrl] = useState("");
  let videoId;
  let [keywords, setKeywords] = useState([]);
  let [showKeywords, setShowKeywords] = useState(false);
  let tempKeyword;
  let [showComments, setShowComments] = useState(false);

  const onSuccess = (res) => {
    console.log(res.tokenId);
    console.log(res.profileObj.name);
    setUsername(res.profileObj.name);
    tokenId = res.tokenId;
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
    setShowSubscribe(false);
    setShowComments(true);
  };

  let handleAddKeywords = () => {
    console.log("keyword :", keywords.length);
    console.log("tempkeyword :", tempKeyword);
    if (tempKeyword && keywords.length <= 9) {
      setKeywords((keywords) => keywords.concat(tempKeyword));
      setShowKeywords(true);
    }
    if (keywords.length >= 10) {
      alert(
        tempKeyword +
          " not added, you have already entered max 10 inputs for comment keywords"
      );
    }
    document.getElementById("keywordinput").value = "";
  };

  let handleUnubscribe = () => {
    // handle the unsubscribe
    console.log("unsubscribe");
    setKeywords([]);
    setUrl("");
    setShowSubscribe(true);
    setShowComments(false);
    setShowKeywords(false);
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
          <div>Welcome {username}</div>
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

      {showComments && (
        <div>
          <div>URL : {url}</div>
          <div>Keywords : {keywords.toString()}</div>
          <div>comments will apprear here</div>
          <button onClick={handleUnubscribe} className="button">
            <span className="buttonText">Unsubscribe</span>
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
