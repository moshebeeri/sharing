import React, { useEffect, useState } from 'react';
import { query, collection, where, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { Scheduler } from '@aldabil/react-scheduler';
import { ResourceType } from './resource/ResourcesList';
import { SubscriberType, SubscriptionManager } from '../app/operations/SubscriptionManager';
import { getAuth } from '@firebase/auth';
import { firebaseApp } from '../config/firebase';
import { getFirestore } from 'firebase/firestore';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Box } from '@mui/system';

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
  '#000000', // black
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
      event.color = getColorForResource(selectedResource);
      await setDoc(docRef, {
        ...event,
        userId: user.uid,
        resourceId: selectedResource,
        created: Date.now(),
      });
      console.log('Event saved with ID: ', docRef.id);
    } catch (error) {
      console.error('Error saving event to Firestore: ', error);
    }
  
    return event;
  };
  
  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      const subscriber: SubscriberType = {
        userId: auth.currentUser?.uid || ''

      };
      const fetchedResources = await subscriptionManager.subscribedResources(subscriber);
      setResources(fetchedResources);
    };

    fetchResources();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedResource) return; // If no resource is selected, don't fetch events

      const eventsRef = query(
        collection(db, 'events'),
        where('resourceId', '==', selectedResource)
      );
      const eventsSnapshot = await getDocs(eventsRef);
      setEvents(eventsSnapshot.docs.map(doc => ({ ...doc.data()} as ResourcedEvent)));
    };

    fetchEvents();
  }, [selectedResource]);

  const handleResourceChange = (selected: string) => {
    setSelectedResource(selected);
  };
  
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
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {resources.map(resource => (
            <MenuItem value={resource.id} key={resource.id}>
              {resource.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Scheduler events={events} onConfirm={onConfirm} />
    </div>
  );
};

export default EventsViewer;
