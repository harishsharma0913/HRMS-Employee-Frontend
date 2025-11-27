import { Mail, Phone } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeData } from '../ReduxToolkit/authSlice';


const Profile = () => {
  const dispatch = useDispatch();
  const { employee, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmployeeData());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading profile...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 mt-10">Error loading profile: {error}</div>;
  }

  if (!employee) {
    return <div className="text-center text-red-500 mt-10">Employee not found.</div>;
  }

  return (
    <div className="p-2 max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white border-l-4 border-gray-400 text-gray-900 rounded-lg p-6 shadow-md flex flex-col sm:flex-row text-center lg:text-start items-center gap-6">
        <img
          src={
            employee?.documents?.profileImage
              ? `https://hrms-api.tipsg.in/uploads/${employee.documents.profileImage}`
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrmvSoqEMvs4E-TIgyfMdztZYEdKav-zok1A&s"
          }
          alt={employee?.fullName || "Profile"}
          className="w-32 h-32 rounded-full shadow-lg object-cover"
        />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{employee.fullName}</h2>
          <p className="text-sm sm:text-base">{employee.personalEmail}</p>
          <p className="text-sm sm:text-base font-medium mt-1">
            {employee.designation?.name || "Fresher"} —{" "}
            {employee.designation?.department?.name || "No Department"}
          </p>
          <p className="text-sm">Employee ID: {employee.employeeId || "N/A"}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-semibold shadow ${
              employee.isActive ? "bg-green-600 text-white" : "bg-red-100 text-red-600"
            }`}
          >
            {employee.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Contact + Bank Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-400">
          <h3 className="text-xl font-bold mb-3 text-blue-600">📞 Contact Information</h3>
          <p className="my-1"><Mail className="inline mr-2 w-4 text-blue-500" /> Official: {employee.officialEmail}</p>
          <p className="my-1"><Phone className="inline mr-2 w-4 text-blue-500" /> Phone: {employee.phoneNo}</p>
          <p className="my-1">📍 Address: {employee.address}</p>
        </div>

        {/* Bank Info */}
        {employee.bankDetails && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-400">
            <h3 className="text-xl font-bold mb-3 text-green-600">🏦 Bank Details</h3>
            <p className="my-1">Bank Name: {employee.bankDetails.bankName}</p>
            <p className="my-1">Account No: {employee.bankDetails.accountNumber}</p>
            <p className="my-1">IFSC: {employee.bankDetails.ifscCode}</p>
            <p className="my-1">Branch: {employee.bankDetails.branchName}</p>
          </div>
        )}
      </div>

      {/* Experience + Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience */}
        {employee.experience?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-400">
            <h3 className="text-xl font-bold mb-4 text-purple-600">💼 Experience</h3>
            <ul className="space-y-2">
              {employee.experience.map((exp, i) => (
                <li key={i}>
                  <p className="font-semibold">{exp.companyName} — {exp.designation_1}</p>
                  <p className="text-sm text-gray-600">
                    {exp.from ? new Date(exp.from).toLocaleDateString("en-IN") : "N/A"} <span className="text-gray-800 font-bold">to</span>{" "}
                    {exp.to ? new Date(exp.to).toLocaleDateString("en-IN") : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600"><span className="font-bold">•</span> Developed and maintained multiple client projects</p>
                  <p className="text-sm text-gray-600"><span className="font-bold">•</span> Improved application performance by 40%</p>
                  <p className="text-sm text-gray-600"><span className="font-bold">•</span> Collaborated with cross-functional teams</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
          <h3 className="text-xl font-bold mb-4 text-yellow-600">🛠️ Skills & Expertise</h3>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Node.js", "AWS", "Docker"].map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {["Leadership", "Communication", "Problem Solving"].map((skill) => (
                <span
                  key={skill}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



