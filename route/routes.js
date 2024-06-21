const express = require('express');
const { Mentor, Student } = require('../models/models');

const router = express.Router();

// Create Mentor API
router.post('/mentors', async (req, res) => {
  try {
    const name = new Mentor(req.body);
    await name.save();
    res.status(201).json(name);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create Student API
router.post('/students', async (req, res) => {
  try {
    const name = new Student(req.body);
    await name.save();
    res.status(201).json(name);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign Student to Mentor API
router.post('/assign', async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or Mentor not found' });
    }

    student.mentor = mentorId;
    mentor.students.push(studentId);

    await student.save();
    await mentor.save();

    res.status(200).json({ message: 'Student assigned to Mentor successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add Multiple Students to Mentor API
router.post('/mentors/:mentorId/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const { studentIds } = req.body;

    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);

      if (student) {
        mentor.students.push(studentId);
        await mentor.save();
      }
    }

    res.status(200).json({ message: 'Students added to Mentor successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign or Change Mentor for Student API
router.put('/students/:studentId/assign', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or Mentor not found' });
    }

    student.mentor = mentorId;
    await student.save();

    res.status(200).json({ message: 'Student assigned to new Mentor successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Select One Student and Assign one Mentor API
router.put('/students/:studentId/mentor/:mentorId', async (req, res) => {
  try {
    const { studentId, mentorId } = req.params;
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or Mentor not found' });
    }

    student.mentor = mentorId;
    await student.save();

    res.status(200).json({ message: 'Student assigned to Mentor successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Show all students for a particular mentor API
router.get('/mentors/:mentorId/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate('students');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.status(200).json(mentor.students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Show the previously assigned mentor for a particular student API
router.get('/students/:studentId/mentor', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('mentor');

    if (!student || !student.mentor) {
      return res.status(404).json({ message: 'Student or Mentor not found' });
    }

    res.status(200).json(student.mentor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;