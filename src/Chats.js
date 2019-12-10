import React from 'react'
import { useSelector } from 'react-redux'
import { useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import ChatItem from './ChatItem';

const chatsQuery = {
    path: 'bullets',
    queryParams: ['limitToLast=10']
}

function Chats() {
    //attach our chats listener
    useFirebaseConnect(() => [
        chatsQuery
    ])


    // The chat coming from firebase
    const chats = useSelector(state => state.firebase.data.bullets)

    //show a loading message
    if (!isLoaded(chats)) {
        return 'Loading Chats...'
    };

    //show a message if there are no chats
    if (isEmpty(chats)) {
        return 'No chats :('
    }

    console.log(chats);

    return Object.entries(chats).map((chat, id) => {
        return console.log({...chat});
    })   
}

export default Chats


// return Object.keys(chats).map(( { value: chat, key }, ind) => (
//     <ChatItem 
//         key={`${key} - ${ind}`}
//         id={key}
//         {...chat}
//     />        
// ))