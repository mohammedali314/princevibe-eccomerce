import React, { useState } from 'react';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YouTubeIcon,
  LinkedInIcon,
  TikTokIcon
} from './SocialIcons';
import './Footer.scss';

const Footer = ({ onLogoClick }) => {
  const [email, setEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const currentYear = new Date().getFullYear();

  const footerSections = {
    // company: {
    //   title: "Company",
    //   links: [
    //     { name: "About PrinceVibe", href: "#about" },
    //     { name: "Our Story", href: "#story" },
    //     { name: "Careers", href: "#careers" },
    //     { name: "Press Center", href: "#press" },
    //     { name: "Sustainability", href: "#sustainability" },
    //     { name: "Investor Relations", href: "#investors" }
    //   ]
    // },
    products: {
      title: "Products",
      links: [
        { name: "Luxury Watches", href: "#luxury" },
        { name: "Smart Watches", href: "#smart" },
        { name: "Sport Watches", href: "#sport" },
        { name: "Limited Editions", href: "#limited" },
        { name: "New Arrivals", href: "#new" },
        { name: "Best Sellers", href: "#bestsellers" }
      ]
    },
    services: {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "#contact" },
        { name: "Size Guide", href: "#size-guide" },
        { name: "Shipping Info", href: "#shipping" },
        { name: "Returns & Exchanges", href: "#returns" },
        { name: "Warranty", href: "#warranty" },
        { name: "Repair Services", href: "#repair" }
      ]
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Order Tracking", href: "#tracking" },
        { name: "FAQ", href: "#faq" },
        { name: "Live Chat", href: "#chat" },
        { name: "Video Guides", href: "#guides" },
        { name: "Product Registration", href: "#registration" }
      ]
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "https://facebook.com/princevibe", followers: "2.3M" },
    { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com/princevibe", followers: "1.8M" },
    { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com/princevibe", followers: "892K" },
    { name: "YouTube", icon: YouTubeIcon, href: "https://youtube.com/princevibe", followers: "654K" },
    { name: "LinkedIn", icon: LinkedInIcon, href: "https://linkedin.com/company/princevibe", followers: "234K" },
    { name: "TikTok", icon: TikTokIcon, href: "https://tiktok.com/@princevibe", followers: "445K" }
  ];

  const paymentMethods = [
    { name: "Visa", image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "Google Pay", image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
    { name: "JazzCash", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA4MCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzAwNzNhNyIvPgo8dGV4dCB4PSI0MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+SmF6ekNhc2g8L3RleHQ+Cjwvc3ZnPg==" },
    { name: "EasyPaisa", image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA4MCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzAwYjA0ZiIvPgo8dGV4dCB4PSI0MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+RWFzeVBhaXNhPC90ZXh0Pgo8L3N2Zz4=" }
  ];

  const certifications = [
    { name: "SSL Secured", icon: ShieldCheckIcon, description: "256-bit encryption" },
    { name: "Fast Delivery", icon: TruckIcon, description: "Shipping only in Pakistan" },
    { name: "24/7 Support", icon: ClockIcon, description: "Expert assistance" }
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "ja", name: "日本語", flag: "🇯🇵" }
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="brand-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <img 
                  src="/logo.png" 
                  alt="PrinceVibe" 
                  className="logo-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML += '<span class="logo-text">PrinceVibe</span>';
                  }}
                />
              </div>
              <p className="brand-description">
                Crafting exceptional timepieces since 2008. PrinceVibe represents the pinnacle of 
                luxury, precision, and timeless elegance in watchmaking.
              </p>
              
              {/* Contact Information */}
              <div className="contact-info">
                <div className="contact-item">
                  <PhoneIcon />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <EnvelopeIcon />
                  <span>hello@princevibe.com</span>
                </div>
                <div className="contact-item">
                  <MapPinIcon />
                  <span>123 Luxury Ave, New York, NY 10001</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h4>Follow Us</h4>
                <div className="social-links">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a 
                        key={social.name} 
                        href={social.href} 
                        className="social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${social.name} - ${social.followers} followers`}
                      >
                        <IconComponent />
                        <span className="social-tooltip">
                          {social.name} - {social.followers}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.values(footerSections).map((section) => (
              <div key={section.title} className="footer-section">
                <h4 className="section-title">{section.title}</h4>
                <ul className="section-links">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            {/* Payment Methods */}
            <div className="payment-methods">
              <span className="payment-label">We Accept:</span>
              <div className="payment-icons">
                {paymentMethods.map((method) => (
                  <img 
                    key={method.name} 
                    src={method.image} 
                    alt={method.name}
                    className="payment-icon"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="language-selector">
              <GlobeAltIcon />
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Copyright and Legal */}
            <div className="legal-section">
              <div className="copyright">
                {/* <HeartIcon className="heart-icon" /> */}
                <span>© {currentYear} PrinceVibe. Crafted with love for timepiece enthusiasts.</span>
              </div>
              {/* <div className="legal-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#cookies">Cookie Policy</a>
                <a href="#accessibility">Accessibility</a>
                <a href="#sitemap">Sitemap</a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 