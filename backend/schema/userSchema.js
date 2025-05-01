import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      // type: String,
      type: mongoose.Schema.Types.String,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model('User', userSchema);
export default User;
