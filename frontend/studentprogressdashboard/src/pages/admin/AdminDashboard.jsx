import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import BarChart from "../../components/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ADMIN DASHBOARD" subtitle="Monitor & Manage Student LMS" />
        <Button
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: "#fff",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
          onClick={() => navigate("/admin/reports")}
        >
          View Reports
        </Button>
      </Box>

      {/* STATS OVERVIEW */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box gridColumn="span 3" bgcolor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title="120" subtitle="Total Students" progress="0.85" increase="+10%" icon={<PeopleIcon sx={{ color: colors.greenAccent[600], fontSize: 26 }} />} />
        </Box>

        <Box gridColumn="span 3" bgcolor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title="12" subtitle="Teachers Assigned" progress="0.65" increase="+3%" icon={<SchoolIcon sx={{ color: colors.greenAccent[600], fontSize: 26 }} />} />
        </Box>

        <Box gridColumn="span 3" bgcolor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title="25" subtitle="Subjects" progress="0.75" increase="+5%" icon={<AssignmentIcon sx={{ color: colors.greenAccent[600], fontSize: 26 }} />} />
        </Box>

        <Box gridColumn="span 3" bgcolor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title="85%" subtitle="Avg Attendance" progress="0.85" increase="+2%" icon={<CalendarTodayIcon sx={{ color: colors.greenAccent[600], fontSize: 26 }} />} />
        </Box>

        {/* ASSIGNMENT PERFORMANCE */}
        <Box gridColumn="span 8" gridRow="span 2" bgcolor={colors.primary[400]}>
          <Box mt="25px" px="30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={600} color={colors.grey[100]}>
                Assignment Performance
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                Weekly Overview
              </Typography>
            </Box>
          </Box>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* RECENT STUDENT LOGS */}
        <Box gridColumn="span 4" gridRow="span 2" bgcolor={colors.primary[400]} p="20px" overflow="auto">
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
            Recent Activity Logs
          </Typography>
          <Typography variant="body2" color={colors.grey[300]} lineHeight={2}>
            • 👩‍🎓 John registered for "Java Basics"<br />
            • 📘 Priya submitted "Assignment 4"<br />
            • 🎯 Rahul scored 89 in "Math Test"<br />
            • 🗓️ Sneha marked present on July 3<br />
            • ✏️ Admin added subject "DSA"
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
