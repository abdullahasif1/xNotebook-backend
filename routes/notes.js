const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE 1: Get All the Notes using: Get "/api/notes/fetchallnotes"    Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {   
    const notes = await Note.find({user: req.user.id});
    res.json(notes)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})




//ROUTE 2: Add a new Note using: POST "/api/notes/addnote"    Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description' , 'desceiption must be atleast 5 characters').isLength({ min: 5 }),
  
], async (req, res)=>{

    try {
    

    const {title, description, tag,} = req.body;
    //if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title, description, tag, user: req.user.id
    })
    const savedNote = await note.save();

    res.json(savedNote)

        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 3: Update an existing Note using: PUT "/api/notes/updatmote"    Login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
        try {
            
        const {title, description,tag} = req.body;
        //Crate a network object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(400).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 4: Delete an existing Note using: PUT "/api/notes/deletenote"    Login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
        try {
            
        const {title, description,tag} = req.body;
        

        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(400).send("Not Found")}

        //Allow deletion only if user owns the Note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted", note: note });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router