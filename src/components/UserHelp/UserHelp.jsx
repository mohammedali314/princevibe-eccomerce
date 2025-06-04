import React, { useState, useEffect } from 'react';
import { 
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  LifebuoyIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CubeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import './UserHelp.scss';

const UserHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const faqData = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and choose a payment method."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD) for customers in Pakistan."
    },
    {
      id: 3,
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email Or phone call. You can also check your order status in the 'My Orders' section of your account."
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn items in original condition. Please contact our support team to initiate a return."
    },
    {
      id: 5,
      question: "How long does shipping take?",
      answer: "Standard shipping within Pakistan takes 3-7 business days. Express shipping is available for 1-3 business days at an additional cost."
    },
    {
      id: 6,
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 24 hours of placement. After this period, please contact our support team for assistance."
    },
    {
      id: 7,
      question: "How do I create an account?",
      answer: "Click on the 'Sign Up' button in the top navigation, fill in your details, and verify your email address to complete registration."
    },
    {
      id: 8,
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your personal and payment information."
    }
  ];

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@princevibe.com",
      responseTime: "Response within 24 hours",
      action: "Send Email",
      href: "mailto:support@princevibe.com"
    },
    {
      icon: PhoneIcon,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+92 300 123 4567",
      responseTime: "Mon-Fri, 9 AM - 6 PM",
      action: "Call Now",
      href: "tel:+923001234567"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Not Available Now",
      responseTime: "Will be available soon",
      action: "Not Available",
      href: "#"
    }
  ];

  const additionalResources = [
    {
      icon: BookOpenIcon,
      title: "User Guide",
      description: "Complete guide to using our platform and services"
    },
    {
      icon: DocumentTextIcon,
      title: "Product Catalog",
      description: "Browse our complete collection with detailed specifications"
    },
    {
      icon: VideoCameraIcon,
      title: "Video Tutorials",
      description: "Watch step-by-step guides for common tasks"
    },
    {
      icon: CubeIcon,
      title: "Size Guide",
      description: "Find the perfect fit with our detailed sizing charts"
    }
  ];

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="user-help">
      {/* Luxury Header */}
      <div className="help-header-section">
        <div className="container">
          <h1>Help & Support</h1>
          <p>Your questions, expertly answered</p>
        </div>
      </div>

      <div className="help-container">
        {/* Help Intro */}
        <div className="help-intro">
          <h2>How can we help you?</h2>
          <p>Find answers to frequently asked questions, contact our support team, or explore our comprehensive resources.</p>
        </div>

        <div className="help-content">
          {/* FAQ Section */}
          <div className="faq-section">
            <div className="section-header">
              <QuestionMarkCircleIcon className="section-icon" />
              <h3>Frequently Asked Questions</h3>
            </div>
            
            <div className="faq-search">
              <input
                type="text"
                placeholder="Search FAQ articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="no-results">
                <p>No FAQ items match your search. Try different keywords or contact our support team.</p>
              </div>
            ) : (
              <div className="faq-list">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button 
                      className={`faq-question ${expandedFaq === faq.id ? 'active' : ''}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h4>{faq.question}</h4>
                      {expandedFaq === faq.id ? (
                        <ChevronUpIcon className="faq-icon" />
                      ) : (
                        <ChevronDownIcon className="faq-icon" />
                      )}
                    </button>
                    <div className={`faq-answer ${expandedFaq === faq.id ? 'open' : ''}`}>
                      <div className="answer-content">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <div className="section-header">
              <LifebuoyIcon className="section-icon" />
              <h3>Contact Support</h3>
            </div>
            
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method">
                  <method.icon className="method-icon" />
                  <h4>{method.title}</h4>
                  <p>{method.description}</p>
                  <div className="contact-info">{method.contact}</div>
                  <div className="response-time">{method.responseTime}</div>
                  <a href={method.href} className="contact-btn">
                    <span>{method.action}</span>
                    <ArrowRightIcon className="btn-icon" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHelp; 