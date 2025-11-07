import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();


const users = [];
const comments = [];
const sessions = {};

comments.push({ //example comment
  author: "System",
  text: "world wake",
  createdAt: new Date().toLocaleString()
});

comments.push({ //example comment
  author: "Admin", 
  text: "<b>bold</b>",
  createdAt: new Date().toLocaleString()
});

function getCurrentUser(req) { //get current user from session
  if (req.cookies && req.cookies.sessionId) {
    const session = sessions[req.cookies.sessionId];
    if (session && new Date() < new Date(session.expires)) {
      return { username: session.user };
    }
  }
  return null;
}


app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: './views/layouts/',
  partialsDir: './views/partials/'
}));
app.set('view engine', 'hbs');
app.set('views', './views');


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/", (req, res) => {
  const user = getCurrentUser(req);
  res.render('home', { 
    title: 'Wild West Forum',
    message: 'Welcome to the Wild West Forum!',
    user: user
  });
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/login", (req, res) => {
  res.render('login');
});

app.get("/comments", (req, res) => {
  const user = getCurrentUser(req);
  res.render('comments', {
    comments: comments,
    count: comments.length,
    user: user
  });
});

app.get("/comment-new", (req, res) => {
  const user = getCurrentUser(req);
  if (!user) {
    return res.render('login', { error: "Please log in to post." });
  }
  res.render('comment-new', { user: user });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('register', { error: "Username and password are required." });
  }
  
  if (users.find(user => user.username === username)) {
    return res.render('register', { error: "Username already taken." });
  }
  
  users.push({ username, password });
  res.render('login', { success: "Registration successful! Please log in." });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.render('login', { error: "Invalid username or password." });
  }
  
  const sessionId = uuidv4(); // generate unique session ID
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // session expires in 1 day
  
  sessions[sessionId] = {
    user: username,
    sessionId: sessionId,
    expires: expires
  };
  
  res.cookie('sessionId', sessionId);
  res.cookie('loggedIn', 'true');
  res.cookie('user', username);
  
  res.redirect('/');
});

app.post("/logout", (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }
  
  res.clearCookie('sessionId'); 
  res.clearCookie('loggedIn');
  res.clearCookie('user');
  
  res.redirect('/');
});

app.post("/comment", (req, res) => { //create comment
  const user = getCurrentUser(req);
  if (!user) {
    return res.render('login', { error: "Please log in to post a comment." });
  }
  
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.render('comment-new', { 
      error: "Comment text cannot be empty.",
      user: user,
      text: text
    });
  }
  
  comments.push({
    author: user.username,
    text: text.trim(),
    createdAt: new Date().toLocaleString() //format date to readable string
  });
  
  res.redirect('/comments');
});

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => console.log(`Node on ${PORT}`)); //used for testing in local environment