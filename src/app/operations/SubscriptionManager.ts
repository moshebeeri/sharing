import {
  DocumentReference,
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  where,
  getFirestore,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { firebaseApp } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { Invite } from '../../components/types';

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

interface SubscriberType {
  userId: string;
  // add other properties as needed
}

interface ResourceType {
  id: string;
  // add other properties as needed
}

interface SubscriptionType {
  subscriberId: DocumentReference,
  resourceId: DocumentReference,
  createdAt: Date,
  dueDate: Date,
}

class SubscriptionManager {
  private userId: string | undefined;

  constructor() {
    this.userId = auth.currentUser?.uid;
  }
  public async getAllSubscriptions(subscriber: SubscriberType): Promise<ResourceType[]> {
    // Query for all subscriptions for this user
    const subscriptionRef = query(
      collection(db, 'subscriptions'),
      where('subscriberId', '==', subscriber.userId)
    );
    const subscriptionSnapshot = await getDocs(subscriptionRef);

    // Gather the resources of all the subscriptions
    const resources: ResourceType[] = [];
    subscriptionSnapshot.forEach(async (resource) => {
      const resourceRef = doc(db, 'resources', resource.data().resourceId);
      const resourceSnap = await getDoc(resourceRef);
      resources.push(resourceSnap.data() as ResourceType);
    });
    return resources;
  }

  public async subscribe(subscriber: SubscriberType, resource: ResourceType): Promise<ResourceType[]> {
    const subscriptionRef = doc(collection(db, 'subscriptions'));
    const newSubscription = {
      subscriberId: subscriber.userId,
      resourceId: resource.id,
      createdAt: new Date(),
      // add more fields as needed
    };
    await setDoc(subscriptionRef, newSubscription);
    return this.subscribedResources(subscriber);
  }

  public async unsubscribe(subscriber: SubscriberType, resource: ResourceType): Promise<ResourceType[]> {
    const subscriptionRef = query(
      collection(db, 'subscriptions'),
      where('subscriberId', '==', subscriber.userId),
      where('resourceId', '==', resource.id)
    );
    const subscriptionSnapshot = await getDocs(subscriptionRef);
    subscriptionSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    return this.subscribedResources(subscriber);
  }

  public async subscribedResources(subscriber: SubscriberType): Promise<ResourceType[]> {
    const subscriptionRef = query(
      collection(db, 'subscriptions'),
      where('subscriberId', '==', subscriber.userId)
    );
    const subscriptionSnapshot = await getDocs(subscriptionRef);
    const resources: ResourceType[] = [];
    subscriptionSnapshot.forEach(async (resource) => {
      const resourceRef = doc(db, 'resources', resource.data().resourceId);
      const resourceSnap = await getDoc(resourceRef);
      resources.push(resourceSnap.data() as ResourceType);
    });
    return resources;
  }

  public async dueSubscription(subscriber: SubscriberType): Promise<ResourceType[]> {
    // Depending on how you store subscription due dates, you would need to modify this method.
    // For simplicity, let's assume that there's a 'dueDate' field in each subscription document.
    const subscriptionRef = query(
      collection(db, 'subscriptions'),
      where('subscriberId', '==', subscriber.userId),
      where('dueDate', '<=', new Date())
    );
    const subscriptionSnapshot = await getDocs(subscriptionRef);
    const resources: ResourceType[] = [];
    subscriptionSnapshot.forEach(async (resource) => {
      const resourceRef = doc(db, 'resources', resource.data().resourceId);
      const resourceSnap = await getDoc(resourceRef);
      resources.push(resourceSnap.data() as ResourceType);
    });
    return resources;
  }

  public async subscriptionsToRenew(subscriber: SubscriberType): Promise<ResourceType[]> {
    // Depending on how you store subscription due dates, you would need to modify this method.
    // For simplicity, let's assume that there's a 'dueDate' field in each subscription document.
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    // Query for subscriptions with a renewalDate before or on one month from now
    const subscriptionRef = query(
      collection(db, 'subscriptions'),
      where('subscriberId', '==', subscriber.userId),
      where('renewalDate', '<=', oneMonthFromNow)
    );
    const subscriptionSnapshot = await getDocs(subscriptionRef);

    // Gather the resources of the subscriptions due to renew
    const resources: ResourceType[] = [];
    subscriptionSnapshot.forEach(async (resource) => {
      const resourceRef = doc(db, 'resources', resource.data().resourceId);
      const resourceSnap = await getDoc(resourceRef);
      resources.push(resourceSnap.data() as ResourceType);
    });
    return resources;
  }

  public async invite(resourceId: string, email: string) {
    const invitesCollection = collection(db, 'invites');
    const docRef = doc(invitesCollection);
    await setDoc(docRef, {
      userId: this.userId,
      resourceId,
      email,
    });
  }

  public async getInvites(userId: string): Promise<Invite[]> {
    const db = getFirestore();
    const querySnapshot = await getDocs(query(collection(db, "invites"), where("userId", "==", userId)));
    const invites: Invite[] = [];
    querySnapshot.forEach((doc) => {
      invites.push(doc.data() as Invite);
    });
    return invites;
  }

  public async uploadDocuments(documents: File[]) {
    throw new Error('Method not implemented.');
  }
}

export {SubscriptionManager}