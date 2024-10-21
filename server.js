const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todo-api',{
    useNewUrlParser:true,   
    useUnifiedTopology:true
})
.then(()=> console.log('Connected to MongoDB'))
.catch(err=> console.error('Could not connect to MongoDB',err));


app.get('/tasks',async(req,res) => {
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id); // Find task by ID
        if (!task) return res.status(404).json({ message: 'Task not found' }); // 404 if not found
        res.json(task); // Return the task
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors
    }
});



app.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        completed: req.body.completed || false
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.put('/tasks/:id',async (req,res) => {
    try{
        const task=await Task.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            completed:req.body.completed
        },{new:true});

        if(!task) return res.status(404).json({message: 'Task not found'});
        res.json(task);
    }catch (err){
        res.status(400).json({message: error.message});
    }
});

app.delete('tasks/:id',async (req,res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task) return res.status(404).json({message:'Task not found'});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});


app.listen(port, () => {
    console.log(`To-Do API listening at http://localhost:${port}`);
});
