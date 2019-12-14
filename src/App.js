import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import styled from 'styled-components';
import { Provider, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { combineReducers, createStore } from 'redux';
import { firebaseReducer, isLoaded, ReactReduxFirebaseProvider, useFirebaseConnect } from 'react-redux-firebase';
import YoutubePlayer from 'react-youtube-player';
import randomColor from 'randomcolor';
import AwesomeDanmaku from 'awesome-danmaku';
import { TweenLite, TweenMax } from 'gsap';
import qr from './qr.png';
import VideoPlayer from './Components/VideoPlayer';
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from './theme';
import Header from './Layout/Header';
import ChatInput from './Components/ChatInput';

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

let shownDanMu = {};

const AppWrapper = styled.div`
    height: 100vh;
  background-color: black;
  //background-color: transparent;
  justify-content: space-between;
  overflow: hidden;
`;

const ScheduleWrapper = styled.div`

`;


function App() {
    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <MuiThemeProvider theme={theme}>
                    <AppWrapper>
                        <Header />
                        <ChatApp />
                        <ChatInput />
                    </AppWrapper>
                </MuiThemeProvider>
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

const ChatApp = props => {
    return (
        <div>
            <div>
                <DanMu />
                <VideoPlayer />
                
            </div>


        </div>
    );
}

const DanMu = props => {
    useFirebaseConnect([
        { type: 'child_added', path: '/bullets' }
    ]);

    // The data coming from firebase
    const bullets = useSelector(state => state.firebase.data.bullets)
    const danMuPlayerRef = useRef(null);
    let tweenRef = useRef(null);
    const [danMuPlayer, setDanMuPlayer] = useState(null);

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
                    color: randomColor({ luminosity: 'bright', hue: 'hotpink' }),
                    fontSize: '2em',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                    speed: 1,
                    tracks: 5,
                }, true);

                shownDanMu[k] = true;
            });
        }
    }

    return (
        <div>
            <div
                ref={danMuPlayerRef}
                style={{ zIndex: 9999, width: "100%", position: "absolute", height: '90vh'}} />
        </div>

    );
}

export default App;
