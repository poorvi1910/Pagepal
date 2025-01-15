const listModal=document.getElementById("list-modal");
const listBox=document.getElementById("list-box");

listBox.addEventListener('click', ()=>{
    listModal.classList.remove('hidden');
})

listModal.addEventListener('click', (e) => {
    if (e.target === listModal) {
        listModal.classList.add('hidden');
    }
});