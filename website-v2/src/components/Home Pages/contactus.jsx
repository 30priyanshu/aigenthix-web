import React, { useState } from 'react';
import { contactService } from '../../services/contactService';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

import SEO from "../SEO";

const ContactUs = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyEmail: '',
        companyName: '',
        jobTitle: '',
        phoneNumber: '',
        country: '',
        comments: '',
        agreeToTerms: false,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // State for submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await contactService.submitContactForm(formData);

            setSubmitStatus('success');

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                companyEmail: '',
                companyName: '',
                jobTitle: '',
                phoneNumber: '',
                country: '',
                comments: '',
                agreeToTerms: false,
            });
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Define the steps for "Get Started Today"
    const steps = [
        {
            number: 1,
            title: "Contact Us",
            icon: (
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            number: 2,
            title: "Get a Consultation",
            icon: (
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            number: 3,
            title: "Get a Cost Estimate",
            icon: (
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
        {
            number: 4,
            title: "Project Kickoff",
            icon: (
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V3m0 2v11m-4 5h8a2 2 0 002-2v-1a2 2 0 00-2-2H8a2 2 0 00-2 2v1a2 2 0 002 2z" />
                </svg>
            )
        },
    ];

    // Placeholder for countries - replace with a real list or API call
    const countries = [
        "Select a country*",
        "United States", "Canada", "United Kingdom", "Australia", "Germany", "India", "Other"
    ];

    return (
        
        // Add pt-24 (padding-top) to account for fixed navbar
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-serif italic font-semibold text-black mb-6">
                        Get Started Today
                    </h1>
                </div>



                {/* Steps Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {steps.map((step) => (
                        <div key={step.number} className="text-center">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg inline-flex mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {step.number}. {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Form Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4 text-center">
                        Transform Your Vision into Reality
                    </h2>
                    <p className="text-center text-gray-600 font-serif font-bold mb-10 max-w-2xl mx-auto">
                        Let's discuss your ideas. We will send you an NDA before we talk. All the information is kept confidential.
                    </p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* First Name */}
                        <div>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name*"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name*"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        {/* Company Email */}
                        <div>
                            <input
                                type="email"
                                id="companyEmail"
                                name="companyEmail"
                                value={formData.companyEmail}
                                onChange={handleChange}
                                placeholder="Company Email*"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        {/* Company Name */}
                        <div>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Company Name*"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        {/* Job Title */}
                        <div>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="Job Title*"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        {/* Select Country */}
                        <div className="md:col-span-2">
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                            >
                                {countries.map((country, idx) => (
                                    <option key={idx} value={country === "Select a country*" ? "" : country} disabled={country === "Select a country*"}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Comments */}
                        <div className="md:col-span-2">
                            <textarea
                                id="comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                placeholder="Comments*"
                                rows="5"
                                maxLength="500"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.comments.length} of 500 max characters
                            </p>
                        </div>
                        {/* Terms and Conditions Checkbox */}
                        <div className="md:col-span-2 flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                           <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
  I agree to the{" "}
  <Link to="/terms-of-use" className="text-blue-600 hover:underline">
    Terms of Use
  </Link>{" "}
  and{" "}
  <Link to="/privacy-policy" className="text-blue-600 hover:underline">
    Privacy Policy
  </Link>.
</label>

                        </div>
                        {/* Submit Button */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Start a conversation'}
                            </button>
                        </div>
                        {submitStatus === 'success' && (
                            <div className="md:col-span-2 text-green-700 text-sm font-medium">
                                Thank you. Your message has been submitted successfully.
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="md:col-span-2 text-red-700 text-sm font-medium">
                                We could not submit your request right now. Please try again shortly.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;