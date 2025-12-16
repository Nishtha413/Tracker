import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// --- Theme Colors ---
const COLORS = {
    bg: '#cad2c5',          // ash-grey
    cardBg: '#84a98c',      // muted-teal (Cards)
    text: '#000000',        // black (Primary Text)
    placeholder: '#354f52', // dark-slate-grey
    shadow: '#354f52',      // dark-slate-grey

    // Phases - Keeping semantic logic
    menstrual: '#EF9A9A',
    follicular: '#A5D6A7',
    ovulation: '#FFF59D',
    luteal: '#FFCC80',

    // UI
    inputBg: '#84a98c',     // Cards/Inner Blocks
    primary: '#52796f'      // deep-teal (Primary Buttons)
};

const Diary = () => {
    const [moodText, setMoodText] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const moods = [
        { icon: 'sentiment-very-satisfied', label: 'Great', color: '#FFD54F' },
        { icon: 'sentiment-satisfied', label: 'Good', color: '#81C784' },
        { icon: 'sentiment-neutral', label: 'Okay', color: '#90A4AE' },
        { icon: 'sentiment-dissatisfied', label: 'Sad', color: '#90CAF9' },
        { icon: 'sentiment-very-dissatisfied', label: 'Awful', color: '#EF9A9A' },
    ];

    const phases = [
        { title: 'Menstrual Phase', color: COLORS.menstrual, icon: 'opacity', desc: 'Rest & Reflect' },
        { title: 'Follicular Phase', color: COLORS.follicular, icon: 'spa', desc: 'Energy Rising' },
        { title: 'Ovulation Phase', color: COLORS.ovulation, icon: 'wb-sunny', desc: 'Peak Fertility' },
        { title: 'Luteal Phase', color: COLORS.luteal, icon: 'whatshot', desc: 'Slow Down' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Diary</Text>
                </View>

                {/* Mood Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>How are you feeling?</Text>

                    {/* Mood Icons */}
                    <View style={styles.moodRow}>
                        {moods.map((m, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.moodBtn,
                                    selectedMood === m.label && { backgroundColor: m.color + '40', borderColor: '#354f52', borderWidth: 1 }
                                ]}
                                onPress={() => setSelectedMood(m.label)}
                            >
                                <MaterialIcons
                                    name={m.icon}
                                    size={32}
                                    color={selectedMood === m.label ? m.color : '#BDBDBD'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Text Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Write your thoughts here..."
                        placeholderTextColor={COLORS.placeholder}
                        multiline
                        numberOfLines={4}
                        value={moodText}
                        onChangeText={setMoodText}
                        textAlignVertical="top"
                    />
                </View>

                {/* Cycle Phases Section */}
                <Text style={styles.sectionHeader}>Cycle Phases</Text>

                <View style={styles.phasesContainer}>
                    {phases.map((phase, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.phaseCard, { borderLeftColor: phase.color }]}
                            onPress={() => Alert.alert(phase.title, `Learn more about the ${phase.title} and how to care for yourself.`)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconBox, { backgroundColor: phase.color + '30' }]}>
                                <MaterialIcons name={phase.icon} size={24} color={phase.color === COLORS.ovulation ? '#FBC02D' : phase.color} />
                            </View>
                            <View style={styles.phaseInfo}>
                                <Text style={styles.phaseTitle}>{phase.title}</Text>
                                <Text style={styles.phaseDesc}>{phase.desc}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#354f52" />
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f3e46', // Charcoal Blue to match other screens
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 15,
        marginTop: 10,
        marginLeft: 5,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#1b4332', // Darker Green (User requested)
        marginBottom: 15,
        fontWeight: '600',
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    moodBtn: {
        padding: 8,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#84a98c', // Muted teal container
        borderRadius: 15,
        padding: 15,
        fontSize: 15,
        color: COLORS.text,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    phasesContainer: {
        gap: 15,
    },
    phaseCard: {
        backgroundColor: '#ffffff', // User requested White
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 5,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    phaseInfo: {
        flex: 1,
    },
    phaseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    phaseDesc: {
        fontSize: 13,
        color: '#546e7a', // Adjusted for contrast on white
    },
});

export default Diary;