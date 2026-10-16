import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import FloatingChatButton from './FloatingChatButton'
import ChatWindow from './ChatWindow'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {!isOpen && (
        <FloatingChatButton onClick={() => setIsOpen(true)} />
      )}
    </>
  )
}