const ChatApp = props => {
    const firebase = useFirebase();
    let ts = Math.round((new Date()).getTime() / 1000);

    //chat listener
    useFirebaseConnect([
      {type: 'child_added', path: '/bullets'}
    ]);

    

    // The chat coming from firebase
    const bullets = useSelector(state => state.firebase.data.bullets)

    // Track the input message
    let currentInput = {};
    const [submittedInput, setSubmittedInput] = useState("");
    let options = {
      size: 'medium',
      color: 'black',
      speed: 'medium'
    };

    if(isLoaded(bullets)) {
      console.log(bullets);
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


    //we should only render the last chat that's come in
      //

    let chats = Object.keys(bullets).map((key, id) => bullets[key].time > (ts - 10) ? bullets[key] : null);

    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'row', flex: 1 }}>
          {chats[0] != null ? <Chats chats={chats}/> : null} 
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



// const Chats = props => {

//     const chatsRef = useRef([]);

//     // we can access the elements with chatsRef.current[n]

//     useEffect(() => {
//         chatsRef.current = chatsRef.current.slice(0, props.chats.length);
//         props.chats.map((chat, i) => {
//             return (
//                 TweenMax.fromTo(
//                     [chatsRef.current[i]],
//                     30,
//                     {x: '100vw'},
//                     {x: '-50vw', repeat: 0,}
//                 )
//             );
//         })
//     }, [props.chats]);

//     return props.chats.map((chat, i) => (
//         <div
//             key={i}
//             ref={el => chatsRef.current[i] = el} >
//             <Chat options={chat.options}>{chat.chat}</Chat>
//         </div>
//     ));
// }
