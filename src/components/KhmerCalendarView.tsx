import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Tag,
  Star,
  Sparkles,
  Info,
  CheckCircle2,
  PartyPopper,
  GraduationCap,
  Award
} from 'lucide-react';
import {
  OFFICIAL_KHMER_HOLIDAYS_2026,
  KHMER_SOLAR_MONTHS,
  KHMER_DAYS_OF_WEEK,
  toKhmerDigits,
  getKhmerLunarDateInfo,
  KhmerHoliday,
  SchoolCalendarEvent
} from '../khmerCalendarData';

interface KhmerCalendarViewProps {
  schoolName: string;
}

export const KhmerCalendarView: React.FC<KhmerCalendarViewProps> = ({ schoolName }) => {
  // Current view date
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 2, 21)); // default March 21, 2026
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-21');
  const [filterType, setFilterType] = useState<'all' | 'holidays' | 'school_events' | 'notes'>('all');

  // Custom user events / notes saved in localStorage
  const [customEvents, setCustomEvents] = useState<SchoolCalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('moeys_calendar_custom_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ev-1',
        title: 'កិច្ចប្រជុំបូកសរុបការងារប្រចាំត្រីមាស និងការវាយតម្លៃលទ្ធផលសិស្ស',
        date: '2026-03-21',
        category: 'meeting',
        notes: 'រៀបចំរបាយការណ៍បូកសរុប និងបញ្ជូនទៅកម្រងស្ពានស្រែង',
        isImportant: true,
      },
      {
        id: 'ev-2',
        title: 'ការប្រកួតកីឡាបាល់ទាត់មិត្តភាពសិស្សបឋម',
        date: '2026-03-28',
        category: 'sports',
        notes: 'កីឡាករថ្នាក់ទី៥ និងទី៦ ចូលរួមប្រកួត',
        isImportant: false,
      },
    ];
  });

  // Modal / Form state for adding custom event
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-03-21');
  const [newCategory, setNewCategory] = useState<'holiday' | 'exam' | 'meeting' | 'sports' | 'general'>('general');
  const [newNotes, setNewNotes] = useState('');
  const [newIsImportant, setNewIsImportant] = useState(false);

  // Save events to local storage
  const saveEvents = (updated: SchoolCalendarEvent[]) => {
    setCustomEvents(updated);
    try {
      localStorage.setItem('moeys_calendar_custom_events', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: SchoolCalendarEvent = {
      id: 'event_' + Date.now(),
      title: newTitle.trim(),
      date: newDate,
      category: newCategory,
      notes: newNotes.trim(),
      isImportant: newIsImportant,
    };

    const updated = [newEvent, ...customEvents];
    saveEvents(updated);
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = customEvents.filter(ev => ev.id !== id);
    saveEvents(updated);
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToday = () => {
    setCurrentDate(new Date(2026, 2, 21));
    setSelectedDate('2026-03-21');
  };

  // Calendar grid math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

  // Days array for current month
  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      const mStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(prevDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${prevDate.getFullYear()}-${mStr}-${dStr}`,
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const curDate = new Date(year, month, i);
      const mStr = String(curDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(curDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${year}-${mStr}-${dStr}`,
        dayNumber: i,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill standard 35 or 42 grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const mStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(nextDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${nextDate.getFullYear()}-${mStr}-${dStr}`,
        dayNumber: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month, startingDayOfWeek, daysInMonth]);

  // Selected date info
  const selectedDateObj = useMemo(() => {
    const parts = selectedDate.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }, [selectedDate]);

  const selectedDateLunarInfo = useMemo(() => {
    return getKhmerLunarDateInfo(selectedDateObj);
  }, [selectedDateObj]);

  // Find holidays and events for a date
  const getHolidaysForDate = (dateStr: string) => {
    return OFFICIAL_KHMER_HOLIDAYS_2026.filter(h => {
      if (h.date === dateStr) return true;
      if (h.daysCount > 1) {
        const start = new Date(h.date).getTime();
        const cur = new Date(dateStr).getTime();
        const diff = (cur - start) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff < h.daysCount;
      }
      return false;
    });
  };

  const getEventsForDate = (dateStr: string) => {
    return customEvents.filter(e => e.date === dateStr);
  };

  const selectedDateHolidays = getHolidaysForDate(selectedDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold font-moul text-slate-900">
              ប្រតិទិនខ្មែរ និងកាលវិភាគអប់រំ (Khmer Calendar 2026)
            </h1>
          </div>
          <p className="text-xs text-slate-500 pl-1">
            ពិនិត្យថ្ងៃបុណ្យជាតិ ថ្ងៃសីល ថ្ងៃឈប់សម្រាក និងកត់ត្រាព្រឹត្តិការណ៍ចំណាំការងារសាលារៀន ({schoolName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            ថ្ងៃកំណត់របាយការណ៍ (២១ មីនា)
          </button>
          <button
            onClick={() => {
              setNewDate(selectedDate);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បង្កើតព្រឹត្តិការណ៍ / ចំណាំ</span>
          </button>
        </div>
      </div>

      {/* Selected Day Feature Banner with Khmer Chhnam Lunar Details */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-200 text-amber-900">
                កាលបរិច្ឆេទដែលបានជ្រើសរើស
              </span>
              <span className="text-xs text-slate-600">
                {selectedDate}
              </span>
            </div>

            <h2 className="text-lg font-bold text-amber-950 font-moul">
              {selectedDateLunarInfo.dayOfWeekKhmer} {selectedDateLunarInfo.lunarDayString} ខែ{selectedDateLunarInfo.lunarMonth} ឆ្នាំ{selectedDateLunarInfo.animalYear} {selectedDateLunarInfo.sak} ព.ស.{selectedDateLunarInfo.buddhistYear}
            </h2>

            <p className="text-sm font-semibold text-slate-800">
              ត្រូវនឹង {selectedDateLunarInfo.solarDateStringKhmer}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {selectedDateHolidays.length > 0 ? (
              selectedDateHolidays.map(h => (
                <div
                  key={h.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5"
                >
                  <PartyPopper className="w-3.5 h-3.5" />
                  <span>{h.nameKhmer}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ថ្ងៃបំពេញការងារ និងបង្រៀនធម្មតា</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Details & Events on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-moul">
                ខែ{KHMER_SOLAR_MONTHS[month]} ឆ្នាំ{toKhmerDigits(year)}
              </h3>
              <span className="text-xs text-slate-500">
                ({firstDayOfMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="ខែមុន"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="ខែបន្ទាប់"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {KHMER_DAYS_OF_WEEK.map((d, i) => (
              <div
                key={i}
                className={`py-2 text-xs font-semibold rounded-md ${
                  i === 0 ? 'text-rose-600 bg-rose-50/50' : i === 6 ? 'text-amber-700 bg-amber-50/50' : 'text-slate-700 bg-slate-50'
                }`}
              >
                {d.replace('ថ្ងៃ', '')}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr === selectedDate;
              const dateObj = new Date(item.dateStr);
              const lunar = getKhmerLunarDateInfo(dateObj);
              const holidays = getHolidaysForDate(item.dateStr);
              const events = getEventsForDate(item.dateStr);
              const hasHoliday = holidays.length > 0;
              const hasEvent = events.length > 0;
              const isSunday = dateObj.getDay() === 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-h-[80px] sm:min-h-[92px] p-1.5 text-left rounded-lg border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 ring-offset-1 z-10'
                      : item.isCurrentMonth
                      ? 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/60'
                      : 'border-slate-100 bg-slate-50/40 opacity-40 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span
                      className={`text-xs font-bold leading-none ${
                        isSunday || hasHoliday
                          ? 'text-rose-600 font-extrabold'
                          : 'text-slate-900'
                      }`}
                    >
                      {toKhmerDigits(item.dayNumber)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.dayNumber}
                    </span>
                  </div>

                  {/* Lunar Note */}
                  <div className="text-[10px] text-amber-800/80 font-medium truncate w-full">
                    {lunar.lunarDayString}
                  </div>

                  {/* Badges / Indicators */}
                  <div className="space-y-0.5 w-full">
                    {hasHoliday && (
                      <div className="bg-rose-100 text-rose-800 text-[9px] font-medium px-1 py-0.5 rounded truncate border border-rose-200">
                        {holidays[0].nameKhmer.split('(')[0]}
                      </div>
                    )}
                    {hasEvent && (
                      <div className="bg-sky-100 text-sky-800 text-[9px] font-medium px-1 py-0.5 rounded truncate border border-sky-200">
                        {events[0].title}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legends */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>ថ្ងៃបុណ្យជាតិ / សម្រាក</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              <span>ព្រឹត្តិការណ៍សាលា / ចំណាំ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>កាលបរិច្ឆេទជ្រើស</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Date Agenda & Quick Add */}
        <div className="space-y-6">
          {/* Card: Selected Date Agenda */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>របៀបវារៈ & ចំណាំប្រចាំថ្ងៃ ({toKhmerDigits(selectedDateObj.getDate())} {KHMER_SOLAR_MONTHS[selectedDateObj.getMonth()]})</span>
              </h3>
              <button
                onClick={() => {
                  setNewDate(selectedDate);
                  setShowAddModal(true);
                }}
                className="text-amber-600 hover:text-amber-700 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>បន្ថែម</span>
              </button>
            </div>

            {/* Official Holiday Details if any */}
            {selectedDateHolidays.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                  ថ្ងៃឈប់សម្រាកផ្លូវការ / បុណ្យជាតិ
                </p>
                {selectedDateHolidays.map(h => (
                  <div key={h.id} className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                    <p className="font-bold text-xs text-rose-900">{h.nameKhmer}</p>
                    {h.description && (
                      <p className="text-[11px] text-rose-700">{h.description}</p>
                    )}
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-rose-200/80 text-rose-900 rounded font-medium">
                      សម្រាក {toKhmerDigits(h.daysCount)} ថ្ងៃ
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Events / Notes */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                ព្រឹត្តិការណ៍សាលារៀន និងចំណាំ ({selectedDateEvents.length})
              </p>

              {selectedDateEvents.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  មិនទាន់មានព្រឹត្តិការណ៍ ឬចំណាំនៅថ្ងៃនេះទេ
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg transition-colors flex items-start justify-between gap-2"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                              ev.category === 'exam'
                                ? 'bg-purple-100 text-purple-800'
                                : ev.category === 'meeting'
                                ? 'bg-sky-100 text-sky-800'
                                : ev.category === 'sports'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {ev.category === 'exam'
                              ? 'ការប្រឡង'
                              : ev.category === 'meeting'
                              ? 'កិច្ចប្រជុំ'
                              : ev.category === 'sports'
                              ? 'កីឡា'
                              : 'ទូទៅ'}
                          </span>
                          <span className="font-bold text-slate-900">{ev.title}</span>
                        </div>
                        {ev.notes && (
                          <p className="text-slate-600 text-[11px] leading-relaxed">{ev.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors shrink-0"
                        title="លុបចំណាំ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card: Upcoming MoEYS Milestones & Holidays */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>កាលវិភាគសំខាន់ៗបន្ទាប់ (MoEYS Milestones)</span>
            </h3>

            <div className="space-y-2 text-xs">
              {OFFICIAL_KHMER_HOLIDAYS_2026.filter(h => h.date >= selectedDate).slice(0, 5).map(h => (
                <div
                  key={h.id}
                  onClick={() => setSelectedDate(h.date)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-amber-50/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{h.nameKhmer}</p>
                    <p className="text-[11px] text-slate-500">{h.date}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {h.isDayOff ? 'ឈប់សម្រាក' : 'ព្រឹត្តិការណ៍'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to Create New Event or Note */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>បង្កើតព្រឹត្តិការណ៍ / កំណត់ចំណាំថ្មី</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">ចំណងជើងព្រឹត្តិការណ៍ / កិច្ចការ៖</label>
                <input
                  type="text"
                  required
                  placeholder="ឧទាហរណ៍៖ កិច្ចប្រជុំគ្រូប្រចាំខែ, ការប្រកួតកីឡា..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">កាលបរិច្ឆេទ (Date)៖</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ប្រភេទកម្មវិធី៖</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="general">ទូទៅ / ចំណាំ</option>
                    <option value="meeting">កិច្ចប្រជុំ</option>
                    <option value="exam">ការប្រឡង</option>
                    <option value="sports">កីឡា & សិល្បៈ</option>
                    <option value="holiday">ថ្ងៃសម្រាក</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">ខ្លឹមសារលម្អិត ឬសេចក្ដីបញ្ជាក់បន្ថែម៖</label>
                <textarea
                  rows={3}
                  placeholder="កំណត់ចំណាំបន្ថែម ទីកន្លែង ឬអ្នកទទួលខុសត្រូវ..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-important"
                  checked={newIsImportant}
                  onChange={e => setNewIsImportant(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="chk-important" className="text-slate-700 font-medium">
                  កំណត់ជាព្រឹត្តិការណ៍សំខាន់
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors shadow-xs"
                >
                  រក្សាទុកព្រឹត្តិការណ៍
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
