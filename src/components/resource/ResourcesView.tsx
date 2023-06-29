import React, { useState, useEffect } from "react";
import { Container, Box, Tab, Tabs } from "@mui/material";
import ResourcesList, { ResourceType } from "./ResourcesList";
import ResourceForm from "./ResourceForm";
import { getFirestore, collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { firebaseApp } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import Search from "../search/Search";


const db = getFirestore(firebaseApp);
const ResourcesView: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const auth = getAuth();

  useEffect(() => {
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

      return () => {
        unsubscribe();
      };
    }
  }, [auth.currentUser]); // Rerun effect when the current user changes

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedOption(newValue);
  };

  const onResourceFormSubmit = () => {
    setSelectedOption(0);
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={selectedOption} onChange={handleTabChange}>
          <Tab label="My Resources" />
          <Tab label="Add Resource" />
          <Tab label="Find Resource" />

        </Tabs>
      </Box>

      {selectedOption === 0 && <ResourcesList resources={resources} title="My Resources" />}
      {selectedOption === 1 && <ResourceForm onSubmit={onResourceFormSubmit} />}
      {selectedOption === 2 && <Search/>}

    </Container>
  );
};

export default ResourcesView;
