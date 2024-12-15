import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from '../services/api';

const StripeDonationForm = ({ projectId, donorId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded yet.');
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      const { token, error: stripeError } = await stripe.createToken(cardElement);

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      const donationData = {
        projectId,
        donorId,
        amount,
        token: token.id,
        currency: 'usd',
      };

      const response = await axios.post('/donations/stripe', donationData);
      setMessage('Donation successful!');

      // Trigger the success callback
      if (onSuccess) {
        onSuccess();
      }

      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process donation.');
    }
  };

  return (
    <div className="stripe-donation-form">
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter donation amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Donate
        </button>
      </form>
    </div>
  );
};

export default StripeDonationForm;
