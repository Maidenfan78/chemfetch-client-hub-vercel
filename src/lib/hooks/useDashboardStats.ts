// src/lib/hooks/useDashboardStats.ts
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export interface DashboardStats {
  totalChemicals: number;
  sdsDocuments: number;
  hazardousSubstances: number;
  dangerousGoods: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChemicals: 0,
    sdsDocuments: 0,
    hazardousSubstances: 0,
    dangerousGoods: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = supabaseBrowser();
      setError(null);

      try {
        // Get total chemicals count
        const { count: totalChemicals, error: chemicalsError } = await supabase
          .from('user_chemical_watch_list')
          .select('*', { count: 'exact', head: true });

        if (chemicalsError) {
          throw new Error(`Failed to fetch chemicals count: ${chemicalsError.message}`);
        }

        // Get SDS documents count (chemicals with SDS URLs)
        const { count: sdsDocuments, error: sdsError } = await supabase
          .from('user_chemical_watch_list')
          .select('product_id')
          .not('product_id', 'is', null)
          .then(async ({ data: watchlistData, error }) => {
            if (error) {
              throw error;
            }
            if (!watchlistData?.length) {
              return { count: 0, error: null };
            }

            const productIds = watchlistData.map(item => item.product_id);
            return await supabase
              .from('product')
              .select('*', { count: 'exact', head: true })
              .in('id', productIds)
              .not('sds_url', 'is', null);
          });

        if (sdsError) {
          console.warn('Failed to fetch SDS count:', sdsError);
        }

        // Get hazardous substances count
        let hazardousCount = 0;
        let dangerousCount = 0;

        try {
          const { data: watchlistData, error: watchlistError } = await supabase
            .from('user_chemical_watch_list')
            .select('*');

          if (watchlistError) {
            console.warn('Failed to fetch watchlist for hazard counts:', watchlistError);
          } else if (watchlistData) {
            const productIds = watchlistData.map(item => item.product_id).filter(Boolean);

            if (productIds.length > 0) {
              // Try to get SDS metadata first
              const { data: sdsMetadata, error: sdsMetadataError } = await supabase
                .from('sds_metadata')
                .select('*')
                .in('product_id', productIds);

              if (sdsMetadataError) {
                console.warn('SDS metadata table not available:', sdsMetadataError);
              }

              // Create a map of product_id to SDS metadata
              const sdsMap = new Map();
              if (sdsMetadata) {
                sdsMetadata.forEach(meta => {
                  sdsMap.set(meta.product_id, meta);
                });
              }

              // Count hazardous and dangerous goods
              watchlistData.forEach(item => {
                const sdsData = sdsMap.get(item.product_id);

                // Check hazardous substance (prefer SDS metadata, fallback to watchlist data)
                const isHazardous = sdsData?.hazardous_substance ?? item.hazardous_substance;
                if (isHazardous) {
                  hazardousCount++;
                }

                // Check dangerous good (prefer SDS metadata, fallback to watchlist data)
                const isDangerous = sdsData?.dangerous_good ?? item.dangerous_good;
                if (isDangerous) {
                  dangerousCount++;
                }
              });
            }
          }
        } catch (err) {
          console.warn('Failed to calculate hazard counts:', err);
        }

        setStats({
          totalChemicals: totalChemicals ?? 0,
          sdsDocuments: sdsDocuments ?? 0,
          hazardousSubstances: hazardousCount,
          dangerousGoods: dangerousCount,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
