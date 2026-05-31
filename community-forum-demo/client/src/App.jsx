import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // load old messages
    socket.on("chat-history", (data) => {
      setChat(data);
    });

    // live messages
    socket.on("receive-message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      user: "You",
      text: message,
      time: new Date().toLocaleTimeString()
    };

    socket.emit("send-message", msgData);
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Community Real-Time Chat</h1>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div key={index} style={styles.message}>
            <b>{msg.user}</b>: {msg.text}
            <span style={styles.time}>{msg.time}</span>
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    color: "white"
  },
  title: {
    marginBottom: 20
  },
  chatBox: {
    width: "60%",
    height: "60vh",
    overflowY: "auto",
    background: "#1e293b",
    padding: 20,
    borderRadius: 10
  },
  message: {
    padding: 10,
    marginBottom: 10,
    background: "#334155",
    borderRadius: 8
  },
  time: {
    float: "right",
    fontSize: "10px",
    opacity: 0.7
  },
  inputBox: {
    marginTop: 20,
    display: "flex",
    width: "60%"
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    border: "none"
  },
  button: {
    padding: "10px 20px",
    marginLeft: 10,
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: 5,
    cursor: "pointer"
  }
};

export default App;