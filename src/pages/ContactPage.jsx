import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { CONTACT_INFO } from '../utils/constant';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add logic to send the contact form
        console.log('Contact form submitted:', formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>

                        <div className="space-y-6">
                            {/* Address */}
                            <div className="flex items-start">
                                <MapPinIcon className="h-6 w-6 text-indigo-600 mt-1 mr-4" />
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {CONTACT_INFO.address}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center">
                                <PhoneIcon className="h-6 w-6 text-indigo-600 mr-4" />
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">Phone & WhatsApp</h3>
                                    <p className="text-gray-600 text-sm">{CONTACT_INFO.phone}</p>
                                    <a
                                        href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hi! I have a question about your products. Can you help me?`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Chat on WhatsApp →
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center">
                                <EnvelopeIcon className="h-6 w-6 text-indigo-600 mr-4" />
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                                    <p className="text-gray-600 text-sm">{CONTACT_INFO.email}</p>
                                    <a
                                        href={`mailto:${CONTACT_INFO.email}`}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Send us an email →
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-medium text-gray-900 mb-3">Business Hours</h3>
                            <div className="text-sm text-gray-600">
                                <p>{CONTACT_INFO.businessHours.weekdays}</p>
                                <p>{CONTACT_INFO.businessHours.sunday}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors duration-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
