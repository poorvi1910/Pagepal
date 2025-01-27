const ownModal=document.getElementById("own-modal");
const ownBox=document.getElementById("own-box");
const oaddbookbtn=document.getElementById("oadd-book-btn");
const obookTitleInput = document.getElementById('obook-title');
const ownForm = document.getElementById("own-form");
const ownlistContainer = document.getElementById("ownlist-container");

ownBox.addEventListener('click', ()=>{
    ownModal.classList.remove('hidden');
    fetchownlist();
});

async function fetchownlist(){
    try{
        const uname = ownForm.action.split('/').pop();
        const response = await fetch(`/ownlist/${uname}`);
        const ownlist = await response.json();
        
        ownlistContainer.innerHTML = '';
        
        ownlist.forEach((book,index) => {
            const li = document.createElement('li');
            const bookSpan = document.createElement('span');
            bookSpan.textContent = book;
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';

            li.appendChild(bookSpan);
            li.appendChild(deleteButton);
            ownlistContainer.appendChild(li);
        });
        
    }catch(err){
        console.log(err);
    }
}

ownlistContainer.addEventListener('click',async (e)=>{
    if(e.target.classList.contains('delete-btn')){
        const li=e.target.closest('li');
        const index=Array.from(ownlistContainer.children).indexOf(li);
        const uname = ownForm.action.split('/').pop();
        try{
            const response= await fetch(`/ownlist/${uname}/${index}`, {
                method: 'POST'
            });
            await fetchownlist();
        }catch(err){
            console.log(err);
        }
    }
})

ownModal.addEventListener('click', (e) => {
    if (e.target === ownModal) {
        ownModal.classList.add('hidden');
        obookTitleInput.classList.add('hidden');
        obookTitleInput.value = '';
    }
});

oaddbookbtn.addEventListener('click', ()=>{
    obookTitleInput.classList.remove('hidden');
    obookTitleInput.focus();
})

ownForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(ownForm);
        await fetch(ownForm.action, {
            method: 'POST',
            body: new URLSearchParams(formData),
        });
        
        obookTitleInput.value = '';
        obookTitleInput.classList.add('hidden');
        await fetchownlist();
    } catch(err) {
        console.log(err);
    }
});