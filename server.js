import cors from "cors";
import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import db from "./config/database.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import eventRoutes from "./routes/eventsRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, './client/dist')));

app.use(json());
app.use(urlencoded({ extended: true }));

db();

app.use("/api/competitions", competitionRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/events", eventRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
