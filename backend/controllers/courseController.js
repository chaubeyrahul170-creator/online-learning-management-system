// import Course from '../models/Course.js';

// // @desc    Get all courses from MongoDB
// // @route   GET /api/courses
// // @access  Public
// export const getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json(courses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get single course by ID
// // @route   GET /api/courses/:id
// // @access  Public
// export const getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.status(200).json(course);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create a new course
// // @route   POST /api/courses
// // @access  Private
// export const createCourse = async (req, res) => {
//   try {
//     const course = await Course.create(req.body);
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Update Course Learning Progress (When student marks video done)
// // @route   PUT /api/courses/:id/progress
// // @access  Public / Private
// export const updateCourseProgress = async (req, res) => {
//   try {
//     const { completedLessons, progress } = req.body;
//     const course = await Course.findById(req.params.id);

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     if (completedLessons !== undefined) course.completedLessons = completedLessons;
//     if (progress !== undefined) course.progress = progress;

//     await course.save();
//     res.json({ message: 'Progress updated successfully', course });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete a course
// // @route   DELETE /api/courses/:id
// // @access  Private / Admin Only
// export const deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     await Course.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Course deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



import Course from '../models/Course.js';

// @desc    Get all courses from MongoDB
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course (Faculty / Admin)
// @route   POST /api/courses
// @access  Private
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add lecture to an existing course (Faculty)
// @route   POST /api/courses/:id/lectures
// @access  Private
export const addLecture = async (req, res) => {
  try {
    const { moduleTitle, lecture } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let mod = course.modules.find(
      (m) => m.title.toLowerCase() === (moduleTitle || '').toLowerCase()
    );

    if (!mod) {
      course.modules.push({
        title: moduleTitle || 'Module 1: Core Lectures',
        lectures: [lecture],
      });
    } else {
      mod.lectures.push(lecture);
    }

    course.totalLessons = course.modules.reduce((acc, m) => acc + m.lectures.length, 0);
    await course.save();

    res.status(201).json({ message: 'Lecture added successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Course Learning Progress
// @route   PUT /api/courses/:id/progress
// @access  Public / Private
export const updateCourseProgress = async (req, res) => {
  try {
    const { completedLessons, progress } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (completedLessons !== undefined) course.completedLessons = completedLessons;
    if (progress !== undefined) course.progress = progress;

    await course.save();
    res.json({ message: 'Progress updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course (Admin Only)
// @route   DELETE /api/courses/:id
// @access  Private / Admin Only
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

