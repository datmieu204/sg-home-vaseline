import React, { createContext, useState, useEffect } from 'react';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const [userServices, setUserServices] = useState([]);
  
  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('userServices');
    if (savedServices) {
      try {
        const services = JSON.parse(savedServices);
        console.log("Loaded services from storage:", services);
        setUserServices(services);
      } catch (error) {
        console.error("Error loading services from localStorage:", error);
        setUserServices([]);
      }
    }
  }, []);
  
  // Save services to localStorage whenever they change
  useEffect(() => {
    console.log("Saving services to storage:", userServices);
    localStorage.setItem('userServices', JSON.stringify(userServices));
  }, [userServices]);
  
  const addUserService = (serviceData) => {
    // Ensure ID exists
    const newServiceId = serviceData.id || Date.now();
    
    setUserServices(prevServices => {
      // Check if this service title already exists
      const existingIndex = prevServices.findIndex(
        service => service.title === serviceData.title
      );
      
      // If service exists, update it instead of adding a new one
      if (existingIndex !== -1) {
        console.log("Updating existing service:", serviceData.title);
        
        // Create a new array with the updated service
        const updatedServices = [...prevServices];
        updatedServices[existingIndex] = {
          ...prevServices[existingIndex],
          quantity: serviceData.quantity,
          endDate: serviceData.endDate,
          registerDate: serviceData.registerDate,
          paymentStatus: serviceData.paymentStatus || 'Chờ thanh toán',
          status: 'active' // Set to active when updating
        };
        
        return updatedServices;
      } else {
        // Add new service
        console.log("Adding new service:", serviceData.title);
        return [
          ...prevServices, 
          {
            ...serviceData,
            id: newServiceId,
            status: 'active'
          }
        ];
      }
    });
    
    return newServiceId; // Return the ID of the added/updated service
  };
  
  const updateServiceStatus = (serviceId, newStatus) => {
    console.log(`Updating service ${serviceId} status to: ${newStatus}`);
    
    setUserServices(prevServices => {
      // Create a new array with the updated service
      const updatedServices = prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, status: newStatus } 
          : service
      );
      
      return updatedServices;
    });
  };
  
  const removeUserService = (serviceId) => {
    setUserServices(prevServices => 
      prevServices.filter(service => service.id !== serviceId)
    );
  };
  
  return (
    <ServicesContext.Provider value={{
      userServices,
      addUserService,
      updateServiceStatus,
      removeUserService
    }}>
      {children}
    </ServicesContext.Provider>
  );
};

export default ServicesProvider;