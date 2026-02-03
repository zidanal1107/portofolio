require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// DATABASE CONNECTION
// ==========================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error("MySQL Error:", err);
        return;
    }
    console.log("MySQL Connected");
});

// ==========================
// HEALTH CHECK
// ==========================
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ==========================
// REGISTER
// ==========================
app.post("/register", async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        if (!nama || !email || !password) {
            return res.json({ ok: false, msg: "Form belum lengkap" });
        }

        db.query("SELECT id FROM users WHERE email = ?", [email], async (err, result) => {
            if (err) return res.json({ ok: false, msg: "DB Error" });

            if (result.length) {
                return res.json({ ok: false, msg: "Email sudah terdaftar" });
            }

            const hashed = await bcrypt.hash(password, 10);
            const id = crypto.randomUUID();

            db.query(
                "INSERT INTO users (id, nama, email, password) VALUES (?, ?, ?, ?)",
                [id, nama, email, hashed],
                err => {
                    if (err) return res.json({ ok: false, msg: "Gagal insert user" });
                    res.json({ ok: true, msg: "Register berhasil" });
                }
            );
        });

    } catch {
        res.json({ ok: false, msg: "Server error" });
    }
});

// ==========================
// LOGIN
// ==========================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ ok: false, msg: "Form belum lengkap" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.json({ ok: false, msg: "DB Error" });

        if (!result.length) {
            return res.json({ ok: false, msg: "Email belum terdaftar" });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ ok: false, msg: "Password salah" });
        }

        const token = crypto.randomUUID();
        const expired = Date.now() + 1000 * 60 * 60 * 24; // 24 jam

        db.query(
            "INSERT INTO sessions (token, user_id, expired_at) VALUES (?, ?, ?)",
            [token, user.id, expired],
            err => {
                if (err) return res.json({ ok: false, msg: "Session error" });
                res.json({ ok: true, token });
            }
        );
    });
});

// ==========================
// AUTH CHECK
// ==========================
app.post("/auth", (req, res) => {
    const { token } = req.body;

    if (!token) return res.json({ ok: false });

    db.query("SELECT * FROM sessions WHERE token = ?", [token], (err, sessions) => {
        if (err || !sessions.length) return res.json({ ok: false });

        const session = sessions[0];

        if (session.expired_at < Date.now()) {
            return res.json({ ok: false, msg: "Session expired" });
        }

        db.query(
            "SELECT id, nama, email FROM users WHERE id = ?",
            [session.user_id],
            (err, users) => {
                if (err || !users.length) return res.json({ ok: false });

                res.json({ ok: true, user: users[0] });
            }
        );
    });
});

// ==========================
// LOGOUT
// ==========================
app.post("/logout", (req, res) => {
    const { token } = req.body;

    if (!token) return res.json({ ok: true });

    db.query("DELETE FROM sessions WHERE token = ?", [token]);
    res.json({ ok: true });
});

// ==========================
// SERVER RUN (RAILWAY READY)
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
