export default function Dashboard(){
  return (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: "Active Doctors", value: 24 },
                { label: "Registered Staff", value: 42 },
                { label: "Total Patients", value: 1275 },
                { label: "Appointments Today", value: 18 },
                { label: "Revenue Collected", value: "$12,450" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center min-h-[90px] border border-gray-50  hover:text-blue-700 hover:bg-blue-50"
                 >
                  <span className="text-xl font-bold">
                    {value}
                  </span>
                  <span className="text-sm text-gray-400 font-bold mt-1 hover:text-blue-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Recent Activities Table */}
            <section className="mb-8 max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
              <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Doctor</th>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        time: "09:00 AM",
                        type: "Appointment booked",
                        doctor: "Dr. Smith",
                        patient: "John Doe",
                        notes: "Follow-up visit",
                      },
                      {
                        time: "10:30 AM",
                        type: "Payment received",
                        doctor: "-",
                        patient: "-",
                        notes: "Invoice #12345",
                      },
                      {
                        time: "11:15 AM",
                        type: "Patient registered",
                        doctor: "-",
                        patient: "Mary Johnson",
                        notes: "New patient",
                      },
                      {
                        time: "01:00 PM",
                        type: "Appointment cancelled",
                        doctor: "Dr. Lee",
                        patient: "Jane Doe",
                        notes: "Rescheduled",
                      },
                    ].map(({ time, type, doctor, patient, notes }, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{time}</td>
                        <td className="px-4 py-3">{type}</td>
                        <td className="px-4 py-3">{doctor}</td>
                        <td className="px-4 py-3">{patient}</td>
                        <td className="px-4 py-3">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </>
        )
}