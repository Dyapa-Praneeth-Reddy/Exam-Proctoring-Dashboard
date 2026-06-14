import exp from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


// CREATE EXPRESS APP
const app = exp();


// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));


// BODY PARSER
app.use(exp.json());


// COOKIE PARSER
app.use(cookieParser());

//ROUTES
import authRoutes from './routes/auth.js';
import examRoutes from './routes/examRoutes.js';
import attemptRoutes from './routes/attemptRoutes.js';
import violationRoutes from './routes/violationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 and Frontend static serving
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
    app.use(exp.static(path.join(__dirname, "../frontend/dist")));

    // Catch-all route to serve the React app
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });
} else {
    app.use((req, res) => {
        res.status(404).json({
            message: "Route not found"
        });
    });
}


// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    // Only log full error in development
    if (process.env.NODE_ENV !== "production") {
        console.error("Error:", err);
    } else {
        console.error("Error:", err.message);
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation error", error: err.message });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format", error: err.message });
    }

    const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

    if (errCode === 11000) {
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];
        return res.status(409).json({
            message: "Duplicate entry",
            error: `${field} "${value}" already exists`,
        });
    }

    res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
});

export default app;