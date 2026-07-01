import { Card, Avatar, Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const birthdays = [
  { name: "Priya Sharma", date: "July 5" },
  { name: "Rahul Verma", date: "July 9" },
  { name: "Sneha Iyer", date: "July 14" },
];

function UpcomingBirthdays() {
  return (
    <Card
      title={
        <span>
          <GiftOutlined className="mr-2 text-pink-500" />
          Upcoming Birthdays
        </span>
      }
      className="shadow-sm h-full"
    >
      <div className="flex flex-wrap gap-4">
        {birthdays.map((item) => (
          <div key={item.name} className="flex flex-col items-center w-16 text-center">
            <Avatar size={48}>{item.name.charAt(0)}</Avatar>
            <Text className="text-xs mt-1 leading-tight">{item.name}</Text>
            <Text type="secondary" className="text-xs">{item.date}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default UpcomingBirthdays;