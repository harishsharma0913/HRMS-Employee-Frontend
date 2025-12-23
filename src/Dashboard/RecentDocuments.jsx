import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getFileType = (fileName) => {
  if (!fileName) return "";
  return fileName.split(".").pop().toUpperCase();
};

const RecentDocuments = ({ documents = {} }) => {
  /* 🔹 Convert object → array */
  let docsArray = [];
  const navigate = useNavigate();

  // 🔹 Profile / Aadhar / PAN
  Object.entries(documents).forEach(([key, value]) => {
    if (key === "marksheets") return;

    if (value) {
      docsArray.push({
        name: key.replace(/([A-Z])/g, " $1"),
        file: value,
        type: getFileType(value),
      });
    }
  });

  // 🔹 Marksheets
  if (documents.marksheets) {
    Object.entries(documents.marksheets).forEach(
      ([key, value]) => {
        if (value) {
          docsArray.push({
            name: `${key.toUpperCase()} Marksheet`,
            file: value,
            type: getFileType(value),
          });
        }
      }
    );
  }

  // 🔹 Latest 3 only
  const recentDocs = docsArray.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-l-4 border-l-purple-500 border-gray-200 p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-purple-700 font-semibold">
          <FileText size={18} />
          <span>Recent Documents</span>
        </div>
        <button
         onClick={() => navigate("/documents")}
         className="text-sm text-purple-600 hover:underline">
          View All
        </button>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        {recentDocs.length === 0 && (
          <p className="text-sm text-gray-400">
            No documents uploaded
          </p>
        )}

        {recentDocs.map((doc, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-sm font-medium capitalize">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-400">
                  {doc.type}
                </p>
              </div>
            </div>
            
           <a
            href={`https://hrms-api.tipsg.in/uploads/${doc.file}`}
            target="_blank"
            className="text-xs text-purple-600 hover:underline"
           >
          View
          </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDocuments;
