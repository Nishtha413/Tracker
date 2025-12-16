import React, { createContext, useState, ReactNode, useContext, useMemo } from 'react';
import moment from 'moment';

export interface HistoryItem {
    id: string;
    startDate: string;
    endDate: string;
    symptoms: string[];
    collectionMethods: string[];
}

interface TrackerContextType {
    history: HistoryItem[];
    addEntry: (entry: HistoryItem) => void;
    deleteEntry: (id: string) => void;
    stats: {
        avgPeriod: number;
        avgCycle: number;
    };
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider = ({ children }: { children: ReactNode }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const addEntry = (entry: HistoryItem) => {
        setHistory((prev) => [entry, ...prev]);
    };

    const deleteEntry = (id: string) => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
    };

    const stats = useMemo(() => {
        if (history.length === 0) return { avgPeriod: 0, avgCycle: 28 }; // Default values

        // 1. Average Period Length
        const totalPeriodDays = history.reduce((acc, item) => {
            const start = moment(item.startDate);
            const end = moment(item.endDate);
            return acc + end.diff(start, 'days') + 1;
        }, 0);
        const avgPeriod = Math.round(totalPeriodDays / history.length);

        // 2. Average Cycle Length
        let avgCycle = 28;
        if (history.length >= 2) {
            const sortedHistory = [...history].sort((a, b) => moment(a.startDate).valueOf() - moment(b.startDate).valueOf());
            let totalCycleDays = 0;
            let cycleCount = 0;

            for (let i = 1; i < sortedHistory.length; i++) {
                const prevStart = moment(sortedHistory[i - 1].startDate);
                const currStart = moment(sortedHistory[i].startDate);
                totalCycleDays += currStart.diff(prevStart, 'days');
                cycleCount++;
            }
            avgCycle = Math.round(totalCycleDays / cycleCount);
        }

        return { avgPeriod, avgCycle };
    }, [history]);

    return (
        <TrackerContext.Provider value={{ history, addEntry, deleteEntry, stats }}>
            {children}
        </TrackerContext.Provider>
    );
};

export const useTracker = () => {
    const context = useContext(TrackerContext);
    if (!context) {
        throw new Error('useTracker must be used within a TrackerProvider');
    }
    return context;
};
