# CheatApp

This is a small chat application backend built using Node.js, Express, MongoDB, and Socket.io. The application allows users to register, send messages, and view message conversations. The backend is integrated with WebSocket for real-time message delivery. This project is using node v20+. 

# Features

- **User Registration-Login-See Profile-Edit Profile**: user name-email-password.
- **Send Messaging**: messages are sent and received in real-time using Socket.io.
- **See Message History**: can see previous conversations between other users.
- **Security**: JWT authentication.

## Tech Stack Used

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Real-Time Communication**: Socket.io
- **Authentication**: JWT authentication

## Node.js version
- **v20.11.0**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kuldeep-Singh-Naruka/CheatApp.git
2. Install the dependencies:
   ```bash
   npm install
2. create .env:
   ```bash
   PORT=yourPortNumber
   MONGO_URI=url
   JWT_SECRET=secaret
3. Now Just start the application
   ```bash
   npx nodemon

# API

- **POST /api/v1/user/register -**: register a new user.
  ```bash
  {
   "name": "My Name Here",
   "email": "email@gmail.com",
   "password": "passwordispassword"
  }
- **POST /api/v1/user/login -**: log in a user and in responce you'll get token.
  ```bash
  {
   "email": "email@gmail.com",
   "password": "passwordispassword"
  }
- **GET /api/v1/message/conversation?receiverId= -**: get conversection(send receiverId in parmas).
- **POST /api/v1/message/send -**: send message.
  ```bash
  {
   "receiverId": "66faaee7a5f3f49c5b1bda3f",
   "content": "im seanding my first message"
  }

# WebSocket Events

- **register**: it will make a object that will take userId and the socket id combination.
  ```bash
  {
  "userId": "66faaee7a5f3f49c5b1bda3f"
  }
- **sendMessage**: after ragister you can send the message.
  ```bash
  {
  "senderId": "66faad3f3aaff2f781f9259e",
  "receiverId": "66faaee7a5f3f49c5b1bda3f",
  "content": "from First Socket msg!"
  }
- **receiveMessage**: to receive message of your friend.


