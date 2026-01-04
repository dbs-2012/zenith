import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../css/ecs/ScheduleModal.css';

const ScheduleModal = ({ isOpen, onClose, onConfirm, onRemove, cluster, initialRange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Always start fresh for a new editing session
            setStartDate(null);
            setEndDate(null);
            setCurrentMonth(new Date());
            setIsSaving(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleMonthNav = (direction) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const isDateInPast = (dayNum) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
        return checkDate < today;
    };

    const handleDateClick = (dayNum) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);

        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (clickedDate < startDate) {
                setStartDate(clickedDate);
            } else {
                setEndDate(clickedDate);
            }
        }
    };

    const handleConfirm = async () => {
        if (startDate && !isSaving) {
            setIsSaving(true);

            // Simulate backend delay
            setTimeout(() => {
                onConfirm({
                    from: startDate,
                    to: endDate || startDate
                });
                setIsSaving(false);
            }, 800);
        }
    };

    return (
        <div className="schedule-modal-overlay" onClick={onClose}>
            <div className="schedule-modal-content" onClick={e => e.stopPropagation()}>
                <div className="schedule-modal-header">
                    <h2 className="schedule-modal-title">Schedule Cluster: {cluster?.name}</h2>
                    <button onClick={onClose} className="close-modal-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="schedule-modal-body">
                    {/* Animated Clock Section */}
                    <div className="clock-container">
                        <div className="animated-clock">
                            <div className="radar-sweep"></div>
                            <div className="clock-center"></div>
                            <div className="clock-hand-hour"></div>
                            <div className="clock-hand-minute"></div>
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="clock-tick"
                                    style={{ transform: `rotate(${i * 30}deg) translateY(-52px)` }}
                                ></div>
                            ))}
                            <div className="clock-marker-outer">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="clock-tick-outer"
                                        style={{ transform: `rotate(${i * 30}deg) translateY(-85px)` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        {/* <span className="clock-label">24-Hour System Pulse</span> */}
                    </div>

                    {/* Calendar Section */}
                    <div className="calendar-view">
                        <div className="calendar-header">
                            <button
                                className="calendar-nav-btn"
                                onClick={() => handleMonthNav(-1)}
                                disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="calendar-month-title">
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button className="calendar-nav-btn" onClick={() => handleMonthNav(1)}>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="calendar-day-label">{day}</div>
                            ))}
                            {[...Array(getFirstDayOfMonth(currentMonth))].map((_, i) => (
                                <div key={`empty-${i}`} className="calendar-day disabled"></div>
                            ))}
                            {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                                const dayNum = i + 1;
                                const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
                                const inPast = isDateInPast(dayNum);

                                const isStart = startDate && checkDate.getTime() === startDate.getTime();
                                const isEnd = endDate && checkDate.getTime() === endDate.getTime();
                                const inRange = startDate && endDate && checkDate > startDate && checkDate < endDate;

                                const isToday = dayNum === new Date().getDate() &&
                                    currentMonth.getMonth() === new Date().getMonth() &&
                                    currentMonth.getFullYear() === new Date().getFullYear();

                                return (
                                    <div
                                        key={dayNum}
                                        className={`calendar-day ${inPast ? 'disabled' : ''} ${isStart ? 'selected-start' : ''} ${isEnd ? 'selected-end' : ''} ${inRange ? 'in-range' : ''} ${isToday ? 'today' : ''}`}
                                        onClick={() => !inPast && handleDateClick(dayNum)}
                                    >
                                        {dayNum}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="schedule-modal-footer">
                    {initialRange && (
                        <button
                            className="btn-schedule-remove"
                            onClick={() => onRemove(cluster.name || cluster.id)}
                        >
                            Remove Schedule
                        </button>
                    )}
                    <button
                        className={`btn-schedule-save ${isSaving ? 'saving' : ''}`}
                        onClick={handleConfirm}
                        disabled={!startDate || isSaving}
                    >
                        {isSaving ? 'Saving to Cloud...' : 'Confirm Schedule'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
