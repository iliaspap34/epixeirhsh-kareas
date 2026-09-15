// ============================================================
// BUSINESS CLUB - APP.JS
// ============================================================

const API_URL =
  "https://businessclub.ilias-pap-net.workers.dev/api/chat";


// ============================================================
// JOIN FORM
// ============================================================

const joinForm = document.getElementById("joinForm");

if (joinForm) {

  joinForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
      document.getElementById("name")?.value.trim() || "";

    const className =
      document.getElementById("class")?.value.trim() || "";

    const contribution =
      document.getElementById("contribution")?.value.trim() || "";

    const learning =
      document.getElementById("learning")?.value.trim() || "";

    const idea =
      document.getElementById("idea")?.value.trim() || "";

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

    if (message) {
      message.textContent =
        "✓ Thank you! Your application has been received.";

      message.style.color = "#8cffb0";
    }

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


if (chatForm && chatInput) {

  chatForm.addEventListener("submit", function (event) {

    // ΠΟΛΥ ΣΗΜΑΝΤΙΚΟ:
    // Δεν αφήνουμε το form να κάνει reload τη σελίδα.
    event.preventDefault();
    event.stopPropagation();

    sendMessage();

  });

}


// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage() {

  if (!chatInput) return;

  const question =
    chatInput.value.trim();

  if (!question) return;


  // Εμφάνιση ερώτησης χρήστη
  addUserMessage(question);


  // Καθαρίζουμε το input
  chatInput.value = "";


  // AI loading message
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


    // AI answer
    loading.textContent =
      data.answer ||
      "I couldn't generate an answer.";


    // Sources
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

}


// ============================================================
// QUICK QUESTIONS
// ============================================================

function askQuickQuestion(question) {

  if (!chatInput) return;


  // Βάζουμε την ερώτηση στο input
  chatInput.value = question;


  // Στέλνουμε απευθείας
  sendMessage();

}


// ============================================================
// USER MESSAGE
// ============================================================

function addUserMessage(text) {

  if (!chatMessages) return;


  const message =
    document.createElement("div");

  message.className =
    "message user-message";


  const content =
    document.createElement("div");

  content.textContent =
    text;


  message.appendChild(content);

  chatMessages.appendChild(message);


  scrollChat();

}


// ============================================================
// AI MESSAGE
// ============================================================

function addAIMessage(text) {

  if (!chatMessages) return null;


  const message =
    document.createElement("div");

  message.className =
    "message ai-message";


  const avatar =
    document.createElement("div");

  avatar.className =
    "message-avatar";

  avatar.textContent =
    "AI";


  const content =
    document.createElement("div");

  content.textContent =
    text;


  message.appendChild(avatar);

  message.appendChild(content);

  chatMessages.appendChild(message);


  scrollChat();


  return content;

}


// ============================================================
// SOURCES
// ============================================================

function addSources(sources) {

  if (!chatMessages) return;


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

    if (!source?.url) return;


    const link =
      document.createElement("a");

    link.href =
      source.url;

    link.target =
      "_blank";

    link.rel =
      "noopener noreferrer";

    link.textContent =
      source.title ||
      source.url;


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
// SCROLL CHAT
// ============================================================

function scrollChat() {

  if (!chatMessages) return;


  chatMessages.scrollTo({

    top:
      chatMessages.scrollHeight,

    behavior:
      "smooth"

  });

}


// ============================================================
// ENTER KEY
// ============================================================

if (chatInput) {

  chatInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );

}
