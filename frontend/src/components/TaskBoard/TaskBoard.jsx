import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Input, Modal, Row, Col, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', assignedUser: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        if (Array.isArray(response.data)) {
          setTasks(response.data);
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
    // Form validation
    if (!formData.title || !formData.description) {
      notification.error({
        message: 'Error',
        description: 'Title and Description are required!',
      });
      return;
    }

    try {
      await axios.post('/api/tasks', formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', assignedUser: '' });

      // Re-fetch tasks after creating a new one
      const response = await axios.get('/api/tasks');
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create task. Please try again.',
      });
      console.error('Error creating task:', error);
    }
  };

  // Update task status
  const handleMoveTask = async (id, newStatus) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status: newStatus });

      // Re-fetch tasks after updating status
      const response = await axios.get('/api/tasks');
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update task status. Please try again.',
      });
      console.error('Error updating task status:', error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <Input
        placeholder="Search tasks by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20, width: '300px', marginRight: 10 }}
      />

      {/* Add Task Button */}
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 20 }}
      >
        Add Task
      </Button>

      {/* Modal for Creating a New Task */}
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

      {/* Task Dashboard */}
      <Row gutter={16}>
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Col span={8} key={status}>
            <h2>{status}</h2>
            {filteredTasks.filter((task) => task.status === status).map((task) => (
              <Card
                key={task._id}
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
