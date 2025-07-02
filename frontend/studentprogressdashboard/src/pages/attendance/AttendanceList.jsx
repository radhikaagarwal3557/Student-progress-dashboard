import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export const AbsentList = ({ data }) => {
  const currentDate = dayjs(new Date()).format('DD/MMM/YYYY');

  // Normalize and compare dates
  const currentAbsenteeData = data?.find(
    (arr) => dayjs(arr.date).format('DD/MMM/YYYY') === currentDate
  );

  return (
    <Box sx={{ height: '320px', overflow: 'auto' }}>
      {currentAbsenteeData ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAbsenteeData?.absentees?.length > 0 ? (
              currentAbsenteeData.absentees.map((absentee, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body1" component="span">
                      {absentee?.rollno || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" component="span">
                      {absentee?.name || 'Unnamed'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography>No absentees today!</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <Typography>No Attendance Data Found</Typography>
      )}
    </Box>
  );
};

// ✅ PropTypes for validation
AbsentList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      absentees: PropTypes.arrayOf(
        PropTypes.shape({
          rollno: PropTypes.string,
          name: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};
