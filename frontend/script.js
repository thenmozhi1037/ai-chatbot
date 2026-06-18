const chatBox = document.getElementById("chatBox");
const typing = document.getElementById("typing");

/* Send Message */
async function sendMessage() {

    const input =
    document.getElementById("message");

    const message =
    input.value.trim();

    if (!message) return;

    chatBox.innerHTML += `
    <div class="message user">
        ${message}
    </div>
    `;

    input.value = "";

    chatBox.scrollTop =
    chatBox.scrollHeight;

    typing.style.display = "block";

    try {

        const response = await fetch(
        "https://chatassist-backend.onrender.com/chat",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message,
                userId:
                localStorage.getItem("userId")
            })
        });

        const data =
        await response.json();

        typing.style.display = "none";

        chatBox.innerHTML += `
        <div class="message bot">
            ${data.reply}
        </div>
        `;

        chatBox.scrollTop =
        chatBox.scrollHeight;

        loadSidebarHistory();

    } catch (err) {

        typing.style.display = "none";

        chatBox.innerHTML += `
        <div class="message bot">
            Error connecting to AI.
        </div>
        `;
    }
}

/* Enter Key */
document.addEventListener(
"keydown",
function(e){

    if(e.key === "Enter"){
        sendMessage();
    }
});

/* Voice Input */
function startVoice(){

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert(
        "Voice input not supported in this browser."
        );

        return;
    }

    const recognition =
    new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult =
    function(event){

        document.getElementById(
        "message"
        ).value =
        event.results[0][0].transcript;
    };
}

/* Theme Toggle */
function toggleTheme(){

    document.body.classList.toggle(
    "light-mode"
    );

    if(
        document.body.classList.contains(
        "light-mode"
        )
    ){
        localStorage.setItem(
        "theme",
        "light"
        );
    }
    else{
        localStorage.setItem(
        "theme",
        "dark"
        );
    }
}

/* Load Theme */
window.onload = function(){

    if(
        localStorage.getItem(
        "theme"
        ) === "light"
    ){
        document.body.classList.add(
        "light-mode"
        );
    }

    loadSidebarHistory();
};

/* New Chat */
function newChat(){

    chatBox.innerHTML = "";
}

/* Open History Page */
function openHistory(){

    window.location.href =
    "history.html";
}

/* Sidebar History */
async function loadSidebarHistory(){

    try{

        const userId =
        localStorage.getItem(
        "userId"
        );

        const response =
        await fetch(
        `https://chatassist-backend.onrender.com/history?userId=${userId}`
        );

        const chats =
        await response.json();

        const historyList =
        document.getElementById(
        "historyList"
        );

        if(!historyList) return;

        historyList.innerHTML = "";

        chats.slice(0,15)
        .forEach(chat=>{

            const div =
            document.createElement(
            "div"
            );

            div.className =
            "history-item";

            div.innerText =
            chat.userMessage
            .substring(0,40);

            div.onclick =
            function(){

                chatBox.innerHTML = `
                <div class="message user">
                    ${chat.userMessage}
                </div>

                <div class="message bot">
                    ${chat.botReply}
                </div>
                `;
            };

            historyList.appendChild(
            div
            );
        });

    }catch(err){

        console.log(err);
    }
}

/* Search History */
const searchInput =
document.getElementById(
"searchInput"
);

if(searchInput){

    searchInput.addEventListener(
    "keyup",
    function(){

        const value =
        this.value.toLowerCase();

        const items =
        document.querySelectorAll(
        ".history-item"
        );

        items.forEach(item=>{

            if(
                item.innerText
                .toLowerCase()
                .includes(value)
            ){
                item.style.display =
                "block";
            }
            else{
                item.style.display =
                "none";
            }
        });
    });
}