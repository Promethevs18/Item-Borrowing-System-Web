// Notifications.js
import React, { useEffect } from 'react';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { Bounce, toast } from 'react-toastify';


const Notif = () => {

    const db = getFirestore();
  useEffect(() => {
    // Request permission for browser notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Listen for real-time updates in Firestore
    const q = query(collection(db, "Items"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            showNotification("New item: ", change.doc.data().assetName);
        }
        if (change.type === "modified") {
            showNotification("Modified item: ", change.doc.data().assetName);

        }
        if (change.type === "removed") {
           showNotification("Removed item: ", change.doc.data().assetName);
           
        }
      });
    });

    const r = query(collection(db, "Approved Requests"));
    const newNotif = onSnapshot(r, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            showNotification("New approval: ", change.doc.data().borrower);
        }
        if (change.type === "modified") {
            showNotification("Modified approval: ", change.doc.data().borrower);

        }
        if (change.type === "removed") {
           showNotification("Data removed: ", change.doc.data().borrower);
           
        }
      });
    });

    const s = query(collection(db, "Calibrated Items"));
    const calibNotif = onSnapshot(s, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            showNotification("New calibration: ", change.doc.data().instrumentType);
        }
        if (change.type === "modified") {
            showNotification("Modified detail: ", change.doc.data().instrumentType);

        }
        if (change.type === "removed") {
           showNotification("Removed item: ", change.doc.data().instrumentType);
        }
      });
    });

    const t = query(collection(db, "Requests"));
    const reqNotif = onSnapshot(t, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            showNotification("New request: ", change.doc.data().borrower);
        }
        if (change.type === "modified") {
            showNotification("Modified request: ", change.doc.data().borrower);

        }
        if (change.type === "removed") {
           showNotification("Rejected Request: ", change.doc.data().borrower);
        }
      });
    });

    const u = query(collection(db, "Users list"));
    const userNotif = onSnapshot(u, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            showNotification("New request: ", change.doc.data().borrower);
        }
        if (change.type === "modified") {
            showNotification("Modified request: ", change.doc.data().borrower);

        }
        if (change.type === "removed") {
           showNotification("Rejected Request: ", change.doc.data().borrower);
        }
      });
    });


    // Clean up the listener on unmount
    return () => {
        unsubscribe();
        newNotif();
        calibNotif();
        reqNotif();
        userNotif();
    };

  }, []);

  // Function to show a browser notification
  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
        toast.info(`🦄 ${title + body}!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
    }
  };

  return null; // This component doesn't render anything
};

export default Notif;
