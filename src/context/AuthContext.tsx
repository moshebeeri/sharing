import React from "react";
import * as firebase from 'firebase/auth';

export const AuthContext = React.createContext<firebase.User | null>(null);

