import { useState, useEffect } from 'react';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';

import SearchBox, { SearchType } from './SearchBox';
import { useLocation, useNavigate } from "react-router-dom";
import SearchResults from './SearchResults';
import { ResourceType } from '../resource/ResourcesList';

const db = getFirestore()

interface SearchProps {
  embedded?: boolean;
}

const Search: React.FC<SearchProps> = ({ embedded }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialSearch: SearchType = {
    category: '',
    radius: 0,
    location: '',
    freeText: ''
  };

  const [search, setSearch] = useState<SearchType>(location.state ? location.state as SearchType : initialSearch);
  const [resources, setResources] = useState<ResourceType[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(embedded) {
      navigate('/search', { state: search });
    } else {
      // perform search here, it's already handled in useEffect
    }
  }

  useEffect(() => {
    if (!embedded) {
      const resourcesQuery = query(collection(db, 'resources'), orderBy('title'));
      const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
        const resourcesData: ResourceType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ResourceType[];
        setResources(resourcesData);
      });

      return () => unsubscribe();
    }
  }, [search, embedded]);

  return (
    <>
      <SearchBox handleSubmit={handleSubmit} search={search} setSearch={setSearch} />
      {!embedded && <SearchResults resources={resources} />}
    </>
  )
}

export default Search;
