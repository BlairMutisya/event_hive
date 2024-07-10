import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EventForm = () => {
  const initialValues = {
    title: "",
    description: "",
    date: "",
    location: "",
    medium: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    category: "",
    acceptReservation: false,
    imageUrl: "", 
  };
  
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date().required("Date is required"),
    location: Yup.string().required("Location is required"),
    medium: Yup.string().required("Medium is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    maxParticipants: Yup.number().required("Max Participants is required"),
    category: Yup.string().required("Category is required"),
    acceptReservation: Yup.boolean().required("Accept Reservation is required"),
    imageUrl: Yup.string()
      .url("Must be a valid URL")
      .required("Image URL is required"),
  });
  