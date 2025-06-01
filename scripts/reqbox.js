const reqModal = document.getElementById("req-modal");
const reqBox = document.getElementById("req-box");
const sendbut = document.getElementById("send-btn");
const accbut = document.getElementById("accept-btn");
const sendModal = document.getElementById("send-modal");
const accModal = document.getElementById("acc-modal");
const sendForm = document.getElementById("send-form");
const sendContainer = document.getElementById("send-container");
const accContainer = document.getElementById("acc-container");

reqBox?.addEventListener('click', () => {
    reqModal.classList.remove('hidden');
});

reqModal.addEventListener('click', (e) => {
    if (e.target === reqModal) {
        reqModal.classList.add("hidden");
        sendModal.classList.add("hidden");
        accModal.classList.add("hidden");
    }
});

sendbut.addEventListener('click', () => {
    sendModal.classList.remove('hidden');
    accModal.classList.add('hidden');
});

sendForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookTitle = e.target["book-title"].value;
    const uname = sendbut.dataset.uname;
    try {
        const res = await fetch(`/find/${bookTitle}`);
        const owners = await res.json();

        sendContainer.innerHTML = '';
        owners.forEach(owner => {
            if (owner === uname) return;
            const li = document.createElement('li');
            li.textContent = owner + " ";
            const sendBtn = document.createElement('button');
            sendBtn.textContent = "✔";
            sendBtn.addEventListener('click', async () => {
                await fetch(`/sendreq`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ from: uname, to: owner })
                });
                li.remove();
            });
            li.appendChild(sendBtn);
            sendContainer.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
});

accbut.addEventListener('click', async () => {
    accModal.classList.remove('hidden');
    sendModal.classList.add('hidden');
    const uname = accbut.dataset.uname;
    try {
        const response = await fetch(`/requests/${uname}`);
        const accList = await response.json();

        accContainer.innerHTML = '';
        accList.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user + " ";

            const acceptBtn = document.createElement('button');
            acceptBtn.textContent = "✔";
            acceptBtn.addEventListener('click', async () => {
                await fetch(`/acceptreq`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ from: user, to: uname })
                });
                li.remove();
            });

            const rejectBtn = document.createElement('button');
            rejectBtn.textContent = "🗑";
            rejectBtn.addEventListener('click', async () => {
                await fetch(`/rejectreq`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ from: user, to: uname })
                });
                li.remove();
            });

            li.appendChild(acceptBtn);
            li.appendChild(rejectBtn);
            accContainer.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
});