import React, { useState } from 'react';

function SellerDetailsModal({ property }) {
  const [showModal, setShowModal] = useState(false);

  const handleInterest = () => {
    // Logic to show seller details modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Logic to close modal
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleInterest}>I'm Interested</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Seller Details</h2>
            <p>Name: {property.seller.firstName} {property.seller.lastName}</p>
            <p>Email: {property.seller.email}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDetailsModal;
