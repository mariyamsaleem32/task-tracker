import React, { useEffect, useState } from "react";
import { Layout, Typography } from "antd";
import Header from "../UI/Header";
import Footer from "../UI/Footer";
import Card from "../UI/Card";
import axios from "axios";

const { Content, Footer: AntFooter } = Layout;
const { Title } = Typography;

const apiUrl = import.meta.env.BACKEND_API;

function TaskDashboard() {
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

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Header />
      <Content style={{ padding: "2rem" }}>
        {Data && (
          <Title level={2} style={{ textAlign: "center", marginBottom: "2rem" }}>
            {`Welcome ${Data.name} On Task Management Board`}
          </Title>
        )}
        <Card home={"true"} />
      </Content>
      <AntFooter style={{ textAlign: "center" }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
}

export default TaskDashboard;
