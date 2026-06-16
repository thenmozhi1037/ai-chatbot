const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const typing = document.getElementById("typing");

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    addUserMessage(message);

    userInput.value = "";

    typing.style.display = "block";

    try {

        const response = await fetch("https://chatassist-backend.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        typing.style.display = "none";

        addBotMessage(data.reply);

    } catch (error) {
    typing.style.display = "none";
    console.log(error);
    addBotMessage("Error: " + error.message);

    }
}

function addUserMessage(message) {

    const div = document.createElement("div");

    div.className = "message user-message";

    div.innerText = message;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotMessage(message) {

    const div = document.createElement("div");

    div.className = "message bot-message";

    div.innerText = message;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

userInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();
    }
});
async function loadHistory() {
    try {
        const res = await fetch("https://chatassist-backend.onrender.com/history");
        const data = await res.json();

        const historyDiv = document.getElementById("historyList");
        historyDiv.innerHTML = "";

        data.forEach(chat => {
            const div = document.createElement("div");
            div.className = "history-item";
            div.innerText = chat.userMessage;

            div.onclick = () => {
                addUserMessage(chat.userMessage);
                addBotMessage(chat.botReply);
            };

            historyDiv.appendChild(div);
        });

    } catch (err) {
        console.log(err);
    }
}
function toggleHistory(){

    document
    .getElementById("historyPanel")
    .classList.toggle("show");
}
function openHistory(){

    window.location.href = "history.html";
}

/* Load on page open */
loadHistory();
