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

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ticket Details</h1>
        <button onClick={downloadPdf} className="bg-blue-600 text-white px-4 py-2 rounded">
          Download PDF
        </button>
      </div>

      <div ref={printRef} className="bg-white p-6 rounded shadow-md text-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center">Salka Tech</h2>
        <p><strong>Ticket Number:</strong> {ticket.ticketNumber}</p>
        <p><strong>Subject:</strong> {ticket.subject}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Client Info</h3>
          <p><strong>Name:</strong> {ticket.user.name}</p>
          <p><strong>Email:</strong> {ticket.user.email}</p>
          <p><strong>Phone:</strong> {ticket.user.phone}</p>
          <p><strong>Company:</strong> {ticket.company?.name}</p>
        </div>

        {ticket.assignedTo && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Assigned To</h3>
            <p><strong>Name:</strong> {ticket.assignedTo.name}</p>
            <p><strong>Email:</strong> {ticket.assignedTo.email}</p>
            <p><strong>Phone:</strong> {ticket.assignedTo.phone}</p>
          </div>
        )}

        {ticket.attachments?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            <ul className="list-disc pl-5">
              {ticket.attachments.map((file, i) => (
                <li key={i}>
                  <a href={file.path} download className="text-blue-600 hover:underline">
                    {file.originalname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
