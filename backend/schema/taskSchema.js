import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("task", taskSchema);
export default Task;
