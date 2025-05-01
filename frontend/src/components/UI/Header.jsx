import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Drawer, Button, Layout, Space, Typography } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

const { Header: AntHeader } = Layout;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <AntHeader style={{ background: "#fff", boxShadow: "0 2px 8px #f0f1f2", padding: "0 24px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link to="/login">
          <img
            src={logo}
            alt="logo"
            style={{
              height: 40,
              filter:
                "invert(6%) sepia(95%) saturate(6097%) hue-rotate(307deg) brightness(60%) contrast(102%)",
            }}
          />
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: "none", gap: 24, alignItems: "center" }}>
          <NavLink to="/" text="All Task" icon={<AppstoreOutlined />} />
          <Space size="middle">
            {isAuthenticated ? (
              <NavLink to="/logout" text="Logout" icon={<LogoutOutlined />} />
            ) : (
              <>
                <NavLink to="/signup" text="Sign Up" icon={<UserAddOutlined />} />
                <NavLink to="/login" text="Login" icon={<LoginOutlined />} />
              </>
            )}
          </Space>
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={toggleMenu}
          className="mobile-menu-btn"
        />
      </div>

      {/* Drawer for mobile nav */}
      <Drawer
        title="Menu"
        placement="right"
        closable
        onClose={toggleMenu}
        open={isOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu mode="vertical" onClick={toggleMenu}>
          <Menu.Item key="home">
            <Link to="/">All Task</Link>
          </Menu.Item>
          {isAuthenticated ? (
            <Menu.Item key="logout">
              <Link to="/logout">Log Out</Link>
            </Menu.Item>
          ) : (
            <>
              <Menu.Item key="signup">
                <Link to="/signup">Sign Up</Link>
              </Menu.Item>
              <Menu.Item key="login">
                <Link to="/login">Login</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Drawer>
    </AntHeader>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    style={{
      display: "flex",
      alignItems: "center",
      color: "#333",
      fontWeight: 500,
      transition: "color 0.3s",
    }}
  >
    <span style={{ marginRight: 8 }}>{icon}</span>
    {text}
  </Link>
);

export default Header;
