'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MiLunaLogo } from '../../components/mi_luna_logo';
import { FloralBackground } from '../../components/floral_background';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');

    // 🧠 Aquí más adelante conectaremos la IA
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Estoy aquí para ayudarte 💖. Pronto me conectaré a la IA.' },
      ]);
    }, 500);
  };

  const handleBack = () => router.push('/menu');

  return (
    <main className="flex min-h-screen flex-col items-center py-20 px-4 bg-white relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center w-full max-w-3xl">
        {/* 🔙 Header con logo centrado */}
        <div className="grid grid-cols-3 items-center w-full mb-6">
          <button
            onClick={handleBack}
            className="text-pink-700 hover:text-pink-900 transition flex items-center gap-2 justify-self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Atrás
          </button>
          <div className="flex justify-center">
            <MiLunaLogo size="small" />
          </div>
          <div /> {/* espacio vacío para balance */}
        </div>

        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          ¡Consulta a tu asistente personal!
        </h2>

        {/* Chat */}
        <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-6 flex flex-col h-[500px] overflow-y-auto mb-6">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center">Escribe tu primera consulta 👇</p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 p-3 rounded-xl max-w-[70%] whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-pink-500 text-white self-end'
                  : 'bg-gray-200 text-gray-800 self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex w-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Escribe tu mensaje... (Enter = enviar, Shift+Enter = salto de línea)"
            className="flex-1 border border-pink-300 rounded-l-xl px-4 py-3 focus:outline-none resize-none h-16"
          />
          <button
            onClick={sendMessage}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 rounded-r-xl"
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}
