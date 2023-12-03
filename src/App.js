import logo from './logo.svg';
import './App.css';

const signalR = require("@microsoft/signalr");
let connection;

const connect = (token) =>{
  console.warn('TOKEN --- ', token);

  connection = new signalR.HubConnectionBuilder().withUrl("https://api.roomieroster.com/chat", {
    accessTokenFactory: ()=> token
  }).build();

connection.start().then(function () {
    console.log("SignalR ile bağlantı kuruldu.");

    onConnected();
    onError();
    onNewMessage();
    onUserChats();
    onPreviousMessages();

  }).catch(function (err) {
      return console.error(err.toString());
  });

  window.connection = connection;
}

const sendPrivate = (recieverName = 'alp.yurtseven', message = 'TEST FROM REACT APP') => {
  console.log("RecieverName", recieverName);
  connection.invoke("SendPrivate", recieverName, message).catch(function (err) {
    return console.error(err.toString());
  });
}

const getChats = () =>{
  connection.invoke("GetChats").catch(function (err) {
    return console.error(err.toString());
  });
}

const getMessagesByChat = (id) => {
  connection.invoke("GetMessagesByChat", Number(id)).catch(function (err) {
    return console.error(err.toString());
  });
}

const onConnected = () => {
  connection.on("Connected", (userList) => {
    console.log("ConnectedUserList", userList);
  });
}

const onError = () => {
  connection.on("Error", (status, message) => {
    console.log("ERROR FROM HUB: ",message);
  });
}

const onNewMessage = () => {
  connection.on("NewMessage", (messagesObject) => {
    console.log("New Message --- ",  messagesObject);
  });
}

const onUserChats = () => {
  connection.on("UserChats", (messagesObject) => {
    console.log('USER CHATS ----- ', messagesObject);
  });
}

const onPreviousMessages= () => {
  connection.on("PreviousMessages", (messagesObject) => {
    console.log('Previous Messages ----- ', messagesObject);
  });
}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button className='sendPrivate'  onClick={()=>{sendPrivate()}}>
          Send Private
        </button>
        <button className='getChats'  onClick={()=>{getChats()}}>
          Get Chats
        </button>
        <button className='getMessagesByChat'  onClick={()=>{getMessagesByChat(document.querySelector('input').value)}}>
          Get Messages
        </button>
        <input type='text' name='chatId' placeholder='ChatId'></input>
        <input type='text' name='authToken' placeholder='Token'></input>
        <button className='connectToChat'  onClick={()=>{connect(document.getElementsByName('authToken')[0].value)}}>
          Connect
        </button>
      </header>
    </div>
  );
}

export default App;
