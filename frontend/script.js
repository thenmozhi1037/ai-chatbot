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

        const response = await fetch("http://localhost:3000/chat", {
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

        addBotMessage("⚠️ Server Error");

        console.log(error);
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