const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  links: [
    {
      senderId: { type: String, required: true },
      url: { type: String, required: true },
      sentAt: { type: Date, default: Date.now },
      unread: { type: Boolean, default: true }
    }
  ]
});

module.exports = mongoose.model('Device', DeviceSchema);
