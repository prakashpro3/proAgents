# Phase 10: Debug & Log Management

## Command
```
pa:debug
pa:logs
```

## Aliases
- `pa:debug` → Full debug workflow
- `pa:logs` → View/analyze logs
- `pa:log` → Quick log check

---

## Overview

Debug and log management across all platforms:
- **Web**: Browser console, network logs
- **React Native**: Metro bundler, device logs
- **Android Native**: Logcat, ADB logs
- **iOS Native**: Xcode console, device logs

---

## Commands Reference

| Command | Action |
|---------|--------|
| `pa:debug` | Start debug session |
| `pa:debug-web` | Web console debugging |
| `pa:debug-rn` | React Native debugging |
| `pa:debug-android` | Android native debugging |
| `pa:debug-ios` | iOS native debugging |
| `pa:logs` | View recent logs |
| `pa:logs-filter "term"` | Filter logs by term |
| `pa:logs-clear` | Clear debug logs |
| `pa:logs-export` | Export logs to file |
| `pa:debug-clean` | Remove debug statements before production |
| `pa:debug-add` | Add debug logs to code |
| `pa:debug-add "file"` | Add logs to specific file |
| `pa:debug-trace "function"` | Add entry/exit logs to function |
| `pa:debug-var "variable"` | Track variable changes |
| `pa:debug-api` | Add API request/response logging |
| `pa:debug-state` | Add state change logging |
| `pa:debug-error` | Add error boundary/try-catch logging |

---

## Adding Debug Logs to Code

### pa:debug-add

Intelligently add debug logs throughout code. AI analyzes the code and adds appropriate logging.

**What gets logged:**
- Function entry/exit with parameters
- Variable state changes
- API calls and responses
- Error conditions
- State mutations
- User interactions

**Log Markers:**
All added logs are marked for easy removal:
```javascript
// DEBUG:START - Added by pa:debug
console.log('[DEBUG] functionName:', { param1, param2 });
// DEBUG:END
```

---

### Platform-Specific Log Insertion

#### JavaScript / TypeScript / React / React Native

**Function Tracing:**
```javascript
// DEBUG:START
const originalFunction = myFunction;
myFunction = function(...args) {
  console.log('[DEBUG:ENTER] myFunction', { args, timestamp: Date.now() });
  const result = originalFunction.apply(this, args);
  console.log('[DEBUG:EXIT] myFunction', { result, timestamp: Date.now() });
  return result;
};
// DEBUG:END
```

**Variable Tracking:**
```javascript
// DEBUG:START
let _debugValue = myVariable;
Object.defineProperty(window, 'myVariable', {
  get: () => _debugValue,
  set: (val) => {
    console.log('[DEBUG:VAR] myVariable changed:', { from: _debugValue, to: val });
    _debugValue = val;
  }
});
// DEBUG:END
```

**React Component Logging:**
```javascript
// DEBUG:START
useEffect(() => {
  console.log('[DEBUG:MOUNT] ComponentName mounted', { props });
  return () => console.log('[DEBUG:UNMOUNT] ComponentName unmounted');
}, []);

useEffect(() => {
  console.log('[DEBUG:STATE] state changed:', { stateName: value });
}, [value]);
// DEBUG:END
```

**API Call Logging:**
```javascript
// DEBUG:START
console.log('[DEBUG:API:REQ]', {
  method: 'POST',
  url: '/api/users',
  body: requestData,
  timestamp: new Date().toISOString()
});
// DEBUG:END

const response = await fetch('/api/users', { method: 'POST', body: requestData });

// DEBUG:START
console.log('[DEBUG:API:RES]', {
  status: response.status,
  data: responseData,
  duration: `${Date.now() - startTime}ms`
});
// DEBUG:END
```

**Error Logging:**
```javascript
// DEBUG:START
try {
// DEBUG:END
  // existing code
// DEBUG:START
} catch (error) {
  console.error('[DEBUG:ERROR]', {
    error: error.message,
    stack: error.stack,
    context: { functionName: 'myFunction', params }
  });
  throw error;
}
// DEBUG:END
```

---

#### Android (Kotlin)

