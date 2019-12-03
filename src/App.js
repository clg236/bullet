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
  background-color: tomato;
  justify-content: space-between;
  overflow: hidden;
`;

const InputWrapper = styled.input`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1em;
  font-size: 2em;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
`

const handleColorType = color => {
  switch (color) {
    case "primary":
      return "#03a9f3";
    case "danger":
      return "#f56342";
    default:
      return "#fff";
  }
};

const handleSize = size => {
  switch(size) {
    case "large":
      return '2em';
    case "medium":
      return '1.5em';
    case "small":
      return '.7em';
    default:
      return '.5em'
  }
}

const Chat = styled.p`
  font-size: ${props => handleSize(props.options.size)};
  color: ${props => props.options.color};
`

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

const ChatApp = props => {
    const firebase = useFirebase();
    let ts = Math.round((new Date()).getTime() / 1000);

    //chat listener
    useFirebaseConnect([
      {type: 'child_added', path: '/bullets'}
    ]);

    // The data coming from firebase
    const bullets = useSelector(state => state.firebase.data.bullets)

    // Track the input message
    let currentInput = {};
    const [submittedInput, setSubmittedInput] = useState("");
    let options = {
      size: 'medium',
      color: 'black',
      speed: 'medium'
    };


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

        currentInput && setSubmittedInput(currentInput);
        console.log(currentInput);

        // Save it to firebase
        firebase.push("bullets", currentInput);

        // Clear the input
        currentInput = '';
    }

    // Event handler - We call this method if there is any change happening to the input
    function handleInputChange(e) {
        currentInput = { time: ts, chat: e.target.value, options: options };
    }

    // Object.keys(bullets).map((key, id) => (<Chats key={id} chats={bullets[key]}/>))

    let chats = Object.keys(bullets).map((key, id) => bullets[key]);

    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'row', flex: 1 }}>
          <Chats chats={chats}/>
          {/* <Chats chats={chats} /> */}

          <InputWrapper
                placeholder="type something"
                onChange={handleInputChange}
                //value={currentInput}
                onKeyPress={handleEnterPressed}
            />

        </div>
              <ButtonWrapper>
              <button onClick={() => options.size = 'large'}>large</button>
              <button onClick={() => options.size = 'medium'}>medium</button>
              <button onClick={() => options.size = 'medium'}>small</button>
              <button onClick={() => options.color = 'black'}>black</button>
              <button onClick={() => options.color = 'teal'}>teal</button>
        </ButtonWrapper></div>
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
                    30,
                    {x: '100vw'},
                    {x: '-50vw', repeat: 0,}
                )
            );
        })
    }, [props.chats]);

    return props.chats.map((chat, i) => (
        <div
            key={i}
            ref={el => chatsRef.current[i] = el} >
            <Chat options={chat.options}>{chat.chat}</Chat>
        </div>
    ));
}

export default App;
