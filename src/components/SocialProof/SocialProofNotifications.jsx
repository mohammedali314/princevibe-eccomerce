import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import './SocialProofNotifications.scss';

const SocialProofNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [realUsers, setRealUsers] = useState([]);
  const [realProducts, setRealProducts] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Generate realistic Pakistani users
  const generatePakistaniUsers = () => {
    const pakistaniNames = [
      'Ahmed K.', 'Fatima S.', 'Hassan M.', 'Ayesha R.', 'Muhammad A.',
      'Zainab H.', 'Omar F.', 'Sana Q.', 'Ali R.', 'Noor K.',
      'Bilal A.', 'Maryam L.', 'Usman W.', 'Khadija N.', 'Saad M.',
      'Amna S.', 'Hamza I.', 'Zara H.', 'Tariq A.', 'Hina B.',
      'Asad M.', 'Rabia K.', 'Faisal R.', 'Sidra A.', 'Imran S.',
      'Maham F.', 'Kashif M.', 'Sadia P.', 'Nabeel A.', 'Farah T.',
      'Adnan K.', 'Hira M.', 'Shahid R.', 'Samina A.', 'Waseem H.',
      'Rubina S.', 'Junaid M.', 'Nadia K.', 'Arslan A.', 'Shazia R.',
      'Rizwan S.', 'Fouzia M.', 'Shoaib A.', 'Bushra K.', 'Kamran H.',
      'Shaista F.', 'Nasir M.', 'Uzma A.', 'Sajid R.', 'Tayyaba S.'
    ];

    const pakistaniCities = [
      'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
      'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot',
      'Hyderabad', 'Sargodha', 'Bahawalpur', 'Sukkur', 'Larkana',
      'Jhang', 'Gujrat', 'Mardan', 'Kasur', 'Sahiwal',
      'Okara', 'Wah', 'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah',
      'Mingora', 'Chiniot', 'Kamoke', 'Mandi Bahauddin', 'Jhelum',
      'Sadiqabad', 'Jacobabad', 'Shikarpur', 'Khanewal', 'Hafizabad',
      'Kohat', 'Muzaffargarh', 'Khanpur', 'Gojra', 'Mianwali',
      'Bahawalnagar', 'Samundri', 'Tando Adam', 'Jaranwala', 'Chishtian',
      'Daska', 'Muridke', 'Ahmadpur East', 'Kamalia', 'Vihari'
    ];

    // Generate 50 random Pakistani users
    const users = [];
    for (let i = 0; i < 50; i++) {
      users.push({
        name: pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)],
        location: pakistaniCities[Math.floor(Math.random() * pakistaniCities.length)]
      });
    }

    return users;
  };

  // Fetch Pakistani users instead of international ones
  const fetchRealUsers = async () => {
    try {
      // Generate authentic Pakistani users
      const pakistaniUsers = generatePakistaniUsers();
      setRealUsers(pakistaniUsers);
    } catch (error) {
      console.error('Error generating Pakistani users:', error);
      // Fallback to basic Pakistani users
      setRealUsers([
        { name: 'Ahmed K.', location: 'Karachi' },
        { name: 'Sara M.', location: 'Lahore' },
        { name: 'Hassan A.', location: 'Islamabad' },
        { name: 'Ayesha R.', location: 'Faisalabad' },
        { name: 'Omar S.', location: 'Rawalpindi' },
        { name: 'Fatima H.', location: 'Multan' },
        { name: 'Ali R.', location: 'Peshawar' },
        { name: 'Zara K.', location: 'Quetta' },
        { name: 'Bilal M.', location: 'Gujranwala' },
        { name: 'Noor A.', location: 'Sialkot' },
        { name: 'Usman F.', location: 'Hyderabad' },
        { name: 'Amna S.', location: 'Sargodha' }
      ]);
    }
  };

  // Fetch real products from your backend
  const fetchRealProducts = async () => {
    try {
      const response = await ApiService.getProducts({ limit: 50 });
      const transformedResponse = ApiService.transformResponse(response);
      
      if (transformedResponse.success && transformedResponse.data) {
        const products = transformedResponse.data.map(product => product.name);
        setRealProducts(products);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching real products:', error);
      // Fallback to sample watches if API fails
      setRealProducts([
        'Rolex Submariner',
        'Omega Speedmaster',
        'TAG Heuer Formula 1',
        'Seiko Prospex',
        'Casio G-Shock',
        'Tissot T-Classic',
        'Citizen Eco-Drive',
        'Fiber Aura Premium',
        'Prince Elite Collection',
        'Heritage Gold Classic'
      ]);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchRealUsers(),
        fetchRealProducts()
      ]);
      setIsDataLoaded(true);
    };
    
    loadData();
  }, []);

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // More realistic timestamps with professional distribution
  const getRealisticTimestamp = () => {
    const options = [
      'Just now',
      '2 mins ago',
      '5 mins ago',
      '8 mins ago',
      '12 mins ago',
      '15 mins ago',
      '18 mins ago',
      '22 mins ago',
      '25 mins ago',
      '30 mins ago',
      '35 mins ago',
      '45 mins ago',
      '1 hour ago',
      '2 hours ago'
    ];
    
    // Weight the distribution to favor recent timestamps
    const weights = [0.15, 0.15, 0.12, 0.12, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.03, 0.02, 0.02, 0.01];
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < options.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return options[i];
      }
    }
    
    return options[0]; // Fallback
  };

  const createNotification = () => {
    // Don't create notifications if data isn't loaded yet
    if (!isDataLoaded || realUsers.length === 0 || realProducts.length === 0) {
      return null;
    }

    const user = getRandomElement(realUsers);
    const product = getRandomElement(realProducts);
    
    const newNotification = {
      id: Date.now() + Math.random(),
      user: user.name,
      location: user.location,
      product: product,
      timestamp: getRealisticTimestamp(),
      type: Math.random() > 0.3 ? 'purchase' : 'viewing' // 70% purchase, 30% viewing
    };

    return newNotification;
  };

  const showNotification = () => {
    const notification = createNotification();
    
    if (!notification) return; // Skip if data not loaded
    
    setNotifications(prev => [notification, ...prev.slice(0, 0)]); // Keep only 1 notification at a time

    // Hide notification after 6-8 seconds (more time to read)
    const displayDuration = Math.random() * 2000 + 6000; // 6-8 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, displayDuration);
  };

  useEffect(() => {
    // Only start showing notifications after data is loaded
    if (!isDataLoaded) return;

    // Show first notification after 15-30 seconds (more realistic)
    const initialTimer = setTimeout(() => {
      showNotification();
    }, Math.random() * 15000 + 15000); // 15-30 seconds

    // Professional timing: Show notifications every 45-120 seconds (1-2 minutes)
    const scheduleNextNotification = () => {
      const delay = Math.random() * 75000 + 45000; // 45-120 seconds
      setTimeout(() => {
        // Sometimes skip showing a notification to make it feel more natural (15% chance)
        if (Math.random() > 0.15) {
          showNotification();
        }
        scheduleNextNotification(); // Schedule the next one
      }, delay);
    };

    // Start the professional notification schedule
    scheduleNextNotification();

    return () => {
      clearTimeout(initialTimer);
    };
  }, [isDataLoaded, realUsers, realProducts]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Don't render anything if data isn't loaded or no notifications
  if (!isDataLoaded || notifications.length === 0) return null;

  return (
    <div className="luxury-notifications">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`luxury-notification ${notification.type}`}
        >
          <div className="notification-content">
            <div className="notification-header">
              <div className="user-initial">
                {notification.user.charAt(0)}
              </div>
              <div className="notification-body">
                <div className="notification-text">
                  <span className="user-name">{notification.user}</span>
                  <span className="location-text">from {notification.location}</span>
                  <span className="action-text">
                    {notification.type === 'purchase' ? 'purchased' : 'is viewing'}
                  </span>
                  <span className="product-name">{notification.product}</span>
                </div>
                <div className="notification-time">
                  {notification.timestamp}
                </div>
              </div>
            </div>
            
            {notification.type === 'purchase' && (
              <div className="purchase-indicator">
                <span className="checkmark">✓</span>
              </div>
            )}
          </div>
          
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default SocialProofNotifications; 