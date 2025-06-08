const chatModal=document.getElementById("chat-modal");
const chatBox=document.getElementById("chat-box");
const typeBox = document.getElementById("typebox");

chatBox.addEventListener('click',async()=>{
    chatModal.classList.remove('hidden');
    
    try {
    const res = await fetch('/chat');
    const users = await res.json();

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
    }
})

async function selectChat(user) {
  selectedUser = user;
  typeBox.classList.remove("hidden");
}
