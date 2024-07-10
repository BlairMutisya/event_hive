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
  