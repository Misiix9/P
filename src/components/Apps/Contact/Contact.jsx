import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';

const initialState = { name: '', email: '', message: '' };

const Contact = ({ showNotification }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return 'All fields are required.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return 'Invalid email address.';
    }
    return '';
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm(initialState);
      if (showNotification) showNotification('Message sent!', 'success');
    }, 1200);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-glass rounded-xl shadow-glass border border-white/10 p-6 flex flex-col gap-4">
        <h2 className="text-accent text-xl font-bold mb-2 text-center">Contact Me</h2>
        <input
          className="rounded bg-black/30 border border-white/10 px-4 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-accent transition"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          className="rounded bg-black/30 border border-white/10 px-4 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-accent transition"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />
        <textarea
          className="rounded bg-black/30 border border-white/10 px-4 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-accent transition min-h-[100px] resize-none"
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          disabled={loading}
        />
        {error && <div className="text-red-400 text-xs text-center">{error}</div>}
        <Motion.button
          type="submit"
          className="mt-2 px-6 py-2 rounded bg-accent text-black font-semibold shadow-glass hover:scale-105 active:scale-95 transition disabled:opacity-60"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </Motion.button>
        {sent && <div className="text-green-400 text-xs text-center mt-2">Message sent! Thank you.</div>}
      </form>
    </div>
  );
};

export default Contact; 