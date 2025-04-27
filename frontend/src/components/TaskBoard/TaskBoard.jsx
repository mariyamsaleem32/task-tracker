import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { Button, Card, Input, Modal, Select, Col, Row, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const TaskBoard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'To Do', assignedUser: '' });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ ...doc.data(), id: doc.id });
      });
      setTasks(tasksArr);
    });

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map(doc => doc.data());
      setUsersList(users);
    };

    fetchUsers();
    return () => unsubscribe();
  }, []);

  const handleCreateOrUpdateTask = async () => {
    if (!formData.title || !formData.assignedUser) {
      alert('Please fill title and assign user.');
      return;
    }

    if (isEditMode) {
      await updateDoc(doc(db, 'tasks', editTaskId), {
        ...formData
      });
    } else {
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        createdBy: user.uid,
      });
    }

    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({ title: '', description: '', status: 'To Do', assignedUser: '' });
    setEditTaskId(null);
  };

  const handleEditTask = (task) => {
    setIsEditMode(true);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUser: task.assignedUser,
    });
    setEditTaskId(task.id);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 20 }}>
        <Title level={2}>Task Tracking App</Title>
        <Button danger onClick={() => auth.signOut()} style={{ backgroundColor: 'red', color: 'white' }}>
          Logout
        </Button>
      </Space>

      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalOpen(true); setIsEditMode(false); }}>
          Add Task
        </Button>
        <Input
          placeholder="Search by Title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>

      <Row gutter={16}>
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Col span={8} key={status}>
            <Title level={3}>{status}</Title>
            {filteredTasks.filter(task => task.status === status).map(task => (
              <Card
                key={task.id}
                title={task.title}
                extra={<b>Assigned: {task.assignedUser}</b>}
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEditTask(task)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDeleteTask(task.id)} />
                ]}
                style={{ marginBottom: 10 }}
              >
                <p>{task.description}</p>
              </Card>
            ))}
          </Col>
        ))}
      </Row>

      <Modal
        title={isEditMode ? "Edit Task" : "Create New Task"}
        open={isModalOpen}
        onOk={handleCreateOrUpdateTask}
        onCancel={() => { setIsModalOpen(false); setIsEditMode(false); }}
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
        <Select
          placeholder="Assign to User"
          value={formData.assignedUser}
          onChange={(value) => setFormData({ ...formData, assignedUser: value })}
          style={{ width: '100%' }}
        >
          {usersList.map((u, idx) => (
            <Option key={idx} value={u.name}>
              {u.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default TaskBoard;
