import React, { useState } from "react";
import { useRouter } from "next/router";
import { notifySuccess, notifyError } from "@/utils/toast";
import axios from "axios";
import Wrapper from "@/layout/wrapper";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiBriefcase, FiTrash2, FiPlus, FiUsers, FiLock } from "react-icons/fi";
import Link from "next/link";
import { API_URL } from "@/url_helper";
import AuthUser from "@/auth/authuser";
import { redirect } from "next/dist/server/api-utils";

const Registration = () => {
  const router = useRouter();
  const { step } = router.query;
  const [submitting, setSubmitting] = useState(false);
  const [contactPersons, setContactPersons] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { user } = AuthUser();

  // Main form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    gst: "",
    status: "",
    step: step || "1"
  });

  // Form errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    gst: "",
    status: ""
  });

  // Contact person form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: ""
  });

  // Contact person errors
  const [contactErrors, setContactErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: ""
  });

  const labelMap = {
    "2": {
      title: "Business Registration",
      name: "Business Name",
      email: "Business Email",
      password: "Business Password",
      mobile: "Business Mobile",
      address: "Business Address",
      gst: "Business GST (Optional)",
    },
    "3": {
      title: "Bank Registration",
      name: "Bank Name",
      email: "Bank Email",
      password: "Bank Password",
      mobile: "Bank Contact Number",
      address: "Branch Address",
      gst: "Bank GST (Optional)",
    },
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    setFormData(prev => ({ ...prev, status }));
    setErrors(prev => ({ ...prev, status: "" }));
  };

  const labels = selectedStatus ? labelMap[selectedStatus] : {};

  const validateMainForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Status validation when step is 0
    if (step === "0" && !formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    } else {
      newErrors.status = "";
    }

    // Optional fields validation
    if (formData.mobile && !/^\+?[1-9]\d{1,14}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid international mobile number";
      isValid = false;
    } else {
      newErrors.mobile = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateContactForm = () => {
    let isValid = true;
    const newErrors = { ...contactErrors };

    if (!contactForm.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!contactForm.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(contactForm.email)) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (!contactForm.mobile) {
      newErrors.mobile = "Mobile is required";
      isValid = false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(contactForm.mobile)) {
      newErrors.mobile = "Enter a valid international mobile number";
      isValid = false;
    } else {
      newErrors.mobile = "";
    }

    if (!contactForm.designation.trim()) {
      newErrors.designation = "Designation is required";
      isValid = false;
    } else {
      newErrors.designation = "";
    }

    setContactErrors(newErrors);
    return isValid;
  };


  const handleContinue = async(e) => {
    e.preventDefault();

    const payload = {
      user_id:user.user_id,
      user_type:1
    }
    
      const response = await axios.post(`${API_URL}/user/verify`, payload);


    // console.log(response.data);
    

    router.push("/");
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    if (contactErrors[name]) {
      setContactErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const addContactPerson = (e) => {
    e.preventDefault();
    // if (!validateContactForm()) return;

    if (contactPersons.length >= 5) {
      notifyError("Maximum 5 contact persons allowed");
      return;
    }

    setContactPersons([...contactPersons, contactForm]);
    setContactForm({
      name: "",
      email: "",
      mobile: "",
      designation: ""
    });
  };

  const removeContactPerson = (index) => {
    const updatedContacts = [...contactPersons];
    updatedContacts.splice(index, 1);
    setContactPersons(updatedContacts);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // if (!validateMainForm()) return;

    try {
      setSubmitting(true);

      const formType = step == "0" ? formData.status : step;

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile || null,
        address: formData.address || null,
        gst: formData.gst || null,
        user_id: user ? user.user_id : '0',
        form_type: formType,
        contact_persons: contactPersons,
      };




      const response = await axios.post(`${API_URL}/user-type/registration`, payload);

      if (response.data.success) {
        notifySuccess(response.data.message || "Registration successful");
        setFormData({
          name: "",
          email: "",
          password: "",
          mobile: "",
          address: "",
          gst: "",
          status: "",
          step: step || "1"
        });
        setContactPersons([]);
        router.push("/");
      } else {
        notifySuccess(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      notifyError(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <SEO pageTitle={selectedStatus ? labels.title : "Registration"} />
      <HeaderTwo style_2={true} />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-gray-100">
        <div className="row w-100 max-w-1000 rounded-lg overflow-hidden" style={{ minHeight: '650px' }}>
          {/* Left Section - Main Form */}
          <div className="col-12 col-lg-6 p-0 d-flex flex-column">
            <div className="flex-grow-1 p-5 bg-white">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedStatus ? labels.title : "Select Registration Type"}
                </h2>
                <p className="text-gray-600">
                  {selectedStatus ? "Please fill in your details" : "Choose the type of registration"}
                </p>
              </div>

              <form className="space-y-4 mt-2">
                {step === "0" && !selectedStatus && (
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2 mr-2">
                      <FiBriefcase className="inline mr-2" /> Registration Type
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleStatusChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ml-2 ${errors.status ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                      <option value="">Continue As Customer</option>
                      <option value="2">Business Registration</option>
                      <option value="3">Bank Registration</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    <button className="btn btn-primary m-4" onClick={(e) => handleContinue(e)}>Continue</button>

                  </div>
                )}

                {selectedStatus && (
                  <>
                    {/* Name */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiUser className="inline mr-2" /> {labels.name}
                      </label>
                      <div className="relative">
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder={`Enter ${labels.name}`}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiMail className="inline mr-2" /> {labels.email}
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder={`Enter ${labels.email}`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiLock className="inline mr-2" /> {labels.password || "Password"}
                      </label>
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="Enter your password"
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {/* Mobile */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiPhone className="inline mr-2" /> {labels.mobile}
                      </label>
                      <input
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.mobile ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder={`Enter ${labels.mobile}`}
                      />
                      {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                    </div>

                    {/* Address */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiMapPin className="inline mr-2" /> {labels.address}
                      </label>
                      <input
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder={`Enter ${labels.address}`}
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    {/* GST */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiFileText className="inline mr-2" /> {labels.gst}
                      </label>
                      <input
                        name="gst"
                        type="text"
                        value={formData.gst}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.gst ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder={`Enter ${labels.gst}`}
                      />
                      {errors.gst && <p className="mt-1 text-sm text-red-600">{errors.gst}</p>}
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Right Section - Contact Persons */}
          {selectedStatus && (
            <div className="col-12 col-lg-6 p-0 d-flex flex-column bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex-grow-1 p-5 overflow-auto">
                <div className="text-center mb-5">
                  <h3 className="text-xl font-bold text-gray-800">Contact Persons</h3>
                  <p className="text-gray-600">Add up to 5 contact persons</p>
                </div>

                <form onSubmit={addContactPerson} className="space-y-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiUser className="inline mr-2 text-blue-500" /> Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${contactErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter contact person name"
                    />
                    {contactErrors.name && <p className="mt-1 text-sm text-red-600">{contactErrors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiMail className="inline mr-2 text-blue-500" /> Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${contactErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter contact person email"
                    />
                    {contactErrors.email && <p className="mt-1 text-sm text-red-600">{contactErrors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiPhone className="inline mr-2 text-blue-500" /> Mobile No
                    </label>
                    <input
                      name="mobile"
                      type="tel"
                      value={contactForm.mobile}
                      onChange={handleContactInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${contactErrors.mobile ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter contact person mobile"
                    />
                    {contactErrors.mobile && <p className="mt-1 text-sm text-red-600">{contactErrors.mobile}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiBriefcase className="inline mr-2 text-blue-500" /> Designation
                    </label>
                    <input
                      name="designation"
                      type="text"
                      value={contactForm.designation}
                      onChange={handleContactInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${contactErrors.designation ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter designation"
                    />
                    {contactErrors.designation && <p className="mt-1 text-sm text-red-600">{contactErrors.designation}</p>}
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition duration-200 ${contactPersons.length >= 5
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    disabled={contactPersons.length >= 5}
                  >
                    <FiPlus className="mr-2" />
                    Add Contact Person {contactPersons.length > 0 && `(${contactPersons.length}/5)`}
                  </button>
                </form>

                {contactPersons.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FiUsers className="mr-2 text-indigo-600" />
                      Added Contacts
                    </h5>

                    <div className="relative">
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

                      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedStatus && (
        <div className="bg-white border-t border-gray-200 text-center max-w-1000 rounded-lg overflow-hidden">
          <button
            onClick={onSubmit}
            className="w-full btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      )}

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default Registration;