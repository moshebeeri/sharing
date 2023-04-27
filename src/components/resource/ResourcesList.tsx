import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import ResourceCard from "./ResourceCard";
import ResourceForm from "./ResourceForm";

export interface ResourceType {
  id: string;
  title: string;
  description: string;
  price: number;
  availability: string;
  images: string[];
  primaryImageIndex: number;
  availableResources: number;
  isGroupClosed: boolean;
  resourceGroupName: string;
  videos: string[];
}

interface ResourcesListProps {
  resources: ResourceType[];
  title?: string;
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources, title = "My Resources" }) => {
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);

  const handleFormSubmit = () => {
    // Refresh the resources list and close the form
    setSelectedResource(null);
  };

  return (
    <Container>
      <Box mt={4} textAlign="center">
        <Typography variant="h4" gutterBottom style={{ color: blue[500] }}>
          {title}
        </Typography>
      </Box>
      {selectedResource && (
        <ResourceForm
          resource={selectedResource}
          onSubmit={handleFormSubmit}
          editMode = {true}
        />
      )}
      <Grid container spacing={2}>
        {resources.map((resource) => (
          <Grid item key={resource.id} xs={12} sm={6} md={4} lg={3}>
            <ResourceCard
              resource={resource}
              onEdit={() => setSelectedResource(resource)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResourcesList;
