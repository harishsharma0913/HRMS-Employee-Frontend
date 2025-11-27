import { useEffect, useState } from "react";
import { Search, Filter, FileText, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeData } from "../ReduxToolkit/authSlice";
import { useToast } from "../Toast/ToastProvider";

const categories = [
  { label: "Work Documents", count: 24 },
  { label: "Company Policies", count: 15 },
  { label: "Forms & Templates", count: 32 },
  { label: "Approvals", count: 8 },
];

const Documents = () => {
  const [search, setSearch] = useState("");
  const [Documents, setDocuments] = useState(null);
    const { showToast } = useToast();

    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.auth);

    useEffect(() => {
    dispatch(fetchEmployeeData());
    }, [dispatch]);

     useEffect(() => {
     if (employee?.documents) {
      setDocuments(employee.documents);
      }
       }, [employee]);


    if (!Documents) {
     return <div className="text-center mt-10 text-gray-500">Loading documents...</div>;
     }
    
      const handleDownload = async (fileName) => {
  try {
    const response = await fetch(`https://hrms-api.tipsg.in/uploads/${encodeURIComponent(fileName)}`);

    if (!response.ok) {
      showToast("File Not Uploaded","info")
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    showToast("Failed to download file: " + error.message,"error")
    console.error(error);
  }
};
  return (
    <div className="p-2 space-y-4">
      {/* Search + Filter */}
      <div className="flex gap-4">
        <div className="flex items-center bg-white border rounded px-3 py-2 w-full">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search documents..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 text-white font-semibold rounded-[4px] flex items-center gap-2 bg-blue-500 hover:bg-blue-400">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <div key={index} className="lg:flex md:text-center p-4  bg-white border rounded shadow hover:shadow-md transition">
            <div className="flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="lg:flex-1 ms-2">
              <h4 className="font-medium text-center lg:text-left ">{cat.label}</h4>
              <p className="text-sm text-gray-500 text-center lg:text-left">{cat.count} Documents</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-3">Documents</h3>
        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">10th Marksheet</h4>
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
               <button title="Download" onClick={() => handleDownload(Documents.marksheets.ten)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2 hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>

        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">Twelth Marksheet</h4> 
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
                <button title="Download" onClick={() => handleDownload(Documents.marksheets.twel)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2 hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>

        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">Graduate Marksheet</h4>
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
                <button title="Download" onClick={() => handleDownload(Documents.marksheets.ug)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2 hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>

        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">Post Graduate Marksheet</h4>
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
                <button title="Download" onClick={() => handleDownload(Documents.marksheets.pg)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2  hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>
      </div>

      

      {/* Important Documents */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-3">Important Documents</h3>

        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">Aadhar Card</h4>
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
                <button title="Download" onClick={() => handleDownload(Documents.aadhar)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2  hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>

        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">Pan Card</h4>
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
                <button title="Download" onClick={() => handleDownload(Documents.pan)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2  hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>

        <div className="bg-white rounded border divide-y hover:shadow-md transition">
            <div className="flex items-center px-4 py-3">
                <FileText className="w-5 h-5 text-blue-800" />
              <div className="flex-1 ml-3">
                <h4 className="font-medium">Resume</h4>
                <p className="text-sm text-gray-500">
                  jpg • 2.4 MB • 26 Sep 2023
                </p>
              </div>
              <div className="text-gray-400 flex gap-6">
                <button title="Download" onClick={() => handleDownload(Documents.resume)} >
                  <Download className="w-9 h-9 text-gray-600 rounded-full p-2  hover:bg-blue-500 hover:text-white" />
                </button>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Documents;