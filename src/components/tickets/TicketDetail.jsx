// import { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../../utils/api';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const TicketDetail = () => {
//   const { id } = useParams();
//   const [ticket, setTicket] = useState(null);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchTicket = async () => {
//       const res = await api.get(`/tickets/${id}`);
//       setTicket(res.data.data.ticket);
//     };
//     fetchTicket();
//   }, [id]);

//   const downloadPdf = async () => {
//     const element = printRef.current;
//     const canvas = await html2canvas(element);
//     const data = canvas.toDataURL('image/png');
//     const pdf = new jsPDF();
//     const imgProps = pdf.getImageProperties(data);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`Ticket-${ticket.ticketNumber}.pdf`);
//   };

//   if (!ticket) return <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Ticket Details</h1>
//         <button onClick={downloadPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
//           Download PDF
//         </button>
//       </div>

//       <div ref={printRef} className="bg-white p-6 rounded shadow-md text-gray-800">
//         <h2 className="text-xl font-bold mb-4 text-center">Salka Tech</h2>
//         <p><strong>Ticket Number:</strong> {ticket.ticketNumber}</p>
//         <p><strong>Subject:</strong> {ticket.subject}</p>
//         <p><strong>Description:</strong> {ticket.description}</p>
//         <p><strong>Status:</strong> {ticket.status}</p>
//         <p><strong>Priority:</strong> {ticket.priority}</p>
//         <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

//         <div className="mt-4">
//           <h3 className="text-lg font-semibold mb-2">Client Info</h3>
//           <p><strong>Name:</strong> {ticket.user.name}</p>
//           <p><strong>Email:</strong> {ticket.user.email}</p>
//           <p><strong>Phone:</strong> {ticket.user.phone}</p>
//           <p><strong>Company:</strong> {ticket.company?.name}</p>
//         </div>

//         {ticket.assignedTo && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold mb-2">Assigned To</h3>
//             <p><strong>Name:</strong> {ticket.assignedTo.name}</p>
//             <p><strong>Email:</strong> {ticket.assignedTo.email}</p>
//             <p><strong>Phone:</strong> {ticket.assignedTo.phone}</p>
//           </div>
//         )}

//         {ticket.attachments?.length > 0 && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold mb-2">Attachments</h3>
//             <ul className="list-disc pl-5">
//               {ticket.attachments.map((file, i) => (
//                 <li key={i}>
//                   <a href={file.path} download className="text-blue-600 hover:underline">
//                     {file.originalname}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TicketDetail;
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data.data.ticket);
    };
    fetchTicket();
  }, [id]);

  const downloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Ticket-${ticket.ticketNumber}.pdf`);
  };

  if (!ticket) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ticket Details</h1>
        <button onClick={downloadPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
          Download PDF
        </button>
      </div>

      <div ref={printRef} className="bg-white p-6 rounded shadow-md text-gray-800">
       
        <div className="mt-4">
        
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Ticket Details
          </h1>
          {/* <button 
            onClick={downloadPdf}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg
                      hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5
                      focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Download PDF
          </button> */}
        </div>

        <div 
          ref={printRef} 
          className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-white border-opacity-70
                    transform transition-all duration-300 hover:shadow-3xl relative overflow-hidden"
        >
          {/* 3D Gradient Effect Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 -ml-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-10"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                SalkaTech
              </h2>
              <div className="mt-2 h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                  <p className="text-gray-500 text-sm font-medium">Ticket Number</p>
                  <p className="text-lg font-semibold text-gray-800">{ticket.ticketNumber}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                  <p className="text-gray-500 text-sm font-medium">Subject</p>
                  <p className="text-lg font-semibold text-gray-800">{ticket.subject}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                  <p className="text-gray-500 text-sm font-medium">Status</p>
                  <p className="text-lg font-semibold">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                      ticket.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                  <p className="text-gray-500 text-sm font-medium">Priority</p>
                  <p className="text-lg font-semibold">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                  <p className="text-gray-500 text-sm font-medium">Created At</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {ticket.assignedTo && (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                    <p className="text-gray-500 text-sm font-medium">Assigned To</p>
                    <p className="text-lg font-semibold text-gray-800">{ticket.assignedTo.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
              <p className="text-gray-500 text-sm font-medium">Description</p>
              <p className="text-gray-800 mt-2">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">Client Info</h3>
                <div className="space-y-2">
                  <p><strong className="text-gray-600">Name:</strong> {ticket.user.name}</p>
                  <p><strong className="text-gray-600">Email:</strong> {ticket.user.email}</p>
                  <p><strong className="text-gray-600">Phone:</strong> {ticket.user.phone}</p>
                  <p><strong className="text-gray-600">Company:</strong> {ticket.company?.name || 'N/A'}</p>
                </div>
              </div>

              {ticket.attachments?.length > 0 && (
                <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">Attachments</h3>
                  <ul className="space-y-2">
                    {ticket.attachments.map((file, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <a 
                          href={file.path} 
                          download 
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline truncate"
                        >
                          {file.originalname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    

  );
};

export default TicketDetail;