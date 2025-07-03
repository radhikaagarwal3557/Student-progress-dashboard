import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import BarChart from '../../components/chart/BarChart';
import DataContext from '../../context/DataContext';

const StudentDashboard = () => {
    const {
        loggedUser,
        fetchAssignments,
        assignments,
        setAssignments
    } = useContext(DataContext);

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        fetchAssignments();
    }, []);

    useEffect(() => {
        if (assignments.length) {
            setChartData({
                labels: assignments.map((data) => `Assignment-${data.id}`),
                datasets: [{
                    label: "Assignment Score",
                    data: assignments.map((data) => data.score),
                    backgroundColor: "#4b0dba"
                }]
            });
        }
    }, [assignments]);

    return (
        <Box sx={{ p: 3 }}>
            {/* Assignment Chart */}
            <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
                <Typography variant="h5" align="center" gutterBottom>Assignment Progress</Typography>
                {assignments.length > 0 ? <BarChart chartData={chartData} /> : <Typography>No assignment data available.</Typography>}
            </Paper>

            {/* Attendance Overview */}
            <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
                <Grid container spacing={2} textAlign="center">
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">Total Days</Typography>
                            <Typography variant="h6">{loggedUser.totalDays || 0}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">Days Present</Typography>
                            <Typography variant="h6">{loggedUser.presentDays || 0}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">Attendance %</Typography>
                            <Typography variant="h6">
                                {loggedUser.totalDays ? `${Math.round((loggedUser.presentDays / loggedUser.totalDays) * 100)}%` : "N/A"}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            {/* Subject-Teacher Table */}
            <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Subjects & Teachers</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell>Teacher</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loggedUser.subjects?.length > 0 ? (
                                loggedUser.subjects.map((subj, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{subj.name}</TableCell>
                                        <TableCell>{subj.teacherName}</TableCell>
                                        <TableCell>{subj.teacherEmail}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={3}>No subjects assigned.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Result Summary */}
            <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Exam Results</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell>Marks</TableCell>
                                <TableCell>Grade</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loggedUser.results?.length > 0 ? (
                                loggedUser.results.map((res, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{res.subject}</TableCell>
                                        <TableCell>{res.marks}</TableCell>
                                        <TableCell>{res.grade}</TableCell>
                                        <TableCell sx={{ color: res.status === "Pass" ? 'green' : 'red' }}>{res.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4}>No results available.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default StudentDashboard;
