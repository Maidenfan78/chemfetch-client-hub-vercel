// src/app/api/delete-item/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const watchListId = searchParams.get('id');

    if (!watchListId) {
      return NextResponse.json({ error: 'Invalid watchlist ID' }, { status: 400 });
    }

    const supabase = await supabaseServer();

    // Get the current user to ensure they can only delete their own items
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, get the watchlist item to ensure it belongs to the current user
    const { data: watchListItem, error: fetchError } = await supabase
      .from('user_chemical_watch_list')
      .select('id, product_id, user_id')
      .eq('id', watchListId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (watchListItem.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the watchlist item
    const { error: deleteError } = await supabase
      .from('user_chemical_watch_list')
      .delete()
      .eq('id', watchListId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Optionally, you might want to clean up related data
    // For example, if this was the last reference to a product, you might want to delete SDS metadata
    // However, this depends on your business logic and whether products are shared between users

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Unexpected error in delete-item route:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
