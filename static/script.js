console.log("script.js is loaded");

const studentList = document.getElementById('student-list');
let currentAudio = null;
let isPlaying = false;
let loopInterval = null;

// Get the base URL dynamically
const baseURL = `${window.location.origin}`;

// Fetch active students from the server every 5 seconds
async function fetchActiveStudents() {
    try {
        const response = await fetch(`${baseURL}/active-students`);
        if (response.ok) {
            const activeStudents = await response.json();
            updateStudentList(activeStudents);
            if (!loopInterval) startSoundLoop(); // Start sound loop if not already started
        } else {
            console.error("Failed to fetch active students from server");
        }
    } catch (error) {
        console.error("Error fetching active students:", error);
    }
}

// Update the student list on the page
function updateStudentList(activeStudents) {
    studentList.innerHTML = ''; // Clear the current list
    activeStudents.forEach(student => {
        const listItem = document.createElement('li');
        listItem.textContent = `${student.name} - ${student.class}`;
        listItem.dataset.name = student.name;
        studentList.appendChild(listItem);
    });
}

// Function to play sound for each active student
async function playStudentSound(name) {
    const soundPath = `${baseURL}/static/sounds/${encodeURIComponent(name)}.mp3?timestamp=${Date.now()}`;
    console.log(`Attempting to play sound for: ${name}, Path: ${soundPath}`);

    try {
        isPlaying = true;
        currentAudio = new Audio(soundPath);

        // Play audio and wait for it to finish
        await currentAudio.play();
        await new Promise(resolve => currentAudio.onended = resolve);
    } catch (error) {
        console.error(`Error playing sound for ${name}:`, error);
    } finally {
        isPlaying = false;
    }
}

// Function to start the sound loop for all students
function startSoundLoop() {
    if (loopInterval || studentList.children.length === 0) return;  // Prevent multiple loops

    loopInterval = setInterval(async () => {
        if (isPlaying) return;  // Prevent multiple sounds playing at once

        for (let student of studentList.children) {
            const name = student.dataset.name;
            await playStudentSound(name);
        }
    }, 1000);  // Interval to loop through the list
}

// Function to add or remove a student based on the barcode scanned
async function fetchStudent(barcode) {
    try {
        const response = await fetch(`${baseURL}/get-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ barcode: barcode })
        });

        if (response.ok) {
            const student = await response.json();

            // If the student is already displayed, remove them
            if (isStudentDisplayed(student.name)) {
                await removeStudent(student.name);
            } else {
                await addStudent(student.name, student.class);
            }
        } else {
            alert("Student not found");
        }
    } catch (error) {
        console.error("Error in fetching student:", error);
    }
}

// Function to add a student to the server and display list
async function addStudent(name, className) {
    try {
        await fetch(`${baseURL}/add-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, class: className })
        });
    } catch (error) {
        console.error(`Error adding student ${name}:`, error);
    }
}

// Function to remove a student from the server and display list
async function removeStudent(name) {
    try {
        await fetch(`${baseURL}/remove-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });
    } catch (error) {
        console.error(`Error removing student ${name}:`, error);
    }
}

// Handle form submission
function handleBarcodeInput(event) {
    event.preventDefault();
    const barcodeInput = document.getElementById('barcode-input');
    const barcode = barcodeInput.value.trim();

    if (barcode) {
        fetchStudent(barcode);
        barcodeInput.value = '';  // Clear the input field
    }
}

// Check if a student is already displayed
function isStudentDisplayed(name) {
    return Array.from(studentList.children).some(
        (item) => item.textContent.includes(name)
    );
}

// Fetch active students when the page loads and every 5 seconds
document.addEventListener('DOMContentLoaded', () => {
    fetchActiveStudents();
    setInterval(fetchActiveStudents, 5000);
});

// Event listener for form submission
document.getElementById('barcode-form').addEventListener('submit', handleBarcodeInput);
