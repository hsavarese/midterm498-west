import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";

const app = express();


const users = []; // Array of { username, password }
const comments = []; // Array of { author, text, createdAt }
const sessions = new Map(); // Map where key is sessionId → { user, expires }

// Set up Handlebars engine with layouts and partials
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: './views/layouts/',
  partialsDir: './views/partials/'
}));
app.set('view engine', 'hbs');
app.set('views', './views');


app.use(express.static("public")); // serve files in server/public
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser()); // parse cookies

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// renders home.hbs inside main.hbs layout
app.get("/", (_req, res) => {
  res.render('home', { 
    title: 'Wild West Forum',
    message: 'Welcome to the Wild West Forum!'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node on ${PORT}`));