# TETSUO

Got it. Building the project structure now.

---

# Project Structure Created

```
school-builder/
├── src/
│   ├── components/
│   ├── constants/
│   ├── data/
│   ├── navigation/
│   ├── screens/
│   ├── storage/
│   └── utils/
├── assets/
│   ├── avatars/
│   ├── icons/
│   ├── shop/
│   └── sounds/
├── App.js
└── package.json
```

---

# Step 2: Core Files

Creating the foundation files now.

---

## File 1: package.json

```json
{
  "name": "school-builder",
  "version": "1.0.0",
  "main": "App.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-av": "~13.10.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "~3.29.0",
    "react-native-safe-area-context": "4.8.2",
    "@react-native-async-storage/async-storage": "1.21.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
```

---

## File 2: src/constants/colors.js

```javascript
export const colors = {
  // Primary palette
  primary: '#6C63FF',
  primaryDark: '#5A52D9',
  primaryLight: '#8B85FF',

  // Secondary
  secondary: '#FF6B6B',
  secondaryDark: '#E55555',

  // Accent
  accent: '#4ECDC4',
  accentDark: '#3DB5AD',

  // Coins
  coin: '#FFD93D',
  coinDark: '#E5C235',

  // Feedback
  correct: '#6BCB77',
  incorrect: '#FF6B6B',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  textMuted: '#B2BEC3',
  border: '#DFE6E9',

  // Difficulty
  easy: '#6BCB77',
  medium: '#FFD93D',
  hard: '#FF6B6B',
};
```

---

## File 3: src/constants/config.js

```javascript
export const config = {
  // App info
  appName: 'SchoolBuilder',
  version: '1.0.0',

  // Game settings
  questionsPerSession: 10,
  maxStreakBonus: 100,
  streakBonusPerDay: 20,

  // Rewards
  rewards: {
    easy: 5,
    medium: 10,
    hard: 15,
    perfectBonus: 50,
  },

  // Difficulty thresholds
  difficulty: {
    easy: { min: 0, max: 20 },
    medium: { min: 21, max: 40 },
    hard: { min: 41, max: 60 },
  },

  // Storage keys
  storageKeys: {
    user: '@schoolbuilder_user',
    sessions: '@schoolbuilder_sessions',
  },

  // Grades available
  grades: [1, 2, 3, 4, 5, 6],

  // Avatars available
  avatars: ['fox', 'owl', 'bear', 'rabbit', 'cat', 'dog'],
};
```

---

## File 4: App.js

```javascript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
```

---

## File 5: src/navigation/AppNavigator.js

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens (placeholder imports - we'll build these next)
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## File 6: src/screens/WelcomeScreen.js (Placeholder)

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SchoolBuilder</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    marginTop: 10,
  },
});
```

---

# Current Project State

| File | Status |
|------|--------|
| package.json | ✅ Created |
| App.js | ✅ Created |
| src/constants/colors.js | ✅ Created |
| src/constants/config.js | ✅ Created |
| src/navigation/AppNavigator.js | ✅ Created |
| src/screens/WelcomeScreen.js | ✅ Placeholder |

---

# Step 3: Data Files

Ready to create the math questions and shop items data files.

Say **continue** and I'll deliver them.

---

# ARCHITECT

# Got It

I'll build the complete folder structure and initial files right now. No terminal commands needed from you.

---

## Creating Project Structure

```
school-builder/
├── App.js
├── app.json
├── package.json
├── src/
│   ├── components/
│   ├── constants/
│   ├── data/
│   ├── navigation/
│   ├── screens/
│   ├── storage/
│   └── utils/
└── assets/
    ├── avatars/
    ├── shop/
    ├── icons/
    └── sounds/
