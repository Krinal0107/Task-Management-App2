import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Papa from 'papaparse'

const ImportCSVButton = () => {
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleImport = (e) => {
    // const file = e.target.files[0];
    if (!file) return;

    // Parsing the CSV file using PapaParse
    Papa.parse(file, {
        header: true, // First row as headers
        complete: async (results) => {
            const { data, errors } = results;

            if (errors.length) {
                toast.error('There was an error processing the CSV file.');
                return;
            }

            // Validate required fields (name, description, dueDate, priorityLevel)
            const isValid = data.every(task => 
                task.name && task.description && task.dueDate && task.priorityLevel
            );

            if (!isValid) {
                toast.error('CSV must contain name, description, dueDate, and priorityLevel fields.');
                return;
            }

            // Submit each task to the backend
            try {
                const promises = data.map(task => 
                    axios.post(
                        `${process.env.REACT_APP_API}/api/tasks/add`,
                        { ...task },
                        {
                            headers: {
                                Authorization: token,
                            }
                        }
                    )
                );

                await Promise.all(promises);
                toast.success('All tasks added successfully');
                // navigate('/tasks');
            } catch (err) {
                if (err?.response?.data?.error.includes("User is not authorized")) {
                    localStorage.removeItem('user');
                    localStorage.clear();
                    // navigate('/login');
                } else {
                    toast.error('An error occurred while adding the tasks.');
                }
            }
        },
        error: () => {
            toast.error('Failed to parse the CSV file.');
        }
    });
};



  return (
    <div style={{display: 'flex'}}>
      <label htmlFor="file-upload" className="custom-file-upload">
        {file ? file.name : 'Choose CSV'}
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} />
      <button className="import-button" onClick={handleImport}>Import CSV</button>
    </div>
  );
};

export default ImportCSVButton;
