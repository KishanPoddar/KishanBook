const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "kishanisagoodboy";

// ROUTE 1: Create a user using: POST "/auth/api/createuser". No Login required
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false
    //If there are error, return Bad request and bad errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    //Check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        //create a new user
        const salt = bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)

        success = true
        res.json({ success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2: Authenticate a user using: POST "/auth/api/login". No Login required
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false
    //If there are error, return Bad request and bad errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
    
// ROUTE 3: Get logged in user details using: POST "/auth/api/getuser". Login required
//CHange Header token to get login details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
    
module.exports = router