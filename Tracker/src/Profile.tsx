import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// --- Theme Colors ---
const COLORS = {
    bg: '#cad2c5',          // ash-grey
    cardBg: '#84a98c',      // muted-teal
    text: '#000000',        // black
    subtext: '#354f52',     // dark-slate-grey
    primary: '#52796f',     // deep-teal
    iconBg: '#cad2c5',      // ash-grey
    divider: '#354f52',     // Borders
    shadow: '#354f52',
    danger: '#52796f',      // deep-teal
};

interface SettingItem {
    id: string;
    icon: string;
    label: string;
    type?: 'link' | 'switch';
    value?: boolean;
    onToggle?: () => void;
}

interface SettingGroup {
    title: string;
    items: SettingItem[];
}

const Profile = () => {
    // Mock State for toggles
    const [darkMode, setDarkMode] = useState(false);

    const settingsData: SettingGroup[] = [
        {
            title: 'Account',
            items: [
                { id: 'edit', icon: 'person-outline', label: 'Edit Profile' },
                { id: 'email', icon: 'mail-outline', label: 'Email / Phone' },
                { id: 'password', icon: 'lock-outline', label: 'Change Password' },
            ]
        },
        {
            title: 'Cycle & Health',
            items: [
                { id: 'length', icon: 'timer', label: 'Cycle Length Preferences' },
                { id: 'reminders', icon: 'notifications-none', label: 'Period Reminders' },
                { id: 'fertility', icon: 'child-care', label: 'Fertility Notifications' },
            ]
        },
        {
            title: 'App Preferences',
            items: [
                { id: 'theme', icon: 'brightness-6', label: 'Dark Mode', type: 'switch', value: darkMode, onToggle: () => setDarkMode(!darkMode) },
                { id: 'lang', icon: 'language', label: 'Language' },
                { id: 'backup', icon: 'cloud-queue', label: 'Data Backup' },
            ]
        },
        {
            title: 'Privacy & Security',
            items: [
                { id: 'lock', icon: 'security', label: 'App Lock' },
                { id: 'export', icon: 'file-download', label: 'Export Data' },
                { id: 'policy', icon: 'privacy-tip', label: 'Privacy Policy' },
            ]
        },
        {
            title: 'About',
            items: [
                { id: 'about', icon: 'info-outline', label: 'About App' },
                { id: 'help', icon: 'help-outline', label: 'Contact Support' },
                { id: 'version', icon: 'layers', label: 'Version 1.0.0' },
            ]
        }
    ];

    const renderSettingItem = (item: SettingItem, index: number, total: number) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.itemRow, index === total - 1 && styles.lastItem]}
            onPress={() => item.type !== 'switch' && Alert.alert('Navigate', `Go to ${item.label}`)}
            activeOpacity={0.7}
            disabled={item.type === 'switch'} // Handle switch separately if needed, or wrap switch in View
        >
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name={item.icon} size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
            </View>

            {item.type === 'switch' ? (
                <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#cad2c5', true: COLORS.primary }}
                    thumbColor={'#ffffff'}
                />
            ) : (
                <MaterialIcons name="chevron-right" size={24} color={COLORS.subtext} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder Avatar */}
                        <MaterialIcons name="account-circle" size={80} color="#cad2c5" />
                        <TouchableOpacity style={styles.editBadge} onPress={() => Alert.alert('Edit', 'Change Photo')}>
                            <MaterialIcons name="edit" size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>Your Profile</Text>
                    <Text style={styles.userEmail}>user@example.com</Text>
                </View>

                {/* Settings Groups */}
                {settingsData.map((group) => (
                    <View key={group.title} style={styles.groupContainer}>
                        <Text style={styles.groupTitle}>{group.title}</Text>
                        <View style={styles.card}>
                            {group.items.map((item, index) => renderSettingItem(item, index, group.items.length))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Log Out', 'Are you sure?')}>
                    <Text style={styles.logoutText}>Log Out</Text>
                    <MaterialIcons name="logout" size={20} color="#FFF" style={styles.logoutIcon} />
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatarContainer: {
        marginBottom: 10,
        position: 'relative',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#84a98c',
        borderRadius: 50, // Make it circular if it was an image
    },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '300',
        color: COLORS.text,
        letterSpacing: 0.5,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.subtext,
        marginTop: 2,
    },
    groupContainer: {
        marginBottom: 25,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.subtext,
        marginBottom: 10,
        marginLeft: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        paddingHorizontal: 5,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: COLORS.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    itemLabel: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '400',
    },
    logoutBtn: {
        backgroundColor: COLORS.primary, // muted-teal
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    logoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    logoutIcon: {
        marginLeft: 8
    },
    bottomSpacer: {
        height: 40
    }
});

export default Profile;