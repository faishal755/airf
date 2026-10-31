import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes,
  FaExpandAlt,
  FaCompressAlt,
  FaRedo,
  FaMicrophone,
  FaMicrophoneSlash,
  FaChevronDown,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { MdOutlineSupportAgent, MdClose } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { listingDataContext } from "../../context/ListingContext";
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContext";
import axios from "axios";
import { dummyListings } from "../../data/dummyListings";
import {
  QUICK_SUGGESTIONS,
  findHelpAnswer,
  searchListingsWithNLP,
} from "./chatKnowledge";
import ChatListingCard from "./ChatListingCard";
import ChatSupportTicket from "./ChatSupportTicket";
import { chatSound } from "./chatSound";

const STORAGE_KEY = "airbnb_concierge_messages_v1";

const INITIAL_GREETING = {
  id: "msg_welcome",
  sender: "bot",
  text: `👋 **Welcome to your Airbnb Travel Assistant!**

I am **Aura**, your personalized travel assistant. Here's how I can assist you:
- 🔍 **Search & Recommend Stays**: Find villas, cabins, pool houses, or budget stays tailored to your dates and budget.
- 🗺️ **Sync with Map**: Preview listings right here and filter them on your home map with one click.
- 🛡️ **Help & Policies**: Instant guidance on how to book, cancellations, refunds, and hosting your place.

Tap any topic below or ask me anything in your own words!`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  followUps: [
    "🏖️ Beach villas in Goa",
    "🏔️ Mountain cabins",
    "🏊 Stays with private pools",
    "💰 Under ₹3,000",
    "📅 How to book a stay?",
    "🛡️ Cancellation & Refunds",
  ],
};

