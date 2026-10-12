# Project Context

## Intro

The customer is me - the developer of this app.
I want to build an appplication that helps me build good habits, to transform into a newer version of myself. It's inspired by [James Clear's Atomic Habits book](https://jamesclear.com/atomic-habits), with the following keynotes:

- Limiting screen time for social media apps (considered bad apps) (first revision)
- Associate bad apps + daily progress with each good habit, specifically:
  - When a task (habit) is completed, its progress increases
  - When the user tries to access the associated bad app with a habit, its progress diminishes.
- Display a mascot (a company), with its feeling/status reflected upon the habit following usage

# Folder structure

```
MainApp/
├── android/              # The native Android source code of this app, for Gradle build + debugging purposes.
├── app/                  # Contains the UI screens only (no custom components allowed here)
│   ├── screen_name/      # The screen on the UI
│   │   └── index.tsx/
│   └── (tabs).tsx        # App's home page containing first level screens, accessible via bottom navigation tabs.
├── assets/images         # Images for customization of certain elements (e.g. Splash screen, icons)
├── components/           # UI Components
│   ├── per-screen/       # Specific to one screen (e.g. `capsules list` screen, `create-capsule` screen)
│   │   ui/               # Shared throughout many screens
├── constants/            # Global/per-screen constants (colors, dimensions, theme...)
├── hooks/                # Global/per-screen custom hooks
├── models/               # Business object definitions
├── modules/              # Native Kotlin Expo-modules, bundled and finalized in `android` folder altogether by Gradle.
│                           User-created to handle native Android operations (e.g. VPN, Notifications)
├── plugins/              # Scripts to inject extras into AndroidManifest.xml (e.g. custom native Services like `app-list-module`).
│                           Helps Android OS recognize + allow them to be executed.
├── redux/                # Redux-related components (selectors, slices)
│   └── homepageSlice     # Redux slice with selectors and reducers for state persistence
│   └── homepageThunk     # Listens to dispatches and perform API calls
├── docs/                 # Documents guiding Agentic AI on tasks (dev, test,...)
└── utils/                # Global utility functions
```

# Coding conventions

## Component composition

- When to put a new shared component in `ui` folder:
  - When the component can't be broken down even further (break it down further won't make it complete)
  - Common examples: Button, TextInput, Spinner, ImageUploader, Table,...

- When the user prompts a specific UI structure in top down approach, build the UI from the bottom-up approach for ease. For example:
  - **Prompt**: On the home page, I want to create a UI consisting of:
    - Critical Information month's invoices, mismatches, pos-pending review, expiring today.
    - Each item is a KpiCard, having a subtitle at the top, the number right underneath, and the unit on the right side of the number, if applicable.
  - **Execution**: Copy that, I will start from the bottom with the KpiCard, then construct the Dashboard using a Grid of KpiCards,...

- When not to break down a component into child ones:
  - The child component size does not have 30 lines at minimum
  - There's too much repeated code between children components (after breaking down)

- Only `export` a component if it's used externally.

## Function definition

- A function should be between 30 and 80 lines long. Anything longer should be broken down into smaller functions.

## CSS Styling

- Separate a style as a reusable constant when any of these happens:
  - It's used throughout multiple components
  - It's too long (number of characters exceeds 80 per line)

## Constants

- Color/Text: Before adding a hex color, as requested by the user by name (e.g. yellow), check if its available in `constants/colors.ts` (for color), and `constants\text.ts` for text.
- Dimensions: Make sure to measure/calculate them by the screen width and height. For example:

<blockquote>

```tsx
const borderRadius = 12px //WRONG
const borderRadius = SCREEN_WIDTH * 0.2 //CORRECT
```

</blockquote>

- Dimensions: Use the one within `constants\dimensions.ts`