**Function Tracing:**
```kotlin
// DEBUG:START
fun myFunction(param1: String, param2: Int): Result {
    Log.d("DEBUG", "[ENTER] myFunction: param1=$param1, param2=$param2")
    val startTime = System.currentTimeMillis()
// DEBUG:END

    // existing code

// DEBUG:START
    Log.d("DEBUG", "[EXIT] myFunction: result=$result, duration=${System.currentTimeMillis() - startTime}ms")
    return result
}
// DEBUG:END
```

**Variable Tracking:**
```kotlin
// DEBUG:START
var myVariable: String = ""
    set(value) {
        Log.d("DEBUG", "[VAR] myVariable: $field -> $value")
        field = value
    }
// DEBUG:END
```

**API Call Logging:**
```kotlin
// DEBUG:START
Log.d("DEBUG", "[API:REQ] POST /api/users: $requestBody")
// DEBUG:END

val response = apiService.createUser(requestBody)

// DEBUG:START
Log.d("DEBUG", "[API:RES] status=${response.code()}, body=${response.body()}")
// DEBUG:END
```

**Lifecycle Logging:**
```kotlin
// DEBUG:START
override fun onCreate(savedInstanceState: Bundle?) {
    Log.d("DEBUG", "[LIFECYCLE] onCreate: ${this::class.simpleName}")
    super.onCreate(savedInstanceState)
}

override fun onResume() {
    Log.d("DEBUG", "[LIFECYCLE] onResume: ${this::class.simpleName}")
    super.onResume()
}

override fun onDestroy() {
    Log.d("DEBUG", "[LIFECYCLE] onDestroy: ${this::class.simpleName}")
    super.onDestroy()
}
// DEBUG:END
```

---

#### iOS (Swift)

**Function Tracing:**
```swift
// DEBUG:START
func myFunction(param1: String, param2: Int) -> Result {
    let startTime = CFAbsoluteTimeGetCurrent()
    print("[DEBUG:ENTER] myFunction: param1=\(param1), param2=\(param2)")
// DEBUG:END

    // existing code

// DEBUG:START
    let duration = CFAbsoluteTimeGetCurrent() - startTime
    print("[DEBUG:EXIT] myFunction: result=\(result), duration=\(duration)s")
    return result
}
// DEBUG:END
```

**Variable Tracking:**
```swift
// DEBUG:START
var myVariable: String = "" {
    willSet {
        print("[DEBUG:VAR] myVariable will change: \(myVariable) -> \(newValue)")
    }
    didSet {
        print("[DEBUG:VAR] myVariable changed: \(oldValue) -> \(myVariable)")
    }
}
// DEBUG:END
```

**API Call Logging:**
```swift
// DEBUG:START
print("[DEBUG:API:REQ] POST /api/users: \(requestBody)")
// DEBUG:END

let response = try await apiService.createUser(requestBody)

// DEBUG:START
print("[DEBUG:API:RES] status=\(response.statusCode), body=\(response.data)")
// DEBUG:END
```

**SwiftUI View Logging:**
```swift
// DEBUG:START
var body: some View {
    VStack {
        // existing content
    }
    .onAppear {
        print("[DEBUG:VIEW] \(type(of: self)) appeared")
    }
    .onDisappear {
        print("[DEBUG:VIEW] \(type(of: self)) disappeared")
    }
    .onChange(of: someState) { oldValue, newValue in
        print("[DEBUG:STATE] someState: \(oldValue) -> \(newValue)")
    }
}
// DEBUG:END
```

**UIKit Lifecycle Logging:**
```swift
// DEBUG:START
override func viewDidLoad() {
    print("[DEBUG:LIFECYCLE] viewDidLoad: \(type(of: self))")
    super.viewDidLoad()
}

override func viewWillAppear(_ animated: Bool) {
    print("[DEBUG:LIFECYCLE] viewWillAppear: \(type(of: self))")
    super.viewWillAppear(animated)
}

override func viewDidDisappear(_ animated: Bool) {
    print("[DEBUG:LIFECYCLE] viewDidDisappear: \(type(of: self))")
    super.viewDidDisappear(animated)
}
// DEBUG:END
```

---

### pa:debug-trace "functionName"

Add detailed tracing to a specific function:

1. Find the function in codebase
2. Add entry log with all parameters
3. Add exit log with return value
4. Add timing measurement
5. Add error catching with stack trace

