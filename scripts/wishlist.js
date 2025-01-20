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
        
        wishlist.forEach((book,index) => {
            const li = document.createElement('li');
            const bookSpan = document.createElement('span');
            bookSpan.textContent = book;
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';

            li.appendChild(bookSpan);
            li.appendChild(deleteButton);
            wishlistContainer.appendChild(li);
        });
        
    }catch(err){
        console.log(err);
    }
}

wishlistContainer.addEventListener('click',async (e)=>{
    if(e.target.classList.contains('delete-btn')){
        const li=e.target.closest('li');
        const index=Array.from(wishlistContainer.children).indexOf(li);
        const uname = wishForm.action.split('/').pop();
        try{
            const response= await fetch(`/wishlist/${uname}/${index}`, {
                method: 'POST'
            });
            await fetchWishlist();
        }catch(err){
            console.log(err);
        }
    }
})

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