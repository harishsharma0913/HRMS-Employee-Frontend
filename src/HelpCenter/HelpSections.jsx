import {
  Rocket,
  CalendarCheck,
  Settings,
  FolderUp,
  Clock,
  Headphones
} from 'lucide-react';

export default function HelpSections() {
  const sections = [
    { title: 'Getting Started', desc: 'Learn the basics of HRConnect', icon: <Rocket className="text-blue-500 w-6 h-6" /> },
    { title: 'Leave Management', desc: 'Understanding leave policies and requests', icon: <CalendarCheck className="text-blue-500 w-6 h-6" /> },
    { title: 'Profile Settings', desc: 'Manage your profile and preferences', icon: <Settings className="text-blue-500 w-6 h-6" /> },
    { title: 'Document Management', desc: 'Learn about document uploads and storage', icon: <FolderUp className="text-blue-500 w-6 h-6" /> },
    { title: 'Time & Attendance', desc: 'Track time and attendance policies', icon: <Clock className="text-blue-500 w-6 h-6" /> },
    { title: 'Support & Contact', desc: 'Get in touch with HR support', icon: <Headphones className="text-blue-500 w-6 h-6" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sections.map((section, idx) => (
        <div key={idx} className="gap-3 items-start p-4 border bg-white rounded-md hover:shadow">
          {section.icon}
          <div className="mt-1">
            <h3 className="font-semibold text-lg">{section.title}</h3>
            <p className="text-sm text-gray-600">{section.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}