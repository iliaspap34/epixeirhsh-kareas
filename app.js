const API_URL = "/api/chat";


/* =========================
   JOIN FORM
========================= */

const joinForm = document.getElementById("joinForm");

joinForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const className =
        document.getElementById("class").value.trim();

    const contribution =
        document.getElementById("contribution").value.trim();

    const learning =
        document.getElementById("learning").value.trim();

    const idea =
        document.getElementById("idea").value.trim();


    const interests =
        [...document.querySelectorAll(
            '.checkbox-grid input:checked'
        )].map(input => input.value);


    const application = {

        name,
        class: className,
        interests,
        contribution,
        learning,
        idea,

        createdAt:
            new Date().toISOString()

    };


    console.log("APPLICATION:", application);


    /*
        TEMPORARY

        Later this will send the application
        to our Cloudflare Worker / database.
    */

    const message =
        document.getElementById("formMessage");

    message.innerHTML =
        "✓ Thank you! Your application has been received.";

    message.style.color = "#8cffb0";

    joinForm.reset();

});


/* =========================
   AI CHAT
========================= */

const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");

const chatMessages =
    document.getElementById("chatMessages");


chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const question =
        chatInput.value.trim();

    if (!question) return;

    addUserMessage(question);

    chatInput.value = "";

    const loading =
        addAIMessage("Thinking...");


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: question
                })

            });


        if (!response.ok) {
            throw new Error("API error");
        }


        const data =
            await response.json();


        loading.textContent =
            data.answer || "No answer received.";


    } catch (error) {

        console.error(error);

        /*
            TEMPORARY FALLBACK

            Until Cloudflare Worker is connected.
        */

        loading.textContent =
            "The Business AI will be connected soon. " +
            "Your question was: " +
            question;

    }

});


/* =========================
   QUICK QUESTIONS
========================= */

function askQuickQuestion(question) {

    chatInput.value = question;

    chatForm.dispatchEvent(
        new Event("submit")
    );

}


/* =========================
   CHAT UI
========================= */

function addUserMessage(text) {

    const message =
        document.createElement("div");

    message.className =
        "message user-message";

    message.innerHTML =
        `<div>${escapeHTML(text)}</div>`;

    chatMessages.appendChild(message);

    scrollChat();

}


function addAIMessage(text) {

    const message =
        document.createElement("div");

    message.className =
        "message ai-message";

    message.innerHTML = `
        <div class="message-avatar">
            AI
        </div>

        <div></div>
    `;

    const content =
        message.querySelector(
            "div:last-child"
        );

    content.textContent = text;

    chatMessages.appendChild(message);

    scrollChat();

    return content;

}


function scrollChat() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
