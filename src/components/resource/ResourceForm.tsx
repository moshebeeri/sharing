import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  where
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";
import { firebaseApp } from '../../config/firebase';
import { Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box } from "@mui/system";
import { getAuth } from "firebase/auth";
import {
  Container,
  IconButton,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank, Delete } from "@mui/icons-material";
import AvailabilityPatternForm from "./AvailabilityPatternForm";
import { useAppSelector } from '../../app/hooks';
import Alert from '@mui/material/Alert';

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

interface ResourceFormProps {
  resource?: {
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
  };
  onSubmit: () => void;
  editMode?: boolean;
}


const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onSubmit, editMode }) => {
  const availabilityPatternError = useAppSelector((state) => state.availabilityPattern.error.message);
  const [title, setTitle] = useState(resource?.title || "");
  const [description, setDescription] = useState(resource?.description || "");
  const [price, setPrice] = useState(resource?.price || 0);
  const [availabilityPattern, setAvailabilityPattern] = useState(resource?.availability || "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ file: File; url: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(resource?.images || []);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(resource?.primaryImageIndex || 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [availableResources, setAvailableResources] = useState(resource?.availableResources || 1);
  const [isGroupClosed, setIsGroupClosed] = useState(resource?.isGroupClosed || false);
  const [resourceGroupName, setResourceGroupName] = useState(resource?.resourceGroupName || "");
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [resourceGroupNames, setResourceGroupNames] = useState<string[]>([]);
  const [addNewResourceGroup, setAddNewResourceGroup] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    console.log("handleFormSubmit");
    e.preventDefault();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not logged in");
      return;
    }

    const resourceRef = resource
      ? doc(db, "resources", resource.id)
      : doc(collection(db, "resources"));
    const newImageUrls = await Promise.all(
      selectedImages.map(async (selectedImage, index) => {
        const imagePath = `resources/${resourceRef.id}/${index}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, selectedImage.file);
        return await getDownloadURL(imageRef);
      })
    );
    const newVideoUrls = await Promise.all(
      videoFiles.map(async (videoFile, index) => {
        const videoPath = `resources/${resourceRef.id}/videos/${index}`;
        const videoRef = ref(storage, videoPath);
        await uploadBytes(videoRef, videoFile);
        return await getDownloadURL(videoRef);
      })
    );

    if (addNewResourceGroup) {
      // Save the new resource group to Firestore with the user ID
      await addDoc(collection(db, "resourceGroups"), { name: resourceGroupName, userId });
    }

    await setDoc(resourceRef, {
      userId,
      title,
      description,
      price,
      availability: availabilityPattern, // Set availability to availabilityPattern
      images: [...imageUrls, ...newImageUrls],
      primaryImageIndex,
      availableResources,
      isGroupClosed,
      resourceGroupName,
      videos: newVideoUrls,
    });
    onSubmit();
  };


  useEffect(() => {
    const fetchResourceGroupNames = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("User not logged in");
        return;
      }

      const q = query(collection(db, "resourceGroups"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const names: string[] = [];
      querySnapshot.forEach((doc) => {
        names.push(doc.data().name);
      });
      setResourceGroupNames(names);
    };


    fetchResourceGroupNames();
  }, []);

  useEffect(() => {
    const totalSize = videoFiles.reduce((acc, video) => acc + video.size, 0);

    if (totalSize > 200 * 1024 * 1024) {
      //setSubmitDisabled(true);
      console.log("The total size of the selected video files exceeds 200 MB.");
    } else {
      //setSubmitDisabled(false);
    }
  }, [videoFiles]);

  const handleDelete = async () => {
    if (!resource) return;

    await deleteDoc(doc(db, "resources", resource.id));
    onSubmit();
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newSelectedImages = Array.from(e.target.files)
      .filter((file) => !file.name.startsWith("."))
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      .filter(
        (newImage) =>
          !selectedImages.some((selectedImage) => selectedImage.file.name === newImage.file.name)
      );

    const combinedImages = [...selectedImages, ...newSelectedImages];

    const totalSize = combinedImages.reduce((acc, image) => acc + image.file.size, 0);

    if (totalSize > 200 * 1024 * 1024) {
      alert("The total size of the selected images exceeds 200 MB.");
      return;
    }

    setSelectedImages(combinedImages);

    // Reset the input value
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));

    // Reset the input value
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  const handlePrimaryImage = (value: number) => {
    setPrimaryImageIndex(value);
  };
  const handleVideoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setVideoFiles(Array.from(e.target.files).filter((file) => !file.name.startsWith(".")));
  };

  return (
    <Container>
    <Box mt={4} textAlign="center">
      <Typography variant="h4" gutterBottom style={{ color: blue[500] }}>
        {editMode? "Edit Resource" : "Add Resource"}
      </Typography>
    </Box>

    <Form onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>

        <Form.Control
          type="text"
          placeholder="Enter title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description *</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="price">
        <Form.Label>Price (in USD $) *</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Availability *</Form.Label>
          <AvailabilityPatternForm
            value={availabilityPattern}
            onChange={(value: string) => setAvailabilityPattern(value)}
            fields={['hours', 'daysOfMonth', 'months', 'daysOfWeek']}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="availableResources">
          <Form.Label>Available Resources</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={availableResources}
            onChange={(e) => setAvailableResources(parseInt(e.target.value))}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="isGroupClosed">
          <Form.Check
            type="checkbox"
            label="Closed group (only admin can invite)"
            checked={isGroupClosed}
            onChange={(e) => setIsGroupClosed(e.target.checked)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="resourceGroupName">
          <Form.Label>Resource Group Name</Form.Label>
          {addNewResourceGroup ? (
            <Form.Control
              type="text"
              placeholder="Enter resource group name"
              value={resourceGroupName}
              onChange={(e) => setResourceGroupName(e.target.value)}
            />
          ) : (
              <Form.Select
                value={resourceGroupName}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === "add-new") {
                    setAddNewResourceGroup(true);
                    setResourceGroupName("");
                  } else {
                    setResourceGroupName(selectedValue);
                  }
                }}
              >
                <option value="" disabled>
                  Select a Resource Group
                </option>
                {resourceGroupNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
                <option value="add-new">Add New Resource Group</option>
              </Form.Select>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoSelect}
            style={{ display: "block" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            {...({ webkitdirectory: "true", directory: "true" } as any)}
            style={{ display: "block" }}
          />
          {selectedImages.map((image, index) => (
            <div key={index} className="mb-2" style={{ position: "relative", display: "inline-block" }}>
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                width="200"
                height="200"
                className="me-2"
                style={{ objectFit: "cover" }}
              />
              <IconButton
                size="small"
                color="success"
                style={{ position: "absolute", top: 0, left: 0 }}
                onClick={() => handlePrimaryImage(index)}
              >
                {primaryImageIndex === index ? <CheckBox fontSize="small" /> : <CheckBoxOutlineBlank fontSize="small" />}
              </IconButton>
              <IconButton
                size="small"
                color="info"
                style={{ position: "absolute", top: 0, right: 0, padding:"10px"}}
                onClick={() => handleRemoveImage(index)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </div>
          ))}
          {availabilityPatternError && (
            <Alert severity="error" style={{ marginTop: 16 }}>
              {availabilityPatternError}
            </Alert>
          )}
        </Form.Group>

      <Button variant="primary" type="submit" disabled={!formValid}>
          {resource ? "Update" : "Add"} Resource
      </Button>
      {resource && (
        <Button variant="danger" onClick={handleDelete} className="ms-3">
          Delete Resource
        </Button>
      )}
      </Form>
      </Container>
  );
};

export default ResourceForm;