import express from 'express';
import mongoose from 'mongoose';
import auth, {RequestWithUser} from '../middleware/auth';
import Task from '../models/Task';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }

    const task = new Task({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

    await task.save();
    return res.send(task);

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }
    const tasks = await Task.find({user: req.user._id});
    return res.send(tasks);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }

    const {title, description, status} = req.body;

    if (!title || !status) {
      return res.status(400).send({error: 'Title and status are required'});
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({error: 'You dont have permission to update the task!'});
    }

    task.title = title;
    task.description = description;
    task.status = status;

    await task.save();

    return res.send(task);

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({error: 'You dont have permission to delete the task!'});
    }

    await task.deleteOne();
    return res.send({message: 'Task deleted successfully.'});

  } catch (error) {
    return next(error);
  }
});


export default tasksRouter;