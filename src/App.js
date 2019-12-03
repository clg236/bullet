import React, { useState, useEffect, useRef, createRef } from 'react';
import './App.css';
import { TweenLite, TweenMax } from 'gsap';
import styled from 'styled-components';

import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import { combineReducers, createStore } from 'redux';
import { firebaseReducer, useFirebaseConnect, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { useSelector } from "react-redux";

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

  //chat listener
  useFirebaseConnect([
    'bullet',
  ])

  const bullets = useSelector(state => state.firebase.data.bullets)

  const [chats, setChats] = useState([]);
  let currentInput = ''

  return (
    <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <div>
        {Object.keys(bullets).map((key, id) => (<Chats key={key} id={id} chats={bullets[key]} />))}
        
        <input 
          placeholder="type something"
          onChange={ e => currentInput = e.target.value }
          onKeyPress={ e => e.key === 'Enter' ? setChats([currentInput]) : null } 
        />
      </div>
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}

const Chats = props => {
  
  const chatsRef = useRef([]);

    // we can access the elements with chatsRef.current[n]

    useEffect(() => {
       chatsRef.current = chatsRef.current.slice(0, props.chats.length);
       props.chats.map((chat,i) => {
        return (
          TweenMax.fromTo(
            [chatsRef.current[i]],
            0.5,
            { x: '100vw' },
            { x: 0, repeat: 0, }
          )
        );  
       })
    }, [props.chats]);

    return props.chats.map((chat, i) => (
      <div 
        key={i} 
        ref={el => chatsRef.current[i] = el} 
        style={{ fontSize: 40, width: `${(i + 1) * 100}px` }}>
        {chat}
      </div>
    ));
}

export default App;