**Example Usage:**
```
pa:debug-trace "processPayment"
pa:debug-trace "UserService.authenticate"
pa:debug-trace "handleSubmit"
```

---

### pa:debug-var "variableName"

Track all changes to a specific variable:

1. Find variable declaration
2. Add change tracking
3. Log old value, new value, and call stack
4. Works with state, props, class properties

**Example Usage:**
```
pa:debug-var "isLoading"
pa:debug-var "user.email"
pa:debug-var "cartItems"
```

---

### pa:debug-api

Add logging to all API calls:

1. Find API service/fetch calls
2. Add request logging (method, url, headers, body)
3. Add response logging (status, data, timing)
4. Add error logging with full details

---

### pa:debug-state

Add state change logging:

**React/React Native:**
- Wrap useState with logging
- Add useEffect to track changes
- Log Redux/Zustand/MobX actions

**Android:**
- Log ViewModel state changes
- Log LiveData updates
- Log StateFlow emissions

**iOS:**
- Log @State changes
- Log @Published property updates
- Log ObservableObject changes

---

### pa:debug-error

Add comprehensive error logging:

1. Wrap code sections in try-catch
2. Add error boundaries (React)
3. Log error message, stack trace, context
4. Add breadcrumb trail for debugging

---

## Web Debugging

### Browser Console Logs

**View Console Logs:**
```javascript
// Common log levels
console.log('Info message');
console.warn('Warning message');
console.error('Error message');
console.debug('Debug message');
console.info('Info message');

// Grouped logs
console.group('User Auth');
console.log('Step 1: Validate input');
console.log('Step 2: API call');
console.groupEnd();

// Table format
console.table([{name: 'John', age: 30}, {name: 'Jane', age: 25}]);

// Time tracking
console.time('API Call');
// ... code ...
console.timeEnd('API Call');
```

**Debug Patterns to Search:**
```
console.log
console.warn
console.error
console.debug
debugger
```

### Network Debugging
```javascript
// Intercept fetch for debugging
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('Fetch:', args[0]);
  const response = await originalFetch(...args);
  console.log('Response:', response.status);
  return response;
};
```

---

## React Native Debugging

### Metro Bundler Logs

**View Metro Logs:**
```bash
# Start Metro with verbose logging
npx react-native start --verbose

# View specific log levels
npx react-native start --verbose 2>&1 | grep -E "(error|warn)"
```

### Device Logs

**Console Logs in RN:**
```javascript
// Standard console (appears in Metro)
console.log('Debug:', data);
console.warn('Warning:', message);
console.error('Error:', error);

// Conditional logging
if (__DEV__) {
  console.log('Development only log');
}

// Structured logging
const logger = {
  debug: (tag, message, data) => {
    if (__DEV__) {
      console.log(`[${tag}]`, message, data || '');
    }
  },
  error: (tag, message, error) => {
    console.error(`[${tag}] ERROR:`, message, error);
    // Could also send to crash reporting
  }
};
```

### React Native Debugger Tools

**Flipper (Recommended):**
```bash
# Install Flipper
brew install --cask flipper

# In your app, logs appear automatically
# Network requests visible in Network tab
# React DevTools integrated
```

**Reactotron:**
```javascript
// reactotron.config.js
import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ name: 'MyApp' })
  .useReactNative({
    networking: { ignoreUrls: /symbolicate/ },
    errors: { veto: (frame) => false },
  })
  .connect();

// Usage
Reactotron.log('Hello');
Reactotron.warn('Warning');
Reactotron.error('Error');
Reactotron.display({
  name: 'API Response',
  value: response,
  preview: 'User data received'
});
```

### ADB Logs for React Native (Android)
```bash
# View all React Native logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# Filter by tag
adb logcat -s ReactNativeJS

# Clear and view fresh logs
adb logcat -c && adb logcat *:S ReactNativeJS:V

# Save to file
adb logcat -d > rn_logs.txt
```

### iOS Simulator Logs for React Native
```bash
# View logs in Terminal
xcrun simctl spawn booted log stream --predicate 'subsystem == "com.apple.UIKit"'

# React Native specific
xcrun simctl spawn booted log stream | grep -i "react"

# Or use Console.app
# Open Console.app → Select simulator → Filter by process
```

---

## Android Native Debugging

