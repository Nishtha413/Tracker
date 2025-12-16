import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import { useTracker } from './context/TrackerContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Configuration & Styles ---
const THEME_COLORS = {
    period: '#cad2c5',      // deep-teal (Primary Accent)
    bg: '#cad2c5',          // ash-grey
    text: '#000000',        // black (Primary Text)
};

const Calender = () => {
    const { history, stats } = useTracker();

    // Generate Marked Dates for Calendar
    const markedDates = useMemo(() => {
        const marks: any = {};

        // 1. Mark Historical Periods
        history.forEach(entry => {
            const start = moment(entry.startDate);
            const end = entry.endDate ? moment(entry.endDate) : moment(entry.startDate).add(stats.avgPeriod - 1, 'days');

            let current = start.clone();
            while (current.isSameOrBefore(end)) {
                const dateString = current.format('YYYY-MM-DD');
                marks[dateString] = {
                    customStyles: {
                        container: {
                            backgroundColor: THEME_COLORS.period,
                            borderRadius: 16, // Circle
                            elevation: 2
                        },
                        text: { color: 'white', fontWeight: 'bold' }
                    },
                    type: 'period'
                };
                current.add(1, 'day');
            }
        });

        // 2. Predict Future Periods Only (Next 6 Months)
        if (history.length > 0) {
            // Get latest cycle start
            const latestEntry = [...history].sort((a, b) => moment(b.startDate).valueOf() - moment(a.startDate).valueOf())[0];
            let nextCycleStart = moment(latestEntry.startDate).add(stats.avgCycle, 'days');

            // Generate for 6 cycles ahead
            for (let i = 0; i < 6; i++) {
                // Mark Predicted Period
                let pDate = nextCycleStart.clone();
                const pEnd = pDate.clone().add(stats.avgPeriod - 1, 'days');

                while (pDate.isSameOrBefore(pEnd)) {
                    const dStr = pDate.format('YYYY-MM-DD');
                    if (!marks[dStr]) {
                        marks[dStr] = {
                            customStyles: {
                                container: {
                                    borderColor: THEME_COLORS.period,
                                    borderWidth: 1.5,
                                    backgroundColor: '#cad2c5', // Ash Grey
                                    borderRadius: 16
                                },
                                text: { color: THEME_COLORS.period }
                            }
                        };
                    }
                    pDate.add(1, 'day');
                }

                // Advance to next cycle
                nextCycleStart.add(stats.avgCycle, 'days');
            }
        }

        return marks;
    }, [history, stats]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}> Calendar</Text>
            </View>

            <CalendarList
                // Range
                pastScrollRange={12}
                futureScrollRange={12}

                // Styling
                markingType={'custom'}
                markedDates={markedDates}

                // Theme
                theme={{
                    calendarBackground: '#cad2c5', // Muted Teal (Cards)
                    textSectionTitleColor: '#000000',
                    selectedDayBackgroundColor: THEME_COLORS.period,
                    selectedDayTextColor: '#ffffff', // Text on dark button/accent
                    todayTextColor: THEME_COLORS.period,
                    dayTextColor: '#000000',
                    textDisabledColor: '#cad2c5', // Ash Grey
                    dotColor: THEME_COLORS.period,
                    selectedDotColor: '#ffffff',
                    arrowColor: THEME_COLORS.period,
                    monthTextColor: '#000000',
                    indicatorColor: THEME_COLORS.period,
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 14,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 13
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cad2c5',
    },
    headerContainer: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        marginBottom: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f3e46',
    },
});

export default Calender;