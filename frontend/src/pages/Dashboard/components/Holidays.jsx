import { Card, List, Typography } from "antd";
import { StarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const holidays = [
  { name: "Independence Day", date: "Aug 15" },
  { name: "Ganesh Chaturthi", date: "Aug 27" },
  { name: "Gandhi Jayanti", date: "Oct 2" },
];

function Holidays() {
  return (
    <Card
      title={
        <span>
          <StarOutlined className="mr-2 text-purple-500" />
          Holidays
        </span>
      }
      className="shadow-sm h-full"
    >
      <List
        itemLayout="horizontal"
        dataSource={holidays}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={<Text type="secondary">{item.date}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

export default Holidays;