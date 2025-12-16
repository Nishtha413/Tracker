import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useTracker, HistoryItem } from './context/TrackerContext';

const DEFAULT_SYMPTOMS = ["Cramps", "Headache", "Fatigue", "Bloating", "Mood Swings", "Acne"];
const COLLECTION_METHODS = ["Tampon", "Pad", "Panty Liner", "Cup", "Period Underwear"];

const Track = () => {
    const { history, addEntry, deleteEntry: deleteEntryCtx, stats } = useTracker();

    // Range State
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [markedDates, setMarkedDates] = useState<any>({});

    // Symptoms State
    const [allSymptoms, setAllSymptoms] = useState<string[]>(DEFAULT_SYMPTOMS);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [customSymptomText, setCustomSymptomText] = useState('');

    // Collection Method State
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);

    const markRange = (start: string, end: string) => {
        const range: any = {};
        let curr = moment(start);
        const last = moment(end);

        while (curr.isBefore(last) || curr.isSame(last, 'day')) {
            const dateStr = curr.format('YYYY-MM-DD');
            if (dateStr === start) {
                range[dateStr] = { startingDay: true, color: '#52796f', textColor: 'white' };
            } else if (dateStr === end) {
                range[dateStr] = { endingDay: true, color: '#52796f', textColor: 'white' };
            } else {
                range[dateStr] = { color: '#52796f', textColor: 'white' };
            }
            curr.add(1, 'days');
        }
        setMarkedDates(range);
    };

    const onDayPress = (day: { dateString: string }) => {
        const selectedDate = day.dateString;

        if (!startDate) {
            // 1. First Selection: Set Start
            setStartDate(selectedDate);

            // Prediction Logic: Only valid if we have stats
            if (stats.avgPeriod > 0) {
                const predictedEnd = moment(selectedDate).add(stats.avgPeriod - 1, 'days').format('YYYY-MM-DD');
                setEndDate(predictedEnd);
                markRange(selectedDate, predictedEnd);
            } else {
                setEndDate('');
                setMarkedDates({
                    [selectedDate]: { startingDay: true, color: '#84a98c', textColor: 'white' }
                });
            }
        } else {
            // 2. Existing Start Date
            if (moment(selectedDate).isBefore(moment(startDate))) {
                // Clicked BEFORE start: New start date
                setStartDate(selectedDate);
                setEndDate('');
                setMarkedDates({
                    [selectedDate]: { startingDay: true, color: '#84a98c', textColor: 'white' }
                });
            } else if (moment(selectedDate).isSame(moment(startDate))) {
                // Clicked ON start: Reset
                setStartDate('');
                setEndDate('');
                setMarkedDates({});
            } else {
                // Clicked AFTER start: Update End Date (Override prediction or user)
                setEndDate(selectedDate);
                markRange(startDate, selectedDate);
            }
        }
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this period entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteEntryCtx(id)
                }
            ]
        );
    };

    const toggleSymptom = (symptom: string) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const addCustomSymptom = () => {
        if (customSymptomText.trim()) {
            if (!allSymptoms.includes(customSymptomText.trim())) {
                setAllSymptoms([...allSymptoms, customSymptomText.trim()]);
                setSelectedSymptoms([...selectedSymptoms, customSymptomText.trim()]);
            }
            setCustomSymptomText('');
        }
    };

    const toggleCollection = (method: string) => {
        if (selectedCollections.includes(method)) {
            setSelectedCollections(selectedCollections.filter(m => m !== method));
        } else {
            setSelectedCollections([...selectedCollections, method]);
        }
    };

    const handleSave = () => {
        if (!startDate || !endDate) {
            Alert.alert("Error", "Please select a start and end date.");
            return;
        }

        if (moment(endDate).isAfter(moment(), 'day')) {
            Alert.alert("Invalid Date", "You cannot track for future dates.");
            return;
        }

        const newItem: HistoryItem = {
            id: Date.now().toString(),
            startDate: startDate,
            endDate: endDate,
            symptoms: selectedSymptoms,
            collectionMethods: selectedCollections,
        };

        addEntry(newItem);

        // Reset form
        setSelectedSymptoms([]);
        setSelectedCollections([]);
        setStartDate('');
        setEndDate('');
        setMarkedDates({});
        setShowCalendar(false);
        Alert.alert("Success", "Tracking entry saved!");
    };

    const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
        const dur = moment(item.endDate).diff(moment(item.startDate), 'days') + 1;
        return (
            <View style={styles.historyItem}>
                <View style={styles.historyHeader}>
                    <View>
                        <Text style={styles.historyDate}>
                            {moment(item.startDate).format('MMM Do')} - {moment(item.endDate).format('MMM Do, YYYY')}
                        </Text>
                        <Text style={styles.durationBadge}>{dur} Days</Text>
                    </View>
                    <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Symptoms */}
                <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Symptoms: </Text>
                    <View style={styles.historyChips}>
                        {item.symptoms && item.symptoms.length > 0 ? (
                            item.symptoms.map((s, index) => (
                                <Text key={index} style={styles.historyText}>{s}{index < item.symptoms.length - 1 ? ', ' : ''}</Text>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>None</Text>
                        )}
                    </View>
                </View>

                {/* Collection Methods */}
                <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Collection: </Text>
                    <View style={styles.historyChips}>
                        {item.collectionMethods && item.collectionMethods.length > 0 ? (
                            item.collectionMethods.map((m, index) => (
                                <Text key={index} style={styles.historyText}>{m}{index < item.collectionMethods.length - 1 ? ', ' : ''}</Text>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>None</Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Track Period</Text>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Avg Period</Text>
                    <Text style={styles.statValue}>{stats.avgPeriod} Days</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Avg Cycle</Text>
                    <Text style={styles.statValue}>{stats.avgCycle} Days</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

                {/* Date Selection */}
                <View style={styles.section}>
                    <Text style={styles.label}>Period Dates:</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.dateSelector}>
                        <Text style={styles.dateText}>
                            {startDate ? `${moment(startDate).format('MMM Do')} - ${endDate ? moment(endDate).format('MMM Do') : 'Select End'} ` : 'Select Dates'}
                        </Text>
                    </TouchableOpacity>

                    {showCalendar && (
                        <View style={styles.calendarContainer}>
                            <Calendar
                                markingType={'period'}
                                onDayPress={onDayPress}
                                markedDates={markedDates}
                                maxDate={moment().format('YYYY-MM-DD')}
                                theme={{
                                    todayTextColor: '#52796f',
                                    arrowColor: '#52796f',
                                }}
                            />
                        </View>
                    )}
                </View>

                {/* Symptoms Selection */}
                <View style={styles.section}>
                    <Text style={styles.label}>Symptoms:</Text>
                    <View style={styles.chipsContainer}>
                        {allSymptoms.map((symptom) => (
                            <TouchableOpacity
                                key={symptom}
                                style={[
                                    styles.chip,
                                    selectedSymptoms.includes(symptom) && styles.chipSelected
                                ]}
                                onPress={() => toggleSymptom(symptom)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    selectedSymptoms.includes(symptom) && styles.chipTextSelected
                                ]}>
                                    {symptom}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* Add Custom Symptom */}
                    <View style={styles.addSymptomContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add custom symptom..."
                            value={customSymptomText}
                            onChangeText={setCustomSymptomText}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addCustomSymptom}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Collection Method Selection */}
                <View style={styles.section}>
                    <Text style={styles.label}>Collection Method:</Text>
                    <View style={styles.chipsContainer}>
                        {COLLECTION_METHODS.map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={[
                                    styles.chip,
                                    selectedCollections.includes(method) && styles.chipSelected
                                ]}
                                onPress={() => toggleCollection(method)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    selectedCollections.includes(method) && styles.chipTextSelected
                                ]}>
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                    <Text style={styles.submitButtonText}>Save Entry</Text>
                </TouchableOpacity>

                {/* History Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>History:</Text>
                    {history.length === 0 ? (
                        <Text style={styles.emptyHistory}>No entries yet.</Text>
                    ) : (
                        <View style={styles.historyListContainer}>
                            {history.map(item => <View key={item.id}>{renderHistoryItem({ item })}</View>)}
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cad2c5',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2f3e46', // Charcoal Blue Headers
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#84a98c', // Card
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: "#354f52",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#354f52', // Border
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#2f3e46',
    },
    dateSelector: {
        padding: 15,
        backgroundColor: '#84a98c', // Card
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#354f52',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#000000',
    },
    calendarContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#354f52',
        borderRadius: 10,
        overflow: 'hidden',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#cad2c5', // Secondary Accent (unselected)
        borderWidth: 1,
        borderColor: '#354f52',
    },
    chipSelected: {
        backgroundColor: '#52796f', // Deep Teal (Selected)
        borderColor: '#52796f',
    },
    chipText: {
        fontSize: 14,
        color: '#000000',
    },
    chipTextSelected: {
        color: '#ffffff',
        fontWeight: '600',
    },
    addSymptomContainer: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#354f52',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#84a98c',
    },
    addButton: {
        backgroundColor: '#52796f',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#52796f', // Primary
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        shadowColor: "#354f52",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    historyListContainer: {
        marginTop: 5,
    },
    historyItem: {
        padding: 15,
        backgroundColor: '#84a98c', // Card
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#52796f',
        shadowColor: "#354f52",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    durationBadge: {
        backgroundColor: '#52796f',
        color: '#ffffff',
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    deleteButton: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#cad2c5', // Secondary
    },
    deleteButtonText: {
        fontSize: 18,
        color: '#2f3e46',
        fontWeight: 'bold',
    },
    historyDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    historyRow: {
        flexDirection: 'row',
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    historyLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginRight: 5,
    },
    historyChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    historyText: {
        fontSize: 14,
        color: '#000000',
    },
    noDataText: {
        fontSize: 14,
        color: '#354f52', // Subtle
        fontStyle: 'italic',
    },
    emptyHistory: {
        textAlign: 'center',
        color: '#354f52',
        marginTop: 10,
    }
});

export default Track;