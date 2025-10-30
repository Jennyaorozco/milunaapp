'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, FileText, AlertCircle } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  sources?: Array<{ source: string; page: string | number; content: string }>;
}

interface ProcessStatus {
  loading: boolean;
  success?: boolean;
  message?: string;
}

export default function ChatBubble() {
  const pathname = usePathname();
  
  // 🚫 MOVER el return condicional ANTES de TODOS los hooks
  if (pathname === '/login' || pathname === '/register') return null;

  // ✅ Ahora todos los hooks se declaran consistentemente
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>({ loading: false });
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'local'>('local');
  
  // Estado para la posición arrastrable
  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 100 : 100, 
    y: typeof window !== 'undefined' ? window.innerHeight - 100 : 100 
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Auto-scroll al final de los mensajes - SIN PROBLEMAS
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Procesar PDFs al abrir el chat - COMENTADO TEMPORALMENTE
  useEffect(() => {
    // if (isOpen && messages.length === 0) {
    //   processPDFs();
    // }
  }, [isOpen, messages.length]);

  const processPDFs = async () => {
    setProcessStatus({ loading: true });
    try {
      const response = await fetch('/api/rag/process-pdfs');
      const data = await response.json();
      
      setProcessStatus({
        loading: false,
        success: data.success,
        message: data.message
      });
    } catch (error) {
      setProcessStatus({
        loading: false,
        success: false,
        message: 'Error procesando PDFs'
      });
    }
  };

  // Manejar el inicio del arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatRef.current) return;
    
    setIsDragging(true);
    const rect = chatRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    e.preventDefault();
    e.stopPropagation();
  };

  // Manejar el movimiento durante el arrastre
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    const chatWidth = chatRef.current?.offsetWidth || 384;
    const chatHeight = chatRef.current?.offsetHeight || 550;
    const margin = 20;
    
    const boundedX = Math.max(margin, Math.min(window.innerWidth - chatWidth - margin, newX));
    const boundedY = Math.max(margin, Math.min(window.innerHeight - chatHeight - margin, newY));

    setPosition({ x: boundedX, y: boundedY });
  };

  // Manejar el fin del arrastre
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Agregar event listeners globales
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log("🔄 Enviando mensaje a simple-chat...");
      
      const response = await fetch('/api/rag/simple-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input
        }),
      });

      console.log("📨 Respuesta recibida, status:", response.status);

      const data = await response.json();

      if (data.success) {
        console.log("✅ Respuesta exitosa:", data.response.substring(0, 50) + "...");
        
        // Actualizar el proveedor de IA basado en la respuesta
        if (data.type === 'gemini') {
          setAiProvider('gemini');
        } else if (data.type === 'openai') {
          setAiProvider('openai');
        } else {
          setAiProvider('local');
        }
        
        const botMessage: Message = {
          sender: 'bot',
          text: data.response,
          sources: data.sources || []
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        console.error("❌ Error en respuesta:", data.error);
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error al obtener respuesta:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: `¡Hola! 👋 Parece que hay un problema temporal con mi configuración. 

Estoy aquí para ayudarte, pero algunas funciones están en ajustes. ¿Podrías intentarlo de nuevo en un momento?

Mientras tanto, ¿hay algo específico en lo que te pueda asistir?`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div 
      ref={chatRef}
      className={`fixed z-50 flex flex-col items-end transition-transform ${
        isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'
      }`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease'
      }}
    >
      {/* 🌸 Botón flotante */}
      {!isOpen && (
        <button
          onMouseDown={handleMouseDown}
          onClick={() => setIsOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 cursor-grab active:cursor-grabbing relative"
          aria-label="Abrir chat"
        >
          <MessageCircle size={36} strokeWidth={2.5} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-300 rounded-full opacity-70"></div>
        </button>
      )}

      {/* 🧠 Ventana del chat */}
      {isOpen && (
        <div className="w-96 h-[550px] bg-white/95 backdrop-blur-md border border-pink-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
          {/* Header con indicador de proveedor */}
          <div 
            onMouseDown={handleMouseDown}
            className="flex justify-between items-center bg-pink-500 text-white px-5 py-4 rounded-t-3xl cursor-grab active:cursor-grabbing relative"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                aiProvider === 'gemini' ? 'bg-green-400' : 
                aiProvider === 'openai' ? 'bg-blue-400' : 
                'bg-yellow-400'
              }`}></div>
              <h3 className="font-semibold text-lg">
                {aiProvider === 'gemini' ? 'Luna (Gemini)' : 
                 aiProvider === 'openai' ? 'Luna (OpenAI)' : 
                 'Luna (Local)'}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-white hover:text-pink-100 transition cursor-pointer p-1 rounded-full hover:bg-pink-600"
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cuerpo del chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="text-center mt-20 text-gray-500">
                {processStatus.loading ? (
                  <>
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText size={24} className="text-pink-500 animate-pulse" />
                    </div>
                    <p className="text-lg font-medium text-pink-600">Procesando PDFs...</p>
                    <p className="mt-2 text-sm">Leyendo documentos para preparar el asistente</p>
                    <div className="flex justify-center mt-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    </div>
                  </>
                ) : processStatus.success === false ? (
                  <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle size={24} className="text-red-500" />
                    </div>
                    <p className="text-lg font-medium text-red-600">Error</p>
                    <p className="mt-2 text-sm">{processStatus.message}</p>
                    <button 
                      onClick={processPDFs}
                      className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-pink-600 transition"
                    >
                      Reintentar
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle size={24} className="text-pink-500" />
                    </div>
                    <p className="text-lg font-medium text-pink-600">¡Luna Asistente! 🌙</p>
                    <p className="mt-1">Pregúntame lo que quieras</p>
                    <p className="text-xs mt-4 text-gray-400">
                      💡 Potenciado por Google Gemini AI - Respuestas inteligentes y gratuitas
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Modo actual: 
                        <span className={`font-semibold ${
                          aiProvider === 'gemini' ? 'text-green-500' : 
                          aiProvider === 'openai' ? 'text-blue-500' : 
                          'text-yellow-500'
                        }`}>
                          {aiProvider === 'gemini' ? ' Gemini AI' : 
                           aiProvider === 'openai' ? ' OpenAI' : 
                           ' Local'}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line transition-all duration-200 ${
                    msg.sender === 'user'
                      ? 'bg-pink-500 text-white self-end ml-auto rounded-br-none'
                      : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  {isLoading && i === messages.length - 1 && (
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
                
                {/* Mostrar fuentes */}
                {msg.sender === 'bot' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 max-w-[85%]">
                    <p className="font-semibold text-gray-600">📚 Fuentes consultadas:</p>
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="font-medium text-gray-700">
                          {source.source} {source.page && `- Pág. ${source.page}`}
                        </div>
                        <div className="text-gray-600 mt-1">{source.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center border-t border-pink-200 bg-white rounded-b-3xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              rows={1}
              disabled={isLoading || processStatus.loading}
              className="flex-1 px-4 py-3 text-sm resize-none outline-none rounded-bl-3xl placeholder-gray-400 disabled:opacity-50"
              style={{ minHeight: '50px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || processStatus.loading}
              className={`px-5 py-3 rounded-br-3xl font-semibold transition-all ${
                input.trim() && !isLoading && !processStatus.loading
                  ? 'bg-pink-500 hover:bg-pink-600 text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
