# 🏋️‍♂️ Smart Coach App

Project **Smart Coach** is an advanced web application (V7.0) for workout management featuring cloud database integration, user authentication, and an AI assistant. With a modern and responsive design, this application provides an interactive experience for tracking and following your workout routines.

## 🌟 Key Features

* **Modern UI Design:** Uses a Glassmorphism interface with full support for toggling between Dark Mode and Light Mode.


* **AI Integration:** Features a smart chat assistant developed using the `gemini-2.5-flash` API model, which provides precise, personalized fitness advice based on the user's physical data.


* **Cloud Data Management (Cloud Sync):** Utilizes Google Apps Script (GAS) as a cloud backend for user authentication (login and signup) and profile synchronization.


* **Workout Management System:** Dynamically loads workout programs (such as Hybrid PPL - Ali's Pro Edition) alongside advanced logic for circuit training, supersets, and automatic set counting.


* **Smart Timer:** Includes a rest timer widget equipped with audio cues when rest is over, as well as dedicated timers for time-based exercises.


* **Profile & Physical Assessment:** Features an assessment form to record basic stats, absolute strength records (Squat, Deadlift, Bench Press), joint mobility tests, and lifestyle habits (diet status and sleep average).


* **PWA Support:** Can be installed as a standalone app on smartphones using the `manifest.json` configuration file.



## 💻 Technologies Used

* **Front-end:** Developed with HTML5, CSS3 (utilizing custom variables, glass effects, and animations), and Vanilla JavaScript for state management and page routing.


* **Back-end:** Uses server-side functions on the Google Apps Script platform to handle POST/GET requests and store user data.


* **Artificial Intelligence:** Integrated with Google's generative AI service (Gemini API).



## 🛠️ Setup & Usage Guide

You do not need to install heavy frameworks to run this project; the setup process is straightforward:

1. **Run the App:** Host the project files on a local server or simply open the `index.html` file in your web browser.


2. **Connect AI:** To activate the smart assistant, click the settings icon (⚙️) located in the top navigation bar. Enter your Gemini **API Key** and click save (your key will be stored securely in the browser's `localStorage`).


3. **Authentication:** To access the workout programs, go to the login page and create a new account. After signing up, log in to access your dashboard.


4. **Personalize Profile:** Navigate to the "Assessment" section (📋) and fill in your physical details, personal records, and injury history. This ensures your data is saved to the cloud and effectively utilized by the AI.



## 📁 Project File Structure

* **`index.html`:** The main shell of the application, containing the navigation menu, settings modal, and the floating chat widget.


* **`style.css`:** The comprehensive stylesheet covering theme colors, animation codes (such as the card sheen effect), and responsive styles for mobile devices.


* **`script.js`:** The core logic of the system (JavaScript), including the page router, `fetch` requests to the GAS server, circuit training controller, timer management, and audio settings.


* **`manifest.json`:** The Progressive Web App (PWA) configuration file for defining icons and base colors for mobile installation.


* **`data/` folder:** The directory for storing workout programs in JSON format (e.g., `workouts.json`), which includes training days, exercise names, sets, times, and movement codes.


* **`views/` folder:** Contains various HTML components and pages (`login.html`, `assessment.html`, `profile.html`, `workout.html`) that are dynamically loaded into the main application tag.
