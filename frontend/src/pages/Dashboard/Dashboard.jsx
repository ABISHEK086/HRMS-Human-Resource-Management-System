import { Layout, Dropdown, Avatar, Typography, Card, Row, Col } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import UpcomingBirthdays from "./components/UpcomingBirthdays";
import WorkAnniversaries from "./components/WorkAnniversaries";
import TodaysLeave from "./components/TodaysLeave";
import Holidays from "./components/Holidays";
import WorkingRemotely from "./components/WorkingRemotely";

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("employee");
    if (!localStorage.getItem("token") || !stored) {
      navigate("/login");
      return;
    }
    setEmployee(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    navigate("/login");
  };

  const menuItems = [
    { key: "profile", label: "View Profile", icon: <UserOutlined /> },
    { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") handleLogout();
    if (key === "profile") navigate("/profile");
  };

  if (!employee) return null;

  return (
    <Layout className="min-h-screen">
      <Sidebar />

      <Layout>
        <Header className="flex items-center justify-between bg-white shadow px-6">
          <Title level={4} className="!mb-0 !text-blue-600">
            HRMS
          </Title>

          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              className="cursor-pointer bg-blue-600"
            />
          </Dropdown>
        </Header>

        <Content className="p-8 bg-gray-100">
          <Card className="mb-6">
            <Title level={2}>
              Welcome, {employee.first_name} {employee.last_name} 👋
            </Title>
            <p className="text-gray-600">This is your HRMS dashboard.</p>
          </Card>

          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} md={12} lg={8}>
              <UpcomingBirthdays />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <WorkAnniversaries />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <TodaysLeave />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Holidays />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <WorkingRemotely />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;