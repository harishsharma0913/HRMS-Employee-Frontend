
const CompanyNews = () => {
  const news = [
    {
      title: "New Health Benefits Package",
      description: "Enhanced coverage starting January 2025",
    },
    {
      title: "Holiday Schedule Released",
      description: "Check the calendar for updated dates",
    },
    {
      title: "Q4 Results Announced",
      description: "Record-breaking quarter for the company",
    },
  ];

  return (
    <div className="bg-white border shadow-sm rounded-md p-4">
      <h2 className="text-xl font-bold mb-2">Company News</h2>
      <ul className="divide-y divide-gray-200">
        {news.map((item, index) => (
          <li key={index} className="py-3">
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyNews;
