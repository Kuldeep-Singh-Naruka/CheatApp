const Message = require('../model/message.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.id;
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content,
    });

    await message.save();
    req.io.to(receiverId).emit('receiveMessage', message);

    res.status(200).send({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Error sending message' });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { receiverId } = req.query;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(senderId), receiver: new mongoose.Types.ObjectId(receiverId) },
            { sender: new mongoose.Types.ObjectId(receiverId), receiver: new mongoose.Types.ObjectId(senderId) }
          ]
        }
      },
      {
        $sort: { createdAt: 1 }
      }
    ]);
    
    res.status(200).send({ messages });
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).send({ message: 'Error retrieving messages' });
  }
};