### Logcat Commands

**Basic Logcat:**
```bash
# View all logs
adb logcat

# Clear logs
adb logcat -c

# View logs with timestamp
adb logcat -v time

# Filter by priority (V, D, I, W, E, F, S)
adb logcat *:E  # Errors only
adb logcat *:W  # Warnings and above

# Filter by tag
adb logcat -s MyApp:D

# Multiple tags
adb logcat -s MyApp:D NetworkManager:I

# Exclude tags
adb logcat MyApp:D *:S
```

**Advanced Filtering:**
```bash
# Filter by package name
adb logcat --pid=$(adb shell pidof -s com.myapp)

# Filter with grep
adb logcat | grep -E "(ERROR|CRASH|Exception)"

# Save to file
adb logcat -d > android_logs.txt

# Continuous save
adb logcat > android_logs.txt &
```

### Android Log Levels

```kotlin
// In Kotlin/Java code
import android.util.Log

Log.v("MyApp", "Verbose message")    // Lowest priority
Log.d("MyApp", "Debug message")      // Debug
Log.i("MyApp", "Info message")       // Info
Log.w("MyApp", "Warning message")    // Warning
Log.e("MyApp", "Error message")      // Error
Log.wtf("MyApp", "Assert message")   // Critical

// With exception
try {
    // code
} catch (e: Exception) {
    Log.e("MyApp", "Error occurred", e)
}
```

### Android Studio Logcat
```
1. Open Android Studio
2. View → Tool Windows → Logcat
3. Select device/emulator
4. Filter by:
   - Package name
   - Log level
   - Custom regex
```

### Crashlytics/Firebase Logs
```kotlin
// Add breadcrumb logs
FirebaseCrashlytics.getInstance().log("User clicked button X")

// Set custom keys
FirebaseCrashlytics.getInstance().setCustomKey("screen", "home")

// Record exception
FirebaseCrashlytics.getInstance().recordException(e)
```

---

## iOS Native Debugging

### Xcode Console

**View Logs:**
```
1. Run app from Xcode
2. View → Debug Area → Activate Console
3. Or: ⌘ + Shift + C
```

**NSLog / print:**
```swift
// Swift
print("Debug message")                    // Basic print
print("User: \(userName)")               // With interpolation
debugPrint(object)                        // Detailed output

// Objective-C
NSLog(@"Debug message");
NSLog(@"User: %@", userName);
```

### os_log (Recommended for iOS)

```swift
import os.log

// Create logger
let logger = Logger(subsystem: "com.myapp", category: "network")

// Log levels
logger.trace("Trace message")      // Lowest (not persisted)
logger.debug("Debug message")      // Debug (not persisted in release)
logger.info("Info message")        // Info
logger.notice("Notice message")    // Notice
logger.warning("Warning message")  // Warning
logger.error("Error message")      // Error
logger.critical("Critical message") // Critical (always persisted)

// With formatting
logger.info("User \(userId, privacy: .private) logged in")
logger.error("Error code: \(errorCode)")
```

### Console.app for iOS

```
1. Open Console.app (in Applications/Utilities)
2. Select your device or simulator
3. Filter by:
   - Process name
   - Subsystem
   - Category
   - Message content
```

### iOS Simulator Logs via Terminal
```bash
# Stream logs
xcrun simctl spawn booted log stream

# With predicate
xcrun simctl spawn booted log stream --predicate 'subsystem == "com.myapp"'

# Filter by category
xcrun simctl spawn booted log stream --predicate 'category == "network"'

# Save to file
xcrun simctl spawn booted log collect --output ~/Desktop/logs.logarchive
```

### Device Logs (Physical iOS Device)
```bash
# Using idevicesyslog (install via brew install libimobiledevice)
idevicesyslog

# Filter
idevicesyslog | grep "MyApp"

# Using Xcode
# Window → Devices and Simulators → Select device → Open Console
```

---

## Debug Cleanup Before Production

### Find Debug Statements

**Web/React:**
```bash
# Find console.log statements
grep -rn "console\.\(log\|debug\|warn\)" src/

# Find debugger statements
grep -rn "debugger" src/

# Count occurrences
grep -rc "console\.log" src/ | grep -v ":0$"
```

