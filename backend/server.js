require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/Device');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment variables.");
  process.exit(1);
}

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connected');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


app.post('/api/register', async (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });

  try {
    const existing = await Device.findOne({ deviceId });
    if (existing) return res.status(200).json({ message: 'Already registered' });

    await Device.create({ deviceId });
    res.json({ message: 'Device registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/send', async (req, res) => {
  const { recipientDeviceId, deviceId, url } = req.body;
  if (!deviceId || !recipientDeviceId || !url) {
    return res.status(400).json({
      error: 'deviceId, recipientDeviceId, and url are required'
    });
  }


  try {
    // Google Safe Browsing API check
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client: {
            clientId: "your-app-name",       
            clientVersion: "1.0"             
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
          }
        })
      }
    );

    const gsbData = await response.json();

    // If any threats found, reject the URL
    if (gsbData && gsbData.matches && gsbData.matches.length > 0) {
      return res.status(403).json({
        error: 'URL flagged as unsafe',
        threats: gsbData.matches
      });
    }

    // Find the recipient device
    const recipient = await Device.findOne({ deviceId: recipientDeviceId });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient device not found' });
    }

    // Store the URL
    recipient.links.push({
      senderId: deviceId,
      url,
      sentAt: new Date()
    });

    await recipient.save();

    return res.json({ message: 'Link sent' });

  } catch (err) {
    console.error('Error in /api/send:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get links
app.get('/api/links', async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });

  try {
    const device = await Device.findOne({ deviceId });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    const links = device.links.map(link => ({
      senderId: link.senderId,
      url: link.url,
      sentAt: link.sentAt,
      linkId: link._id.toString()
    }));
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a link
app.delete('/api/links', async (req, res) => {
  const { deviceId, linkId } = req.query;
  if (!linkId ) {
    return res.status(400).json({ error: 'link ID required' });
  }

  try {
    const device = await Device.findOneAndUpdate(
      { deviceId }, 
      { $pull: { links: { _id: linkId } } }, 
      { new: true }
    );
    if (!device) return res.status(404).json({ error: 'Device not found' });
    const links = device.links.map(link => ({
      senderId: link.senderId,
      url: link.url,
      sentAt: link.sentAt,
      linkId: link._id.toString()
    }));
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

});

app.listen(3000, () => console.log('Server on http://localhost:3000'));