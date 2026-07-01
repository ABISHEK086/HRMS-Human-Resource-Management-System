import { Layout, Menu } from "antd";
import { UserOutlined, DollarOutlined, InboxOutlined, ApartmentOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const menuItems = [
  { key: "/dashboard", icon: <UserOutlined />, label: "Me" },
  { key: "/attendance", icon: <ClockCircleOutlined />, label: "Attendance" },
  { key: "/leave", icon: <CalendarOutlined />, label: "Leave" },
  { key: "/finance", icon: <DollarOutlined />, label: "Finance" },
  { key: "/inbox", icon: <InboxOutlined />, label: "Inbox" },
  { key: "/organization", icon: <ApartmentOutlined />, label: "Organization" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider width={220} className="bg-white shadow-sm" theme="light">
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-lg font-bold text-blue-600">HRMS</span>
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="border-r-0 pt-2"
      />
    </Sider>
  );
}

export default Sidebar;