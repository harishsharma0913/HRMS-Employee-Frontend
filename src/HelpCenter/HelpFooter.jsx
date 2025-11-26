import { ChevronRight, Headphones } from 'lucide-react';

export default function HelpFooter() {
  const articles = [
    'How to Apply for Leave',
    'Updating Personal Information',
    'Downloading Pay Slips',
    'Attendance Marking Guide',
    'Document Upload Process'
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Popular Help Articles</h3>
      <ul className="space-y-2">
        {articles.map((article, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center p-3 bg-white border rounded-md hover:shadow cursor-pointer"
          >
            <span>{article}</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </li>
        ))}
      </ul>
      <div className="mt-6 p-4 border rounded-md bg-blue-50 hover:shadow">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-base mb-1">Still Need Help?</h4>
            <p className="text-sm">Our support team is available to help you with any questions or issues you may have.</p>
            <p className="text-sm mt-1">
              Email: <a className="text-blue-600" href="mailto:support@hrconnect.com">support@hrconnect.com</a>
            </p>
            <p className="text-sm">Phone: +1 (800) 123-4567</p>
            <p className="text-sm">Available Mon–Fri, 9 AM – 6 PM</p>
          </div>
          <Headphones className="w-10 h-10 text-blue-500" />
        </div>
      </div>
    </div>
  );
}
