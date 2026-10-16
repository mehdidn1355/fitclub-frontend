import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatAPI } from '../../api/endpoints'

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionToken, setSessionToken] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(true)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // اسکرول به آخر
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // بارگذاری اولیه
  useEffect(() => {
    // پیام خوش‌آمد
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        content:
          'سلام! 👋\nمن دستیار هوشمند FitClub هستم.\n\nچطور می‌تونم کمکت کنم؟',
      },
    ])

    // پیشنهادات
    const fetchSuggestions = async () => {
      try {
        const { data } = await chatAPI.suggestions()
        setSuggestions(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSuggestions()

    // Session از localStorage
    const saved = localStorage.getItem('fitclub-chat-session')
    if (saved) setSessionToken(saved)

    // focus روی input
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const sendMessage = async (content) => {
    if (!content.trim() || loading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const { data } = await chatAPI.sendMessage({
        content: content.trim(),
        session_token: sessionToken,
      })

      // ذخیره‌ی session token
      if (data.session_token) {
        setSessionToken(data.session_token)
        localStorage.setItem('fitclub-chat-session', data.session_token)
      }

      // اضافه کردن پاسخ
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: data.bot_message.content,
        },
      ])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'bot',
          content:
            'متأسفم، یه مشکل پیش اومد. 😔\nلطفاً دوباره تلاش کن یا با پشتیبانی تماس بگیر:\n📞 ۰۲۱-۱۲۳۴۵۶۷۸',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  // تبدیل لینک‌ها به کلیک‌پذیر + نمایش شماره
  const renderContent = (content) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ))
  }

  return (
    <motion.div
      className="chat-window"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
    >
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">🤖</div>
          <div>
            <strong>دستیار هوشمند</strong>
            <span className="chat-status">
              <span className="status-dot" />
              آنلاین
            </span>
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`chat-message ${
                msg.role === 'user' ? 'user' : 'bot'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chat-bubble">{renderContent(msg.content)}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            className="chat-message bot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="chat-bubble typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="chat-suggestions">
          <span className="suggestions-title">سوالات پیشنهادی:</span>
          <div className="suggestions-list">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="suggestion-chip"
                onClick={() => sendMessage(s.text)}
              >
                {s.icon} {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="سوالت رو بنویس..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="chat-input"
        />
        <button
          type="submit"
          className="chat-send"
          disabled={!input.trim() || loading}
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>

      {/* Footer */}
      <div className="chat-footer">
        <span>پشتیبانی: 📞 ۰۲۱-۱۲۳۴۵۶۷۸</span>
      </div>
    </motion.div>
  )
}