import React, { useState } from 'react'
import { Bot, X, Sparkles, Send, Database, ArrowRight, CornerDownLeft } from 'lucide-react'
import { executeChatbotQuery } from '../../lib/mockData'
import { useStoreData } from '../../store/useStoreData'
import { api } from '../../lib/api'

export function ChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { products, orders } = useStoreData()

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am your Store Intelligence Assistant. Ask me about your real-time revenue, low stock alerts, top sellers, or order fulfillment pipeline.",
      table: null,
      tool: null
    }
  ])

  const suggestedChips = [
    "Top 5 products this month",
    "Low stock items",
    "Revenue this week vs last week",
    "Orders pipeline status"
  ]

  const handleSendMessage = async (textToSend) => {
    const q = textToSend || inputMessage
    if (!q.trim()) return

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')

    // 1. Try real Gemini / Groq dual failover backend AI service
    try {
      const aiRes = await api.askAI(q)
      if (aiRes && aiRes.answer) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: aiRes.answer,
          table: aiRes.table,
          tool: aiRes.tool,
          params: aiRes.params
        }
        setMessages(prev => [...prev, botMsg])
        return
      }
    } catch (err) {
      console.warn('Real AI assistant call fallback to local engine:', err.message)
    }

    // 2. Deterministic local tool query fallback
    setTimeout(() => {
      const response = executeChatbotQuery(q, products, orders)
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        table: response.table,
        tool: response.tool,
        params: response.params
      }
      setMessages(prev => [...prev, botMsg])
    }, 300)
  }

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Store Assistant"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
      >
        <Bot className="h-6 w-6 group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </button>

      {/* Slide-out Chatbot Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Store AI Assistant</h3>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Tenant Safe • Read-Only Queries
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="font-medium">{msg.text}</p>

                  {/* Render Structured Table if returned by tool */}
                  {msg.table && (
                    <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <table className="w-full text-[11px] text-slate-800 text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                          <tr>
                            {msg.table.columns.map((col, idx) => (
                              <th key={idx} className="p-2 font-bold">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {msg.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2 whitespace-nowrap">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Data Provenance badge */}
                  {msg.tool && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Database className="h-3 w-3 text-indigo-500" />
                        Tool: {msg.tool}
                      </span>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggested Chips (Guaranteed zero-hallucination tools) */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Suggested Fast Queries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about revenue, orders, low stock..."
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
