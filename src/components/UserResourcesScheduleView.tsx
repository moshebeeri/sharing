import { Fragment, useEffect, useRef, useState } from "react";
import { Button, Typography } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent, SchedulerRef } from "@aldabil/react-scheduler/types";
// import { RESOURCES, EVENTS } from "./data";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SubscriberType, SubscriptionManager } from '../app/operations/SubscriptionManager';
import { ResourceType } from "./resource/ResourcesList";
import { firebaseApp } from '../config/firebase';
import { getFirestore, collection, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";

interface ResourcedEvent extends ProcessedEvent {
  resourceId: string
  userId: string
  created: Date
}

const db = getFirestore(firebaseApp);

function UserResourcesScheduleView() {
  const [mode, setMode] = useState<"default" | "tabs">("default");
  const calendarRef = useRef<SchedulerRef>(null);
  const [events, setEvents] = useState<ResourcedEvent[]>([]);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    setIsLoading(true)
    const userId = auth.currentUser?.uid; // Fetch the current user's ID
    if (userId) { // Only run the query if a user is signed in
      console.log("userId: " + userId);
      const resourcesQuery = query(
        collection(db, "resources"),
        where("userId", "==", userId), // Filter where userId matches the logged-in user
        orderBy("createdAt", "desc") // Order by createdAt in descending order
      );
      const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
        const resourcesData: ResourceType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ResourceType[];
        setResources(resourcesData);
      });

      setIsLoading(false)
      return () => {
        unsubscribe();
      };
    }
  }, [auth.currentUser]); // Rerun effect when the current user changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserId(user?.uid || null);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  });

  useEffect(() => {
    setIsLoading(true);

    const fetchEvents = async () => {
      const currentTime = new Date();
      if (!userId) return;
      const resourceIds = resources.map((resource) => resource.id);  // Extract the ids
      if(resourceIds.length === 0) {
        console.log('User does not own any resources.');
        setIsLoading(false);
        return;
      }

      const eventSnapshot = await getDocs(query(
        collection(db, 'events'),
        where('resourceId', 'in', resourceIds),  // Match against array of resource IDs
        where('start', '>=', currentTime)
      ));

      // Transform the data from Firestore
      const userEvents: ResourcedEvent[] = eventSnapshot.docs.map((doc) => {
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
  }, [resources, userId]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (resources.length < 1) {
    return <div>
        You have no resource asociated with this account <br/>
        <a href="/resources">Go to resources </a> and select 'Add Resource'
      </div>
  }

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        <span>Resource View Mode: </span>
        <Button
          color={mode === "default" ? "primary" : "inherit"}
          variant={mode === "default" ? "contained" : "text"}
          size="small"
          onClick={() => {
            setMode("default");
            calendarRef.current?.scheduler?.handleState(
              "default",
              "resourceViewMode"
            );
          }}
        >
          Default
        </Button>
        <Button
          color={mode === "tabs" ? "primary" : "inherit"}
          variant={mode === "tabs" ? "contained" : "text"}
          size="small"
          onClick={() => {
            setMode("tabs");
            calendarRef.current?.scheduler?.handleState(
              "tabs",
              "resourceViewMode"
            );
          }}
        >
          Tabs
        </Button>
      </div>
      <Scheduler
        ref={calendarRef}
        events={events}
        resources={resources}
        resourceFields={{
          idField: "id",
          textField: "title",
          subTextField: "mobile",
          avatarField: "title",
          colorField: "color"
        }}
        fields={[
          {
            name: "id",
            type: "select",
            default: resources.length>0? resources[0].id : '',
            options: resources.map((res) => {
              return {
                id: res.id,
                text: `${res.title}`,
                value: res.id //Should match "name" property
              };
            }),
            config: { label: "Assignee", required: true }
          }
        ]}
        viewerExtraComponent={(fields, event) => {
          return (
            <div>
              {fields.map((field, i) => {
                if (field.name === "admin_id") {
                  const admin = field.options?.find(
                    (fe) => fe.id === event.admin_id
                  );
                  return (
                    <Typography
                      key={i}
                      style={{ display: "flex", alignItems: "center" }}
                      color="textSecondary"
                      variant="caption"
                      noWrap
                    >
                      <PersonRoundedIcon /> {admin?.text}
                    </Typography>
                  );
                } else {
                  return "";
                }
              })}
            </div>
          );
        }}
      />
    </Fragment>
  );
}

export default UserResourcesScheduleView;
