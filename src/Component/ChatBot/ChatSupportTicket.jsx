import React, { useState } from "react";
import { FaCheckCircle, FaPaperPlane, FaHeadset, FaTimes } from "react-icons/fa";

function ChatSupportTicket({ initialTopic = "general", onSubmitted, onCancel }) {
  const [topic, setTopic] = useState(
    initialTopic === "refund" ? "Refund & Cancellation" : "Booking Inquiry"
  );
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.trim() || !message.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = `AB-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setSubmitting(false);
      if (onSubmitted) {
        onSubmitted({
          ticketId: generatedId,
          topic,
          contact,
          message,
        });
      }
    }, 800);
  };

  if (ticketId) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 my-2 text-emerald-900 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FaCheckCircle className="text-emerald-600 text-lg flex-shrink-0" />
          <h4 className="font-semibold text-sm">Support Ticket Created</h4>
        </div>
        <p className="text-xs text-emerald-800 mb-2 leading-relaxed">
          Your request has been prioritized with reference:{" "}
          <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
            #{ticketId}
          </span>
        </p>
        <div className="text-[11px] text-emerald-700 bg-emerald-100/60 p-2 rounded-lg">
          <strong>Topic:</strong> {topic}
          <br />
          <strong>Contact:</strong> {contact}
          <br />
          <strong>Status:</strong> Active (Priority Response &lt; 2 hrs)
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-rose-100 rounded-2xl p-4 my-2 shadow-md">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-xs">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-[#FF385C] flex items-center justify-center">
            <FaHeadset className="text-xs" />
          </div>
          <span>Submit Support Ticket</span>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 text-xs">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Issue Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 text-xs focus:outline-none focus:border-[#FF385C]"
          >
            <option value="Booking Inquiry">Booking Inquiry</option>
            <option value="Refund & Cancellation">Refund & Cancellation</option>
            <option value="Host & Listing Help">Host & Listing Help</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Safety & House Rules">Safety & House Rules</option>
            <option value="Other">Other Assistance</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Your Email or Phone</label>
          <input
            type="text"
            required
            placeholder="e.g. guest@example.com or phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 text-xs focus:outline-none focus:border-[#FF385C]"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">How can we help?</label>
          <textarea
            required
            rows={2}
            placeholder="Describe your issue or question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 text-xs focus:outline-none focus:border-[#FF385C] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting ? (
            <span>Submitting...</span>
          ) : (
            <>
              <FaPaperPlane className="text-xs" />
              <span>Submit Ticket</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatSupportTicket;
