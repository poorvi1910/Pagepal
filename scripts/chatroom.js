const chatModal=document.getElementById("chat-modal");
const chatBox=document.getElementById("chat-box");

chatBox.addEventListener('click',()=>{
    chatModal.classList.remove('hidden');
})

chatModal.addEventListener('click',(e)=>{
    if(e.target===chatModal){
        chatModal.classList.add("hidden");
    }
})