import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Task from './models/Task';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;
  try {
    await db.dropCollection('users');
    await db.dropCollection('tasks');
  } catch (error) {
    console.log('Collections were not present, skipping drop...');
  }

 const [user1, user2] = await User.create({
      username: 'user1',
      password: '123qwe',
      token: crypto.randomUUID()
    }, {
      username: 'user2',
      password: '456qwe',
      token: crypto.randomUUID()
    }
  );

  await Task.create(
    {
      user: user1._id,
      title: 'Do homework',
      description: 'Complete math assignment',
      status: 'new',
    },
    {
      user: user1._id,
      title: 'Prepare presentation',
      description: 'Work on the presentation',
      status: 'in_progress',
    },
    {
      user: user2._id,
      title: 'Read a book',
      description: 'Read the first two chapters of a novel',
      status: 'new',
    },
    {
      user: user2._id,
      title: 'Do housework',
      description: 'Tidy up the room before the weekend',
      status: 'complete',
    }
  );

  await db.close();
};

run().catch(console.error);