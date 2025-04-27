import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Button, Card, Input, Modal, Row, Col } from 'antd';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');  // Adjust this URL to match your backend
        setTasks(response.data);  // Ensure response.data is an array
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Create a new task
  const handleCreateTask = async () => {
    try {
      await axios.post('/api/tasks', formData);  // Adjust this URL to match your backend
      setIsModalOpen(false);
      setFormData({ title: '', description: '' });  // Reset the form
      // Re-fetch tasks after creating a new one
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Update task status (Move to In Progress / Done)
  const handleMoveTask = async (id, newStatus) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status: newStatus });
      // Re-fetch tasks after updating status
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Render Task Dashboard
  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 20 }}>
        Add Task
      </Button>

      <Modal
        title="Create New Task"
        open={isModalOpen}
        onOk={handleCreateTask}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <Input.TextArea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </Modal>

      {/* Task Dashboard Columns */}
      <Row gutter={16}>
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Col span={8} key={status}>
            <h2>{status}</h2>
            {tasks.filter((task) => task.status === status).map((task) => (
              <Card
                key={task._id}  // MongoDB _id
                title={task.title}
                extra={task.assignedUser}
                actions={[
                  status !== 'In Progress' && (
                    <Button
                      size="small"
                      onClick={() => handleMoveTask(task._id, 'In Progress')}
                    >
                      Move to In Progress
                    </Button>
                  ),
                  status !== 'Done' && (
                    <Button
                      size="small"
                      onClick={() => handleMoveTask(task._id, 'Done')}
                    >
                      Move to Done
                    </Button>
                  ),
                ]}
                style={{ marginBottom: 10 }}
              >
                <p>{task.description}</p>
              </Card>
            ))}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TaskBoard;
