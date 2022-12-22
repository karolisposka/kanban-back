const express = require('express');
const {ObjectId} = require('mongodb');
const checkIfLoggedIn = require('../../middleware/auth/auth');
const {getDb} = require('../../controllers/database');
const router = express.Router();


router.get('/categories', checkIfLoggedIn, async(req,res) => {
  try{
    const db = getDb();
    const response = await db.collection('boards').find({user_id: `${req.user}`}, {projection: { _id: 1, name:1}}).toArray();
    if(response){
      res.send(response);
    }else{
      res.status(500).send({err:"something went wrong with the server.Please try again later"});
    }
  }catch(err){
    console.log(err);
    res.status(500).send({err:'something went wrong with the server. Please try again later'});
  }
});

router.get('/get/:id', checkIfLoggedIn, async (req,res) => {
  try{
    const id = ObjectId(req.params.id);
    const db = getDb();
    const response = await db.collection('boards').findOne({_id: id, user_id: req.user});
    if(response){
      return res.send(response);
    }else{
      res.status(500).send({err:'something wrong with the server. Please try again later'})
    }
  }catch(err){
    res.status(500).send({err:"something wrong with the server. Please try again later"});
  }
});


router.delete('/delete/:boardId', checkIfLoggedIn, async(req,res) => {
  try{
    const db = getDb();
    const response = await db.collection('boards').deleteOne({_id: ObjectId(req.params.boardId)});
    if(response.deletedCount){
      res.send({msg:'board successfully deleted', id: req.params.boardId})
    } else{ 
      res.send({err: "something went wrong"})
    }
  }catch(err){  
    res.status(500).send({err: 'something wrong with the server.Please try again later'})
  }
})


router.post('/board/add', checkIfLoggedIn, async(req,res)=> {
  try{
    const db = getDb();
    const response = await db.collection('boards').insertOne({"user_id": req.user, ...req.body}); 
    if (response) {
      res.status(200).send({msg:'board added', id:response.insertedId.toString(), name: req.body.name});
    }
  }catch(err){
    res.status(500).send({err:'something wrong with the server. Please try again later'});
  }
});

router.post('/board/update', checkIfLoggedIn, async(req,res) => {
  try{
    const {page, object} = req.body;
    const id = ObjectId(page);
    const db = getDb();
    const response = await db.collection('boards').updateOne({_id: id},{$set: {name: object.name, columns: object.columns}});

    if(!response.modifiedCount){
      console.log('something wrong')
      res.status(500).send({err:'something wrong with the server. Please try again later'})
    }else{
      res.send({msg: 'board updated', object: object, page: page})
    }
  }catch(err){
    res.status(500).send({err:'something wrong with the server. Please try again later'});
  }
})

router.post('/task/add', checkIfLoggedIn, async(req,res) => {
  const {page, object} = req.body;
  const id = await ObjectId(page);
  const status = object.status;
  try{
    const db = getDb();
    const response =  await db.collection('boards').updateOne({ "_id": id, "columns.name": status }, {$push: {"columns.$[element].tasks": object}}, {arrayFilters: [{ "element.name": status }]});
    if(response.modifiedCount) {
      res.send({msg:'task added successfully', data: object, page: page, status: status})
    }else{
      response.send({err:'something went wrong'})
    }
  }catch(err){
    res.status(500).send({err:'something wrong with the server. Please try again later'});
  }
});

router.post('/tasks/delete/:taskId', checkIfLoggedIn, async (req,res) =>{
  try{
    const {board, column} = req.body;
    const id = ObjectId(board)
    const db = getDb();
    const response = await db.collection('boards').updateOne({'_id': id}, {$pull: {"columns.$[column].tasks": {'name': req.params.taskId}}}, {arrayFilters: [{'column.name': column}]});
    console.log(response);
    if(response.modifiedCount){
      res.send({msg: 'task successfully deleted', object: {column, taskId: req.params.taskId}})
    }else{
      res.send({err: 'something went wrong'})
    }
  }catch(err){
    res.status(500).send({err: 'sometinh wrong with the server. Please try again later'});
  }
})


router.post('/tasks/changeStatus', checkIfLoggedIn, async (req,res ) => {
  try{
    const { status, page, column, task } = req.body.object;
    const object = ObjectId(page);
    const db = getDb();
    const tasks = await db.collection('boards').findOne({"_id": ObjectId(page)} , {projection: {columns:1}});
    if(tasks){
      const [taskToPush] = tasks.columns.filter(col => col.name.trim().toLowerCase() === column.trim().toLowerCase())[0].tasks.filter(tas => tas.name.toLowerCase() === task.toLowerCase());
      const del = await db.collection('boards').updateOne({"_id": object}, {$pull: {"columns.$[column].tasks": {"name": task}}}, {arrayFilters: [{'column.name': column}]});
    if(del.modifiedCount){
      const response = await db.collection('boards').updateOne({"_id": object}, {$push: {"columns.$[column].tasks": taskToPush}}, {arrayFilters: [{'column.name': status}]});
      if(response.modifiedCount){
        res.send({msg: "task status changed", object: {status, page, column, task, taskToPush}})
      }else {
        res.send({err:"something went wrong"})
      }
    }else{
      res.send({err:'something went wrong'})
    }
    }else{
      res.send({err:'something went wrong'})
    }
  }catch(err){
    console.log(err);
 }
})


router.post('/subtasks/changeStatus', checkIfLoggedIn, async(req,res) => {
  try{
    const {id, status, page, column, task} = req.body;
    const object = ObjectId(page)
    const statusChangeTo = !status;
   
    const db = getDb();
    const response = await db.collection('boards')
    .updateOne({"_id": object},{$set: {"columns.$[column].tasks.$[task].subtasks.$[subtask].isCompleted": statusChangeTo}},{arrayFilters: [
        {
          "column.name": column
        },
        {
          "task.name": task
          
        },
        {
          "subtask.id": id
        }
      ],
    })
    if(response.modifiedCount){
      res.send({msg: 'subtask status changed.', object: {status: statusChangeTo, column: column, task: task, subtask: id}})
    } else { 
      res.send({err:'something went wrong.'})
    }
  }catch(err){
    res.status(500).send({err:'something wrong with the server. Please try again later'});
  }
});


module.exports = router;