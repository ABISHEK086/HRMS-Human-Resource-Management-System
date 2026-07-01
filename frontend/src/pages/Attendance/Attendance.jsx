import { useEffect, useState } from "react";
import { Layout, Card, Button, Table, Typography, message, Tag } from "antd";
import { ClockCircleOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Sidebar from "../Dashboard/components/Sidebar";
import { checkIn, checkOut, getMyAttendance, getTodayAttendance } from "../../api";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function Attendance() {
  const navigate = useNavigate();
  const [today, setToday] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getTodayAttendance(token).then(setToday).catch(() => {});
    getMyAttendance(token).then(setRecords).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await checkIn(token);
      message.success("Checked in successfully");
      loadData();
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await checkOut(token);
      message.success("Checked out successfully");
      loadData();
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Check In",
      dataIndex: "check_in",
      key: "check_in",
      render: (val) => (val ? dayjs(val).format("hh:mm A") : "—"),
    },
    {
      title: "Check Out",
      dataIndex: "check_out",
      key: "check_out",
      render: (val) => (val ? dayjs(val).format("hh:mm A") : "—"),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.check_out ? (
          <Tag color="green">Complete</Tag>
        ) : record.check_in ? (
          <Tag color="blue">In Progress</Tag>
        ) : (
          <Tag>—</Tag>
        ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="flex items-center bg-white shadow px-6">
          <Title level={4} className="!mb-0 !text-blue-600">
            Attendance
          </Title>
        </Header>

        <Content className="p-8 bg-gray-100">
          <Card className="mb-6 shadow-sm max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary">
                  <ClockCircleOutlined className="mr-2" />
                  Today — {dayjs().format("dddd, MMMM D, YYYY")}
                </Text>
                <div className="mt-2">
                  {today?.check_in ? (
                    <Text>Checked in at {dayjs(today.check_in).format("hh:mm A")}</Text>
                  ) : (
                    <Text type="secondary">Not checked in yet</Text>
                  )}
                  {today?.check_out && (
                    <Text className="block">
                      Checked out at {dayjs(today.check_out).format("hh:mm A")}
                    </Text>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={handleCheckIn}
                  loading={loading}
                  disabled={today?.check_in}
                >
                  Check In
                </Button>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleCheckOut}
                  loading={loading}
                  disabled={!today?.check_in || today?.check_out}
                >
                  Check Out
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Attendance History" className="shadow-sm">
            <Table
              dataSource={records}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 7 }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Attendance;