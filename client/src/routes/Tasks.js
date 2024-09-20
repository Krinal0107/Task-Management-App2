import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoTask from '../components/NoTask';
import Loading from '../components/Loading';
import AllTasks from '../components/AllTasks';
import TaskFilters from '../components/TaskFilters'; // Import the TaskFilters component
import '../styles/Tasks.css';
import ImportCSVButton from '../components/ImportCSVButton';
import ExportCSVButton from '../components/ExportCSVButton';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]); // Add filtered tasks state
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) navigate('/login');

    const token = user.token;

    useEffect(() => {
        const getTasks = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/tasks/all`, {
                    headers: {
                        Authorization: token,
                    }
                });

                const userTasks = res.data.tasks;
                setTasks(userTasks);
                setFilteredTasks(userTasks); // Set filtered tasks initially to all tasks
                setIsLoading(false);

            } catch (error) {
                if (error.response.data.error === "User is not authorized, try logging in again" || error.response.data.error === "User is not authorized and no token, try logging in") {
                    localStorage.removeItem('user');
                    localStorage.clear();
                    navigate('/login');
                } else {
                    setIsLoading(true);
                }
            }
        }

        getTasks();
    }, [token, navigate]);

    // Filter handler passed to TaskFilters component
    const handleFilter = (filters) => {
        const { name, description, dueDate, priorityLevel } = filters;
        let filtered = tasks;

        if (name) {
            filtered = filtered.filter(task => task.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (description) {
            filtered = filtered.filter(task => task.description.toLowerCase().includes(description.toLowerCase()));
        }

        if (dueDate) {
            filtered = filtered.filter(task => new Date(task.dueDate).toLocaleDateString() === new Date(dueDate).toLocaleDateString());
        }

        if (priorityLevel) {
            filtered = filtered.filter(task => task.priorityLevel === priorityLevel);
        }

        setFilteredTasks(filtered);
    };

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : tasks.length > 0 ? (
                <>
                    <div className="task-actions">
                        <ExportCSVButton tasks={tasks} />
                        <ImportCSVButton />
                    </div>

                    {/* Task Filters */}
                    <TaskFilters onFilter={handleFilter} />

                    {/* Display filtered tasks */}
                    <AllTasks tasks={filteredTasks} />
                </>
            ) : (
                <NoTask />
            )}
        </>
    );
}

export default Tasks;
