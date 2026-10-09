import ContactMessage from "../models/ContactMessage.js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATUS FLOW — Only forward
// new → read → replied → archived
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const STATUS_ORDER = ["new", "read", "replied", "archived"];

const isValidTransition = (currentStatus, newStatus) => {
  // Archived is terminal — no changes allowed
  if (currentStatus === "archived") return false;

  // Same status = no change
  if (currentStatus === newStatus) return false;

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const newIndex = STATUS_ORDER.indexOf(newStatus);

  // Only allow forward transitions
  return newIndex > currentIndex;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const trimmedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // Validate Name
    if (trimmedData.name.length < 2) {
      return res
        .status(400)
        .json({ error: "Name must be at least 2 characters" });
    }
    if (trimmedData.name.length > 50) {
      return res
        .status(400)
        .json({ error: "Name must be less than 50 characters" });
    }
    if (!/^[A-Za-z\s]+$/.test(trimmedData.name)) {
      return res.status(400).json({ error: "Name must contain only letters" });
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }
    if (trimmedData.email.length > 100) {
      return res
        .status(400)
        .json({ error: "Email must be less than 100 characters" });
    }

    // Validate Subject
    if (trimmedData.subject.length < 3) {
      return res
        .status(400)
        .json({ error: "Subject must be at least 3 characters" });
    }
    if (trimmedData.subject.length > 100) {
      return res
        .status(400)
        .json({ error: "Subject must be less than 100 characters" });
    }
    if (!/[A-Za-z]/.test(trimmedData.subject)) {
      return res
        .status(400)
        .json({ error: "Subject must contain at least one letter" });
    }

    // Validate Message
    if (trimmedData.message.length < 10) {
      return res
        .status(400)
        .json({ error: "Message must be at least 10 characters" });
    }
    if (trimmedData.message.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message must be less than 1000 characters" });
    }
    if (!/[A-Za-z]/.test(trimmedData.message)) {
      return res
        .status(400)
        .json({ error: "Message must contain at least one letter" });
    }

    const contactMessage = await ContactMessage.create({
      name: trimmedData.name,
      email: trimmedData.email,
      subject: trimmedData.subject,
      message: trimmedData.message,
      userId: req.userId || undefined,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @desc    Get all contact messages (Admin)
// @route   GET /api/contact/admin/all
// @access  Admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const stats = {
      total: messages.length,
      new: messages.filter((m) => m.status === "new").length,
      read: messages.filter((m) => m.status === "read").length,
      replied: messages.filter((m) => m.status === "replied").length,
      archived: messages.filter((m) => m.status === "archived").length,
    };

    res.json({ stats, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @desc    Update message status (Admin) — FORWARD ONLY
// @route   PUT /api/contact/admin/:id/status
// @access  Admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log(`📝 Request: Update message ${id} to "${status}"`);

    // Validate status field
    if (!STATUS_ORDER.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${STATUS_ORDER.join(", ")}`,
      });
    }

    // Find existing message
    const existingMessage = await ContactMessage.findById(id);
    if (!existingMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    console.log(`   Current status: "${existingMessage.status}"`);

    // ⭐ Enforce forward-only status flow
    if (!isValidTransition(existingMessage.status, status)) {
      return res.status(400).json({
        error:
          `Cannot change status from "${existingMessage.status}" to "${status}". ` +
          `Status can only move forward: new → read → replied → archived`,
      });
    }

    // Update status
    existingMessage.status = status;
    await existingMessage.save();

    console.log(`✅ Message status updated to "${status}"`);

    res.json(existingMessage);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(400).json({ error: error.message });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @desc    Delete message (Admin)
// @route   DELETE /api/contact/admin/:id
// @access  Admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Deleting message ${id}`);

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    console.log(`✅ Message deleted successfully`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: error.message });
  }
};
