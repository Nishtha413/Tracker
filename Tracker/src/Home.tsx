import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import moment from 'moment';
import { useTracker } from './context/TrackerContext';

const { width } = Dimensions.get('window');

const Home = () => {
    const { history, stats } = useTracker();
    // Initialize with today's date
    const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"));

    // Cycle Calculations
    let daysLeft = 0;
    let currentPhase = "Unknown";
    let phaseTip = "Track your period to see insights.";
    let fertilityStatus = "Low";

    if (history.length > 0) {
        // Sort history to get the latest entry
        const latestEntry = [...history].sort((a, b) => moment(b.startDate).valueOf() - moment(a.startDate).valueOf())[0];
        const lastStart = moment(latestEntry.startDate);
        const today = moment();
        const cycleDay = today.diff(lastStart, 'days') + 1;

        // Days Left Calculation
        daysLeft = stats.avgCycle - cycleDay;
        if (daysLeft < 0) daysLeft = 0; // Overdue or Irregular

        // Phase Logic
        if (cycleDay >= 1 && cycleDay <= 5) {
            currentPhase = "Menstrual Phase";
            phaseTip = "Rest well and stay hydrated. Your energy might be low.";
            fertilityStatus = "Low";
        } else if (cycleDay > 5 && cycleDay <= 14) {
            currentPhase = "Follicular Phase";
            phaseTip = "Your energy is rising! Great time for new projects and exercise.";
            fertilityStatus = cycleDay > 10 ? "High" : "Medium";
        } else if (cycleDay === 14) { // Approximate ovulation
            currentPhase = "Ovulation Phase";
            phaseTip = "You're at your peak energy and fertility. Stay active!";
            fertilityStatus = "Very High";
        } else if (cycleDay > 14) {
            currentPhase = "Luteal Phase";
            phaseTip = "Eat protein-rich foods and prioritize self-care as PMS might start.";
            fertilityStatus = "Low";
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header_container}>
                <Text style={styles.header_text}>Period Tracker</Text>
            </View>

            <View style={styles.contentContainer}>

                {/* Date Display */}
                <Text style={styles.todayDateText}>{moment().format('dddd, MMMM Do')}</Text>

                {/* Weekly Calendar */}
                <View style={styles.calendarWrapper}>
                    <CalendarProvider
                        date={selectedDate}
                        onDateChanged={setSelectedDate}
                    >
                        <WeekCalendar
                            firstDay={1}
                            markedDates={{
                                [selectedDate]: {
                                    selected: true,
                                    selectedColor: '#52796f', // Deep Teal (Green)
                                    selectedTextColor: '#ffffff'
                                }
                            }}
                            theme={{
                                calendarBackground: 'transparent', // Show wrapper's #84a98c
                                textSectionTitleColor: '#000000', // Black for readability
                                dayTextColor: '#000000', // Black for numbers
                                todayTextColor: '#2f3e46', // Charcoal for Today (Stronger contrast)
                                selectedDayBackgroundColor: '#52796f',
                                selectedDayTextColor: '#ffffff',
                                dotColor: '#52796f',
                                textDayHeaderFontWeight: 'normal', // Boldest weight for day headers (Mon/Tue)
                                textDayFontWeight: 'bold', // Semi-bold for numbers
                                textDisabledColor: '#52796f',
                                arrowColor: '#52796f',
                                monthTextColor: '#000000',
                                indicatorColor: '#52796f',
                                // @ts-ignore
                                'stylesheet.calendar.header': {
                                    week: {
                                        marginTop: 5,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }
                                }
                            }}
                        />
                    </CalendarProvider>
                </View>

                {/* Cycle Circle */}
                <View style={styles.circleContainer}>
                    <View style={[styles.cycleCircle, { borderColor: currentPhase === 'Menstrual Phase' ? '#52796f' : '#cad2c5' }]}>
                        <Text style={styles.daysLeftText}>{history.length > 0 ? daysLeft : "-"}</Text>
                        <Text style={styles.daysLeftLabel}>Days Left</Text>
                    </View>
                </View>

                <View style={styles.tipBox}>
                    <Text style={styles.tipTitle}>Daily Insight</Text>
                    <Text style={styles.tipText}>💡 {phaseTip}</Text>
                </View>

                {/* Phase & Fertility Info */}
                <View style={styles.cardsContainer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Current Phase</Text>
                        <Text style={styles.cardValue}>{currentPhase}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>Fertility</Text>
                        <Text style={[styles.cardValue, { color: fertilityStatus.includes('High') ? '#32CD32' : '#555' }]}>{fertilityStatus}</Text>
                    </View>
                </View>

                {/* Stats Summary */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Avg Period</Text>
                        <Text style={styles.statVal}>{stats.avgPeriod} Days</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Avg Cycle</Text>
                        <Text style={styles.statVal}>{stats.avgCycle} Days</Text>
                    </View>
                </View>



            </View >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cad2c5',
        paddingTop: 60,
        paddingBottom: 20,
    },
    header_container: {
        alignItems: 'center',
        marginBottom: 2,
        height: 40,
        justifyContent: 'center',
    },
    header_text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f3e46',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    todayDateText: {
        fontSize: 18, // Increased
        color: '#52796f',
        fontWeight: 'bold', // Bolder
        marginBottom: 5,
    },
    calendarWrapper: {
        height: 85,
        width: '100%',
        backgroundColor: '#84a98c',
        borderRadius: 15,
        overflow: 'hidden',
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Added margin
    },
    cycleCircle: {
        width: width * 0.7, // Increased from 0.6
        height: width * 0.7, // Increased from 0.6
        borderRadius: (width * 0.7) / 2, // Updated
        borderWidth: 12, // Increased borders
        borderColor: '#52796f',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#84a98c',
        shadowColor: "#354f52",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    daysLeftText: {
        fontSize: 70, // Increased from 60
        fontWeight: 'bold',
        color: '#000000',
    },
    daysLeftLabel: {
        fontSize: 18,
        color: '#000000', // Black
        marginTop: -5,
    },
    cardsContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    infoCard: {
        width: '48%',
        backgroundColor: '#84a98c',
        padding: 15, // Increased padding
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#354f52',
        minHeight: 80, // Added minHeight
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 14, // Increased
        color: '#000000',
        marginBottom: 5,
        fontWeight: 'bold', // Bolder
    },
    cardValue: {
        fontSize: 16, // Increased
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    tipBox: {
        backgroundColor: '#84a98c',
        padding: 20, // Increased from 15
        borderRadius: 15,
        width: '90%',
        alignItems: 'center',
        borderLeftWidth: 6, // Thicker border
        borderLeftColor: '#52796f',
        marginTop: 5,
        minHeight: 80, // Ensure height
        justifyContent: 'center',
    },
    tipTitle: {
        fontSize: 18, // Increased
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    tipText: {
        fontSize: 15, // Increased
        color: '#000000',
        textAlign: 'left',
        lineHeight: 22, // Increased
        width: '100%',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#84a98c',
        paddingVertical: 15, // Increased
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#354f52',
        shadowColor: "#354f52",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        marginTop: 5,
        minHeight: 70, // Ensure height
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12, // Increased
        color: '#000000',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontWeight: 'bold', // Bolder
    },
    statVal: {
        fontSize: 18, // Increased
        fontWeight: 'bold',
        color: '#000000',
    },
    statDivider: {
        width: 1,
        height: 35, // Increased
        backgroundColor: '#354f52',
    }
});

export default Home;