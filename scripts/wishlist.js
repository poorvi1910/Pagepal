const listModal=document.getElementById("list-modal");
const listBox=document.getElementById("list-box");
const addbookbtn=document.getElementById("add-book-btn");
const bookTitleInput = document.getElementById('book-title');
const wishForm = document.getElementById("wish-form");

listBox.addEventListener('click', ()=>{
    listModal.classList.remove('hidden');
    fetchWishlist();
});

async function fetchWishlist(){
    try{
        
    }catch(err){
        console.log(err);
    }
}

listModal.addEventListener('click', (e) => {
    if (e.target === listModal) {
        listModal.classList.add('hidden');
        bookTitleInput.classList.add('hidden');
        bookTitleInput.value = '';
    }
});

addbookbtn.addEventListener('click', ()=>{
    bookTitleInput.classList.remove('hidden');
    bookTitleInput.focus();
})

bookTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        wishForm.submit();
        bookTitleInput.classList.add('hidden');
    }
});