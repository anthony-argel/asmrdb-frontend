import Login from "./components/login";
import Channel from "./components/channel";
import ChannelForm from "./components/channelform";
import Channels from "./components/channels";
import Register from "./components/register";
import Home from "./components/home";
import NavBar from "./components/navbar";
import Tag from "./components/tag";
import Tags from "./components/tags";
import User from "./components/user";
import Boards from "./components/boards";
import Thread from "./components/thread";
import Board from "./components/board";
import Search from "./components/search";
import { useEffect, useState } from "react";
import "./styles/App.css";

const { HashRouter, Switch, Route } = require("react-router-dom");

function App() {
    const [apiURL, setApiUrl] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const verifyToken = () => {
        if (localStorage.getItem("token") === null) {
            return;
        }

        fetch("https://dry-hollows-28901.herokuapp.com/user/verify", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            mode: "cors",
        }).then((res) => {
            if (res.status === 403 || res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
        });
    };

    function setLogin(status) {
        if (status === false) {
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            setLoggedIn(false);
        } else {
            setLoggedIn(true);
        }
    }

    useEffect(() => {}, [loggedIn]);

    useEffect(() => {
        setApiUrl("https://dry-hollows-28901.herokuapp.com");
        verifyToken();
    }, []);

    useEffect(() => {}, [apiURL]);

    return (
        <div className="App">
            <div style={{ minHeight: "97vh" }}>
                <HashRouter hashType={"slash"}>
                    <NavBar
                        setLogin={setLogin}
                        loggedIn={loggedIn}
                        apiURL={apiURL === "" ? "" : apiURL}
                    />
                    <Switch>
                        <Route path="/" exact>
                            <Home apiURL={apiURL === "" ? "" : apiURL} />
                        </Route>
                        <Route path="/channel/:id" exact>
                            <Channel
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/add" exact>
                            <ChannelForm
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/boards" exact>
                            <Boards
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/board/:id" exact>
                            <Board
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/thread/:id" exact>
                            <Thread
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/user/:id" exact>
                            <User apiURL={apiURL === "" ? "" : apiURL} />
                        </Route>
                        <Route path="/register" exact>
                            <Register
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/tag/:id/:startpos" exact>
                            <Tag
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/tags" exact>
                            <Tags
                                loggedIn={loggedIn}
                                apiURL={apiURL === "" ? "" : apiURL}
                            />
                        </Route>
                        <Route path="/login" exact>
                            <Login
                                setLogin={setLogin}
                                loggedIn={loggedIn}
                                apiURL={apiURL}
                            />
                        </Route>
                        <Route path="/channels/:startpos" exact>
                            <Channels
                                setLogin={setLogin}
                                loggedIn={loggedIn}
                                apiURL={apiURL}
                            />
                        </Route>
                        <Route path="/search/:searchstring/:startpos" exact>
                            <Search apiURL={apiURL === "" ? "" : apiURL} />
                        </Route>
                    </Switch>
                </HashRouter>
            </div>
            <div
                style={{ backgroundColor: "black", minHeight: "3vh" }}
                className="text-center mt-3"
            >
                <a
                    style={{ textDecoration: "none", color: "white" }}
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/anthony-argel"
                >
                    Developer
                </a>
            </div>
        </div>
    );
}

export default App;
