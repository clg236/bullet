import React, {useState, useEffect, useRef, createRef} from 'react';
import './App.css';
import {TweenLite, TweenMax} from 'gsap';
import styled from 'styled-components';

import {Provider} from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {combineReducers, createStore} from 'redux';
import {
    firebaseReducer,
    useFirebaseConnect,
    ReactReduxFirebaseProvider,
    isLoaded,
    useFirebase
} from 'react-redux-firebase';
import {useSelector} from "react-redux";

/*
  1. We should create a series of div's with references to hold each chat
    1.1 Can we create ref's on the fly without having to declare them?

*/

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
firebase.initializeApp(fbConfig)

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
  background-color: tomato;
  justify-content: space-between;
`;

const ChatWrapper = styled.div`

`

function App() {
    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <ChatApp/>
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

const ChatApp = props => {
    const firebase = useFirebase();

    //chat listener
    useFirebaseConnect([
        'bullets',
    ]);

    // The data coming from firebase
    const bullets = useSelector(state => state.firebase.data.bullets)

    // Track the input message
    const [currentInput, setCurrentInput] = useState("");

    // If it hasn't been loaded, we display a loading message
    if (!isLoaded(bullets)) {
        return <p>Loading...</p>
    }

    // Event handler - We call this method after hitting "Enter" to save the data into firebase
    function handleEnterPressed(e) {
        // Key Code: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        if ((e.keyCode ? e.keyCode : e.which) !== 13) {
            return ;
        }

        // Save it to firebase
        firebase.push("bullets", currentInput);

        // Clear the input
        setCurrentInput("");
    }

    // Event handler - We call this method if there is any change happening to the input
    function handleInputChange(e) {
        setCurrentInput(e.target.value);
    }

    return (
        <div>
            {/*{Object.keys(bullets).map((key, id) => (<Chats key={key} id={id} chats={bullets[key]}/>))}*/}

            <input
                placeholder="type something"
                onChange={handleInputChange}
                value={currentInput}
                onKeyPress={handleEnterPressed}
            />
        </div>
    );
}

const Chats = props => {

    const chatsRef = useRef([]);

    // we can access the elements with chatsRef.current[n]

    useEffect(() => {
        chatsRef.current = chatsRef.current.slice(0, props.chats.length);
        props.chats.map((chat, i) => {
            return (
                TweenMax.fromTo(
                    [chatsRef.current[i]],
                    0.5,
                    {x: '100vw'},
                    {x: 0, repeat: 0,}
                )
            );
        })
    }, [props.chats]);

    return props.chats.map((chat, i) => (
        <div
            key={i}
            ref={el => chatsRef.current[i] = el}
            style={{fontSize: 40, width: `${(i + 1) * 100}px`}}>
            {chat}
        </div>
    ));
}

export default App;
