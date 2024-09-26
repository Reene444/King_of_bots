import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentPage.css';

const stripePromise = loadStripe('YOUR_PUBLIC_STRIPE_KEY');

const PaymentPage = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('US');

    const countryFormats = {
        US: {
            addressLine1: 'Street Address',
            addressLine2: 'Apt, suite, etc. (optional)',
            city: 'City',
            state: 'State',
            zipCode: 'ZIP Code',
        },
        UK: {
            addressLine1: 'Street Address',
            addressLine2: 'Apt, flat, etc. (optional)',
            city: 'City',
            state: 'County',
            zipCode: 'Postcode',
        },
    };

    const addressFormat = countryFormats[country];

    const handlePayment = async () => {
        setLoading(true);
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 1000 }),
        });

        const { clientSecret } = await response.json();
        const cardElement = elements.getElement(CardElement);

        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Cardholder Name',
                    email,
                    phone,
                    address: {
                        line1: addressLine1,
                        line2: addressLine2,
                        city,
                        state,
                        postal_code: zipCode,
                        country,
                    },
                },
            },
        });

        if (error) {
            setError(error.message);
        } else {
            alert('Payment successful!');
        }
        setLoading(false);
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="payment-container"> 
                <Typography variant="h4" gutterBottom>
                    Payment 
                </Typography>

                {/* Country Selection */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Country</InputLabel>
                    <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="UK">United Kingdom</MenuItem>
                    </Select>
                </FormControl>

                {/* Email Field */}
                <TextField
                    label="Email"
                    variant="outlined"
                    className="text-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />

                {/* Phone Field */}
                <TextField
                    label="Phone"
                    variant="outlined"
                    className="text-field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />

                {/* Address Fields */}
                <TextField
                    label={addressFormat.addressLine1}
                    variant="outlined"
                    className="text-field"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />
                <TextField
                    label={addressFormat.addressLine2}
                    variant="outlined"
                    className="text-field"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />
                <TextField
                    label={addressFormat.city}
                    variant="outlined"
                    className="text-field"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />
                <TextField
                    label={addressFormat.state}
                    variant="outlined"
                    className="text-field"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />
                <TextField
                    label={addressFormat.zipCode}
                    variant="outlined"
                    className="text-field"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    margin="normal" // Adding margin for spacing
                />

                <div className="card-element-container">
                    <CardElement className='card-element' />
                </div>
                
                <Button
                    variant="contained"
                    color="primary"
                    className="payment-button"
                    onClick={handlePayment}
                    disabled={loading || !stripe || !elements}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </Button>
                
                {error && <div className="error-message">{error}</div>}
            </div>
        </Elements>
    );
};

export default PaymentPage;
