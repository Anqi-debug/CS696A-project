import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from '../services/api';

const StripeDonationForm = ({ projectId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const donorId = localStorage.getItem('userId'); // Get donorId from local storage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded yet.');
      return;
    }

    try {
      console.log('Form Inputs:', { projectId, donorId, amount }); // Debug log

      const cardElement = elements.getElement(CardElement);
      const { token, error: stripeError } = await stripe.createToken(cardElement);

      if (stripeError) {
        console.error('Stripe Token Error:', stripeError);
        setError(stripeError.message);
        return;
      }

      console.log('Generated Stripe Token:', token); // Debug log

      const donationData = {
        projectId,
        donorId,
        amount,
        token: token.id,
        currency: 'usd',
      };

      console.log('Sending Donation Data to Backend:', donationData); // Debug log

      const response = await axios.post('/donations/stripe', donationData);

      console.log('Backend Response:', response.data); // Debug log
      setMessage(response.data.message);
      setAmount('');
    } catch (err) {
      console.error('Error during donation:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to process donation.');
    }
  };

  return (
    <div>
      <h3>Donate to this Project</h3>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Donation Amount"
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
