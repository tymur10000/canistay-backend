require("dotenv").config();
require("./config/database")();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const passport = require("./middleware/passport"); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

// Load environment variables first

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Import routes
const userRoute = require("./routes/userRoute");
const socketServer = require("./socket");

// Middleware configuration
app.set("trust proxy", true);
app.use(passport.initialize());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parser and file upload configuration
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(
  fileUpload({
    createParentPath: true, 
    limits: {
      fileSize: 25 * 1024 * 1024, // 10MB max file size
    },
    abortOnLimit: true,
  })
);

app.get('/create-payment-intent', async (req, res) => { 
  try { 
    const subscription = req.query.subscription;
    const amount = (subscription === "basic" ? 29 : subscription === "elite" ? 299 : 999);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      // Add automatic_payment_methods for better payment method handling
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Static file serving
const uploadsPath = path.join(__dirname, "uploads");
app.use("/static", express.static(path.resolve(uploadsPath, "static")));
app.use("/idcard", express.static(path.resolve(uploadsPath, "id_cards")));
app.use("/files", express.static(path.resolve(uploadsPath, "files")));
app.use("/profile_pictures", express.static(path.resolve(uploadsPath, "profile_pictures")));
app.use("/main_picture", express.static(path.resolve(uploadsPath, "profile_picture")));
app.use("/house_images", express.static(path.resolve(uploadsPath, "house_images")));
app.use("/intro_videos", express.static(path.resolve(uploadsPath, "intro_videos")));

// Routes
app.use("/users", userRoute.router);
app.use("/chat", chatRoute.router);
app.use("/profile", profileRoute.router);
app.use("/house", houseRoute.router);
app.use("/booking", bookingRoute.router);
// Socket.io setup
socketServer(io);

// Server startup
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
