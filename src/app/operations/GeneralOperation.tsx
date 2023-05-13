import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';

interface Payload {
  id: string;
  data: string;
}

interface Props {
  action: (payload: Payload) => any;
  title: string;
}

const GeneralOperation: React.FC<Props> = ({ action, title }) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const navigate = useNavigate();
  // const { title } = useParams();

  const payload: Payload = {
    id: '',
    data: ''
  };

  const handleOkClick = () => {
    dispatch(action(payload));
    navigate(-1);
  };

  return (
    <Container>
      <Typography variant="h4">{title}</Typography>
      {/* You can insert more content here if needed */}
      <Button onClick={() => navigate(-1)} color="primary">
        Cancel
      </Button>
      <Button onClick={handleOkClick} color="primary" autoFocus>
        Ok
      </Button>
    </Container>
  );
};

export default GeneralOperation;
