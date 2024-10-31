import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const AIChatInterface = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur à la conversation
    const userMessage = {
      type: 'user',
      text: message
    };
    setConversation(prev => [...prev, userMessage]);

    // Réinitialiser le champ de message
    const currentMessage = message;
    setMessage('');

    // Activer le chargement
    setIsLoading(true);

    try {
      // Appel au webhook N8N
      const response = await fetch('VOTRE_URL_DE_WEBHOOK_N8N', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage
        })
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec le webhook');
      }

      const data = await response.json();

      // Ajouter la réponse de l'IA à la conversation
      const aiMessage = {
        type: 'ai',
        text: data.response
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = {
        type: 'error',
        text: 'Une erreur est survenue. Veuillez réessayer.'
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-500 text-white font-bold">
        Agent IA Produits
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${msg.type === 'user'
              ? 'bg-blue-100 text-blue-800 self-end ml-auto'
              : msg.type === 'ai'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            {msg.text}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex p-4 border-t border-gray-200"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Posez une question sur nos produits..."
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIChatInterface;