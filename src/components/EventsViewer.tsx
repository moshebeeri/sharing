import { getFirestore, collection, doc, setDoc } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firebaseApp } from '../config/firebase';
import { Scheduler } from '@aldabil/react-scheduler';
import { EVENTS } from './events';
import type { EventActions, ProcessedEvent } from '@aldabil/react-scheduler/types';
import { FunctionComponent } from 'react';

const db = getFirestore(firebaseApp);

const onConfirm = async (event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent> => {
  console.log(JSON.stringify({ event, action }, null, 2));

  // Get the currently logged in user
  const user = getAuth(firebaseApp).currentUser;

  // If user is not logged in, do nothing
  if (!user) {
    console.log('No user is logged in.');
    return event;
  }

  // Save the event to Firestore
  try {
    const eventsCollection = collection(db, 'events');
    const docRef = doc(eventsCollection);
    await setDoc(docRef, {
      ...event,
      userId: user.uid,
    });
    console.log('Event saved with ID: ', docRef.id);
  } catch (error) {
    console.error('Error saving event to Firestore: ', error);
  }

  return event;
};

export const EventsViewer: FunctionComponent = () => {
  return <Scheduler events={EVENTS} onConfirm={onConfirm} />;
};
