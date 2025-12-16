import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// --- Color Palette ---
const COLORS = {
    bg: '#cad2c5',          // ash-grey
    cardBg: '#84a98c',      // muted-teal (Inputs/Cards)
    primary: '#52796f',     // deep-teal (Login Button)
    secondary: '#84a98c',   // muted-teal (Sign Up Button)
    accent: '#354f52',      // dark-slate-grey (Google/Borders)
    header: '#2f3e46',      // charcoal-blue
    text: '#000000',        // black
    textLight: '#ffffff',   // white
};

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
GoogleSignin.configure({
    webClientId: '1085334063592-0h3pbuov8qb52jcenkjep99qtls7m4h7.apps.googleusercontent.com', // Replace with actual Web Client ID from Firebase Console
});

const SignIn = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            setLoading(true);
            await auth().signInWithEmailAndPassword(email, password);
            // Navigation handled by auth listener or manual replace if preferred
            navigation.replace('Main');
        } catch (error: any) {
            console.error(error);
            let msg = 'Login failed';
            if (error.code === 'auth/invalid-email') msg = 'That email address is invalid!';
            if (error.code === 'auth/user-not-found') msg = 'No user found with this email.';
            if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
            Alert.alert('Login Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password to sign up');
            return;
        }

        try {
            setLoading(true);
            await auth().createUserWithEmailAndPassword(email, password);
            Alert.alert('Success', 'Account created! Logging you in...');
            navigation.replace('Main');
        } catch (error: any) {
            console.error(error);
            let msg = 'Sign up failed';
            if (error.code === 'auth/email-already-in-use') msg = 'That email address is already in use!';
            if (error.code === 'auth/invalid-email') msg = 'That email address is invalid!';
            if (error.code === 'auth/weak-password') msg = 'Password is too weak.';
            Alert.alert('Sign Up Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;
            if (!idToken) throw new Error('No ID Token found');

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential);

            navigation.replace('Main');
        } catch (error: any) {
            console.error("Google Sign-In Error", error);
            if (error.code === 3001) { // Error code for 'Sign in cancelled' might vary
                // User cancelled the sign-in flow
                return;
            }
            Alert.alert('Google Sign-In Error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <MaterialIcons name="spa" size={60} color={COLORS.header} />
                    <Text style={styles.headerText}>Welcome Back</Text>
                    <Text style={styles.subHeaderText}>Sign in to continue your journey</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>

                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="hello@example.com"
                            placeholderTextColor="#2f3e46"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#2f3e46"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* Log In Button */}
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8} disabled={loading}>
                        <Text style={styles.loginBtnText}>{loading ? 'Loading...' : 'Log In'}</Text>
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp} activeOpacity={0.8} disabled={loading}>
                        <Text style={styles.signUpBtnText}>Create Account</Text>
                    </TouchableOpacity>

                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google Sign-In */}
                <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} activeOpacity={0.8} disabled={loading}>
                    {/* Simulating G icon with text/icon for now since no assets */}
                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.header,
        marginTop: 10,
    },
    subHeaderText: {
        fontSize: 16,
        color: COLORS.accent,
        marginTop: 5,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.header,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    loginBtnText: {
        color: COLORS.textLight,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpBtn: {
        backgroundColor: COLORS.cardBg, // Using secondary/muted teal
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    signUpBtnText: {
        color: COLORS.textLight, // White text
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.accent,
        opacity: 0.5,
    },
    dividerText: {
        marginHorizontal: 15,
        color: COLORS.accent,
        fontWeight: '600',
    },
    googleBtn: {
        backgroundColor: COLORS.accent, // Dark Slate Grey
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    googleBtnText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignIn;
