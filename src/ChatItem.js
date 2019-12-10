import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'

export default function ChatItem({ id }) {
    console.log(id);
    const chat = useSelector(state => state.firebase.data.chats);
    const firebase = useFirebase()

    function DeleteChat() {
        firebase.remove(`bullets/${ id }`);
    }

    return(
        <p>{chat[id].content}</p>
    )

}

