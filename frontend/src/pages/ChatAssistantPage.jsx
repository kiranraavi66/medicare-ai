import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const ChatAssistantPage = () => {
  const { API_BASE_URL } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
    setupSpeechRecognition();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/history`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setListening(false);
      };

      rec.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setListening(false);
      };

      rec.onend = () => {
        setListening(false);
      };

      recognitionRef.current = rec;
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser version. Please try Chrome or Edge.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const speakText = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    // Clean markdown hashes or asterisks for clear speech
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    setInputMessage('');
    setLoading(true);

    // Optimistic UI update
    const tempUserMsg = { id: Date.now(), sender: 'user', content: query, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/send`, { message: query });
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg = { 
        id: Date.now() + 1, 
        sender: 'assistant', 
        content: '⚠️ I experienced an issue communicating with the AI service. Please check your connection and try again.', 
        created_at: new Date().toISOString() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your chat history?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/chat/history`);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '1.5rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ height: 'calc(88vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '12px' }}>
              <Bot size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>MediCare AI Health Assistant</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered by Gemini 1.5 Flash • Voice Enabled
              </span>
            </div>
          </div>

          <button onClick={handleClearHistory} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} title="Clear Chat History">
            <Trash2 size={14} color="var(--danger)" /> Clear Chat
          </button>
        </div>

        {/* Chat Window Messages */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem' }}>
              <Bot size={48} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
              <h3>How can MediCare AI assist your health today?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
                Ask any general medical question, inquire about symptoms, or request first-aid guidance.
              </p>
              
              {/* Quick Sample Queries */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {[
                  "What should I do for a mild fever?",
                  "How to manage tension headaches at home?",
                  "What are natural ways to soothe a sore throat?",
                  "When is chest pain considered a medical emergency?"
                ].map((q, idx) => (
                  <button key={idx} onClick={() => handleSendMessage(q)} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', borderRadius: '20px' }}>
                    <Sparkles size={14} color="var(--primary)" /> {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="animate-fade-in"
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem', borderRadius: '50%', marginTop: '0.2rem' }}>
                  <Bot size={18} />
                </div>
              )}

              <div 
                style={{
                  maxWidth: '80%',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)' : 'var(--bg-card-solid)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line'
                }}
              >
                <div>{msg.content}</div>

                {msg.sender === 'assistant' && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>MediCare AI</span>
                    <button 
                      onClick={() => speakText(msg.id, msg.content)} 
                      style={{ background: 'none', border: 'none', color: speakingMsgId === msg.id ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      title="Listen to response"
                    >
                      {speakingMsgId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />} {speakingMsgId === msg.id ? 'Stop' : 'Listen'}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div style={{ background: 'var(--bg-input)', color: 'var(--text-main)', padding: '0.4rem', borderRadius: '50%', border: '1px solid var(--border-color)', marginTop: '0.2rem' }}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem', borderRadius: '50%' }}>
                <Bot size={18} />
              </div>
              <div style={{ padding: '0.75rem 1.25rem', borderRadius: '18px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span className="pulse-active">Analyzing medical query...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            <button 
              type="button" 
              onClick={toggleVoiceInput} 
              className={`btn ${listening ? 'btn-danger pulse-active' : 'btn-secondary'}`}
              style={{ padding: '0.75rem', borderRadius: '50%' }}
              title={listening ? 'Listening... Click to stop' : 'Click to Speak'}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input 
              type="text" 
              placeholder={listening ? "Listening to your voice..." : "Type your health or medical question..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              style={{ flex: 1 }}
            />

            <button type="submit" className="btn btn-primary" disabled={loading || !inputMessage.trim()} style={{ padding: '0.75rem 1.25rem' }}>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
