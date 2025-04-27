import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Input, Modal, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';  // For navigating to the login page

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', assignedUser: '' });
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate(); // Hook for navigation

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');  // Adjust this URL to match your backend
        if (Array.isArray(response.data)) {
          setTasks(response.data);  // Ensure response.data is an array
        } else {
          console.error('Expected an array of tasks but got:', response.data);
        }
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
      setFormData({ title: '', description: '', assignedUser: '' });  // Reset the form
      // Re-fetch tasks after creating a new one
      const response = await axios.get('/api/tasks');
      if (Array.isArray(response.data)) {
        setTasks(response.data);  // Ensure response.data is an array
      }
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
      if (Array.isArray(response.data)) {
        setTasks(response.data);  // Ensure response.data is an array
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear any stored session info, then navigate to the login page
    localStorage.removeItem('token');  // Assuming you're storing the token in localStorage
    navigate('/login');
  };

  // Filter tasks based on the search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Task Dashboard
  return (
    <div style={{ padding: 20 }}>
      {/* Logout Button */}
      <Button 
        type="primary" 
        onClick={handleLogout} 
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        Logout
      </Button>

      {/* Search Bar */}
      
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 20 }}>
        Add Task
      </Button>

      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20, width: '300px' }}
      />
      
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 20 ,borderRadius:'40px' }}>
        Search
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
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Assigned User"
          value={formData.assignedUser}
          onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
          style={{ marginBottom: 10 }}
        />
      </Modal>

      {/* Task Dashboard Columns */}
      <Row gutter={16}>
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Col span={8} key={status}>
            <h2>{status}</h2>
            {filteredTasks.filter((task) => task.status === status).map((task) => (
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
