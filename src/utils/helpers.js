export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};



// export const formatDateTime = (dateString) => {
//   const date = new Date(dateString);
//   const options = {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   };
//   return date.toLocaleString('en-US', options);
// };

export const generateDummyCSV = (tickets) => {
  const headers = ['ID,Title,Status,Priority,Company,Created At'];
  const rows = tickets.map(ticket => 
    `${ticket.id},${ticket.title},${ticket.status},${ticket.priority},${ticket.company},${ticket.createdAt}`
  );
  return [...headers, ...rows].join('\n');
};

export const downloadFile = (content, fileName, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};