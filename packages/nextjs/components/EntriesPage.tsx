"use client";

/**
 * Component for displaying user's attestation entries on a map
 * Provides filtering and interactive features
 */

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import EntriesMap from './EntriesMap';
import easConfig from "~~/EAS.config";
import { useAccount } from 'wagmi';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Initialize Apollo Client for GraphQL queries
const client = new ApolloClient({
  uri: 'https://sepolia.easscan.org/graphql',
  cache: new InMemoryCache(),
});

 // Single entry with location and metadata
interface Entry {
  id: string;                    
  coordinates: [number, number]; 
  timestamp: string;            
  memo: string;
  media?: string;                 
  uid: string;                  
}

 // GraphQL query to fetch attestations for a specific address and schema
const GET_ATTESTATIONS = gql`
  query GetAttestations($attester: String!, $schemaId: String!) {
    attestations(where: { attester: { equals: $attester }, schemaId: { equals: $schemaId } }) {
      id attester decodedDataJson time schemaId
    }
  }
`;

// Fetching, processing, and displaying attestation data on a map
const EntriesPage = () => {
  const router = useRouter();
  const { targetNetwork } = useTargetNetwork();
  const { address } = useAccount();
  
  // Component state
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hoveredEntry, setHoveredEntry] = React.useState<Entry | null>(null);
  const [hoverPosition, setHoverPosition] = React.useState<{ x: number, y: number } | null>(null);

  // Fetches and processes attestation entries from the blockchain
  const fetchEntries = React.useCallback(async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    try {
      // Get schema ID for current network
      const schemaId = easConfig.chains[targetNetwork.id.toString() as keyof typeof easConfig.chains]?.schemaUID;
      
      // Fetch attestations
      const { data } = await client.query({
        query: GET_ATTESTATIONS,
        variables: { attester: address, schemaId }
      });

      // Process and validate attestation data
      const processedEntries = data?.attestations
        .map((att: any) => {
          try {
            const decodedData = JSON.parse(att.decodedDataJson);
            
            // Extract required fields from attestation
            const locationData = decodedData.find((item: any) => item.name === 'location')?.value?.value;
            const timestampData = decodedData.find((item: any) => item.name === 'eventTimestamp')?.value?.value?.hex;
            const memoData = decodedData.find((item: any) => item.name === 'memo')?.value?.value;
            const mediaData = decodedData.find((item: any) => item.name === 'mediaData')?.value?.value?.[0];

            if (!locationData || !timestampData) return null;

            // Parse location string into coordinates
            const [longitude, latitude] = locationData.split(',').map(Number);
            if (isNaN(longitude) || isNaN(latitude)) return null;

            const entry = {
              id: att.id,
              coordinates: [longitude, latitude] as [number, number],
              timestamp: new Date(parseInt(timestampData, 16) * 1000).toISOString(),
              memo: memoData || '',
              media: mediaData || undefined,
              uid: att.id
            };

            console.log('Processed entry with media:', { decodedData, mediaData, entry });
            return entry;
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean);

      setEntries(processedEntries);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  }, [address, targetNetwork.id]);

  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <main className="p-5 border border-black bg-[#f0f0f0] min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-3/4 p-4">
        <Link href="/" className="text-[#009900] hover:underline">← Back to Home</Link>
        
        <div className="mt-4">
          {/* Header with entry count and refresh button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[#333] text-2xl font-bold">Your Past Entries {entries.length > 0 && `(${entries.length})`}</h1>
            <button onClick={fetchEntries} className="text-[#009900] hover:underline">Refresh →</button>
          </div>

          {/* Conditional rendering based on loading/error state */}
          {error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : isLoading ? (
            <div className="text-center py-12"><p className="text-[#333]">Loading your entries...</p></div>
          ) : entries.length > 0 ? (
            <div className="h-[75vh] w-full relative">
              <EntriesMap 
                entries={entries} 
                onMarkerClick={(entry) => router.push(`/attestation/uid/${entry.uid}`)} 
                onMarkerHover={(entry, event) => {
                  setHoveredEntry(entry);
                  setHoverPosition({ x: event.clientX, y: event.clientY });
                }}
                onMarkerLeave={() => {
                  setHoveredEntry(null);
                  setHoverPosition(null);
                }}
              />
              {hoveredEntry && hoverPosition && (
                <div 
                  className="absolute bg-[#009900] text-white p-3 rounded-lg shadow-xl border border-[#007700]"
                  style={{ 
                    top: hoverPosition.y - 80,
                    left: hoverPosition.x - 100,
                    zIndex: 1000,
                    minWidth: '200px',
                    transform: 'translate(-5%, -100%)'
                  }}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium border-b border-[#007700] pb-1">
                      <span className="opacity-80">Time:</span>{' '}
                      {new Date(hoveredEntry.timestamp).toLocaleString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {hoveredEntry.media && (
                      <p className="text-sm">
                        <span className="opacity-80">Media:</span>{' '}
                        <span className="font-medium">{hoveredEntry.media}</span>
                      </p>
                    )}
                    {hoveredEntry.memo && hoveredEntry.memo !== 'No memo' && (
                      <p className="text-sm">
                        <span className="opacity-80">Memo:</span>{' '}
                        <span className="font-medium">{hoveredEntry.memo}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#333] mb-6">No entries found.</p>
              <Link href="/register" className="text-[#009900] hover:underline">Create your first entry →</Link>
            </div>
          )}
        </div>
      </div>
      <div className="lg:w-1/3 p-4 border-t lg:border-t-0 lg:border-l border-black overflow-y-auto max-h-screen">
        <h2 className="text-[#009900] mb-4 text-xl font-semibold">Historical Locations</h2>
        {[...entries]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map(entry => (
          <div 
            key={entry.id} 
            className="p-3 mb-3 cursor-pointer bg-[#009900] text-white hover:bg-[#007700] transition-colors duration-200 rounded-lg break-words" 
            onClick={() => router.push(`/attestation/uid/${entry.uid}`)}
          >
            <p className="text-sm mb-1 border-b border-[#007700] pb-1">
              <strong>Time:</strong> {new Date(entry.timestamp).toLocaleString()}
            </p>
            {entry.media && (
              <p className="text-sm mb-1">
                <strong>Media:</strong> {entry.media}
              </p>
            )}
            {entry.memo && entry.memo !== 'No memo' && (
              <p className="text-sm">
                <strong>Memo:</strong> {entry.memo}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default EntriesPage;