import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DataContext from "../../context/DataContext";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Required"),
  cPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const StudentProfile = () => {
  const { loggedUser, handleProfileUpdate, handleHead, isLoading } =
    useContext(DataContext);

  useEffect(() => {
    handleHead("Student Profile");
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Student Profile
          </Typography>
          <Formik
            enableReinitialize
            initialValues={{
              name: loggedUser?.name || "",
              email: loggedUser?.email || "",
              batch: loggedUser?.batch || "",
              rollNo: loggedUser?.rollNo || "",
              password: "",
              cPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleProfileUpdate(values);
              resetForm({ values: "" });
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Full Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={values.email}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="batch"
                      label="Batch"
                      value={values.batch}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="rollNo"
                      label="Roll Number"
                      value={values.rollNo}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="cPassword"
                      label="Confirm Password"
                      type="password"
                      value={values.cPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cPassword && Boolean(errors.cPassword)}
                      helperText={touched.cPassword && errors.cPassword}
                    />
                  </Grid>

                  <Grid item xs={12} textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
