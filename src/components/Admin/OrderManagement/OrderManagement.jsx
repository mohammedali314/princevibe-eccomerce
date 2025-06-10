import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  BanknotesIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import './OrderManagement.scss';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Order status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b', icon: ClockIcon },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6', icon: CheckCircleIcon },
    { value: 'processing', label: 'Processing', color: '#8b5cf6', icon: AdjustmentsHorizontalIcon },
    { value: 'shipped', label: 'Shipped', color: '#06b6d4', icon: TruckIcon },
    { value: 'delivered', label: 'Delivered', color: '#10b981', icon: CheckCircleIcon },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444', icon: XCircleIcon },
    { value: 'returned', label: 'Returned', color: '#f97316', icon: ArrowPathIcon }
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'paid', label: 'Paid', color: '#10b981' },
    { value: 'failed', label: 'Failed', color: '#ef4444' },
    { value: 'refunded', label: 'Refunded', color: '#6b7280' }
  ];

  // ✅ SMART STATUS TRANSITIONS - Based on backend business rules
  const getValidStatusTransitions = (currentStatus) => {
    // Define restricted transitions (what you CAN'T do)
    const restrictedTransitions = {
      'delivered': ['pending', 'confirmed', 'processing'], // Can't go back from delivered
      'cancelled': ['confirmed', 'processing', 'shipped', 'delivered'], // Can't change from cancelled (except to returned)
      'returned': ['pending', 'confirmed', 'processing', 'shipped'] // Returns are final
    };

    // Get all possible statuses
    const allStatuses = statusOptions.map(option => option.value);
    
    // Filter out restricted transitions
    const restrictedList = restrictedTransitions[currentStatus] || [];
    const validTransitions = allStatuses.filter(status => !restrictedList.includes(status));
    
    // Return valid options with reasons for disabled ones
    return statusOptions.map(option => {
      const isValid = validTransitions.includes(option.value);
      let reason = '';
      
      if (!isValid && currentStatus === 'delivered') {
        reason = 'Cannot change status after delivery';
      } else if (!isValid && currentStatus === 'cancelled') {
        reason = 'Cannot change status after cancellation (except to returned)';
      } else if (!isValid && currentStatus === 'returned') {
        reason = 'Cannot change status after return';
      }
      
      return {
        ...option,
        disabled: !isValid,
        reason
      };
    });
  };

  // Enhanced status update with better validation
  const getStatusValidationMessage = (currentStatus, newStatus) => {
    const validTransitions = getValidStatusTransitions(currentStatus);
    const targetOption = validTransitions.find(opt => opt.value === newStatus);
    
    if (targetOption && targetOption.disabled) {
      return targetOption.reason;
    }
    
    return null;
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and search orders
  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/admin/orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data.data || []);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data if API is not available
        setOrders(generateMockOrders());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(generateMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const generateMockOrders = () => {
    const mockOrders = [];
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['cod', 'card', 'bank_transfer'];
    const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
    const products = [
      { name: 'Rolex Submariner', price: 850000, image: 'https://images.unsplash.com/photo-1523170335258-f5c216654a8a?w=100&h=100&fit=crop' },
      { name: 'Omega Speedmaster', price: 650000, image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=100&h=100&fit=crop' },
      { name: 'TAG Heuer Carrera', price: 450000, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=100&h=100&fit=crop' },
      { name: 'Casio G-Shock', price: 25000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' }
    ];

    for (let i = 1; i <= 25; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = randomProduct.price * quantity;
      const tax = Math.floor(subtotal * 0.1);
      const shipping = 500;
      const total = subtotal + tax + shipping;

      mockOrders.push({
        _id: `order_${i}`,
        orderNumber: `PV${Date.now() - i * 1000}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
        customer: {
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
          phone: `+92300000${1000 + i}`,
          address: {
            street: `House ${i}, Street ${i}`,
            city: cities[Math.floor(Math.random() * cities.length)],
            state: 'Punjab',
            zipCode: `${54000 + i}`,
            country: 'Pakistan'
          }
        },
        items: [{
          productId: `prod_${i}`,
          name: randomProduct.name,
          price: randomProduct.price,
          quantity,
          image: randomProduct.image,
          sku: `SKU${i.toString().padStart(3, '0')}`
        }],
        summary: {
          subtotal,
          tax,
          shipping,
          discount: 0,
          total
        },
        payment: {
          method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: Math.random() > 0.3 ? 'paid' : 'pending',
          amount: total
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        trackingNumber: Math.random() > 0.5 ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
        estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: []
      });
    }

    return mockOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.email?.toLowerCase().includes(term) ||
        order.customer?.phone?.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment?.status === paymentFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
      }
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'amount':
          aValue = a.summary?.total || 0;
          bValue = b.summary?.total || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'customer':
          aValue = a.customer?.name || '';
          bValue = b.customer?.name || '';
          break;
        default:
          aValue = a.orderNumber;
          bValue = b.orderNumber;
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });

      // Find the current order
      const order = orders.find(o => o._id === orderId);
      if (!order) {
        alert('❌ Error: Order not found');
        return;
      }

      // ✅ FRONTEND VALIDATION - Check if transition is valid before API call
      const validationMessage = getStatusValidationMessage(order.status, newStatus);
      if (validationMessage) {
        alert(`❌ Invalid Status Change\n\n${validationMessage}\n\n💡 Tip: You can only change to available statuses in the dropdown.`);
        return;
      }

      // If changing to same status, no need to make API call
      if (order.status === newStatus) {
        return;
      }

      // Make API call first (don't update local state until API succeeds)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Parse response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      // Check if response is successful
      if (!response.ok) {
        console.error('API Error Response:', result);
        
        // Show specific error message to user
        const errorMessage = result.message || `Failed to update order status (${response.status})`;
        
        // Enhanced error message with helpful suggestions
        let helpText = '';
        if (result.message && result.message.includes('Invalid status transition')) {
          helpText = '\n\n💡 Status Change Rules:\n• Delivered orders cannot be changed\n• Cancelled orders can only be marked as returned\n• Returned orders are final\n• Orders older than 30 days cannot be cancelled/returned';
        } else if (result.message && result.message.includes('older than 30 days')) {
          helpText = '\n\n💡 This order is too old to be cancelled or returned.\nPlease contact system administrator for assistance.';
        } else {
          helpText = '\n\nPlease check:\n• Your admin permissions\n• Network connection\n• Order status transition rules';
        }
        
        alert(`❌ ${errorMessage}${helpText}`);
        
        // Don't update local state if API failed
        return;
      }

      console.log('Order status updated successfully:', result);

      // Only update local state after successful API call
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );

      // Show success message with status flow
      const statusInfo = getStatusInfo(newStatus);
      alert(`✅ Success!\n\nOrder ${order.orderNumber} status updated to "${statusInfo.label}"\n\n${getStatusFlowMessage(order.status, newStatus)}`);

    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Show network/general error to user
      alert(`❌ Network Error: ${error.message}\n\nPlease check:\n• Your internet connection\n• Backend server is running\n• Admin authentication is valid`);
      
      // Don't update local state on error
    }
  };

  // Helper function to provide status flow context
  const getStatusFlowMessage = (fromStatus, toStatus) => {
    const flows = {
      'pending': { 'confirmed': '📋 Order confirmed! Ready for processing.' },
      'confirmed': { 
        'processing': '⚙️ Order is being processed!',
        'cancelled': '❌ Order cancelled. Stock will be restored.'
      },
      'processing': { 
        'shipped': '🚚 Order shipped! Customer will receive tracking info.',
        'cancelled': '❌ Order cancelled. Stock will be restored.'
      },
      'shipped': { 
        'delivered': '✅ Order delivered! Payment confirmed for COD orders.',
        'returned': '↩️ Order returned. Stock will be restored.'
      },
      'cancelled': { 'returned': '↩️ Order marked as returned.' },
      'delivered': {}, // No transitions from delivered
      'returned': {} // No transitions from returned
    };
    
    return flows[fromStatus]?.[toStatus] || '✅ Status updated successfully!';
  };

  // ✅ DELETE ORDER FUNCTIONALITY
  const deleteOrder = async (orderId, orderNumber) => {
    try {
      const order = orders.find(o => o._id === orderId);
      if (!order) {
        alert('❌ Error: Order not found');
        return;
      }

      // Check if order can be deleted based on backend restrictions
      const canDelete = canOrderBeDeleted(order.status);
      if (!canDelete.allowed) {
        alert(`❌ Cannot Delete Order\n\n${canDelete.reason}\n\n💡 You can only delete orders that are:\n• Pending\n• Confirmed\n• Cancelled\n• Returned`);
        return;
      }

      // Show confirmation dialog
      const confirmationMessage = `🗑️ DELETE ORDER CONFIRMATION\n\nOrder: ${orderNumber}\nStatus: ${getStatusInfo(order.status).label}\nCustomer: ${order.customer?.name}\nTotal: PKR ${(order.summary?.total || 0).toLocaleString()}\n\n⚠️ WARNING: This action cannot be undone!\n\n${order.status === 'confirmed' ? '• Stock will be restored to inventory\n' : ''}${order.status === 'pending' ? '• This will permanently remove the order\n' : ''}${['cancelled', 'returned'].includes(order.status) ? '• This will clean up the spam/mock order\n' : ''}\nAre you absolutely sure you want to delete this order?`;

      if (!confirm(confirmationMessage)) {
        return;
      }

      // Second confirmation for extra safety
      const finalConfirm = confirm(`🚨 FINAL CONFIRMATION\n\nClick OK to permanently delete order ${orderNumber}.\n\nThis is your last chance to cancel!`);
      if (!finalConfirm) {
        return;
      }

      console.log('Attempting to delete order:', { orderId, orderNumber });

      // Try API call first, but don't fail if API is unavailable (for mock data)
      let apiSuccess = false;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Order deleted from API successfully:', result);
          apiSuccess = true;
        } else {
          // If it's a 404 or the order doesn't exist in API, that's OK for mock data
          if (response.status === 404) {
            console.log('Order not found in API (likely mock data), proceeding with local deletion');
            apiSuccess = true;
          } else {
            const result = await response.json();
            console.error('API Error Response:', result);
            const errorMessage = result.message || `Failed to delete order (${response.status})`;
            alert(`❌ Delete Failed\n\n${errorMessage}`);
            return;
          }
        }
      } catch (networkError) {
        console.log('API not available, treating as mock data deletion:', networkError.message);
        // If API is not available, we can still delete from local state (mock data)
        apiSuccess = true;
      }

      if (apiSuccess) {
        console.log('Removing order from local state:', orderId);
        
        // Remove from local state
        setOrders(prevOrders => {
          const filtered = prevOrders.filter(o => o._id !== orderId);
          console.log('Orders after deletion:', filtered.length, 'orders remaining');
          return filtered;
        });
        
        // Remove from bulk selection if selected
        setBulkSelected(prevSelected => {
          const newSelected = new Set(prevSelected);
          newSelected.delete(orderId);
          return newSelected;
        });

        // Update bulk actions visibility
        setShowBulkActions(prev => {
          const newSelected = new Set(bulkSelected);
          newSelected.delete(orderId);
          return newSelected.size > 0;
        });

        // Show success message
        alert(`✅ Order Deleted Successfully!\n\nOrder ${orderNumber} has been permanently deleted.\n\n${order.status === 'confirmed' ? '📦 Stock has been restored to inventory.' : '🧹 Spam/mock order has been cleaned up.'}`);
      }

    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`❌ Delete Failed\n\nError: ${error.message}\n\nPlease try again.`);
    }
  };

  // Helper function to check if order can be deleted
  const canOrderBeDeleted = (status) => {
    const deletableStatuses = ['pending', 'confirmed', 'cancelled', 'returned'];
    const restrictedStatuses = ['processing', 'shipped', 'delivered'];
    
    if (restrictedStatuses.includes(status)) {
      return {
        allowed: false,
        reason: `Orders with status "${getStatusInfo(status).label}" cannot be deleted as they are already in fulfillment process.`
      };
    }
    
    if (deletableStatuses.includes(status)) {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: 'This order status is not eligible for deletion.'
    };
  };

  // ✅ BULK DELETE FUNCTIONALITY
  const bulkDeleteOrders = async () => {
    if (bulkSelected.size === 0) {
      alert('⚠️ No Orders Selected\n\nPlease select orders to delete first.');
      return;
    }

    const selectedOrders = orders.filter(order => bulkSelected.has(order._id));
    const undeletableOrders = selectedOrders.filter(order => !canOrderBeDeleted(order.status).allowed);
    
    if (undeletableOrders.length > 0) {
      const undeletableList = undeletableOrders.map(o => `• ${o.orderNumber} (${getStatusInfo(o.status).label})`).join('\n');
      alert(`❌ Cannot Delete Some Orders\n\nThe following orders cannot be deleted:\n\n${undeletableList}\n\n💡 Only pending, confirmed, cancelled, or returned orders can be deleted.`);
      return;
    }

    const deletableOrders = selectedOrders.filter(order => canOrderBeDeleted(order.status).allowed);
    
    if (deletableOrders.length === 0) {
      alert('❌ No Deletable Orders\n\nNone of the selected orders can be deleted.');
      return;
    }

    // Show bulk confirmation
    const ordersList = deletableOrders.map(o => `• ${o.orderNumber} (${getStatusInfo(o.status).label}) - PKR ${(o.summary?.total || 0).toLocaleString()}`).join('\n');
    const confirmationMessage = `🗑️ BULK DELETE CONFIRMATION\n\n${deletableOrders.length} orders will be deleted:\n\n${ordersList}\n\n⚠️ WARNING: This action cannot be undone!\n\nAre you sure you want to delete these orders?`;

    if (!confirm(confirmationMessage)) {
      return;
    }

    // Final confirmation
    const finalConfirm = confirm(`🚨 FINAL CONFIRMATION\n\nYou are about to permanently delete ${deletableOrders.length} orders.\n\nClick OK to proceed with bulk deletion.`);
    if (!finalConfirm) {
      return;
    }

    try {
      let successCount = 0;
      let failedOrders = [];

      // Delete orders one by one
      for (const order of deletableOrders) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/admin/orders/${order._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            successCount++;
          } else {
            failedOrders.push(order.orderNumber);
          }
        } catch (error) {
          failedOrders.push(order.orderNumber);
        }
      }

      // Update local state - remove successfully deleted orders
      const successfullyDeleted = deletableOrders.filter(order => !failedOrders.includes(order.orderNumber));
      const deletedIds = successfullyDeleted.map(order => order._id);
      
      setOrders(prevOrders => prevOrders.filter(order => !deletedIds.includes(order._id)));
      setBulkSelected(new Set());
      setShowBulkActions(false);

      // Show results
      if (failedOrders.length === 0) {
        alert(`✅ Bulk Delete Successful!\n\n${successCount} orders deleted successfully.\n\n🧹 Spam/mock orders have been cleaned up.`);
      } else {
        alert(`⚠️ Bulk Delete Completed with Errors\n\n✅ Successfully deleted: ${successCount} orders\n❌ Failed to delete: ${failedOrders.length} orders\n\nFailed orders: ${failedOrders.join(', ')}`);
      }

    } catch (error) {
      console.error('Bulk delete error:', error);
      alert(`❌ Bulk Delete Failed\n\nError: ${error.message}`);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const toggleBulkSelection = (orderId) => {
    const newSelected = new Set(bulkSelected);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setBulkSelected(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllOrders = () => {
    const currentPageOrders = getCurrentPageOrders();
    const allSelected = currentPageOrders.every(order => bulkSelected.has(order._id));
    
    if (allSelected) {
      // Deselect all current page orders
      const newSelected = new Set(bulkSelected);
      currentPageOrders.forEach(order => newSelected.delete(order._id));
      setBulkSelected(newSelected);
    } else {
      // Select all current page orders
      const newSelected = new Set(bulkSelected);
      currentPageOrders.forEach(order => newSelected.add(order._id));
      setBulkSelected(newSelected);
    }
    setShowBulkActions(bulkSelected.size > 0);
  };

  const bulkUpdateStatus = async (newStatus) => {
    try {
      for (const orderId of bulkSelected) {
        await updateOrderStatus(orderId, newStatus);
      }
      setBulkSelected(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error bulk updating orders:', error);
    }
  };

  const getCurrentPageOrders = () => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getPaymentStatusInfo = (status) => {
    return paymentStatusOptions.find(option => option.value === status) || paymentStatusOptions[0];
  };

  const formatCurrency = (amount) => {
    return `PKR ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order Number', 'Customer', 'Date', 'Status', 'Payment Status', 'Total'],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customer?.name,
        formatDate(order.createdAt),
        order.status,
        order.payment?.status,
        order.summary?.total
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentPageOrders = getCurrentPageOrders();

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="order-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      {/* Header */}
      <div className="orders-header">
        <div className="header-left">
          <h1>Order Management</h1>
          <p className="subtitle">Manage customer orders and track deliveries</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportOrders}>
            <DocumentDuplicateIcon className="btn-icon" />
            Export
          </button>
          <button className="btn btn-secondary" onClick={fetchOrders}>
            <ArrowPathIcon className="btn-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-container">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search orders by number, customer, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Payment:</label>
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="all">All Payments</option>
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date:</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="filter-group">
            <button
              className={`sort-toggle ${sortOrder === 'desc' ? 'desc' : 'asc'}`}
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? <ChevronDownIcon className="sort-icon" /> : <ChevronUpIcon className="sort-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bulk-actions-bar">
          <span>{bulkSelected.size} orders selected</span>
          <div className="bulk-actions">
            <button onClick={() => bulkUpdateStatus('confirmed')} className="btn btn-sm btn-primary">
              Mark Confirmed
            </button>
            <button onClick={() => bulkUpdateStatus('processing')} className="btn btn-sm btn-secondary">
              Mark Processing
            </button>
            <button onClick={() => bulkUpdateStatus('shipped')} className="btn btn-sm btn-success">
              Mark Shipped
            </button>
            <button onClick={bulkDeleteOrders} className="btn btn-sm btn-warning" title="Delete spam/mock orders">
              🗑️ Delete Orders
            </button>
            <button onClick={() => setBulkSelected(new Set())} className="btn btn-sm btn-danger">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Orders Stats */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <ArchiveBoxIcon className="stat-svg" />
          </div>
          <div className="stat-info">
            <span className="stat-number">{filteredOrders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <ClockIcon className="stat-svg" />
          </div>
          <div className="stat-info">
            <span className="stat-number">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon processing">
            <AdjustmentsHorizontalIcon className="stat-svg" />
          </div>
          <div className="stat-info">
            <span className="stat-number">
              {filteredOrders.filter(o => o.status === 'processing').length}
            </span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon shipped">
            <TruckIcon className="stat-svg" />
          </div>
          <div className="stat-info">
            <span className="stat-number">
              {filteredOrders.filter(o => o.status === 'shipped').length}
            </span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="orders-grid-container">
        {currentPageOrders.length === 0 ? (
          <div className="no-orders">
            <ArchiveBoxIcon className="no-orders-icon" />
            <h3>No orders found</h3>
            <p>No orders match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="grid-header">
              <div className="grid-controls">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={currentPageOrders.length > 0 && currentPageOrders.every(order => bulkSelected.has(order._id))}
                    onChange={selectAllOrders}
                  />
                  <span className="checkmark"></span>
                </label>
                <span>Select All ({currentPageOrders.length} orders)</span>
              </div>
              <div className="view-options">
                <span className="showing-text">
                  Showing {(currentPage - 1) * ordersPerPage + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length}
                </span>
              </div>
            </div>

            <div className="orders-grid">
              {currentPageOrders.map((order, index) => {
                const isExpanded = expandedOrders.has(order._id);
                const isSelected = bulkSelected.has(order._id);
                const statusInfo = getStatusInfo(order.status);
                const paymentInfo = getPaymentStatusInfo(order.payment?.status);

                return (
                  <div 
                    key={order._id} 
                    className={`order-card ${isExpanded ? 'expanded' : ''} ${isSelected ? 'selected' : ''} animate`}
                    style={{ '--delay': `${index * 0.1}s` }}
                  >
                    {/* Card Header */}
                    <div className="card-header">
                      <div className="header-left">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleBulkSelection(order._id)}
                          />
                          <span className="checkmark"></span>
                        </label>
                        
                        <div className="order-number">
                          <h4>{order.orderNumber}</h4>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="header-right">
                        <div className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                          {React.createElement(statusInfo.icon, { className: "status-icon" })}
                          <span>{statusInfo.label}</span>
                        </div>
                        {canOrderBeDeleted(order.status).allowed && (
                          <div className="deletable-tag" title="This order can be deleted">
                            🗑️
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      {/* Product Images Preview */}
                      <div className="product-images">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="product-image-wrapper">
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop'} 
                              alt={item.name}
                              className="product-image"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop';
                              }}
                            />
                            {idx === 2 && (order.items?.length || 0) > 3 && (
                              <div className="more-products">+{(order.items?.length || 0) - 3}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Order Info */}
                      <div className="order-info">
                        <div className="customer-info">
                          <div className="info-item">
                            <UserIcon className="info-icon" />
                            <span className="info-text">{order.customer?.name}</span>
                          </div>
                          <div className="info-item">
                            <MapPinIcon className="info-icon" />
                            <span className="info-text">{order.customer?.address?.city}</span>
                          </div>
                        </div>

                        <div className="order-summary">
                          <div className="items-count">
                            <span className="count">{order.items?.length || 0}</span>
                            <span className="label">item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="total">
                            <span className="currency">PKR</span>
                            <span className="amount">{(order.summary?.total || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment & Status */}
                      <div className="payment-info">
                        <div className="payment-method">
                          <BanknotesIcon className="payment-icon" />
                          <span>
                            {order.payment?.method === 'cod' ? 'COD' : 
                             order.payment?.method === 'card' ? 'Card' : 
                             order.payment?.method === 'mastercard' ? 'Mastercard' :
                             order.payment?.method === 'googlepay' ? 'Google Pay' : 
                             'Bank'}
                          </span>
                        </div>
                        
                        {order.trackingNumber && (
                          <div className="tracking-info">
                            <TruckIcon className="tracking-icon" />
                            <span className="tracking-number">{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="card-actions">
                      <div className="action-left">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                          title={`Current status: ${getStatusInfo(order.status).label}`}
                          data-current-status={order.status}
                        >
                          {getValidStatusTransitions(order.status).map(option => (
                            <option 
                              key={option.value} 
                              value={option.value}
                              disabled={option.disabled}
                              title={option.disabled ? option.reason : `Change status to ${option.label}`}
                            >
                              {option.label}
                              {option.disabled ? ' (Not Available)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="action-right">
                        <button 
                          className="action-btn expand"
                          onClick={() => toggleOrderExpansion(order._id)}
                          title={isExpanded ? "Collapse Details" : "Expand Details"}
                        >
                          {isExpanded ? <ChevronUpIcon className="action-icon" /> : <ChevronDownIcon className="action-icon" />}
                        </button>
                        <button className="action-btn view" title="View Details">
                          <EyeIcon className="action-icon" />
                        </button>
                        <button className="action-btn edit" title="Edit Order">
                          <PencilIcon className="action-icon" />
                        </button>
                        {canOrderBeDeleted(order.status).allowed && (
                          <button 
                            className="action-btn delete" 
                            onClick={() => deleteOrder(order._id, order.orderNumber)}
                            title="Delete spam/mock order"
                          >
                            <TrashIcon className="action-icon" />
                          </button>
                        )}
                        <button className="action-btn print" title="Print Order">
                          <PrinterIcon className="action-icon" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="order-details">
                        <div className="details-header">
                          <h5>Order Details</h5>
                        </div>
                        
                        <div className="details-grid">
                          {/* Customer Details */}
                          <div className="detail-section">
                            <h6>Customer</h6>
                            <div className="detail-content">
                              <div className="detail-item">
                                <UserIcon className="detail-icon" />
                                <span>{order.customer?.name}</span>
                              </div>
                              <div className="detail-item">
                                <EnvelopeIcon className="detail-icon" />
                                <span>{order.customer?.email}</span>
                              </div>
                              <div className="detail-item">
                                <PhoneIcon className="detail-icon" />
                                <span>{order.customer?.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="detail-section">
                            <h6>Shipping</h6>
                            <div className="detail-content">
                              <div className="detail-item">
                                <MapPinIcon className="detail-icon" />
                                <div className="address">
                                  <div>{order.customer?.address?.street}</div>
                                  <div>{order.customer?.address?.city}, {order.customer?.address?.state}</div>
                                  <div>{order.customer?.address?.zipCode}, {order.customer?.address?.country}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="detail-section items-section">
                            <h6>Items ({order.items?.length || 0})</h6>
                            <div className="items-list">
                              {order.items?.map((item, index) => (
                                <div key={index} className="item-card">
                                  <img 
                                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop'} 
                                    alt={item.name} 
                                    className="item-image"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop';
                                    }}
                                  />
                                  <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-meta">Qty: {item.quantity} • SKU: {item.sku}</span>
                                  </div>
                                  <div className="item-price">
                                    <span className="price">PKR {(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="detail-section">
                            <h6>Summary</h6>
                            <div className="summary-content">
                              <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>PKR {(order.summary?.subtotal || 0).toLocaleString()}</span>
                              </div>
                              {(order.summary?.tax || 0) > 0 && (
                                <div className="summary-row">
                                  <span>Tax:</span>
                                  <span>PKR {(order.summary?.tax || 0).toLocaleString()}</span>
                                </div>
                              )}
                              <div className="summary-row">
                                <span>Shipping:</span>
                                <span>{(order.summary?.shipping || 0) > 0 ? `PKR ${order.summary.shipping.toLocaleString()}` : 'FREE'}</span>
                              </div>
                              {(order.summary?.discount || 0) > 0 && (
                                <div className="summary-row discount">
                                  <span>Discount:</span>
                                  <span>- PKR {(order.summary?.discount || 0).toLocaleString()}</span>
                                </div>
                              )}
                              <div className="summary-row total">
                                <span>Total:</span>
                                <span>PKR {(order.summary?.total || 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detail Actions */}
                        <div className="detail-actions">
                          <button className="detail-btn secondary">
                            <PrinterIcon className="btn-icon" />
                            Print
                          </button>
                          <button className="detail-btn secondary">
                            <EnvelopeIcon className="btn-icon" />
                            Email
                          </button>
                          <button className="detail-btn primary">
                            <EyeIcon className="btn-icon" />
                            Full Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * ordersPerPage + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNumber}</h2>
              <button
                className="modal-close"
                onClick={() => setShowOrderDetails(false)}
              >
                <XCircleIcon className="modal-close-icon" />
              </button>
            </div>
            <div className="modal-body">
              {/* Modal content would go here - this is just a placeholder */}
              <p>Full order details modal would be implemented here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 