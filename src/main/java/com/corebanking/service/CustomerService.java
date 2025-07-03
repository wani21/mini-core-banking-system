
package com.corebanking.service;

import com.corebanking.dto.CustomerRegistrationRequest;
import com.corebanking.entity.Customer;
import com.corebanking.entity.KycStatus;
import com.corebanking.entity.User;
import com.corebanking.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomerProfile(User user, CustomerRegistrationRequest request) {
        // Check if customer profile already exists
        Optional<Customer> existingCustomer = customerRepository.findByUser_UserId(user.getUserId());
        if (existingCustomer.isPresent()) {
            throw new RuntimeException("Customer profile already exists for this user");
        }

        // Check if phone number already exists
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setGender(request.getGender());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddressLine1(request.getAddressLine1());
        customer.setAddressLine2(request.getAddressLine2());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setPostalCode(request.getPostalCode());
        customer.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        customer.setKycStatus(KycStatus.PENDING);

        return customerRepository.save(customer);
    }

    public Optional<Customer> findByUserId(Long userId) {
        return customerRepository.findByUser_UserId(userId);
    }

    public Optional<Customer> findByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber);
    }

    public List<Customer> findByKycStatus(KycStatus kycStatus) {
        return customerRepository.findByKycStatus(kycStatus);
    }

    public Customer updateKycStatus(Long customerId, KycStatus kycStatus) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setKycStatus(kycStatus);
        return customerRepository.save(customer);
    }

    public Customer updateKycDocuments(Long customerId, String kycDocuments) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setKycDocuments(kycDocuments);
        customer.setKycStatus(KycStatus.IN_PROGRESS);
        return customerRepository.save(customer);
    }
}
