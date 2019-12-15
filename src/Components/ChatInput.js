import React, {useEffect, useRef, useState} from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase'

const InputWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: row;
`;

const Input = styled.input`
    border-radius: 5px;
    font-size: 1.5em;
    width: 90vw;
    font-family: 'Roboto', sans-serif;
    padding: 10px;
    color: #6FFFB0;
    background-color: black;
    border-width: 0px;
    //border: solid;
    :focus {
        outline: none;
    }
    ::placeholder {
            color: #6FFFB0;
    }
`;

const SendButton = styled.div`
    position: absolute;
    padding: 5px;
    right: 1vw;
    bottom: 0;
`;


export default function ChatInput(props) {
    
    const firebase = useFirebase()
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

    function handleClick(e) {
        firebase.push("bullets", value);
        setValue("");
    }
    
    return (
        <InputWrapper>
             <Input
                placeholder="type something"
                onChange={handleInputChange}
                value={value}
                onKeyPress={handleEnterPressed}
            />
            <SendButton>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<Icon>send</Icon>}
                    style={value ? {color: 'hotpink'} : {display: 'none'}}
                    onClick={handleClick}
                >
            Send
        </Button>
            </SendButton>

        </InputWrapper>    
        );
    
}