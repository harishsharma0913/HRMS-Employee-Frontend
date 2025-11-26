import { FaCalendarAlt, FaRegFileAlt, FaUsers } from "react-icons/fa";

const UpcomingEvents = () => {
  const events = [
    {
      title: "Team Standup",
      time: "Today, 9:00 AM",
      icon: <FaCalendarAlt className="text-blue-600 text-lg pt-1" />,
    },
    {
      title: "Performance Review",
      time: "Tomorrow, 2:00 PM",
      icon: <FaRegFileAlt className="text-green-600 text-lg pt-1" />,
    },
    {
      title: "All Hands Meeting",
      time: "Friday, 3:00 PM",
      icon: <FaUsers className="text-purple-600 text-lg pt-1" />,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
      <ul className="space-y-3 text-sm text-gray-700">
        {events.map((event, index) => (
          <li key={index} className="flex items-start gap-3">
            {event.icon}
            <div>
              <div className="font-medium">{event.title}</div>
              <div className="text-gray-500 text-xs">{event.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
