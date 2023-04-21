import React, { ChangeEvent, FormEvent, useState } from "react";
import { Form, Button, FloatingLabel, ToggleButton, ToggleButtonGroup, Container } from "react-bootstrap";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";
import { firebaseApp } from '../../config/firebase';
import { Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box } from "@mui/system";
import { getAuth } from "firebase/auth";

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
  };
  onSubmit: () => void;
  editMode?: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onSubmit, editMode }) => {
  const [title, setTitle] = useState(resource?.title || "");
  const [description, setDescription] = useState(resource?.description || "");
  const [price, setPrice] = useState(resource?.price || 0);
  const [availability, setAvailability] = useState(resource?.availability || "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(resource?.images || []);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(resource?.primaryImageIndex || 0);

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
      imageFiles.map(async (imageFile, index) => {
        const imagePath = `resources/${resourceRef.id}/${index}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
      })
    );

    await setDoc(resourceRef, {
      userId,
      title,
      description,
      price,
      availability,
      images: [...imageUrls, ...newImageUrls],
      primaryImageIndex,
    });
    onSubmit();
  };

  const handleDelete = async () => {
    if (!resource) return;

    await deleteDoc(doc(db, "resources", resource.id));
    onSubmit();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newImageFiles = [...imageFiles];
    newImageFiles[index] = e.target.files[0];
    setImageFiles(newImageFiles);
  };

  const handlePrimaryImage = (value: number) => {
    console.log("handlePrimaryImage", value);
    setPrimaryImageIndex(value);
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
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="availability">
        <Form.Label>Availability</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Images</Form.Label>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="mb-2">
            <Form.Label htmlFor={`image-${index}`} className="me-2">
              Image {index + 1}:
            </Form.Label>
            {imageUrls[index] && (
              <img src={imageUrls[index]} alt={`Image ${index + 1}`} width="50" height="50" className="me-2" />
            )}
            <Form.Control
              id={`image-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e as React.ChangeEvent<HTMLInputElement>, index)}
            />
          </div>
        ))}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Primary Image</Form.Label>
        <ToggleButtonGroup
          type="radio"
          name="primaryImage"
          value={primaryImageIndex}
          onChange={handlePrimaryImage}
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <ToggleButton key={index} value={index} onClick={() => setPrimaryImageIndex(index)}>
              {index + 1}
            </ToggleButton>
          ))}
          </ToggleButtonGroup>
      </Form.Group>

      <Button variant="primary" type="submit">
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