import React, { useEffect, useState } from 'react';
import { query, collection, where, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { Scheduler } from '@aldabil/react-scheduler';
import { ResourceType } from './resource/ResourcesList';
import { SubscriptionManager } from '../app/operations/SubscriptionManager';
import { getAuth } from '@firebase/auth';
import { firebaseApp } from '../config/firebase';
import { getFirestore } from 'firebase/firestore';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { EventActions, ProcessedEvent } from '@aldabil/react-scheduler/types';

const event_colors = [
  '#ff0000', // red
  '#ffa500', // orange
  '#ffff00', // yellow
  '#008000', // green
  '#00ffff', // cyan
  '#0000ff', // blue
  '#4b0082', // indigo
  '#ee82ee', // violet
  '#a52a2a', // brown
  '#00008b', // dark blue
  '#808080', // gray
  '#008080', // teal
  '#000080', // navy
  '#800000', // maroon
  '#800080', // purple
  '#008000', // lime
  '#c0c0c0', // silver
  '#add8e6', // light blue
  '#90ee90', // light green
  '#d3d3d3', // light gray
];

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const subscriptionManager = new SubscriptionManager();

interface ResourcedEvent extends ProcessedEvent {
  resourceId: string
  userId: string
  created: Date
}

const EventsViewer: React.FC = () => {
  const [events, setEvents] = useState<ResourcedEvent[]>([]);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  function getColorForResource(resourceId: string): string {
    function hashCode(s: string): number {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;
      }
      return hash;
    }
    const hash = hashCode(resourceId);
    const index = Math.abs(hash) % event_colors.length;
    return event_colors[index];
  }

  // const onConfirm = async (event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent> => {
  //   console.log(JSON.stringify({ event, action }, null, 2));
  //   // Get the currently logged in user
  //   const user = getAuth(firebaseApp).currentUser;

  //   // If user is not logged in, do nothing
  //   if (!user) {
  //     console.log('No user is logged in.');
  //     return event;
  //   }
  //   // Save the event to Firestore
  //   try {
  //     const eventsCollection = collection(db, 'events');
  //     const docRef = doc(eventsCollection);
  //     event.color = getColorForResource(selectedResource);
  //     await setDoc(docRef, {
  //       ...event,
  //       userId: user.uid,
  //       resourceId: selectedResource,
  //       created: Date.now(),
  //     });
  //     console.log('Event saved with ID: ', docRef.id);
  //   } catch (error) {
  //     console.error('Error saving event to Firestore: ', error);
  //   }
  //   return event;
  // };

  // Fetch resources

  const onConfirm = async (event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent> => {
    console.log(JSON.stringify({ event, action }, null, 2));

    if (action === "create" && !selectedResource) {
      alert('Please select a resource before adding an event.');
      return event;
    }

    const user = getAuth(firebaseApp).currentUser;

    if (!user) {
      alert('No user is logged in.');
      return event;
    }

    // Check if event is in the past
    if (new Date(event.start).getTime() < Date.now()) {
      alert('Event is in the past and cannot be added.');
      setLastUpdated(new Date());
      return event;
    }

    const eventsCollection = collection(db, 'events');

    let docRef;
    if (action === "edit" && event.event_id) {
      // If it's an edit action and the event has an id, use the existing id
      docRef = doc(eventsCollection, event.event_id.toString());
    } else {
      // If it's an add action or the event doesn't have an id, create a new document
      docRef = doc(eventsCollection);
    }

    event.color = getColorForResource(selectedResource);

    try {
      await setDoc(docRef, {
        ...event,
        userId: user.uid,
        resourceId: selectedResource,
        created: Date.now(),
      });

      console.log('Event saved with ID: ', docRef.id);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error saving event to Firestore: ', error);
    }

    return event;
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserId(user?.uid || null);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      subscriptionManager.subscribedAndPurchasedResources(userId)
        .then(fetchedResources => {
          setResources(fetchedResources);
          console.log(`fetchedResources.length=${fetchedResources.length}`)
          if (fetchedResources.length === 1) {
            console.log(`fesetSelectedResource(${fetchedResources[0].id})`)
            setSelectedResource(fetchedResources[0].id);
          } else {
            const lastResource = localStorage.getItem('lastResource');
            if (lastResource)
              setSelectedResource(lastResource);
          }
        })
        .catch(error => {
          console.error("EventsViewer Failed to fetch resources:", error);
        });
    }
  }, [userId]);


  // Fetch events
  useEffect(() => {
    setIsLoading(true);
    const fetchEvents = async () => {
      if (!userId) return;
      const eventSnapshot = await getDocs(query(collection(db, 'events'), where('userId', '==', userId)));

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
  }, [userId, lastUpdated]);

  const handleResourceChange = (selected: string) => {
    setSelectedResource(selected);
    localStorage.setItem('lastResource', selected);
  }


  const onDelete = async (id: string | number): Promise<string | number> => {
    const user = getAuth(firebaseApp).currentUser;

    if (!user) {
      console.log('No user is logged in.');
      return id;
    }

    const eventsCollection = collection(db, 'events');
    const docRef = doc(eventsCollection, id.toString());

    try {
      await deleteDoc(docRef);
      console.log('Event deleted with ID: ', id);
    } catch (error) {
      console.error('Error deleting event from Firestore: ', error);
    }

    return id;
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: 200 }}>
        <InputLabel id="resource-select-label">Select a resource</InputLabel>
        <Select
          labelId="resource-select-label"
          id="resource-select"
          value={selectedResource}
          onChange={(e) => handleResourceChange(e.target.value)}
          label="Select a resource"
        >
          {resources.map(resource => (
            <MenuItem value={resource.id} key={resource.id}>
              {resource.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Scheduler events={events} onConfirm={onConfirm} onDelete={onDelete} />
      <div>
        {resources.map(resource => (
          <div key={resource.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: getColorForResource(resource.id), marginRight: '10px' }} />
            <div>{resource.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsViewer;
