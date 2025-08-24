// src/components/add-chemical-form.tsx
'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type AddChemicalFormProps = {
  onSuccess: () => void;
};

export function AddChemicalForm({ onSuccess }: AddChemicalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    sdsUrl: '',
    manufacturer: '',
    itemDescription: '',
    quantity: '',
    location: '',
    issueDate: '',
    hazardous: false,
    dangerousGood: false,
    dgClass: '',
    dgClassDescription: '',
    packingGroup: '',
    subsidiaryRisk: '',
    consequence: '',
    likelihood: '',
    riskRating: '',
    swpRequired: false,
    commentsSWP: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = supabaseBrowser();
      const nameTrimmed = formData.productName.trim();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 1) Find (case-insensitive) existing product by name
      const { data: existingProduct, error: searchError } = await supabase
        .from('product')
        .select('id')
        .ilike('name', nameTrimmed)
        .maybeSingle();

      if (searchError) {
        throw searchError;
      }

      let productId: number;

      if (existingProduct?.id) {
        productId = existingProduct.id;

        // Check if user already has this product in their watchlist
        const { data: existingWatchlistItem, error: checkError } = await supabase
          .from('user_chemical_watch_list')
          .select('id, created_at')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingWatchlistItem) {
          const addedDate = new Date(existingWatchlistItem.created_at).toLocaleDateString('en-AU');
          if (
            !confirm(
              `"${nameTrimmed}" is already in your chemical register list (added ${addedDate}).\n\nDo you want to update its details instead?`
            )
          ) {
            setLoading(false);
            return;
          }
        }
      } else {
        // 2) Create product
        const { data: newProduct, error: createError } = await supabase
          .from('product')
          .insert({
            barcode: `manual-${Date.now()}`, // Generate a unique barcode for manual entries
            name: nameTrimmed,
            sds_url: formData.sdsUrl || null,
            contents_size_weight: formData.itemDescription || null,
            manufacturer: formData.manufacturer || null,
          })
          .select('id')
          .single();

        if (createError) {
          throw createError;
        }
        productId = newProduct.id;
      }

      // 3) Add to user's watchlist without duplicates
      const { error: watchlistError } = await supabase.from('user_chemical_watch_list').upsert(
        {
          product_id: productId,
          quantity_on_hand: formData.quantity ? parseInt(formData.quantity) : null,
          location: formData.location || null,
          sds_available: Boolean(formData.sdsUrl),
          sds_issue_date: formData.issueDate || null,
          hazardous_substance: formData.hazardous,
          dangerous_good: formData.dangerousGood,
          dangerous_goods_class: formData.dgClass || null,
          description: formData.itemDescription || null,
          packing_group: formData.packingGroup || null,
          subsidiary_risks: formData.subsidiaryRisk || null,
          consequence: formData.consequence || null,
          likelihood: formData.likelihood || null,
          risk_rating: formData.riskRating || null,
          swp_required: formData.swpRequired,
          comments_swp: formData.commentsSWP || null,
        },
        { onConflict: 'user_id,product_id', ignoreDuplicates: false }
      );

      if (watchlistError) {
        throw watchlistError;
      }

      // 4) Try to add SDS metadata if we have manufacturer info
      if (formData.manufacturer) {
        try {
          await supabase.from('sds_metadata').upsert({
            product_id: productId,
            vendor: formData.manufacturer,
            issue_date: formData.issueDate || null,
            hazardous_substance: formData.hazardous,
            dangerous_good: formData.dangerousGood,
            dangerous_goods_class: formData.dgClass || null,
            description: formData.itemDescription || null,
            packing_group: formData.packingGroup || null,
            subsidiary_risks: formData.subsidiaryRisk || null,
          });
        } catch (sdsError) {
          console.warn('Could not add SDS metadata:', sdsError);
          // Don't fail the whole operation if SDS metadata fails
        }
      }

      // 5) Reset form
      setFormData({
        productName: '',
        sdsUrl: '',
        manufacturer: '',
        itemDescription: '',
        quantity: '',
        location: '',
        issueDate: '',
        hazardous: false,
        dangerousGood: false,
        dgClass: '',
        dgClassDescription: '',
        packingGroup: '',
        subsidiaryRisk: '',
        consequence: '',
        likelihood: '',
        riskRating: '',
        swpRequired: false,
        commentsSWP: '',
      });

      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding chemical:', error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message?: string }).message)
            : String(error);
      alert(`Failed to add chemical: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Add Chemical
      </button>
    );
  }

  return (
    <div className="mb-6 rounded border bg-white p-4 shadow dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add New Chemical</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Product Name *</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={e => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Manufacturer</label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={e => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Item Description</label>
            <input
              type="text"
              value={formData.itemDescription}
              onChange={e => setFormData(prev => ({ ...prev, itemDescription: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
              placeholder="Contents, size, weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
              placeholder="Quantity on hand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
              placeholder="Storage location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">SDS URL</label>
            <input
              type="url"
              value={formData.sdsUrl}
              onChange={e => setFormData(prev => ({ ...prev, sdsUrl: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
              placeholder="https://example.com/sds.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">SDS Issue Date</label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={e => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">DG Class</label>
            <select
              value={formData.dgClass}
              onChange={e => setFormData(prev => ({ ...prev, dgClass: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            >
              <option value="">Select...</option>
              <option value="1">1 - Explosives</option>
              <option value="2.1">2.1 - Flammable gases</option>
              <option value="2.2">2.2 - Non-flammable, non-toxic gases</option>
              <option value="2.3">2.3 - Toxic gases</option>
              <option value="3">3 - Flammable liquids</option>
              <option value="4.1">4.1 - Flammable solids</option>
              <option value="4.2">4.2 - Substances liable to spontaneous combustion</option>
              <option value="4.3">
                4.3 - Substances which emit flammable gases when in contact with water
              </option>
              <option value="5.1">5.1 - Oxidizing substances</option>
              <option value="5.2">5.2 - Organic peroxides</option>
              <option value="6.1">6.1 - Toxic substances</option>
              <option value="6.2">6.2 - Infectious substances</option>
              <option value="7">7 - Radioactive material</option>
              <option value="8">8 - Corrosive substances</option>
              <option value="9">9 - Miscellaneous dangerous substances and articles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Packing Group</label>
            <select
              value={formData.packingGroup}
              onChange={e => setFormData(prev => ({ ...prev, packingGroup: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            >
              <option value="">Select...</option>
              <option value="I">I - Great danger</option>
              <option value="II">II - Medium danger</option>
              <option value="III">III - Minor danger</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Subsidiary Risk</label>
            <input
              type="text"
              value={formData.subsidiaryRisk}
              onChange={e => setFormData(prev => ({ ...prev, subsidiaryRisk: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
              placeholder="e.g., 6.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Consequence</label>
            <select
              value={formData.consequence}
              onChange={e => setFormData(prev => ({ ...prev, consequence: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            >
              <option value="">Select...</option>
              <option value="Catastrophic">Catastrophic</option>
              <option value="Major">Major</option>
              <option value="Moderate">Moderate</option>
              <option value="Minor">Minor</option>
              <option value="Insignificant">Insignificant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Likelihood</label>
            <select
              value={formData.likelihood}
              onChange={e => setFormData(prev => ({ ...prev, likelihood: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            >
              <option value="">Select...</option>
              <option value="Almost Certain">Almost Certain</option>
              <option value="Likely">Likely</option>
              <option value="Possible">Possible</option>
              <option value="Unlikely">Unlikely</option>
              <option value="Rare">Rare</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Risk Rating</label>
            <select
              value={formData.riskRating}
              onChange={e => setFormData(prev => ({ ...prev, riskRating: e.target.value }))}
              className="w-full rounded border p-2 dark:bg-gray-700"
            >
              <option value="">Select...</option>
              <option value="Extreme">Extreme</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Comments/SWP</label>
          <textarea
            value={formData.commentsSWP}
            onChange={e => setFormData(prev => ({ ...prev, commentsSWP: e.target.value }))}
            className="w-full rounded border p-2 dark:bg-gray-700"
            rows={3}
            placeholder="Comments or Safe Work Procedure details"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hazardous}
              onChange={e => setFormData(prev => ({ ...prev, hazardous: e.target.checked }))}
              className="mr-2"
            />
            Hazardous Substance
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.dangerousGood}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  dangerousGood: e.target.checked,
                }))
              }
              className="mr-2"
            />
            Dangerous Good
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.swpRequired}
              onChange={e => setFormData(prev => ({ ...prev, swpRequired: e.target.checked }))}
              className="mr-2"
            />
            SWP Required
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Chemical'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
