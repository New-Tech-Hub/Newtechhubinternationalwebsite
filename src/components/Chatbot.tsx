import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Welcome to NewTech Hub Support 👋\n\nI'm here to help you with:\n- Course information and enrollment\n- Technical support\n- Payment inquiries\n- General questions about our programs\n\nHow can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save conversation to database
  const saveConversation = async (updatedMessages: Message[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const messagesJson = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      if (conversationId) {
        // Update existing conversation
        await supabase
          .from('chat_conversations')
          .update({ 
            messages: messagesJson as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user?.id || null,
            session_id: sessionId,
            messages: messagesJson as any,
            status: 'active'
          })
          .select()
          .single();
        
        if (data && !error) {
          setConversationId(data.id);
        }
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (resp.status === 402) {
        toast.error("Service temporarily unavailable.");
      } else {
        toast.error("Failed to get response. Please try again.");
      }
      throw new Error("Failed to start stream");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "assistant" && prev.length > 1) {
                return [...prev.slice(0, -1), { role: "assistant", content: assistantContent }];
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Save conversation after user message
    await saveConversation(newMessages);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Error:", error);
      const errorMessages: Message[] = [
        ...newMessages,
        {
          role: "assistant" as const,
          content: "Sorry, I encountered an error. Please try again.",
        },
      ];
      setMessages(errorMessages);
      await saveConversation(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectToAgent = () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'Me' : 'Bot'}: ${msg.content}`)
      .join('\n\n');
    
    const whatsappMessage = `Hello! I need help with my inquiry.\n\nMy conversation so far:\n\n${conversationText}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/2348087404084?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp...", {
      description: "You'll be connected to our support team"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">NewTech Hub Support</h3>
                <p className="text-xs text-muted-foreground">We're here to help!</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t space-y-2">
            <Button
              onClick={handleConnectToAgent}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Connect to Live Agent via WhatsApp
            </Button>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
