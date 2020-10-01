import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useGoogleLogin, useGoogleLogout } from "react-google-login";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";

const clientId =
  "400905271083-3vand57i3q59oks52jcunoa40ure8pm3.apps.googleusercontent.com";
const ENDPOINT = "http://localhost:8080/";

let socket = io(ENDPOINT);
let keycount = 0;

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
  let [comments, setComments] = useState([]);
  let [displayText, setDisplayText] = useState("comments will apprear here");
  let [showLoadingComments, setShowLoadingComments] = useState(false);

  const onSuccess = (res) => {
    console.log("user logged in : ", res.profileObj.name);
    setUsername(res.profileObj.name);
    tokenId = res.tokenId;
    setShowLogin(false);
    setShowSubscribe(true);
    socket.emit("login", { token: res.tokenId });
  };

  const onFailure = (res) => {
    console.log("login failed ", res);
  };

  const onLogoutSuccess = (res) => {
    socket.emit("stopPolling", { data: "stopPolling" });
    setShowLogin(true);
    setShowComments(false);
    setKeywords([]);
    setUrl();
    setShowSubscribe(false);
    setComments([]);
    console.log("user logged out");
    setUsername("");
    tokenId = "";
    videoId = "";
    setDisplayText("comments will appear here");
  };

  const onLogoutFailure = (res) => {
    console.log("logout failed");
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: "offline",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
  });

  const { signOut } = useGoogleLogout({
    onFailure: onLogoutFailure,
    clientId: clientId,
    onLogoutSuccess,
    isSignedIn: true,
  });

  let handleSubscribe = () => {
    // handel the subscribe.

    setShowLoadingComments(true);
    showLoadingComments = true;
    console.log("url entered : ", url);
    videoId = url.split("v=")[1].substring(0, 11);
    console.log("video id extracted : ", videoId);
    setShowSubscribe(false);
    setShowComments(true);
    socket.emit("subscribe", { videoId, keywords });
    if (keywords.length == 0) {
      setDisplayText("showing all the comments ( since no keyword entered) : ");
    }
  };

  useEffect(() => {
    socket.on("commentsReady", (data) => {
      setShowLoadingComments(false);
      console.log("comment received : ", data.data);
      var tempcomment = comments.concat([data.data]);
      comments = tempcomment;
      setComments(comments);
      showLoadingComments = false;
      setShowLoadingComments(false);
    });
  }, [showComments]);

  let handleAddKeywords = () => {
    setDisplayText("");
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
    socket.emit("stopPolling", { data: "stopPolling" });
    comments = "";
    console.log("unsubscribed");
    setKeywords([]);
    setUrl("");
    setShowSubscribe(true);
    setShowComments(false);
    setShowKeywords(false);
    setComments([]);
  };

  return (
    <React.Fragment>
      <div className="App-header">
        {showLogin && (
          <div>
            <Button variant="primary" onClick={signIn} className="button">
              Sign in with Google
            </Button>
          </div>
        )}
        {!showLogin && (
          <div>
            <Container fluid>
              <Row>
                <Col>
                  <b />
                  <div>Welcome {username}</div>
                </Col>
                <Col xs={6}> </Col>
                <Col>
                  {" "}
                  <b />{" "}
                  <Button
                    variant="outline-info"
                    onClick={signOut}
                    className="button"
                  >
                    Sign out
                  </Button>
                </Col>
              </Row>
            </Container>
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
            {showKeywords && <div> Keywords : {keywords.toString()}</div>}
            <br></br>
            <label>
              <input
                id="keywordinput"
                type="text"
                value={tempKeyword}
                onChange={(e) => {
                  tempKeyword = e.target.value;
                }}
                placeholder="enter the keywords here"
              />
            </label>
            <Button onClick={handleAddKeywords} className="button">
              <span className="buttonText">Add keywords</span>
            </Button>
            <br></br>

            <Button variant="primary" onClick={handleSubscribe}>
              subscribe
            </Button>
          </div>
        )}

        {showComments && (
          <div>
            <div>
              {" "}
              <b>URL : </b>
              {url}
            </div>
            <div>
              <b>Keywords : </b>
              {keywords.toString() || "**NA**"}
            </div>
            <div>
              <strong>Comments : </strong>
              <i>{displayText}</i> <br />
              <br />
              {showLoadingComments && (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
              {comments.map((comment) => (
                <li key={keycount++}>{comment}</li>
              ))}
            </div>
            <Button
              variant="primary"
              onClick={handleUnubscribe}
              className="button"
            >
              Unsubscribe
            </Button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
