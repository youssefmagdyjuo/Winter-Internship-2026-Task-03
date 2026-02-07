const router = require('express').Router();
const {getUserRole, getAllUsers, addUser,getSpecificUser,updateUser,deleteUser ,updatePassword} = require('../controllers/usersControllers');
const { protect } = require('../middleware/protectedRoutes');

router.route('/')
    .get(getAllUsers)
    .post(addUser);
router.route('/userRole')
    .get(protect, getUserRole)

router.route('/:id')
    .get(getSpecificUser)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/password')
    .put(updatePassword);

module.exports = router;