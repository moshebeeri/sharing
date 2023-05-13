import React, { useState, useEffect } from "react";
import { Container, Box, Tab, Tabs } from "@mui/material";
import ResourcesList, { ResourceType } from "./ResourcesList";
import ResourceForm from "./ResourceForm";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { firebaseApp } from '../../config/firebase';
import { getFirestore } from '@firebase/firestore';
import SearchBox from "../main/SearchBox";


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

  const onResourceFormSubmit = () => {
    setSelectedOption(0);
  };
  const temp = () => {
    const resourcesQuery = query(collection(db, "resources"), orderBy("title"));
    onSnapshot(resourcesQuery, (snapshot) => {
      const resourcesData: ResourceType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ResourceType[];
      setResources(resourcesData);
    });
  }


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
      {selectedOption === 2 && <SearchBox/>}

    </Container>
  );
};

export default ResourcesView;
