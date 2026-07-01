import { Card, Avatar, Typography, Tag } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Text } = Typography;

const remoteToday = [
  { name: "Meera Pillai" },
  { name: "Vikram Singh" },
  { name: "Aditi Rao" },
];

function WorkingRemotely() {
  return (
    <Card
      title={
        <span>
          <HomeOutlined className="mr-2 text-green-500" />
          Working Remotely
        </span>
      }
      className="shadow-sm h-full"
    >
      {remoteToday.length === 0 ? (
        <p className="text-gray-500">No one is remote today.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {remoteToday.map((item) => (
            <div key={item.name} className="flex flex-col items-center w-16 text-center">
              <Avatar size={48}>{item.name.charAt(0)}</Avatar>
              <Text className="text-xs mt-1 leading-tight">{item.name}</Text>
              <Tag color="green" className="text-xs mt-1">Remote</Tag>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default WorkingRemotely;