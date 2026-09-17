import { useState, useEffect } from 'react';
import { db, collection, getDocs, setDoc, doc } from '../firebase';
import { Vehicle } from '../types';
import { VEHICLE_FLEET as DEFAULT_FLEET } from '../data/mockData';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_FLEET);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const colRef = collection(db, 'vehicles');
        const snapshot = await getDocs(colRef);
        
        if (!isMounted) return;

        if (snapshot.empty) {
          // Seed the database if empty in the background
          console.log('Vehicles collection is empty in Firestore, seeding owner cars...');
          for (const v of DEFAULT_FLEET) {
            try {
              const vRef = doc(db, 'vehicles', v.id);
              await setDoc(vRef, v);
            } catch (seedErr) {
              console.warn('Seeding vehicle skipped:', v.id, seedErr);
            }
          }
          if (isMounted) {
            setVehicles(DEFAULT_FLEET);
            setError(null);
          }
        } else {
          const fetchedVehicles: Vehicle[] = [];
          const validIds = new Set(DEFAULT_FLEET.map(v => v.id));
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Vehicle;
            // Only include owner's approved vehicles
            if (validIds.has(data.id)) {
              const defaultV = DEFAULT_FLEET.find(df => df.id === data.id);
              const updatedVehicle: Vehicle = {
                ...data,
                image: defaultV?.image || data.image,
              };
              if (defaultV && data.image !== defaultV.image) {
                // Keep Firestore document in sync with the owner's updated image
                const vRef = doc(db, 'vehicles', data.id);
                setDoc(vRef, { image: defaultV.image }, { merge: true }).catch(() => {});
              }
              fetchedVehicles.push(updatedVehicle);
            }
          });
          
          if (isMounted) {
            if (fetchedVehicles.length === DEFAULT_FLEET.length) {
              setVehicles(fetchedVehicles.sort((a, b) => a.ratePerKm - b.ratePerKm));
            } else {
              // Update Firestore with missing owner vehicles
              for (const v of DEFAULT_FLEET) {
                try {
                  const vRef = doc(db, 'vehicles', v.id);
                  await setDoc(vRef, v);
                } catch {}
              }
              setVehicles(DEFAULT_FLEET);
            }
            setError(null);
          }
        }
      } catch (err: any) {
        console.warn('Firestore vehicles fetch fallback to defaults:', err);
        if (isMounted) {
          // Fallback to default fleet seamlessly
          setVehicles(DEFAULT_FLEET);
          setError(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  return { vehicles, loading, error };
}
