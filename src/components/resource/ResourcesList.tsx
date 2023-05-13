import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import ResourceFormCard from "./ResourceFormCard";
import ResourceForm from "./ResourceForm";
import { PatternType } from "./AvailabilityPatternForm";
import { PricingModel } from "../xmui/PriceTag";
import { useNavigate } from 'react-router-dom';

export interface ResourceType {
  id: string;
  title: string;
  description: string;
  price: PricingModel;
  availability: string[];
  images: string[];
  primaryImageIndex: number;
  availableResources: number;
  isGroupClosed: boolean;
  resourceGroupName: string;
  resourceCategoryName: string;
  videos: string[];
  address: string;
  lat: number;
  lng: number;
  radius: number | null;
  isPickup: boolean;
  createdAt: Date;
  quota: number | null;
  selectedField: keyof PatternType;
  promoted: boolean;
}

interface ResourcesListProps {
  resources: ResourceType[];
  title?: string;
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources, title = "My Resources" }) => {
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = () => {
    // Refresh the resources list and close the form
    setSelectedResource(null);
  };

  function onEditSubscribers(resource: ResourceType): void {
    navigate(`/subscribers/${resource.id}`);
  }

  return (
    <Container>
      <Box mt={4} textAlign="center">
        {selectedResource ? null :
          <Typography variant="h4" gutterBottom style={{ color: blue[500] }}>
            {title}
          </Typography>
        }
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
          <Grid item key={resource.id} xs={12} sm={12} md={6} lg={4}>
            <ResourceFormCard
              resource={resource}
              onEdit={() => setSelectedResource(resource)}
              onEditSubscribers={() => onEditSubscribers(resource)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResourcesList;
