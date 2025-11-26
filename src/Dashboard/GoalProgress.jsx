const GoalProgress = () => {
  const goals = [
    { title: "Complete React Certification", progress: 75 },
    { title: "Improve Team Collaboration", progress: 60 },
    { title: "Mentor Junior Developers", progress: 90 },
  ];

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Goal Progress</h2>
      <p className="text-sm text-gray-500 mb-6">
        Track your professional development goals
      </p>
      {goals.map((goal, index) => (
        <div key={index} className="mb-5">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>{goal.title}</span>
            <span>{goal.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalProgress;
