const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'checkjwt1';

//ROUTE 1: Create a User using: POST "/api/auth/createuser". no login required 
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),

], async (req, res) => {
    let success = false;
    //If there are errors, return Bad errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    
    //why try catch? cause anyyyyy error occurs in db or during creating of user  
    try {

        //Check whether the user with this email exits already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry, user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });//.then(user => res.json(user))

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        //console.log(jwtData);

        success = true;
        res.json({ success, authToken })

    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//ROUTE 2: Authenticate a User using: POST "/api/auth/login".  
router.post('/login', [
    body('email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    let success = false;
    //If there are errors, return Bad errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ error: "Please enter a valid credentials to login" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please enter a valid credentials to login" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

});

//ROUTE 2: Get LoggedIn User Details using: POST "/api/auth/getuser".  Login Required

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router