**React Native:**
```bash
# Find all debug statements
grep -rn "console\.\|__DEV__\|debugger" src/

# Find Reactotron usage
grep -rn "Reactotron" src/
```

**Android (Kotlin/Java):**
```bash
# Find Log statements
grep -rn "Log\.[vdiwef]" app/src/

# Find System.out
grep -rn "System\.out\.print" app/src/
```

**iOS (Swift):**
```bash
# Find print/NSLog statements
grep -rn "print(\|NSLog\|debugPrint" */

# Find os_log debug level
grep -rn "logger\.debug\|logger\.trace" */
```

### Auto-Remove Debug Statements

**For JavaScript/TypeScript (using eslint):**
```json
// .eslintrc.json
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-debugger": "error"
  }
}
```

**Babel Plugin (strips in production):**
```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};
```

**For Android (ProGuard/R8):**
```proguard
# proguard-rules.pro
-assumenosideeffects class android.util.Log {
    public static int v(...);
    public static int d(...);
    public static int i(...);
}
```

**For iOS (Compiler Flag):**
```swift
// Use #if DEBUG
#if DEBUG
print("Debug only message")
#endif

// Or disable in scheme
// Edit Scheme → Run → Arguments → Add: -DDISABLE_LOGGING
```

---

## Structured Logging Pattern

### Universal Logger Implementation

**React Native / JavaScript:**
```javascript
// utils/logger.js
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

class Logger {
  constructor(tag = 'App') {
    this.tag = tag;
    this.level = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
  }

  setLevel(level) {
    this.level = level;
  }

  debug(message, data) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(`[${this.tag}:DEBUG]`, message, data || '');
    }
  }

  info(message, data) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info(`[${this.tag}:INFO]`, message, data || '');
    }
  }

  warn(message, data) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`[${this.tag}:WARN]`, message, data || '');
    }
  }

  error(message, error) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`[${this.tag}:ERROR]`, message, error || '');
      // Send to crash reporting in production
      if (!__DEV__ && typeof Crashlytics !== 'undefined') {
        Crashlytics.recordError(error);
      }
    }
  }
}

export const logger = new Logger('MyApp');
export const createLogger = (tag) => new Logger(tag);
```

**Android (Kotlin):**
```kotlin
// utils/Logger.kt
object Logger {
    private const val TAG = "MyApp"
    private var isDebugEnabled = BuildConfig.DEBUG

    fun d(message: String, tag: String = TAG) {
        if (isDebugEnabled) Log.d(tag, message)
    }

    fun i(message: String, tag: String = TAG) {
        Log.i(tag, message)
    }

    fun w(message: String, tag: String = TAG) {
        Log.w(tag, message)
    }

    fun e(message: String, throwable: Throwable? = null, tag: String = TAG) {
        Log.e(tag, message, throwable)
        // Send to Crashlytics in production
        if (!BuildConfig.DEBUG) {
            FirebaseCrashlytics.getInstance().recordException(throwable ?: Exception(message))
        }
    }
}
```

**iOS (Swift):**
```swift
// Utils/Logger.swift
import os.log

struct Logger {
    private let subsystem: String
    private let category: String
    private let logger: os.Logger

    init(category: String, subsystem: String = Bundle.main.bundleIdentifier ?? "com.myapp") {
        self.subsystem = subsystem
        self.category = category
        self.logger = os.Logger(subsystem: subsystem, category: category)
    }

    func debug(_ message: String) {
        #if DEBUG
        logger.debug("\(message)")
        #endif
    }

    func info(_ message: String) {
        logger.info("\(message)")
    }

    func warning(_ message: String) {
        logger.warning("\(message)")
    }

    func error(_ message: String, error: Error? = nil) {
        logger.error("\(message) - \(error?.localizedDescription ?? "")")
        // Send to Crashlytics in production
        #if !DEBUG
        Crashlytics.crashlytics().record(error: error ?? NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: message]))
        #endif
    }
}

// Usage
let networkLogger = Logger(category: "Network")
networkLogger.debug("Request started")
```

---

## CRITICAL: AI Must Check Logs Itself

**NEVER tell user to "check the logs" or "look for X in console".**

The AI MUST:
1. **RUN** the log viewing commands itself
2. **CAPTURE** the output
3. **ANALYZE** the results
4. **REPORT** findings to user

