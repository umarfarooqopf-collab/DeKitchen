'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  AlertCircle,
  Loader2,
  TreePine,
  Utensils,
  Truck,
  PackageCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [specialRequest, setSpecialRequest] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name || !email || !phone || !date || !time) {
      setErrorMsg('Please fill in all required reservation fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          guests: Number(guests),
          date,
          time,
          specialRequest,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to book table');
      }

      setSuccessMsg(`Table confirmed! Reference ID: ${data.data.id}. We look forward to hosting you at De Kitchen!`);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setGuests('2');
      setDate('');
      setTime('19:00');
      setSpecialRequest('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while booking your table.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Dine-In & Outdoor Seating</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Reserve a Table & Visit Us
        </h1>
        <p className="text-sm text-gray-400">
          Located at 20-A, Old Jamrod Road, University Town, Peshawar. Dine indoor or in our fresh outdoor seating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" id="book">
        
        {/* Table Reservation Form */}
        <div className="bg-dark-900 border border-dark-700/80 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6">
          <div className="border-b border-dark-800 pb-4">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Table Reservation Form
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select indoor dining or outdoor garden seating for you, your family, or party.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. tariq@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0334 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">No. of Guests *</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons (Couple)</option>
                  <option value="4">4 Persons (Family)</option>
                  <option value="6">6 Persons (Party)</option>
                  <option value="8">8+ Persons</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Reservation Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Reservation Time *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Seating Preference / Requests</label>
                <input
                  type="text"
                  placeholder="e.g. Outdoor garden seating, high chair"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-dark-950 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-hover shadow-glow transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reserving Table...</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm Table Booking</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info & Hours */}
        <div className="space-y-6">
          <div className="bg-dark-900 border border-dark-700/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-white tracking-tight border-b border-dark-800 pb-4">
              Direct Contact & Location
            </h3>

            <div className="space-y-4 text-sm text-gray-300">
              <a
                href="tel:03344444767"
                className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/80 border border-dark-700 hover:border-primary/50 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Telephone / Delivery Order</span>
                  <span className="text-base font-bold text-white group-hover:text-primary transition">
                    0334 4444767
                  </span>
                </div>
              </a>

              <a
                href="https://wa.me/923344444767"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/80 border border-dark-700 hover:border-primary/50 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Official WhatsApp</span>
                  <span className="text-base font-bold text-white group-hover:text-primary transition">
                    0334 4444767
                  </span>
                </div>
              </a>

              <a
                href="mailto:dekitchen2018@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/80 border border-dark-700 hover:border-primary/50 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Official Email</span>
                  <span className="text-sm font-bold text-white group-hover:text-primary transition">
                    dekitchen2018@gmail.com
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-dark-800/80 border border-dark-700">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Physical Address</span>
                  <span className="text-sm font-bold text-white leading-relaxed">
                    20-A, Old Jamrod Road, University Town, Peshawar, Pakistan
                  </span>
                </div>
              </div>
            </div>

            {/* Facilities Bar */}
            <div className="pt-2 border-t border-dark-800 space-y-2">
              <span className="text-xs text-gray-400 font-bold uppercase block">Available Services & Facilities:</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <span className="flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5 text-primary" /> Dine-in</span>
                <span className="flex items-center gap-1.5"><TreePine className="w-3.5 h-3.5 text-green-400" /> Outdoor Seating</span>
                <span className="flex items-center gap-1.5"><PackageCheck className="w-3.5 h-3.5 text-blue-400" /> In-store Collection</span>
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-primary" /> Home Delivery</span>
              </div>
            </div>

            <div className="pt-2 border-t border-dark-800 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Clock className="w-4 h-4 text-primary" />
                <span>Opening Hours: 11:00 AM – 11:00 PM (Daily)</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
