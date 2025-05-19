<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My AI Chat</title>
  <style>
    body {
      background-color: #121212;
      color: #fff;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .chat-container {
      max-width: 700px;
      margin: 30px auto;
      padding: 20px;
      border-radius: 10px;
      background: #1e1e1e;
    }
    .message {
      margin: 10px 0;
      padding: 10px;
      border-radius: 8px;
    }
    .user { background-color: #333; text-align: right; }
    .bot { background-color: #262626; text-align: left; }
    .copy-btn {
      float: right;
      margin-left: 10px;
      background: #444;
      border: none;
      color: #fff;
      padding: 2px 8px;
      cursor: pointer;
      font-size: 12px;
    }
    .copy-btn:hover {
      background: #666;
    }
    input[type="text"] {
      width: 90%;
      padding: 10px;
      margin: 20px 0;
      border: none;
      border-radius: 5px;
      background-color: #222;
      color: white;
    }
    button {
      background: red;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="chat-container" id="chat"></div>
  <div style="text-align:center;">
    <input type="text" id="userInput" placeholder="Ask something..." />
    <button onclick="sendMessage()">Send</button>
  </div>

  <script>
    const chatEl = document.getElementById('chat');
    const userInput = document.getElementById('userInput');
    let conversation = [];

    function renderMessage(role, text) {
      const msg = document.createElement('div');
      msg.classList.add('message', role);
      msg.innerHTML = `
        ${text.replace(/\n/g, '<br>')}
        <button class="copy-btn" onclick="copyText(\`${text.replace(/`/g, '\\`')}\`)">Copy</button>
      `;
      chatEl.appendChild(msg);
      chatEl.scrollTop = chatEl.scrollHeight;
    }

    function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;

      renderMessage('user', text);
      conversation.push({ role: 'user', content: text });
      userInput.value = '';

      fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3', // make sure this matches your Ollama model
          messages: conversation,
          stream: false
        })
      })
      .then(res => res.json())
      .then(data => {
        const reply = data.message.content;
        renderMessage('bot', reply);
        conversation.push({ role: 'assistant', content: reply });
      })
      .catch(err => {
        renderMessage('bot', "Error: " + err.message);
      });
    }

    function copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied!');
      });
    }
  </script>
</body>
</html>
