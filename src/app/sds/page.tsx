// src/app/sds/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase-server';

type WatchListItem = {
  id: number;
  product: {
    name: string;
    sds_url: string | null;
  };
};

export default async function SdsPage() {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // fetch the user’s watch-list
  const { data: watchList } = await supabase
    .from('user_chemical_watch_list')
    .select('id, product:product_id(name, sds_url)')
    .returns<WatchListItem[]>();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">SDS Register</h2>
      <ul className="mt-4 space-y-2">
        {watchList?.map(item => (
          <li key={item.id}>
            <a
              href={item.product.sds_url ?? '#'}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {item.product.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
