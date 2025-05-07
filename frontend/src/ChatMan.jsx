import React, { useState, useEffect, useRef } from 'react';

/**
 * ChatMan – Batman‑themed GPT‑4o chat UI
 */
function ChatMan() {
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Auto-scroll target
  const bottomRef = useRef(null);

  /* --- 1. Fetch GPT-4o reply on user prompt --- */
  useEffect(() => {
    if (!userPrompt) return;

    const fetchGPT4oResponse = async () => {
      setLoading(true);

      try {
        const res = await fetch('http://localhost:3001/api/gpt4o', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content:
                  'You are a helpful assistant. ONLY respond from the perspective of Batman. You are Batman.',
              },
              { role: 'user', content: userPrompt },
            ],
            model: 'gpt-4o-mini',
          }),
        });

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'No response';

        setMessages((prev) => [
          ...prev,
          { sender: 'user', content: userPrompt },
          { sender: 'bot', content: reply },
        ]);
        setUserPrompt('');
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', content: 'Error: ' + err.message },
        ]);
      }

      setLoading(false);
    };

    fetchGPT4oResponse();
  }, [userPrompt]);

  /* --- 2. Scroll to latest message on update --- */
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  /* --- 3. Handle form submit --- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.prompt.value.trim();
    if (input) {
      setUserPrompt(input);
      e.target.reset();
    }
  };

  /* --- 4. Render UI --- */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.titleRow}>
          <img
            src="/img/batman-icon.svg"
            alt="Batman Icon"
            style={styles.icon}
          />
          <h2 style={styles.title}>Chatman</h2>
        </header>

        {/* Chat history display */}
        <div style={styles.chatBox}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                ...(msg.sender === 'user' ? styles.userBubble : styles.botBubble),
              }}
            >
              {msg.content}
            </div>
          ))}
          {/* Typing indicator */}
          {loading && <div style={styles.typing}>Typing…</div>}
          {/* Auto-scroll target */}
          <div ref={bottomRef} />
        </div>

        {/* Prompt input form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="prompt"
            placeholder="Type a message…"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

/* --- Inline styles --- */
const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100vw',
    paddingTop: '2rem',
  },
  container: {
    maxWidth: '500px',
    width: '100%',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  icon: {
    width: '28px',
    height: '28px',
    filter:
      'brightness(0) saturate(100%) invert(83%) sepia(61%) saturate(4750%) hue-rotate(6deg) brightness(97%) contrast(101%)',
  },
  chatBox: {
    background: '#f1f1f1',
    padding: '1rem',
    borderRadius: '16px',
    height: '50vh',
    flex: '0 0 50vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    scrollBehavior: 'smooth',
  },
  bubble: {
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    alignSelf: 'flex-start',
    fontSize: '0.95rem',
    textAlign: 'left',
  },
  userBubble: {
    backgroundColor: '#007aff',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  botBubble: {
    backgroundColor: '#e5e5ea',
    color: 'black',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
  },
  typing: {
    color: '#666',
    fontStyle: 'italic',
    padding: '0.25rem 0.5rem',
    alignSelf: 'flex-start',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.25rem',
    borderRadius: '20px',
    backgroundColor: '#007aff',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ChatMan;
