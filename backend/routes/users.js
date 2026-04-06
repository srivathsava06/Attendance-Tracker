const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const protect = require('../middleware/auth');
const { isAdmin, isTeacherOrAdmin } = require('../middleware/roleCheck');

router.get('/', protect, isTeacherOrAdmin, getAllUsers);
router.put('/:id', protect, isAdmin, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
