import React, { useState } from 'react';
import '../styles/Tasks.css'

const TaskFilters = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priorityLevel, setPriorityLevel] = useState('');

    // Handle applying the filters
    const handleFilter = (e) => {
        e.preventDefault();
        const filters = {
            name,
            description,
            dueDate,
            priorityLevel
        };

        // Pass the filter data to the parent component
        onFilter(filters);
    };

    return (
        <div className="task-filters">
            <form onSubmit={handleFilter}>
                <div className="filter-group">
                    <label htmlFor="name">Task Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        placeholder="Search by task name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        placeholder="Search by description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="priorityLevel">Priority Level</label>
                    <select
                        id="priorityLevel"
                        value={priorityLevel}
                        onChange={(e) => setPriorityLevel(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit" className="filter-button">Apply Filters</button>
            </form>
        </div>
    );
};

export default TaskFilters;
