import React, { useEffect, useState } from 'react';
import { query, collection, where, getDocs} from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { firebaseApp } from '../config/firebase';
import { getFirestore } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { ProcessedEvent } from '@aldabil/react-scheduler/types';
import Schedule from './Schedule';


const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

interface ResourcedEvent extends ProcessedEvent {
  resourceId: string
  userId: string
  created: Date
}

const ScheduleView: React.FC = () => {
  const [events, setEvents] = useState<ResourcedEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserId(user?.uid || null);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Fetch events
  useEffect(() => {
    setIsLoading(true);
    const fetchEvents = async () => {
      if (!userId) return;
      const currentTime = new Date();
      const eventSnapshot = await getDocs(query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('start', '>=', currentTime)
      ));

      // Transform the data from Firestore
      const userEvents: ResourcedEvent[] = eventSnapshot.docs.map((doc, index) => {
        const data = doc.data();
          return {
            ...data,
            event_id: doc.id,
            start: new Date(data.start.seconds * 1000), // Transform start date
            end: new Date(data.end.seconds * 1000), // Transform end date
          } as ResourcedEvent;
      });
      setEvents(userEvents);
      setIsLoading(false);
    };
    fetchEvents();
  }, [userId]);



  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h4>Upcoming Events</h4>
      <Schedule events={events} />
    </div>
  );
};

export default ScheduleView;
