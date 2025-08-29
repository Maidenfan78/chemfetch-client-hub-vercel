'use client';

import { useState } from 'react';
import { MobileAppReminder } from '@/components/MobileAppReminder';

// Watchlist Page Component
export default function WatchlistPage() {
  const [data] = useState([]);
  const [loading] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chemical Watchlist</h1>

      <MobileAppReminder />

      {data.length === 0 && !loading ? (
        <p>No entries found.</p>
      ) : (
        <div>{/* Watchlist content will go here */}</div>
      )}
    </div>
  );
}
