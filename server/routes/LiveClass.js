const express = require('express');
const router = express.Router();
const { scheduleLiveClass, getLiveClassesForCourse, getLiveClassById, updateLiveClass, cancelLiveClass, getLiveClassesForInstructor, getLiveClassesForStudent } = require('../controllers/LiveClass');
const { auth, isInstructor } = require('../middlewares/auth');

// Schedule a new live class (instructor only)
router.post('/schedule', auth, isInstructor, scheduleLiveClass);

// List all live classes for a course
router.get('/course/:courseId', auth, getLiveClassesForCourse);

// Update a live class (instructor only)
router.put('/:id', auth, isInstructor, updateLiveClass);

// Cancel a live class (instructor only)
router.post('/:id/cancel', auth, isInstructor, cancelLiveClass);

// Get all live classes for the logged-in instructor
router.get('/instructor', auth, isInstructor, getLiveClassesForInstructor);

// Route for students to get their live classes
router.get("/student", auth, getLiveClassesForStudent);

// Get a single live class by ID
router.get('/:id', auth, getLiveClassById);

module.exports = router; 