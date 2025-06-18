import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import AuthUser from "@/auth/authuser";

// schema
const schema = Yup.object().shape({
  contact_us_name: Yup.string().required().label("Name"),
  contact_us_email: Yup.string().required().email().label("Email"),
  contact_us_subject: Yup.string().required().label("Subject"),
  contact_us_message: Yup.string().required().label("Subject"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const ContactForm = () => {

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const {http} = AuthUser();
    const onSubmit = (data) => {
      http
      .post("/contact_us/store", data)
      .then((res) => {
        if (res.data.status == 1) {
          notifySuccess(res.data.message);
        } else {
          throw new Error("Failed to send message");
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        notifyError("Failed to send message. Please try again later.");
      });  
      reset();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("contact_us_name", { required: `Name is required!` })} name="contact_us_name" id="contact_us_name" type="text" placeholder="Shahnewaz Sakil" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">Your Name</label>
          </div>
          <ErrorMsg msg={errors.contact_us_name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("contact_us_email", { required: `Email is required!` })} name="contact_us_email" id="contact_us_email" type="email" placeholder="shofy@mail.com" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.contact_us_email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("contact_us_subject", { required: `Subject is required!` })} name="contact_us_subject" id="contact_us_subject" type="text" placeholder="Write your subject" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="subject">Subject</label>
          </div>
          <ErrorMsg msg={errors.contact_us_subject?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("contact_us_message", { required: `Message is required!` })} id="contact_us_message" name="contact_us_message" placeholder="Write your message here..."/>
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">Your Message</label>
          </div>
          <ErrorMsg msg={errors.contact_us_message?.message} />
        </div>
      </div>
      <div className="tp-contact-suggetions mb-20">
        <div className="tp-contact-remeber">
          <input  {...register("remember", {required: `Terms and Conditions is required!`})} name="remember" id="remember" type="checkbox" />
          <label htmlFor="remember">Save my name, email, and website in this browser for the next time I comment.</label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <div className="tp-contact-btn">
        <button type="submit">Send Message</button>
      </div>
    </form>
  );
};

export default ContactForm;