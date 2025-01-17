const listModal=document.getElementById("list-modal");
const listBox=document.getElementById("list-box");
const addbookbtn=document.getElementById("add-book-btn");
const bookTitleInput = document.getElementById('book-title');
const wishForm = document.getElementById("wish-form");
const wishlistContainer = document.getElementById("wishlist-container");

listBox.addEventListener('click', ()=>{
    listModal.classList.remove('hidden');
    fetchWishlist();
});

async function fetchWishlist(){
    wishlistContainer.innerHTML = '<div>Loading...</div>';
    try{
        const uname = wishForm.action.split('/').pop();
        const response = await fetch(`/wishlist/${uname}`);
        const wishlist = await response.json();
        
        wishlistContainer.innerHTML = '';
        
        wishlist.forEach(book => {
            const li = document.createElement('li');
            li.textContent = book;
            li.className = 'py-2 px-4 hover:bg-gray-100 rounded';
            wishlistContainer.appendChild(li);
        });
        
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

wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(wishForm);
        await fetch(wishForm.action, {
            method: 'POST',
            body: new URLSearchParams(formData),
        });
        
        bookTitleInput.value = '';
        bookTitleInput.classList.add('hidden');
        await fetchWishlist();
    } catch(err) {
        console.log(err);
    }
});