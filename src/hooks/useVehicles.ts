import { useState, useEffect } from 'react';
import { db, collection, getDocs, setDoc, doc } from '../firebase';
import { Vehicle } from '../types';
import { VEHICLE_FLEET as DEFAULT_FLEET } from '../data/mockData';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const colRef = collection(db, 'vehicles');
        const snapshot = await getDocs(colRef);
        
        if (snapshot.empty) {
          // Seed the database if empty
          console.log('Vehicles database is empty, seeding defaults...');
          const seededVehicles: Vehicle[] = [];
          for (const v of DEFAULT_FLEET) {
            const vRef = doc(db, 'vehicles', v.id);
            await setDoc(vRef, v);
            seededVehicles.push(v);
          }
          setVehicles(seededVehicles);
        } else {
          const fetchedVehicles: Vehicle[] = [];
          snapshot.forEach((doc) => {
            fetchedVehicles.push(doc.data() as Vehicle);
          });
          // Sort by base price or some logic if needed
          setVehicles(fetchedVehicles.sort((a, b) => a.ratePerKm - b.ratePerKm));
        }
      } catch (err: any) {
        console.error('Failed to fetch vehicles:', err);
        setError(err.message);
        // Fallback to defaults if Firestore fails
        setVehicles(DEFAULT_FLEET);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}
