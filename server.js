const express = require('express');
const app = express();
const port = 3001;


app.use(express.json());


let tasks = [
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Study Node.js', completed: false },
];


app.get('/tasks', (req, res) => {
    res.json(tasks);
});


app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
});


app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: req.body.completed || false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});


app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
    
    task.title = req.body.title || task.title;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    
    res.json(task);
});


app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).send('Task not found');
    
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});


app.listen(port, () => {
    console.log(`To-Do API listening at http://localhost:${port}`);
});
