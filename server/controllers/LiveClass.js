const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');

// Schedule a new live class
exports.scheduleLiveClass = async (req, res) => {
  try {
    console.log("[SCHEDULE] req.body:", req.body);
    const { course, title, description, scheduledAt, duration } = req.body;
    const instructor = req.user.id;
    console.log("[SCHEDULE] instructor:", instructor);
    // Optionally: check if instructor owns the course
    const liveClass = await LiveClass.create({
      course,
      instructor,
      title,
      description,
      scheduledAt,
      duration,
    });

    // Fetch course to get enrolled students and instructor
    const courseDoc = await Course.findById(course).populate('studentsEnrolled').populate('instructor');
    const emails = [];
    if (courseDoc && courseDoc.studentsEnrolled) {
      emails.push(...courseDoc.studentsEnrolled.map(u => u.email));
    }
    if (courseDoc && courseDoc.instructor && courseDoc.instructor.email) {
      emails.push(courseDoc.instructor.email);
    }
    // Schedule email reminder 10 minutes before class
    const classTime = new Date(scheduledAt).getTime();
    const now = Date.now();
    const msUntilReminder = classTime - now - 10 * 60 * 1000;
    if (msUntilReminder > 0) {
      setTimeout(() => {
        emails.forEach(email => {
          mailSender(
            email,
            `Live Class Reminder: ${title}`,
            `<p>Your live class <b>${title}</b> is starting soon.<br/>Scheduled at: ${new Date(scheduledAt).toLocaleString()}<br/>Duration: ${duration} min</p>`
          );
        });
      }, msUntilReminder);
    }

    res.status(201).json({ success: true, liveClass });
  } catch (error) {
    console.log("[SCHEDULE] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all live classes for a course
exports.getLiveClassesForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const liveClasses = await LiveClass.find({ course: courseId }).sort({ scheduledAt: 1 });
    res.json({ success: true, liveClasses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single live class by ID
exports.getLiveClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) return res.status(404).json({ success: false, message: 'Live class not found' });
    res.json({ success: true, liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a live class (instructor only)
exports.updateLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const liveClass = await LiveClass.findByIdAndUpdate(id, updates, { new: true });
    if (!liveClass) return res.status(404).json({ success: false, message: 'Live class not found' });
    res.json({ success: true, liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel a live class
exports.cancelLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = await LiveClass.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    if (!liveClass) return res.status(404).json({ success: false, message: 'Live class not found' });
    res.json({ success: true, liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all live classes for the logged-in instructor
exports.getLiveClassesForInstructor = async (req, res) => {
  try {
    const instructorId = req.user.id;
    console.log('Instructor ID:', instructorId);
    const liveClasses = await LiveClass.find({ instructor: instructorId })
      .populate('course')
      .sort({ scheduledAt: -1 });
    console.log('Live classes found:', liveClasses.length);
    res.json({ success: true, data: liveClasses });
  } catch (error) {
    console.error('Error in getLiveClassesForInstructor:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all live classes for a student
exports.getLiveClassesForStudent = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all courses the student is enrolled in
    const courses = await Course.find({ studentsEnrolled: userId });
    const courseIds = courses.map(c => c._id);
    // Find all live classes for those courses
    const liveClasses = await LiveClass.find({ course: { $in: courseIds } })
      .populate('course')
      .sort({ scheduledAt: 1 });
    res.json({ success: true, data: liveClasses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 