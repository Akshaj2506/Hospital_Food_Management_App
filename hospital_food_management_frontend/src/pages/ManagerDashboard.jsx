import { useEffect, useState } from "react"
import DashboardCard from "../components/DashboardCard"
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStaffDetails = async () => {
      await fetch("/api/auth/getAllStaff", {
        method: "GET",
        headers : {
          "auth-token": sessionStorage.getItem("auth-token") ? sessionStorage.getItem("auth-token") : ""
        }
      })
      .then(res => res.json())
      .then(data => {
        setStaff(data);
      })
    }
    const fetchPatientDetails = async () => {
      await fetch("/api/patients/fetch", {
        method: "GET",
        headers : {
          "auth-token": sessionStorage.getItem("auth-token") ? sessionStorage.getItem("auth-token") : ""
        }
      })
      .then(res => res.json())
      .then(data => {
        setPatients(data);
      })
    }
    fetchStaffDetails();
    fetchPatientDetails();
  },[])
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Deliveries"
          count={null}
          description="Total meals delivered today"
          icon="📦"
        />
        <DashboardCard
          title="Patients"
          count={patients.length}
          description="Active patients"
          icon="👩‍⚕️"
        />
        <DashboardCard
          title="Pantry Staff"
          count={staff.length}
          description="Total pantry staff"
          icon="👨‍🍳"
        />
        <DashboardCard
          title="Alerts"
          count={null}
          description="Issues in preparation/delivery"
          icon="⚠️"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Left: Patient Details */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Patient Details</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Room & Bed</th>
                <th className="p-2 border">Gender</th>
                <th className="p-2 border">Phone No.</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{patient.name}</td>
                  <td className="p-2 border">{patient.age}</td>
                  <td className="p-2 border">{patient.floorNumber}-{patient.roomNumber}{patient.bedNumber}</td>
                  <td className="p-2 border">{patient.gender}</td>
                  <td className="p-2 border">{patient.contactInfo}</td>
                  <td className="p-2 border"><button type="button" onClick={() => {navigate}} className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Update</button><button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Staff Details */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Staff Details</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((staff, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{staff.name}</td>
                  <td className="p-2 border">{staff.role}</td>
                  <td className="p-2 border">{staff.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default ManagerDashboard