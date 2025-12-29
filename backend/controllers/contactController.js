const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");

// Reads env or defaults
const RECEIVER_EMAIL =
  process.env.CONTACT_RECEIVER || "mohammedshifa800@gmail.com";

// Simple rate-limit per IP: reject if same IP submitted within last 60s
exports.sendContact = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body || {};
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ msg: "Name, email and message are required." });
    }

    // Rate limit check
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recent = await ContactMessage.findOne({
      ip,
      createdAt: { $gte: oneMinuteAgo },
    });
    if (recent)
      return res
        .status(429)
        .json({ msg: "Please wait before sending another message." });

    // Persist
    const cm = await ContactMessage.create({ name, email, message, phone, ip });

    // Attempt to send email via Nodemailer. If SMTP not configured, use Ethereal test account and return preview URL.
    let previewUrl = null;
    try {
      const host = process.env.SMTP_HOST;
      const port = process.env.SMTP_PORT;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      const mail = {
        from: `${name} <${email}>`,
        to: RECEIVER_EMAIL,
        subject: `Contact form: ${name}`,
        text: `${message}\n\nReply-to: ${email}\nPhone: ${
          phone || "n/a"
        }\nIP: ${ip}`,
      };

      let transporter;
      let info;

      if (host && port && user && pass) {
        transporter = nodemailer.createTransport({
          host,
          port: Number(port),
          secure: Number(port) === 465,
          auth: { user, pass },
        });
        info = await transporter.sendMail(mail);
        console.log(
          "Contact email sent via SMTP, messageId=",
          info?.messageId || info?.response || "(no id)"
        );
      } else {
        // Create Ethereal test account so developer can preview the message
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        info = await transporter.sendMail(mail);
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Ethereal preview URL:", previewUrl);
      }
    } catch (mailErr) {
      console.error("Contact email send failed:", mailErr);
    }

    res.json({ msg: "Message received", message: cm, previewUrl });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// List recent messages (admin/debug)
exports.listMessages = async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 }).limit(200);
    res.json(msgs);
  } catch (err) {
    console.error("List messages error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Mark a message as read
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await ContactMessage.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ msg: "Message not found" });
    res.json(msg);
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a message
exports.removeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await ContactMessage.findByIdAndDelete(id);
    if (!msg) return res.status(404).json({ msg: "Message not found" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