```

---

## Step 1: package.json

```json
{
  "name": "school-builder",
  "version": "1.0.0",
  "main": "App.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-native-screens": "~3.29.0",
    "react-native-safe-area-context": "4.8.2",
    "@react-native-async-storage/async-storage": "1.21.0",
    "expo-av": "~13.10.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
```

---

## Step 2: app.json

```json
{
  "expo": {
    "name": "SchoolBuilder",
    "slug": "school-builder",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icons/app-icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#4A90D9"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#4A90D9"
      }
    }
  }
}
```

---

## Step 3: App.js

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

---

## Step 4: src/constants/colors.js

```javascript
export const colors = {
  // Primary palette
  primary: '#4A90D9',
  primaryDark: '#3A7BC8',
  primaryLight: '#6BA3E0',

  // Secondary palette
  secondary: '#F5A623',
  secondaryDark: '#E09000',
  secondaryLight: '#FFBE4D',

  // Feedback colors
  success: '#7ED321',
  error: '#D0021B',
  warning: '#F5A623',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',

  // Grade colors
  gradeK: '#FF6B6B',
  grade1: '#4ECDC4',
  grade2: '#45B7D1',
  grade3: '#96CEB4',
  grade4: '#FFEAA7',
  grade5: '#DDA0DD',

  // Avatar backgrounds
  avatarBg1: '#FFE4E1',
  avatarBg2: '#E0FFE0',
  avatarBg3: '#E0E0FF',
  avatarBg4: '#FFFFE0',
};
```

---

## Step 5: src/constants/config.js

```javascript
export const config = {
  // App settings
  appName: 'SchoolBuilder',
  version: '1.0.0',

  // Game settings
  questionsPerSession: 10,
  maxStreakBonus: 100,

  // Rewards
  rewards: {
    easy: 5,
    medium: 10,
    hard: 15,
    perfectBonus: 50,
    streakMultiplier: 20,
  },

  // Difficulty thresholds
  difficulty: {
    easy: { min: 0, max: 50 },
    medium: { min: 51, max: 75 },
    hard: { min: 76, max: 100 },
  },

  // Grade levels
  grades: ['K', '1', '2', '3', '4', '5'],

  // Available modes
  modes: ['math', 'spelling', 'typing'],
};
```

---

## Step 6: src/navigation/AppNavigator.js

```javascript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens (placeholder imports - we'll build these next)
import WelcomeScreen from '../screens/WelcomeScreen';
import AvatarSelectScreen from '../screens/AvatarSelectScreen';
import GradeSelectScreen from '../screens/GradeSelectScreen';
import HomeScreen from '../screens/HomeScreen';
import MathChallengeScreen from '../screens/MathChallengeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ShopScreen from '../screens/ShopScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AvatarSelect" component={AvatarSelectScreen} />
      <Stack.Screen name="GradeSelect" component={GradeSelectScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MathChallenge" component={MathChallengeScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

---

## Step 7: Placeholder Screens

I'll create basic placeholders for all 8 screens so the app can run.

### src/screens/WelcomeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SchoolBuilder!</Text>
      <Text style={styles.subtitle}>Learn and earn rewards</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AvatarSelect')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});
```

### src/screens/AvatarSelectScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function AvatarSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Avatar</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GradeSelect')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});
```

### src/screens/GradeSelectScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function GradeSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Grade</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Grade 3</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.grade3,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});
```

### src/screens/HomeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.coins}>🪙 0 coins</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MathChallenge')}
      >
        <Text style={styles.buttonText}>Start Math Challenge</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.shopButton]}
        onPress={() => navigation.navigate('Shop')}
      >
        <Text style={styles.buttonText}>Shop</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.settingsButton]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  coins: {
    fontSize: 20,
    color: colors.secondary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
  },
  shopButton: {
    backgroundColor: colors.secondary,
  },
  settingsButton: {
    backgroundColor: colors.textLight,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});
```

### src/screens/MathChallengeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function MathChallengeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>What is 15 + 23?</Text>

      <View style={styles.answers}>
        <TouchableOpacity style={styles.answerButton}>
          <Text style={styles.answerText}>35</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.answerButton}>
          <Text style={styles.answerText}>38</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.answerButton}>
          <Text style={styles.answerText}>42</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.answerButton}
          onPress={() => navigation.navigate('Results')}
        >
          <Text style={styles.answerText}>48</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 40,
  },
  answers: {
    width: '100%',
  },
  answerButton: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  answerText: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.text,
  },
});
```

### src/screens/ResultsScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function ResultsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Great Job!</Text>
      <Text style={styles.score}>8 / 10 Correct</Text>
      

---

# DEVOPS

# Building Project Structure on Server

Setting up the SchoolBuilder project in your file system now.

---

## Step 1: Create Root Folder

```
school-builder/
```

I'll create all folders and placeholder files so the structure exists.

---

## Creating Files

### /school-builder/package.json

```json
{
  "name": "school-builder",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-av": "~13.10.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "@react-native-async-storage/async-storage": "1.21.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
```

### /school-builder/app.json

```json
{
  "expo": {
    "name": "SchoolBuilder",
    "slug": "school-builder",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4A90D9"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4A90D9"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### /school-builder/babel.config.js

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### /school-builder/App.js

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

### /school-builder/src/constants/colors.js

```javascript
export const colors = {
  // Primary palette
  primary: '#4A90D9',
  primaryDark: '#3A7BC8',
  primaryLight: '#6BA3E0',

  // Accent colors
  accent: '#FFD93D',
  accentDark: '#F5C800',

  // Feedback colors
  success: '#6BCB77',
  error: '#FF6B6B',
  warning: '#FFE66D',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096',
  textMuted: '#A0AEC0',

  // Borders
  border: '#E2E8F0',
  borderLight: '#EDF2F7',

  // Difficulty colors
  easy: '#6BCB77',
  medium: '#FFD93D',
  hard: '#FF6B6B',
};
```

### /school-builder/src/constants/config.js

```javascript
export const config = {
  // Session settings
  questionsPerSession: 10,
  
  // Rewards
  coinsPerCorrect: {
    easy: 5,
    medium: 10,
    hard: 15,
  },
  perfectBonus: 50,
  streakBonusPerDay: 20,
  maxStreakBonus: 100,

  // Grades available
  grades: [1, 2, 3, 4, 5],

  // Default settings
  defaultGrade: 3,
  defaultDifficulty: 'medium',

  // Storage keys
  storageKeys: {
    user: '@schoolbuilder_user',
    sessions: '@schoolbuilder_sessions',
    settings: '@schoolbuilder_settings',
  },
};
```

### /school-builder/src/navigation/AppNavigator.js

```javascript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens (placeholders for now)
import WelcomeScreen from '../screens/WelcomeScreen';
import AvatarSelectScreen from '../screens/AvatarSelectScreen';
import GradeSelectScreen from '../screens/GradeSelectScreen';
import HomeScreen from '../screens/HomeScreen';
import MathChallengeScreen from '../screens/MathChallengeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ShopScreen from '../screens/ShopScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AvatarSelect" component={AvatarSelectScreen} />
      <Stack.Screen name="GradeSelect" component={GradeSelectScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MathChallenge" component={MathChallengeScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

### /school-builder/src/screens/WelcomeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SchoolBuilder!</Text>
      <Text style={styles.subtitle}>Placeholder - Step 7 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/AvatarSelectScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function AvatarSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick Your Avatar</Text>
      <Text style={styles.subtitle}>Placeholder - Step 8 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/GradeSelectScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function GradeSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Grade</Text>
      <Text style={styles.subtitle}>Placeholder - Step 9 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/HomeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Placeholder - Step 10 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/MathChallengeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function MathChallengeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Math Challenge</Text>
      <Text style={styles.subtitle}>Placeholder - Step 12 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/ResultsScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function ResultsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.subtitle}>Placeholder - Step 13 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/ShopScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function ShopScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <Text style={styles.subtitle}>Placeholder - Step 15 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/screens/SettingsScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Placeholder - Step 16 will complete this</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});
```

### /school-builder/src/storage/localStorage.js

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../constants/config';

const { storageKeys } = config;

// User data
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(storageKeys.user, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem(storageKeys.user);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(storageKeys.user);
    return true;
  } catch (error) {
    console.error('Error clearing user:', error);
    return false;
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      storageKeys.user,
      storageKeys.sessions,
      storageKeys.settings,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing all