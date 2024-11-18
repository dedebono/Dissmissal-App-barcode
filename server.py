from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)
CORS(app)

# Connect to Google Sheets
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/spreadsheets",
         "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)
sheet = client.open("StudentDatabase").sheet1

active_students = {}

def load_students():
    students = {}
    rows = sheet.get_all_records()
    for row in rows:
        students[str(row["Barcode"])] = {
            "name": row["Name"],
            "class": row["Class"]
        }
    return students

@app.route("/")
def index():
    return render_template("index.html")

# Route to get student by barcode
@app.route("/get-student", methods=["POST"])
def get_student():
    barcode = request.json.get("barcode")
    students = load_students()
    student = students.get(barcode.lstrip('0'))  # Ignore leading zeros
    if student:
        return jsonify(student)
    else:
        return jsonify({"error": "Student not found"}), 404

# Route to fetch active students
@app.route("/active-students")
def active_students_list():
    return jsonify(list(active_students.values()))

# Serve sounds from /static/sounds directory
@app.route('/static/sounds/<path:filename>')
def serve_sound(filename):
    return send_from_directory('static/sounds', filename)

# Route to add a student to the active list
@app.route("/add-student", methods=["POST"])
def add_student():
    data = request.json
    name = data.get("name")
    className = data.get("class")
    active_students[name] = {"name": name, "class": className}
    return jsonify({"status": "success"})

# Route to remove a student from the active list
@app.route("/remove-student", methods=["POST"])
def remove_student():
    data = request.json
    name = data.get("name")
    if name in active_students:
        del active_students[name]
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
