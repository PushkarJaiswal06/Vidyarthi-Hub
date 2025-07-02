import React from "react";
import ContactUsForm from "../../ContactPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <section className="relative py-16 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We'd love to hear from you. Please fill out this form and we'll get back to you soon.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <ContactUsForm />
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;