import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import styled from 'styled-components';
import {Provider, useSelector} from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {combineReducers, createStore} from 'redux';
import {firebaseReducer, isLoaded, ReactReduxFirebaseProvider, useFirebaseConnect} from 'react-redux-firebase';
import YoutubePlayer from 'react-youtube-player';
import randomColor from 'randomcolor';
import AwesomeDanmaku from 'awesome-danmaku';
import {TweenLite, TweenMax} from 'gsap';
import qr from './qr.png';

const fbConfig = {
    apiKey: "AIzaSyCUiCnctpNoQ3AZ6-J7EkXcqP3P6rorEuA",
    authDomain: "hypermedia-667d9.firebaseapp.com",
    databaseURL: "https://hypermedia-667d9.firebaseio.com",
    projectId: "hypermedia-667d9",
    storageBucket: "hypermedia-667d9.appspot.com",
    messagingSenderId: "323888738549",
    appId: "1:323888738549:web:6e521e7d0ed78d433f95bc",
    measurementId: "G-3G7HTZP887"
}

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users'
}

// Initialize firebase instance
firebase.initializeApp(fbConfig);


// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer
})

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
}

const AppWrapper = styled.div`

  display: flex;
  flex-direction: column
  height: 100vh;
  //background-color: transparent;
  justify-content: space-between;
  overflow: hidden;
`;

const InputWrapper = styled.input`
  font-family: 'Roboto', sans-serif;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1em;
  font-size: 2em;
  color: #6FFFB0;
  background-color: black;
  border-width: 0px;
  border:none;
  :focus {
    outline: none;
  }
  ::placeholder {
      color: #FD6FFF;
  }
`;



function App() {
    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <AppWrapper>
                    <ChatApp/>
                </AppWrapper>
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

let shownDanMu = {};

const opts = {
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

const ChatApp = props => {
    return (
        <div style={{"height": "100%"}}>
            <div style={{display: 'flex', height: "calc(100% - 106px)"}}>
                <DanMu />
                <YoutubePlayer opts={opts} videoId={'sCNrK-n68CM'}/>
            </div>
            <Input/>
        </div>
    );
}

const DanMu = props => {
    useFirebaseConnect([
        {type: 'child_added', path: '/bullets'}
    ]);

    // The data coming from firebase
    const bullets = useSelector(state => state.firebase.data.bullets)
    const danMuPlayerRef = useRef(null);
    let tweenRef = useRef(null);
    const [danMuPlayer, setDanMuPlayer] = useState(null);

    const sendGifs = () => {
      
    }
    

    useEffect(() => {
        setDanMuPlayer(AwesomeDanmaku.getPlayer({
            el: danMuPlayerRef.current,
            maxCount: 50,
            trackCount: 5
        }));

        // TweenMax.fromTo(
        //   tweenRef.current,
        //   10,
        //   {x: '100vw'},
        //   {x: '-999', repeat: 0,}
        // )

        
    }, [danMuPlayerRef]);

    if (danMuPlayer) {
        danMuPlayer.play();

        if (isLoaded(bullets) && bullets && Object.keys(bullets).length > 0) {
            Object.keys(bullets).forEach(k => {
                if (k in shownDanMu) {
                    return;
                }
                danMuPlayer.insert({
                    value: bullets[k],
                    opacity: .9,
                    color: randomColor({luminosity: 'bright', hue: 'hotpink'}),
                    fontSize: '2em',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                    speed: .5,
                    tracks: 10,
                }, true);

                shownDanMu[k] = true;
            });
        }
    }

    return (
      <div>
        <div style={{ fontSize: 50 }} ref={danMuPlayerRef}
          style={{zIndex: 9999, width: "100%", position: "absolute", height: "calc(100% - 106px)"}} />
          {/* <div style={{position: 'absolute', bottom: 100, right: 0}}>
            <img src={qr} />
          </div> */}
          {/* <div style={{zIndex: 9999, width: "100%", position: "absolute", height: "calc(100% - 106px)"}} ref={tweenRef}><img src="https://media.giphy.com/media/6XjF2YYHFTkWI/giphy.gif" /></div> */}
      </div>

    );
}

const Input = props => {
    const [value, setValue] = useState("");
    function handleInputChange(e) {
        setValue(e.target.value);
    }

    // Event handler - We call this method after hitting "Enter" to save the data into firebase
    function handleEnterPressed(e) {
        // Key Code: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        if ((e.keyCode ? e.keyCode : e.which) !== 13) {
            return;
        }

        // Save it to firebase
        firebase.push("bullets", value);
        setValue("");
    }

    return (
      <div>
        <InputWrapper
            placeholder="type something"
            onChange={handleInputChange}
            value={value}
            onKeyPress={handleEnterPressed}
        />
        <div className="qr">
            <h1>Scan and send us a message!</h1>
            <img src={qr} / >
        </div>
      </div>

    );
}

export default App;