### WRONG (Passive):
```
"Run the app and check Metro console for the logs.
Look for: === DEBUG === in the output.
Let me know what you see."
```

### RIGHT (Active):
```
Let me capture the logs and analyze them.

[AI runs: adb logcat -d | grep -i "DEBUG\|ERROR" ]

Found in logs:
- ERROR at line 45: area_allow_in_schedule is undefined
- API response missing expected field
- Root cause: Backend not returning area_allow_in_schedule

Fix: Add fallback in CLA API handler...
```

---

## pa:debug Workflow

### When AI receives `pa:debug`:

1. **Detect Platform:**
   ```
   Check project type:
   - package.json with react-native → React Native
   - build.gradle → Android Native
   - *.xcodeproj → iOS Native
   - package.json with web framework → Web
   ```

2. **Identify Debug Issue:**
   - Read error from user description
   - Check recent git changes
   - Look for crash reports in project

3. **RUN Log Commands (AI executes these):**

   **React Native:**
   ```bash
   # AI runs this and captures output
   adb logcat -d *:S ReactNativeJS:V | tail -100
   ```

   **Android Native:**
   ```bash
   # AI runs this and captures output
   adb logcat -d -s MyApp:D | tail -100
   ```

   **iOS (if accessible):**
   ```bash
   # AI runs this and captures output
   xcrun simctl spawn booted log show --last 5m | grep -i "error\|warn\|debug"
   ```

4. **ANALYZE Output:**
   - Parse log output
   - Find errors, warnings, exceptions
   - Identify patterns
   - Trace execution flow

5. **REPORT & FIX:**
   - Show relevant log entries to user
   - Explain what the logs mean
   - Implement the fix directly

---

## AI Log Capture Commands

**AI MUST run these commands to capture logs - never ask user to check manually.**

### React Native (Android device/emulator)
```bash
# Capture recent JS logs
adb logcat -d *:S ReactNativeJS:V | tail -200

# Capture with timestamps
adb logcat -d -v time *:S ReactNativeJS:V | tail -200

# Filter for errors only
adb logcat -d *:S ReactNativeJS:V | grep -i "error\|exception\|fail"

# Filter for specific tag
adb logcat -d | grep -i "CLA\|area_allow"
```

### React Native (iOS Simulator)
```bash
# Recent logs
xcrun simctl spawn booted log show --last 5m --predicate 'subsystem CONTAINS "react"' 2>/dev/null | tail -200

# Or use system log
log show --last 5m --predicate 'process == "YourAppName"' | tail -200
```

### Android Native
```bash
# App logs
adb logcat -d -s MyApp:D | tail -200

# All errors
adb logcat -d *:E | tail -100

# Specific search
adb logcat -d | grep -i "your_search_term"
```

### iOS Native
```bash
# Simulator logs
xcrun simctl spawn booted log show --last 5m | grep -i "error\|warn" | tail -100

# Device logs (if connected)
idevicesyslog 2>/dev/null | head -200
```

### Web (Node.js backend logs)
```bash
# If running in background, check pm2/docker logs
pm2 logs --lines 100 2>/dev/null || docker logs app --tail 100 2>/dev/null

# Check log files
tail -100 logs/error.log 2>/dev/null
```

---

## Command Quick Reference

| Platform | AI Runs | Filter | Clear | Export |
|----------|---------|--------|-------|--------|
| **React Native** | `adb logcat -d *:S ReactNativeJS:V` | `\| grep "term"` | `adb logcat -c` | `> file.txt` |
| **Android** | `adb logcat -d -s TAG:D` | `\| grep "term"` | `adb logcat -c` | `> file.txt` |
| **iOS Sim** | `xcrun simctl spawn booted log show` | `--predicate` | N/A | `log collect` |
| **Node.js** | `pm2 logs` or `docker logs` | `\| grep "term"` | N/A | `> file.txt` |

---

## Output Format

```
Debug Session
═════════════
Platform: [detected platform]
Issue: [user's issue description]

Log Analysis
────────────
Recent Errors:
• [timestamp] [level] [message]
• [timestamp] [level] [message]

Pattern Detected:
[description of error pattern]

Suggested Fix:
[specific fix based on log analysis]

Debug Commands:
[platform-specific commands to run]
```
