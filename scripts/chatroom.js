const chatModal=document.getElementById("chat-modal");
const chatBox=document.getElementById("chat-box");
const typeBox = document.getElementById("typebox");
const input = document.getElementById("type");
const socket = io();

let selectedUser = null; 
let currentUser = null;

chatBox.addEventListener('click',async()=>{
    chatModal.classList.remove('hidden');
    
    try {
    const res = await fetch('/chat');
    const data = await res.json();
    const users = data.friends;

    const list = document.getElementById("chat-user-list");
    list.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = u.uname;
      li.className = 'text-red-400 font-bold bg-red-100 p-4 m-4 text-md rounded-lg hover:bg-red-200 hover:text-white';
      li.addEventListener('click', () => selectChat(u));
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load chat users", err);
  }
})

chatModal.addEventListener('click',(e)=>{
    if(e.target===chatModal){
        chatModal.classList.add("hidden");
        input.value = '';
        typeBox.classList.add('hidden');
        selectedUser = null; 
        document.getElementById("chat-messages").innerHTML = '';
    }
})

async function selectChat(user) {
    const resp = await fetch('/chat');
    const data = await resp.json();
    currentUser = data.currentUser;
    selectedUser = user;
    typeBox.classList.remove("hidden");
    const roomId = [currentUser._id, selectedUser._id].sort().join('-');
    socket.emit('joinRoom', { senderId: currentUser._id, receiverId: selectedUser._id });
    const res = await fetch(`/chat/history/${selectedUser._id}`);
    const messages = await res.json();
    const chatDiv = document.getElementById("chat-messages");
    
    chatDiv.innerHTML = '';
    messages.forEach(msg => {
        const wrapper = document.createElement('div');
        wrapper.className = msg.sender_id === currentUser._id ? 'self-end max-w-[50%] bg-red-300 text-white rounded-xl px-4 py-2 break-words' : 'self-start max-w-[50%] text-red-300 bg-white rounded-xl px-4 py-2 break-words';
        const msgEl = document.createElement('p');
        msgEl.textContent = msg.message;
        wrapper.appendChild(msgEl);
        chatDiv.appendChild(wrapper);
    });

}

typeBox.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = input.value.trim();
  if (!message || !selectedUser || !currentUser) return;

  socket.emit('chatMessage', {
    senderId: currentUser._id,
    receiverId: selectedUser._id,
    message
  });

  input.value = '';
});

socket.on('message', ({ senderId, message, timestamp }) => {
  const chatDiv = document.getElementById("chat-messages");
  const wrapper = document.createElement('div');
  wrapper.className = senderId === currentUser._id ? 'w-full flex justify-end': 'w-full flex justify-start';
  const msgEl = document.createElement('p');
  msgEl.className = 'bg-red-200 rounded-lg px-4 py-2 max-w-xs break-words';
  msgEl.textContent = message;
  wrapper.appendChild(msgEl);
  chatDiv.appendChild(wrapper);
  chatDiv.scrollTop = chatDiv.scrollHeight;
});