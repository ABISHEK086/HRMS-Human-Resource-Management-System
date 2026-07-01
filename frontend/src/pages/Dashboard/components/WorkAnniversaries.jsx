import { Card, Avatar, Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const anniversaries = [
  { name: "Karthik Raj", years: 3, date: "July 8" },
  { name: "Anjali Menon", years: 1, date: "July 20" },
];

function WorkAnniversaries() {
  return (
    <Card
      title={
        <span>
          <TrophyOutlined className="mr-2 text-yellow-500" />
          Work Anniversaries
        </span>
      }
      className="shadow-sm h-full"
    >
      <div className="flex flex-wrap gap-4">
        {anniversaries.map((item) => (
          <div key={item.name} className="flex flex-col items-center w-16 text-center">
            <Avatar size={48}>{item.name.charAt(0)}</Avatar>
            <Text className="text-xs mt-1 leading-tight">{item.name}</Text>
            <Text type="secondary" className="text-xs">{item.years}y · {item.date}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default WorkAnniversaries;