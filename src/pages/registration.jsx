import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { notifySuccess, notifyError } from "@/utils/toast";
import axios from "axios";
import Wrapper from "@/layout/wrapper";
import ErrorMsg from "@/components/common/error-msg";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiBriefcase, FiTrash2, FiPlus, FiUsers } from "react-icons/fi";
import Link from "next/link";

// Validation schema for main form
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid international mobile number"),
  address: Yup.string().required("Address is required"),
  gst: Yup.string().nullable(),
});

// Validation schema for contact persons
const contactPersonSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid international mobile number"),
  designation: Yup.string().required("Designation is required"),
});

const Registration = () => {
  const router = useRouter();
  const { step } = router.query;
  const [submitting, setSubmitting] = useState(false);
  const [contactPersons, setContactPersons] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Form for contact persons
  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    reset: resetContact,
    formState: { errors: contactErrors },
  } = useForm({
    resolver: yupResolver(contactPersonSchema),
  });

  // Dynamic label map
  const labelMap = {
    default: {
      title: "User Registration",
      name: "Name",
      email: "Email",
      mobile: "Mobile",
      address: "Address",
      gst: "GST (Optional)",
    },
    "2": {
      title: "Business Registration",
      name: "Business Name",
      email: "Business Email",
      mobile: "Business Mobile",
      address: "Business Address",
      gst: "Business GST (Optional)",
    },
    "3": {
      title: "Bank Registration",
      name: "Bank Name",
      email: "Bank Email",
      mobile: "Bank Contact Number",
      address: "Branch Address",
      gst: "Bank GST (Optional)",
    },
  };

  const labels = labelMap[step] || labelMap.default;

  const addContactPerson = (data) => {
    if (contactPersons.length >= 5) {
      notifyError("Maximum 5 contact persons allowed");
      return;
    }
    setContactPersons([...contactPersons, data]);
    resetContact();
  };

  const removeContactPerson = (index) => {
    const updatedContacts = [...contactPersons];
    updatedContacts.splice(index, 1);
    setContactPersons(updatedContacts);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        address: data.address,
        gst: data.gst || null,
        form_type: step,
        contact_persons: contactPersons,
      };

      console.log(payload);
      

      const response = await axios.post("http://localhost:8888/api/registration/store", payload);
      notifySuccess(response.data.message || "Registration successful");
      reset();
      setContactPersons([]);
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      notifyError(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <SEO pageTitle={labels.title} />
      <HeaderTwo style_2={true} />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-gray-100">
        <div className="row w-100 max-w-1000 rounded-lg overflow-hidden" style={{ minHeight: '650px' }}>
          {/* Left Section - Main Form */}
          <div className="col-12 col-lg-6 p-0 d-flex flex-column">
            <div className="flex-grow-1 p-5 bg-white">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">{labels.title}</h2>
                <p className="text-gray-600">Please fill in your details</p>
              </div>
              
              <form className="space-y-4">
                {/* Name */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUser className="inline mr-2" /> {labels.name}
                  </label>
                  <div className="relative">
                    <input
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={`Enter ${labels.name}`}
                    />
                  </div>
                  <ErrorMsg msg={errors.name?.message} />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMail className="inline mr-2" /> {labels.email}
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Enter ${labels.email}`}
                  />
                  <ErrorMsg msg={errors.email?.message} />
                </div>

                {/* Mobile */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiPhone className="inline mr-2" /> {labels.mobile}
                  </label>
                  <input
                    {...register("mobile")}
                    type="tel"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Enter ${labels.mobile}`}
                  />
                  <ErrorMsg msg={errors.mobile?.message} />
                </div>

                {/* Address */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMapPin className="inline mr-2" /> {labels.address}
                  </label>
                  <input
                    {...register("address")}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Enter ${labels.address}`}
                  />
                  <ErrorMsg msg={errors.address?.message} />
                </div>

                {/* GST */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiFileText className="inline mr-2" /> {labels.gst}
                  </label>
                  <input
                    {...register("gst")}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.gst ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Enter ${labels.gst}`}
                  />
                  <ErrorMsg msg={errors.gst?.message} />
                </div>
              </form>

                  
            </div>
          </div>

          {/* Right Section - Contact Persons */}
          <div className="col-12 col-lg-6 p-0 d-flex flex-column bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex-grow-1 p-5 overflow-auto">
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">Contact Persons</h3>
                <p className="text-gray-600">Add up to 5 contact persons</p>
              </div>
              
              {/* Form to add new contact person */}
              <form onSubmit={handleSubmitContact(addContactPerson)} className="space-y-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUser className="inline mr-2 text-blue-500" /> Name
                  </label>
                  <input
                    {...registerContact("name")}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      contactErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter contact person name"
                  />
                  <ErrorMsg msg={contactErrors.name?.message} />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMail className="inline mr-2 text-blue-500" /> Email
                  </label>
                  <input
                    {...registerContact("email")}
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      contactErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter contact person email"
                  />
                  <ErrorMsg msg={contactErrors.email?.message} />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiPhone className="inline mr-2 text-blue-500" /> Mobile No
                  </label>
                  <input
                    {...registerContact("mobile")}
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      contactErrors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter contact person mobile"
                  />
                  <ErrorMsg msg={contactErrors.mobile?.message} />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiBriefcase className="inline mr-2 text-blue-500" /> Designation
                  </label>
                  <input
                    {...registerContact("designation")}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      contactErrors.designation ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter designation"
                  />
                  <ErrorMsg msg={contactErrors.designation?.message} />
                </div>

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition duration-200 ${
                    contactPersons.length >= 5
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                  disabled={contactPersons.length >= 5}
                >
                  <FiPlus className="mr-2" />
                  Add Contact Person {contactPersons.length > 0 && `(${contactPersons.length}/5)`}
                </button>
              </form>

              {/* List of added contact persons */}
{contactPersons.length > 0 && (
  <div className="mt-6">
    <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
      <FiUsers className="mr-2 text-indigo-600" />
      Added Contacts
    </h5>
    
    <div className="relative">
      {/* Horizontal scroll container */}
      <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
        {contactPersons.map((person, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-72"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                  <FiUser className="text-indigo-600 text-lg" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 text-lg truncate">{person.name}</h4>
                  <p className="text-indigo-700 font-medium text-sm truncate">{person.designation}</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMail className="mr-2 text-indigo-500 flex-shrink-0" />
                      <Link 
                        href={`mailto:${person.email}`} 
                        className="hover:text-indigo-600 hover:underline truncate block"
                        title={person.email}
                      >
                        {person.email}
                      </Link>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="mr-2 text-indigo-500 flex-shrink-0" />
                      <Link 
                        href={`tel:${person.mobile}`} 
                        className="hover:text-indigo-600 hover:underline truncate block"
                        title={person.mobile}
                      >
                        {person.mobile}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeContactPerson(index)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                title="Remove contact"
              >
                <FiTrash2 className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Optional scroll indicators (only visible when scrollable) */}
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  </div>
)}

            </div>

            {/* Single Register Button at the bottom */}
      
          </div>
          
        </div>
        
      </div>
  <div className="bg-white border-t border-gray-200 text-center max-w-1000  rounded-lg overflow-hidden">
              <button
                onClick={handleSubmit(onSubmit)}
                className="w-full btn btn-primary btn-lg"
                disabled={submitting}
              >
                {/* {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : ( */}
                  Complete Registration
                {/* )} */}
              </button>
            </div>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default Registration;    