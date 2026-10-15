
const express = require("express");
const db = require("./db7");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// View all leave requests
app.get("/leaves", (req, res) => {
    db.query("SELECT * FROM leave_requests", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Search leave request by employee ID
app.get("/leaves/:employee_id", (req, res) => {
    const id = req.params.employee_id;

    db.query(
        "SELECT * FROM leave_requests WHERE EMPLOYEE_ID = ?",
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ message: "Leave request not found" });
            }
            res.json(results[0]);
        }
    );
});

// Insert a leave request
app.post("/leaves", (req, res) => {
    const { EMPLOYEE_ID, NAME, DEPARTMENT, TYPE_OF_LEAVE,
            NUMBER_OF_DAYS, DESCRIPTION } = req.body;

    const sql = `INSERT INTO leave_requests
        (EMPLOYEE_ID, NAME, DEPARTMENT, TYPE_OF_LEAVE,
         NUMBER_OF_DAYS, DESCRIPTION)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [EMPLOYEE_ID, NAME, DEPARTMENT, TYPE_OF_LEAVE,
         NUMBER_OF_DAYS, DESCRIPTION],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ message: "Leave request inserted successfully" });
        }
    );
});

// Update a leave request
app.put("/leaves/:employee_id", (req, res) => {
    const id = req.params.employee_id;
    const { NAME, DEPARTMENT, TYPE_OF_LEAVE,
            NUMBER_OF_DAYS, DESCRIPTION } = req.body;

    const sql = `UPDATE leave_requests SET
        NAME = ?, DEPARTMENT = ?, TYPE_OF_LEAVE = ?,
        NUMBER_OF_DAYS = ?, DESCRIPTION = ?
        WHERE EMPLOYEE_ID = ?`;

    db.query(
        sql,
        [NAME, DEPARTMENT, TYPE_OF_LEAVE,
         NUMBER_OF_DAYS, DESCRIPTION, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Leave request not found" });
            }
            res.json({ message: "Leave request updated successfully" });
        }
    );
});

// Delete a leave request
app.delete("/leaves/:employee_id", (req, res) => {
    const id = req.params.employee_id;

    db.query(
        "DELETE FROM leave_requests WHERE EMPLOYEE_ID = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Leave request not found" });
            }
            res.json({ message: "Leave request deleted successfully" });
        }
    );
});

app.listen(7000, () => {
    console.log("Leave Management System running at http://localhost:7000");
});
