import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import './Contact.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Add scroll animation observers
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const sections = [heroRef, contactRef, formRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just simulate success
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['03089747141', '03325122666'],
      action: 'tel:03089747141',
      gradient: 'black'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['Princevibe.store@gmail.com'],
      action: 'mailto:Princevibe.store@gmail.com',
      gradient: 'black'
    },
    {
      icon: MapPinIcon,
      title: 'Address',
      details: ['Butt Palaza, Near HBL Bank', 'Karianwala, Gujrat'],
      action: 'https://maps.google.com',
      gradient: 'black'
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat - Sun: 10:00 AM - 6:00 PM'],
      action: null,
      gradient: 'black'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://www.facebook.com/profile.php?id=61576899232165', color: '#1877F2' },
    { name: 'Instagram', icon: '📷', url: 'https://www.instagram.com/princevibe_official/', color: '#E4405F' },
    { name: 'YouTube', icon: '📺', url: 'https://www.youtube.com/channel/UCxAd5CkpTkule-P7rgdevjQ', color: '#FF0000' },
    { name: 'TikTok', icon: '🎵', url: 'https://www.tiktok.com/@princevibe_official', color: '#000000' },
    { name: 'WhatsApp', icon: '💬', url: '#', color: '#25D366' }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" ref={heroRef}>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <ChatBubbleLeftRightIcon />
              Get In Touch
            </span>
            <h1 className="hero-title">
              Let's Start a
              <span className="gradient-text"> Conversation</span>
            </h1>
            <p className="hero-description">
              Have questions about our watches? Need help with an order? Our team is here to help you find the perfect timepiece and provide exceptional service.
            </p>
            <div className="hero-features">
              <div className="feature">
                <CheckCircleIcon />
                <span>24/7 Customer Support</span>
              </div>
              <div className="feature">
                <CheckCircleIcon />
                <span>Quick Response Time</span>
              </div>
              <div className="feature">
                <CheckCircleIcon />
                <span>Expert Assistance</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-element">
              <div className="contact-illustration">
                <div className="message-bubble bubble-1">
                  <HeartIcon />
                  <span>How can we help?</span>
                </div>
                <div className="message-bubble bubble-2">
                  <SparklesIcon />
                  <span>Great service!</span>
                </div>
                <div className="message-bubble bubble-3">
                  <CheckCircleIcon />
                  <span>Quick response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section" ref={contactRef}>
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Multiple ways to reach us for your convenience</p>
          </div>
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className={`contact-info-card contact-${info.title.toLowerCase()}-card`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => info.action && window.open(info.action)}
              >
                <div className="info-icon" style={{ background: '#000000' }}>
                  <info.icon />
                </div>
                <h3>{info.title}</h3>
                <div className={`info-details ${info.title.toLowerCase()}-details`}>
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
                {info.action && (
                  <div className="contact-action">
                    <span>Click to {info.title.toLowerCase()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section" ref={formRef}>
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            {formStatus === 'success' && (
              <div className="status-message success">
                <CheckCircleIcon />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="status-message error">
                <ExclamationCircleIcon />
                <span>Failed to send message. Please try again or contact us directly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={errors.subject ? 'error' : ''}
                    placeholder="What's this about?"
                  />
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? 'error' : ''}
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Media & Additional Info */}
      <section className="social-section">
        <div className="container">
          <div className="social-content">
            <div className="social-text">
              <h3>Follow Us on Social Media</h3>
              <p>Stay connected for the latest updates, exclusive offers, and watch collections</p>
            </div>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="social-icon" style={{ backgroundColor: social.color }}>
                    {social.icon}
                  </span>
                  <span className="social-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="additional-info">
            <div className="info-grid">
              <div className="info-item">
                <GlobeAltIcon />
                <h4>Pakistan Shipping</h4>
                <p>We ship across Pakistan with secure packaging and tracking</p>
              </div>
              <div className="info-item">
                <HeartIcon />
                <h4>Customer Care</h4>
                <p>Dedicated support team for all your needs</p>
              </div>
              <div className="info-item">
                <SparklesIcon />
                <h4>Quality Guarantee</h4>
                <p>100% authentic products with warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 