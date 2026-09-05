const response = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "qwen3:4b",
    messages: [
      {
        role: "user",
        content: "Say hello in one sentence."
      }
    ],
    stream: false
  })
});

const data = await response.json();

console.log(data.message.content);