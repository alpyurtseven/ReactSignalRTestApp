import logo from './logo.svg';
import './App.css';

const signalR = require("@microsoft/signalr");
let connection;

const Connect = (token) =>{
  console.warn('TOKEN --- ', token);

  connection = new signalR.HubConnectionBuilder().withUrl("https://api.roomie.helloworldeducation.com/chat", {
    accessTokenFactory: ()=> token
  }).build();

connection.start().then(function () {
    console.log("SignalR ile bağlantı kuruldu.");

    OnUserConnected();
    OnError();
    OnNewMessage();
    OnPreviousMessages();

  }).catch(function (err) {
      return console.error(err.toString());
  });
}

const SendPrivate = (recieverName = 'roomie.test2', message = 'TEST FROM REACT APP') => {

  console.log("RecieverName", recieverName);
  connection.invoke("SendPrivate", recieverName, message).catch(function (err) {
    return console.error(err.toString());
  });
}

const GetMessages = () => {
  connection.invoke("GetMessages").catch(function (err) {
    return console.error(err.toString());
  });
}

const OnUserConnected = () => {
  connection.on("userConnected", (userList) => {
    console.log("ConnectedUserList", userList);
  });
}

const OnError = () => {
  connection.on("onError", (errorMessage) => {
    console.log(errorMessage);
  });
}

const OnNewMessage = () => {
  connection.on("newMessage", (messagesObject) => {
    console.log("New Message --- ",  messagesObject);
  });
}

const OnPreviousMessages = () => {
  connection.on("previousMessages", (messagesObject) => {
    console.log('PREVIOUS MESSAGES ----- ', messagesObject);
  });
}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button className='sendPrivate'  onClick={()=>{SendPrivate()}}>
          Send Private
        </button>
        <button className='getMessages'  onClick={()=>{GetMessages()}}>
          Get Messages
        </button>
        <input type='text' name='authToken' placeholder='Token'></input>
        <button className='connectToChat'  onClick={()=>{Connect(document.querySelector('input').value)}}>
          Connect
        </button>
      </header>
    </div>
  );
}

export default App;
