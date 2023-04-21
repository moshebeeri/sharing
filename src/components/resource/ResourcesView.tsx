import React, { useState, useEffect } from "react";
import { Container, Box, Tab, Tabs } from "@mui/material";
import ResourcesList, { ResourceType } from "./ResourcesList";
import ResourceForm from "./ResourceForm";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { firebaseApp } from '../../config/firebase';
import { getStorage } from "firebase/storage";
import { getFirestore } from '@firebase/firestore';


const db = getFirestore(firebaseApp);
const ResourcesView: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [resources, setResources] = useState<ResourceType[]>([]);

  useEffect(() => {
    const resourcesQuery = query(collection(db, "resources"), orderBy("title"));
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
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedOption(newValue);
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={selectedOption} onChange={handleTabChange}>
          <Tab label="My Resources" />
          <Tab label="Find Resource" />
          <Tab label="Add Resource" />
        </Tabs>
      </Box>

      {selectedOption === 0 && <ResourcesList resources={resources} title="My Resources" />}
      {selectedOption === 1 && <ResourcesList resources={resources} title="Find Resource"/>}
      {selectedOption === 2 && <ResourceForm onSubmit={() => {}} />}
    </Container>
  );
};

export default ResourcesView;
