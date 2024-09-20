import { FaDownload } from 'react-icons/fa';

const ExportCSVButton = ({tasks}) => {

  const handleExport = () => {
    const headers = ['Task ID', 'Task Name', 'Description', 'Due Date', 'Priority Level', 'Created At']; // Adjust based on your Task model
    const csvRows = [headers];

    tasks.forEach(task => {
        const row = [
            task._id,
            task.name,
            task.description,
            new Date(task.dueDate).toLocaleDateString(), // Format the date as needed
            task.priorityLevel,
            new Date(task.createdAt).toLocaleDateString(), // Assuming `timestamps: true` adds this field
        ];
        csvRows.push(row);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.csv';
    link.click();
  };

  return (
    <button className="export-button" onClick={handleExport}>
      <FaDownload style={{ marginRight: '8px' }} />
      Export CSV
    </button>
  );
};

export default ExportCSVButton;
