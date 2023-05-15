import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { SubscriptionManager } from './SubscriptionManager';

interface InviteFormProps {
  resourceId: string;
}

const InviteForm: React.FC<InviteFormProps> = ({ resourceId }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const subscriptionManager = new SubscriptionManager();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Make sure the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    // Create the invite
    await subscriptionManager.invite(resourceId, email);
    setMessage(`Invite sent to ${email}`);
    setEmail('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">
        Invite
      </Button>
      {message && <div>{message}</div>}
    </Form>
  );
};

export default InviteForm;
