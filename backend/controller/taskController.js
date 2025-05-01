import Task from "../schema/taskSchema.js";
import User from "../schema/userSchema.js";

// Create a new Task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.headers.userid;
    const newTask = await Task.create({ title, description });
    await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });
    res.status(201).json({ task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getLoggedInTask = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const user = await User.findById(userId).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.status(200).json({ status: 200, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Complete Task 
const getCompleteTask = async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match:{complete:true},
      options: { sort: { createdAt: -1 } },
    });
    if (!Data) {
      return res.status(404).json({ status: 404, message: "Data not found" });
    }
    res.status(200).json({ status: 200, Data });
  } catch (error) {
    console.error("Error fetching Data details:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get InComplete Task 
const getInCompleteTask = async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match:{complete:false},
      options: { sort: { createdAt: -1 } },
    });
    if (!Data) {
      return res.status(404).json({ status: 404, message: "Data not found" });
    }
    res.status(200).json({ status: 200, Data });
  } catch (error) {
    console.error("Error fetching Data details:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try { 
    const { title, description } = req.body;
    await Task.findByIdAndUpdate(id, { title: title, description: description });
    res.status(200).json({message:"Task Updated"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Complete Task 
const updateCompleteTask = async (req, res) => {
   try {
     const { id } = req.params;
     const taskData = await Task.findById(id);
     const CompleteTask = taskData.complete;
     await Task.findByIdAndUpdate(id,{complete:!CompleteTask})
     res.status(200).json({ message: "Task Updated" });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
}

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    await Task.findByIdAndDelete(taskId);

    await User.findByIdAndUpdate(req.headers.userid, {
      $pull: { task: taskId },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createTask,
  getInCompleteTask,
  getCompleteTask,
  updateTask,
  updateCompleteTask,
  deleteTask,
  getLoggedInTask,
};