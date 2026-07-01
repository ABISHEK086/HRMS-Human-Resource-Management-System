import { Card, Avatar, Typography, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const onLeave = [
  { name: "Divya Nair", type: "Sick" },
  { name: "Arjun Reddy", type: "Casual" },
];

function TodaysLeave() {
  return (
    <Card
      title={
        <span>
          <CalendarOutlined className="mr-2 text-red-500" />
          Today's Leave
        </span>
      }
      className="shadow-sm h-full"
    >
      {onLeave.length === 0 ? (
        <p className="text-gray-500">No one is on leave today.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {onLeave.map((item) => (
            <div key={item.name} className="flex flex-col items-center w-16 text-center">
              <Avatar size={48}>{item.name.charAt(0)}</Avatar>
              <Text className="text-xs mt-1 leading-tight">{item.name}</Text>
              <Tag color="red" className="text-xs mt-1">{item.type}</Tag>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default TodaysLeave;