function ChatBot() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingData, setNewListData } = useContext(listingDataContext);
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext) || {};

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Active support ticket topic if user triggers ticket form
  const [activeTicketTopic, setActiveTicketTopic] = useState(null);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [INITIAL_GREETING];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setShowTooltip(false);
    }
  }, [messages, isOpen, isTyping]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Chat storage error:", e);
    }
  }, [messages]);

  // Dismiss tooltip after 10s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Global window event listener to open concierge from anywhere in the app
  useEffect(() => {
    const handleOpenEvent = (e) => {
      setIsOpen(true);
      setShowTooltip(false);
      if (e?.detail?.query) {
        setTimeout(() => {
          handleSend(e.detail.query);
        }, 200);
      }
    };
    window.addEventListener("open-airbnb-concierge", handleOpenEvent);
    return () => window.removeEventListener("open-airbnb-concierge", handleOpenEvent);
  }, []);

  // Web Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          // Automatically submit speech after a tiny delay
          setTimeout(() => {
            handleSend(transcript);
          }, 300);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.info("Voice recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
        setIsListening(false);
      }
    }
  };

  const toggleSound = () => {
    chatSound.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleResetChat = () => {
    const fresh = [
      {
        ...INITIAL_GREETING,
        id: `msg_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(fresh);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTicketTopic(null);
    toast.success("Chat history cleared");
  };

  // Sync matched listings onto Home page & map
  const handleApplyToHome = (itemOrList) => {
    const listToSet = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
    setNewListData(listToSet);
    toast.success(
      `Filtered ${listToSet.length} stay${listToSet.length > 1 ? "s" : ""} on your home view!`,
      { autoClose: 2500 }
    );
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  // Process user message
  const handleSend = (textToSend) => {
    const userText = (textToSend || input).trim();
    if (!userText || isTyping) return;

    chatSound.playPop();

    const newMsg = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      processBotResponse(userText);
    }, 700);
  };

  const processBotResponse = async (query) => {
    const allAvailableListings =
      listingData && listingData.length > 0 ? listingData : dummyListings;

    // Check if query matches help / FAQ / small-talk topics first
    const helpMatch = findHelpAnswer(query, userData, navigate);

    if (helpMatch) {
      chatSound.playReceive();
      setIsTyping(false);

      if (helpMatch.type === "support_prompt") {
        setActiveTicketTopic(helpMatch.action?.payload || "general");
      }

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: helpMatch.text,
        action: helpMatch.action,
        followUps: helpMatch.followUps,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnreadCount((c) => c + 1);
      return;
    }

    // Otherwise, perform intelligent NLP listings search
    let { listings, explanation } = searchListingsWithNLP(query, allAvailableListings);

    // If serverUrl is present, attempt live database search
    if (serverUrl) {
      try {
        const res = await axios.post(
          `${serverUrl}/api/bot/chat`,
          { message: query },
          { timeout: 6000 }
        );
        if (res.data?.reply) {
          explanation = res.data.reply;
        }
        if (res.data?.listings && res.data.listings.length > 0) {
          const backendIds = new Set(res.data.listings.map((l) => String(l._id)));
          const filteredLocal = listings.filter((l) => !backendIds.has(String(l._id)));
          listings = [...res.data.listings, ...filteredLocal].slice(0, 4);
        }
      } catch (err) {
        // Graceful fallback to searchListingsWithNLP
      }
    }

    chatSound.playReceive();
    setIsTyping(false);

    const botMsg = {
      id: `bot_${Date.now()}`,
      sender: "bot",
      text: explanation,
      listings: listings,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      followUps: [
        "Filter all these on the map",
        "Show cheaper stays under ₹3,000",
        "How do I reserve one of these?",
        "What is the cancellation policy?",
      ],
    };

    setMessages((prev) => [...prev, botMsg]);
    if (!isOpen) setUnreadCount((c) => c + 1);
  };

  // Quick Action Handler for Action Buttons inside messages
  const handleActionClick = (action) => {
    if (!action) return;
    if (action.actionType === "navigate") {
      navigate(action.payload);
    } else if (action.actionType === "support_form") {
      setActiveTicketTopic(action.payload || "general");
      // Scroll to bottom
      setTimeout(scrollToBottom, 150);
    }
  };

  // Support ticket submitted callback
  const handleSupportTicketSubmitted = (ticketData) => {
    setActiveTicketTopic(null);
    chatSound.playReceive();

    const botConfirmMsg = {
      id: `bot_ticket_${Date.now()}`,
      sender: "bot",
      text: `✅ **Thank you, your support ticket #${ticketData.ticketId} is logged!**

Our Concierge & Guest Experience specialists have received your inquiry regarding **${ticketData.topic}**. A senior specialist will reach out to **${ticketData.contact}** within **2 hours**.`,
      followUps: ["Browse trending stays", "How does booking work?", "Cancellation policies"],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botConfirmMsg]);
  };

  // Markdown-like text renderer
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");

    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-gray-900 text-sm mt-1 mb-1.5 flex items-center gap-1.5">
            {line.replace("### ", "")}
          </h4>
        );
      }
      // List item
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-3 list-disc text-xs text-gray-700 my-0.5 leading-relaxed">
            {renderInlineMarkdown(line.substring(2))}
          </li>
        );
      }
      // Numbered item
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-xs text-gray-700 my-1 leading-relaxed pl-1">
            {renderInlineMarkdown(line)}
          </div>
        );
      }
      // Regular paragraph / blank line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-gray-800 leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="font-sans">
      {/* ── Welcome Floating Tooltip ── */}
      {showTooltip && !isOpen && (
        <div className="fixed bottom-24 right-5 md:right-8 z-50 bg-white border border-rose-100 shadow-xl rounded-2xl p-3.5 max-w-[270px] animate-bounce-subtle">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5"
          >
            <FaTimes className="text-xs" />
          </button>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#E00B41] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <IoSparkles className="text-sm" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Airbnb AI Concierge</p>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                Need help finding the best stay or have booking questions? Ask Aura!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Launcher Trigger Button ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] text-white px-4 py-3.5 md:px-5 md:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 select-none cursor-pointer"
            aria-label="Open AI Concierge"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-1 rounded-full bg-[#FF385C] opacity-40 blur-sm group-hover:opacity-75 animate-pulse -z-10" />

            {/* Icon */}
            <div className="relative">
              <IoSparkles className="text-lg md:text-xl text-yellow-200 animate-spin-slow" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold tracking-wide flex items-center gap-1">
                <span>Ask AI Concierge</span>
              </div>
            </div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── Chat Modal / Window ── */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white border border-gray-200 shadow-2xl transition-all duration-300 ease-out overflow-hidden ${
            isExpanded
              ? "bottom-4 right-4 left-4 top-4 md:left-auto md:top-auto md:bottom-6 md:right-6 md:w-[560px] md:h-[750px] md:max-h-[90vh] rounded-3xl"
              : "bottom-3 right-3 left-3 md:left-auto md:bottom-6 md:right-6 w-auto md:w-[410px] h-[82vh] md:h-[620px] max-h-[88vh] rounded-2xl md:rounded-3xl"
          }`}
        >
          {/* ── Top Header ── */}
          <div className="bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] text-white px-4 py-3.5 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <IoSparkles className="text-lg text-yellow-200" />
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-rose-600 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white leading-tight">
                    Aura
                  </h3>
                  <span className="text-[10px] bg-white/20 text-white font-medium px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    AI Concierge
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-none mt-0.5">
                  Smart Stay Finder & 24/7 Support
                </p>
              </div>
            </div>

            {/* Header Control Actions */}
            <div className="flex items-center gap-1 text-white/90">
              {/* Sound toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <FaVolumeMute className="text-sm" /> : <FaVolumeUp className="text-sm" />}
              </button>

              {/* Reset chat */}
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                title="Restart conversation"
              >
                <FaRedo className="text-xs" />
              </button>

              {/* Expand / Compress desktop only */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:block p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                title={isExpanded ? "Standard view" : "Expanded view"}
              >
                {isExpanded ? <FaCompressAlt className="text-xs" /> : <FaExpandAlt className="text-xs" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                title="Close chat"
              >
                <MdClose className="text-lg" />
              </button>
            </div>
          </div>

          {/* ── Messages Scroll Area ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-neutral-50/60 text-gray-800">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] md:max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      isUser
                        ? "bg-[#FF385C] text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-sm"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs md:text-[13px] leading-relaxed whitespace-pre-wrap font-normal">
                        {msg.text}
                      </p>
                    ) : (
                      <div>
                        {renderFormattedText(msg.text)}

                        {/* Interactive listings cards inside bot message */}
                        {msg.listings && msg.listings.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                              <span>Recommended Matches ({msg.listings.length})</span>
                              <button
                                type="button"
                                onClick={() => handleApplyToHome(msg.listings)}
                                className="text-[#FF385C] hover:underline font-semibold cursor-pointer"
                              >
                                Filter on Home Map →
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2 mt-1">
                              {msg.listings.map((item) => (
                                <ChatListingCard
                                  key={item._id}
                                  listing={item}
                                  onApplyToPage={handleApplyToHome}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action CTA Button if attached */}
                        {msg.action && (
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => handleActionClick(msg.action)}
                              className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                            >
                              <span>{msg.action.label}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Contextual Follow-up Chips for latest bot message */}
                  {!isUser &&
                    msg.followUps &&
                    msg.followUps.length > 0 &&
                    msg.id === messages[messages.length - 1]?.id && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.followUps.map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (chip.includes("Filter all these on the map")) {
                                if (msg.listings) handleApplyToHome(msg.listings);
                              } else {
                                handleSend(chip);
                              }
                            }}
                            className="bg-white hover:bg-rose-50 text-gray-700 hover:text-[#FF385C] border border-gray-200 hover:border-rose-200 text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shadow-2xs cursor-pointer select-none"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {/* Inline Support Ticket Form if requested */}
            {activeTicketTopic && (
              <ChatSupportTicket
                initialTopic={activeTicketTopic}
                onSubmitted={handleSupportTicketSubmitted}
                onCancel={() => setActiveTicketTopic(null)}
              />
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs pl-1">
                <div className="w-7 h-7 rounded-full bg-rose-100 text-[#FF385C] flex items-center justify-center">
                  <IoSparkles className="text-xs animate-spin-slow" />
                </div>
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggested Quick Actions Carousel ── */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {QUICK_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.query)}
                className="whitespace-nowrap text-[11px] bg-gray-100 hover:bg-rose-50 hover:text-[#FF385C] text-gray-700 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer select-none flex-shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ── Input Box Form ── */}
          <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#FF385C]/30 focus-within:bg-white focus-within:border-[#FF385C] border border-transparent transition-all"
            >
              {/* Voice recognition microphone */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-gray-400 hover:text-gray-700"
                }`}
                title={isListening ? "Listening... click to stop" : "Speak your search"}
              >
                {isListening ? (
                  <FaMicrophoneSlash className="text-sm" />
                ) : (
                  <FaMicrophone className="text-sm" />
                )}
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : "Ask Aura... (e.g. pool villa in Goa under 9k)"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-xs md:text-sm text-gray-800 focus:outline-none placeholder-gray-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0 cursor-pointer"
                title="Send message"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>

            <div className="text-center mt-1.5">
              <span className="text-[10px] text-gray-400">
                Airbnb Travel Assistant • Free Property Search & 24/7 Help
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
