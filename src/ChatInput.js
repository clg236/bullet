import React, { useState } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';

const InputWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
`;

const Input = styled.input`
    position: absolute;
    bottom: 0;
    padding: 1em;
    border:none;
    width: 100%
    outline: none;
    font-size: 25px;
`;

const SubmitButton = styled.button`
    position: absolute;
    padding: 1em;
    right: 1.2em;
    bottom: 1.2em;
    border:0px solid blue;
    background:blue;
    color:white;
`;

const ChatInput = props => {

    const [input, setInput] = useState('')
    const [color, setColor] = useState(
        {
            displayColorPicker: false,
            color: {
              r: '241',
              g: '112',
              b: '19',
              a: '1',
            },
        }
    );

    function clearInput(e) {
        setInput('');
        props.onKeyPress(e);
    }

    function handleChange(e) {
        setInput(e.target.value)
    }

    return (  
        <InputWrapper>   
            <Input
                placeholder={props.placeholder}
                onChange={handleChange}
                onKeyPress={props.onKeyPress}
                value={input}
            />
            <SubmitButton onClick={clearInput}>SEND</SubmitButton>
        </InputWrapper>

    );

}

export default ChatInput;