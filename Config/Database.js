const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://jishnuprakashc7_db_user:zjCkXxrQe5xYM2G4@user.hrclior.mongodb.net/?retryWrites=true&w=majority&appName=user',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

module.exports = connectDB;
