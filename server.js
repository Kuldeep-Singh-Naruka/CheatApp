require('dotenv').config();
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./app/config/db');
const userRoutes = require('./app/routes/user.routes');
const messageRoutes = require('./app/routes/message.routes');
const cors = require('cors');
const { Server } = require('socket.io');
const Message = require('./app/model/message.model');

const app = express();
const server = http.createServer(app);
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Server is running fine');
});

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = {}; // Map to track userId to socketId

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register user when they connect
  socket.on('register', (userId) => {
    users[userId.userId] = socket.id; 
  });

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    try {
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content: content,
      });

      await message.save();

      // Emit message to the receiver's socket
      console.log(users);
      const receiverSocketId = users[receiverId]; // Convert receiverId to string
      if (receiverSocketId) {
        console.log(`Sending message to: ${receiverSocketId}`);
        socket.to(receiverSocketId).emit('receiveMessage', message);
      } else {
        console.log(`Receiver not connected: ${receiverId}`);
      }
    } catch (error) {
      console.error('Error in sendMessage:', error.message);
    }
  });

  // Remove user from the map on disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const userId in users) {
      if (users[userId] === socket.id) {
        console.log(`User disconnected: ${userId}`);
        delete users[userId];
        break; // Exit the loop once the user is found and deleted
      }
    }
  });
});


// Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
