// src/lib/hooks/useWatchList.ts
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import type { Database } from '@/types/supabase';

export type WatchListItem = {
  id: string;
  created_at?: string;
  quantity_on_hand?: number;
  location?: string;
  sds_available?: boolean;
  sds_issue_date?: string;
  hazardous_substance?: boolean;
  dangerous_good?: boolean;
  dangerous_goods_class?: string;
  description?: string;
  packing_group?: string;
  subsidiary_risks?: string;
  consequence?: string;
  likelihood?: string;
  risk_rating?: string;
  swp_required?: boolean;
  comments_swp?: string;
  product: {
    id: number;
    name: string;
    barcode: string;
    contents_size_weight: string | null;
    sds_url: string | null;
    manufacturer: string | null;
    sds_metadata: {
      vendor: string | null;
      issue_date: string | null;
      hazardous_substance: boolean | null;
      dangerous_good: boolean | null;
      dangerous_goods_class: string | null;
      packing_group: string | null;
      subsidiary_risks: string | null;
      description: string | null;
    } | null;
  };
};

export function useWatchList() {
  const [data, setData] = useState<WatchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchWatchList = async () => {
      const supabase = supabaseBrowser();
      setError(null);

      try {
        // Step 1: Get watchlist items with all fields
        const { data: watchListData, error: watchListError } = await supabase
          .from('user_chemical_watch_list')
          .select('*')
          .order('created_at', { ascending: false });

        if (watchListError) {
          console.error('Watchlist query error:', watchListError);
          setError(watchListError.message);
          setLoading(false);
          return;
        }

        if (!watchListData?.length) {
          setData([]);
          setLoading(false);
          return;
        }

        console.log('Watchlist data fetched:', watchListData);

        // Step 2: Get product information for all watchlist items
        const productIds = watchListData.map(item => item.product_id).filter(Boolean);

        const { data: productsData, error: productsError } = await supabase
          .from('product')
          .select('*')
          .in('id', productIds);

        if (productsError) {
          console.error('Products query error:', productsError);
          setError(productsError.message);
          setLoading(false);
          return;
        }

        // Create product lookup map
        const productsMap = new Map<number, Database['public']['Tables']['product']['Row']>();
        (productsData || []).forEach(product => {
          productsMap.set(product.id, product);
        });

        // Step 3: Get SDS metadata for products
        type SdsMetadata = {
          product_id: number;
          vendor?: string | null;
          issue_date?: string | null;
          hazardous_substance?: boolean | null;
          dangerous_good?: boolean | null;
          dangerous_goods_class?: string | null;
          packing_group?: string | null;
          subsidiary_risks?: string | null;
          description?: string | null;
        };
        let sdsMetadata: SdsMetadata[] = [];
        try {
          const { data: sdsData, error: sdsError } = await supabase
            .from('sds_metadata')
            .select('*')
            .in('product_id', productIds);

          if (sdsError) {
            console.warn('SDS metadata query failed:', sdsError);
          } else {
            sdsMetadata = sdsData || [];
            console.log('Successfully fetched SDS metadata:', sdsMetadata);
          }
        } catch (e) {
          console.warn('SDS metadata table may not exist:', e);
        }

        // Create SDS metadata lookup map
        const sdsMap = new Map<number, SdsMetadata>();
        sdsMetadata.forEach(meta => {
          sdsMap.set(meta.product_id, meta);
        });

        // Step 4: Combine all data
        const combinedData = watchListData
          .map(item => {
            const product = productsMap.get(item.product_id);
            const sdsFromSeparateTable = sdsMap.get(item.product_id);

            if (!product) {
              console.warn(`Product not found for product_id: ${item.product_id}`);
              return null;
            }

            // Prefer data from sds_metadata table, but use watchlist data as fallback
            const sdsMetadata = sdsFromSeparateTable || {
              vendor: null,
              issue_date: item.sds_issue_date || null,
              hazardous_substance: item.hazardous_substance || null,
              dangerous_good: item.dangerous_good || null,
              dangerous_goods_class: item.dangerous_goods_class || null,
              packing_group: item.packing_group || null,
              subsidiary_risks: item.subsidiary_risks || null,
              description: item.description || null,
            };

            return {
              id: item.id,
              created_at: item.created_at,
              quantity_on_hand: item.quantity_on_hand,
              location: item.location,
              sds_available: item.sds_available,
              sds_issue_date: item.sds_issue_date,
              hazardous_substance: item.hazardous_substance,
              dangerous_good: item.dangerous_good,
              dangerous_goods_class: item.dangerous_goods_class,
              description: item.description,
              packing_group: item.packing_group,
              subsidiary_risks: item.subsidiary_risks,
              consequence: item.consequence,
              likelihood: item.likelihood,
              risk_rating: item.risk_rating,
              swp_required: item.swp_required,
              comments_swp: item.comments_swp,
              product: {
                id: product.id,
                name: product.name || '',
                barcode: product.barcode || '',
                contents_size_weight: product.contents_size_weight || null,
                sds_url: product.sds_url || null,
                manufacturer: product.manufacturer || null,
                sds_metadata: sdsMetadata,
              },
            };
          })
          .filter(Boolean) as WatchListItem[]; // Remove null entries

        console.log('Final combined data:', combinedData);
        setData(combinedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchList();
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { data, loading, error, refresh };
}
