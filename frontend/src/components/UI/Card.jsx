import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card as AntCard,
  Button,
  Input,
  Row,
  Col,
  Typography,
  Space,
  message,
  Modal,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { handleError, handleSuccess } from "../../utils/utils";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const apiUrl = import.meta.env.BACKEND_API;

function Card({ home }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [Data, setData] = useState();

  const headers = {
    userId: localStorage.getItem("userId"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${apiUrl}/task/get-all-tasks`, {
        headers,
      });
      setData(response.data.user);
    };
    fetch();
  }, []);

  const handleCompleteTask = async (id) => {
    try {
      const response = await axios.put(
        `${apiUrl}/task/update-complete-task/${id}`,
        {},
        { headers }
      );
      handleSuccess("Task Updated", response);
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === id ? { ...task, complete: !task.complete } : task
        ),
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/task/create-task`,
        { title, description },
        { headers }
      );
      handleSuccess("Task Created", response);
      setShowForm(false);
      setData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, response.data.task],
      }));
    } catch (error) {
      handleError("User should be logged in", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/task/delete-task/${id}`,
        { headers }
      );
      handleSuccess("Task Deleted", response);
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task._id !== id),
      }));
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {home === "true" && (
        <>
          <AntCard
            hoverable
            onClick={() => setShowForm(true)}
            style={{ margin: 24, textAlign: "center" }}
          >
            <PlusOutlined style={{ fontSize: 24, marginBottom: 16 }} />
            <Title level={4}>Add Task</Title>
          </AntCard>

          <Modal
            title="Create a New Task"
            open={showForm}
            onCancel={() => setShowForm(false)}
            onOk={handleAddTask}
            okText="Add"
          >
            <Input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </Modal>
        </>
      )}

      <Row gutter={[24, 24]} style={{ padding: "24px" }}>
        {Data &&
          Data.tasks &&
          Data.tasks.map((task, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <AntCard
                title={task.title}
                extra={
                  <DeleteOutlined
                    onClick={() => deleteTask(task._id)}
                    style={{ color: "#999", cursor: "pointer" }}
                  />
                }
                bordered
                style={{ borderRadius: 8 }}
              >
                <Paragraph>{task.description}</Paragraph>
                <Button
                  type="primary"
                  block
                  style={{
                    backgroundColor: task.complete ? "#52c41a" : "#722ed1",
                    borderColor: "transparent",
                    marginTop: 16,
                  }}
                  onClick={() => handleCompleteTask(task._id)}
                >
                  {task.complete ? "Complete" : "In Progress"}
                </Button>
              </AntCard>
            </Col>
          ))}
      </Row>
    </>
  );
}

export default Card;
