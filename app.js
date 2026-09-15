// ============================================================
// BUSINESS CLUB
// APP.JS
// ============================================================

const API_URL =
  "https://businessclub.ilias-pap-net.workers.dev/api/chat";


// ============================================================
// JOIN FORM
// ============================================================

const joinForm =
  document.getElementById("joinForm");

if (joinForm) {

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

    const interests = [
      ...document.querySelectorAll(
        ".checkbox-grid input:checked"
      )
    ].map(input => input.value);

    const application = {
      name,
      class: className,
      interests,
      contribution,
      learning,
      idea,
      createdAt: new Date().toISOString()
    };

    console.log("APPLICATION:", application);

    const message =
      document.getElementById("formMessage");

    message.textContent =
      "✓ Thank you! Your application has been received.";

    message.style.color = "#8cffb0";

    joinForm.reset();

  });

}


// ============================================================
// AI CHAT
// ============================================================

const chatForm =
  document.getElementById("chatForm");

const chatInput =
  document.getElementById("chatInput");

const chatMessages =
  document.getElementById("chatMessages");


if (chatForm) {

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
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: question
          })

        });


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.error || "API error"
        );
      }


      loading.textContent =
        data.answer ||
        "I couldn't generate an answer.";


      if (
        Array.isArray(data.sources) &&
        data.sources.length > 0
      ) {

        addSources(data.sources);

      }


    } catch (error) {

      console.error(
        "BUSINESS AI ERROR:",
        error
      );

      loading.textContent =
        "Sorry, something went wrong while contacting the Business AI.";

    }

    scrollChat();

  });

}


// ============================================================
// QUICK QUESTIONS
// ============================================================

function askQuickQuestion(question) {

  if (!chatInput || !chatForm) return;

  chatInput.value = question;

  chatForm.dispatchEvent(
    new Event("submit")
  );

}


// ============================================================
// USER MESSAGE
// ============================================================

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


// ============================================================
// AI MESSAGE
// ============================================================

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
    message.querySelector("div:last-child");

  content.textContent = text;

  chatMessages.appendChild(message);

  scrollChat();

  return content;

}


// ============================================================
// SOURCES
// ============================================================

function addSources(sources) {

  const container =
    document.createElement("div");

  container.className =
    "ai-sources";


  const title =
    document.createElement("div");

  title.textContent =
    "Sources";

  title.style.fontWeight =
    "700";

  title.style.marginBottom =
    "8px";


  container.appendChild(title);


  sources.forEach(source => {

    const link =
      document.createElement("a");

    link.href =
      source.url;

    link.target =
      "_blank";

    link.rel =
      "noopener noreferrer";

    link.textContent =
      source.title || source.url;

    link.style.display =
      "block";

    link.style.marginBottom =
      "5px";

    link.style.color =
      "#555";

    container.appendChild(link);

  });


  chatMessages.appendChild(container);

  scrollChat();

}


// ============================================================
// SCROLL
// ============================================================

function scrollChat() {

  if (!chatMessages) return;

  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


// ============================================================
// SECURITY
// ============================================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text;

  return div.innerHTML;

}
