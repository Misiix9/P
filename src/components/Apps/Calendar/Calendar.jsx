import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
  Bell,
  Edit,
  Trash2,
  Calendar as CalendarView,
  List,
  Grid3X3,
  Settings,
  RefreshCw,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day, agenda
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Sample events (in a real app, these would come from Google Calendar API)
  const sampleEvents = [
    {
      id: '1',
      title: 'Portfolio Review Meeting',
      description: 'Quarterly portfolio performance review with stakeholders',
      start: new Date(2024, new Date().getMonth(), 15, 10, 0),
      end: new Date(2024, new Date().getMonth(), 15, 11, 30),
      location: 'Conference Room A',
      attendees: ['john@example.com', 'sarah@example.com'],
      type: 'meeting',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Submit final project deliverables',
      start: new Date(2024, new Date().getMonth(), 20, 23, 59),
      end: new Date(2024, new Date().getMonth(), 20, 23, 59),
      location: '',
      attendees: [],
      type: 'deadline',
      color: 'bg-red-500'
    },
    {
      id: '3',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      start: new Date(2024, new Date().getMonth(), new Date().getDate(), 9, 0),
      end: new Date(2024, new Date().getMonth(), new Date().getDate(), 9, 30),
      location: 'Video Call',
      attendees: ['team@example.com'],
      type: 'meeting',
      color: 'bg-green-500'
    },
    {
      id: '4',
      title: 'Workshop: React Best Practices',
      description: 'Learning session on advanced React patterns and optimization',
      start: new Date(2024, new Date().getMonth(), new Date().getDate() + 2, 14, 0),
      end: new Date(2024, new Date().getMonth(), new Date().getDate() + 2, 17, 0),
      location: 'Training Room B',
      attendees: ['developers@example.com'],
      type: 'workshop',
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    setEvents(sampleEvents);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        events: getEventsForDate(prevDate)
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date: date,
        isCurrentMonth: true,
        events: getEventsForDate(date)
      });
    }
    
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        events: getEventsForDate(nextDate)
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateDate = (direction) => {
    playClick();
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    playClick();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectDate = (date) => {
    playClick();
    setSelectedDate(date);
  };

  const openEventModal = (event = null) => {
    playClick();
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const MonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="bg-glass-dark rounded-xl border border-white/10 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {weekdays.map(day => (
            <div key={day} className="p-3 text-center text-white/80 font-medium bg-black/20">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <motion.div
              key={index}
              className={`aspect-square border-r border-b border-white/5 p-2 cursor-pointer hover:bg-white/5 transition ${
                !day.isCurrentMonth ? 'text-white/40' : 'text-white'
              } ${isToday(day.date) ? 'bg-accent/20' : ''} ${
                isSelected(day.date) ? 'ring-2 ring-accent/50' : ''
              }`}
              onClick={() => selectDate(day.date)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm font-medium ${isToday(day.date) ? 'text-accent' : ''}`}>
                  {day.date.getDate()}
                </div>
                <div className="flex-1 mt-1 space-y-1">
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs px-1 py-0.5 rounded text-white truncate ${event.color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEventModal(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-white/60">
                      +{day.events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const AgendaView = () => {
    const upcomingEvents = filteredEvents
      .filter(event => event.start >= new Date())
      .sort((a, b) => a.start - b.start)
      .slice(0, 10);

    return (
      <div className="bg-glass-dark rounded-xl border border-white/10 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
            <p>No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                className="bg-black/20 rounded-lg p-4 hover:bg-black/30 cursor-pointer transition"
                onClick={() => openEventModal(event)}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{event.title}</h4>
                    <p className="text-white/70 text-sm mt-1">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.start)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.attendees.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const EventModal = () => (
    <AnimatePresence>
      {showEventModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeEventModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-glass backdrop-blur-lg rounded-xl border border-white/20 max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {selectedEvent ? 'Event Details' : 'New Event'}
              </h2>
              <button
                onClick={closeEventModal}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            
            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedEvent.title}</h3>
                  <p className="text-white/70 mt-1">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60 mb-1">Start Time</div>
                    <div className="text-white">
                      {selectedEvent.start.toLocaleDateString()} at {formatTime(selectedEvent.start)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">End Time</div>
                    <div className="text-white">
                      {selectedEvent.end.toLocaleDateString()} at {formatTime(selectedEvent.end)}
                    </div>
                  </div>
                </div>
                
                {selectedEvent.location && (
                  <div>
                    <div className="text-white/60 mb-1 text-sm">Location</div>
                    <div className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.location}
                    </div>
                  </div>
                )}
                
                {selectedEvent.attendees.length > 0 && (
                  <div>
                    <div className="text-white/60 mb-1 text-sm">Attendees</div>
                    <div className="text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedEvent.attendees.join(', ')}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      playSuccess();
                      addNotification({
                        message: 'Event edit feature coming soon!',
                        type: 'info'
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      playSuccess();
                      addNotification({
                        message: 'Event delete feature coming soon!',
                        type: 'info'
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-accent focus:outline-none"
                />
                <textarea
                  placeholder="Event description"
                  rows={3}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-accent focus:outline-none resize-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="datetime-local"
                    className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                  <input
                    type="datetime-local"
                    className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location (optional)"
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-accent focus:outline-none"
                />
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      playSuccess();
                      addNotification({
                        message: 'Event creation feature coming soon!',
                        type: 'info'
                      });
                      closeEventModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Event
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-white">Calendar</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-10 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none w-48"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
          
          <button
            onClick={() => openEventModal()}
            className="flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-white/80" />
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 text-white/80" />
            </button>
          </div>
          
          <button
            onClick={goToToday}
            className="px-3 py-2 bg-black/20 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition text-sm"
          >
            Today
          </button>
          
          <h3 className="text-lg font-semibold text-white">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>
        
        <div className="flex bg-black/20 rounded-lg border border-white/10">
          {[
            { id: 'month', label: 'Month', icon: Grid3X3 },
            { id: 'agenda', label: 'Agenda', icon: List }
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => {
                  playClick();
                  setViewMode(view.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 transition ${
                  viewMode === view.id
                    ? 'bg-accent text-black'
                    : 'text-white/70 hover:text-white'
                } ${view.id === 'month' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-glass p-4">
        <AnimatePresence mode="wait">
          {viewMode === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MonthView />
            </motion.div>
          ) : (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AgendaView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EventModal />
    </div>
  );
};

export default Calendar;