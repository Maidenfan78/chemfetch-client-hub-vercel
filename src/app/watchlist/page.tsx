'use client';

import { useState } from 'react';
import { useWatchList } from '@/lib/hooks/useWatchList';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { AddChemicalForm } from '@/components/add-chemical-form';

export default function WatchListPage() {
  const { data, loading, error, refresh } = useWatchList();

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('product_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const handleUpdate = async (productId: number, pdfUrl?: string | null) => {
    try {
      setStatusMsg(null);
      setUpdatingId(productId);

      const res = await fetch('/api/update-sds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, pdfUrl }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed to parse SDS' }));
        throw new Error(error || 'Failed to parse SDS');
      }

      setStatusMsg('SDS parsed successfully. Refreshing…');
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update SDS info';
      console.error(msg);
      setStatusMsg(msg);
    } finally {
      setUpdatingId(null);
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  const handleDelete = async (watchListId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from your chemical register?`)) {
      return;
    }

    try {
      setStatusMsg(null);
      setDeletingId(watchListId);

      const supabase = supabaseBrowser();
      const { error } = await supabase
        .from('user_chemical_watch_list')
        .delete()
        .eq('id', watchListId);

      if (error) {
        throw new Error(error.message);
      }

      setStatusMsg(`"${productName}" deleted successfully. Refreshing…`);
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete item';
      console.error(msg);
      setStatusMsg(msg);
    } finally {
      setDeletingId(null);
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  const handleInlineEdit = (
    watchListId: string,
    field: string,
    currentValue: string | number | null
  ) => {
    setEditingField(`${watchListId}-${field}`);
    setEditingValue(
      currentValue !== null && currentValue !== undefined ? String(currentValue) : ''
    );
  };

  const handleSaveEdit = async (watchListId: string, field: string) => {
    try {
      const supabase = supabaseBrowser();

      let updateValue: unknown = editingValue;
      if (field === 'quantity_on_hand') {
        updateValue = editingValue ? parseInt(editingValue, 10) : null;
      }

      const { error } = await supabase
        .from('user_chemical_watch_list')
        .update({ [field]: updateValue })
        .eq('id', watchListId);

      if (error) {
        throw new Error(error.message);
      }

      setEditingField(null);
      setEditingValue('');
      refresh();
    } catch (err) {
      console.error('Failed to update field:', err);
      setStatusMsg('Failed to update field');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case 'product_name':
        aValue = a.product.name.toLowerCase();
        bValue = b.product.name.toLowerCase();
        break;
      case 'manufacturer':
        aValue = (a.product.sds_metadata?.vendor || a.product.manufacturer || '').toLowerCase();
        bValue = (b.product.sds_metadata?.vendor || b.product.manufacturer || '').toLowerCase();
        break;
      case 'quantity':
        aValue = a.quantity_on_hand || 0;
        bValue = b.quantity_on_hand || 0;
        break;
      case 'location':
        aValue = (a.location || '').toLowerCase();
        bValue = (b.location || '').toLowerCase();
        break;
      case 'sds_issue_date':
        aValue = a.product.sds_metadata?.issue_date
          ? new Date(a.product.sds_metadata.issue_date)
          : new Date(0);
        bValue = b.product.sds_metadata?.issue_date
          ? new Date(b.product.sds_metadata.issue_date)
          : new Date(0);
        break;
      case 'hazardous_substance':
        aValue = a.product.sds_metadata?.hazardous_substance ? 1 : 0;
        bValue = b.product.sds_metadata?.hazardous_substance ? 1 : 0;
        break;
      case 'dangerous_good':
        aValue = a.product.sds_metadata?.dangerous_good ? 1 : 0;
        bValue = b.product.sds_metadata?.dangerous_good ? 1 : 0;
        break;
      case 'dangerous_goods_class':
        aValue = (a.product.sds_metadata?.dangerous_goods_class || '').toLowerCase();
        bValue = (b.product.sds_metadata?.dangerous_goods_class || '').toLowerCase();
        break;
      case 'packing_group':
        aValue = (a.product.sds_metadata?.packing_group || '').toLowerCase();
        bValue = (b.product.sds_metadata?.packing_group || '').toLowerCase();
        break;
      case 'subsidiary_risks':
        aValue = (a.product.sds_metadata?.subsidiary_risks || '').toLowerCase();
        bValue = (b.product.sds_metadata?.subsidiary_risks || '').toLowerCase();
        break;
      case 'consequence':
        aValue = (a.consequence || '').toLowerCase();
        bValue = (b.consequence || '').toLowerCase();
        break;
      case 'likelihood':
        aValue = (a.likelihood || '').toLowerCase();
        bValue = (b.likelihood || '').toLowerCase();
        break;
      case 'risk_rating':
        aValue = (a.risk_rating || '').toLowerCase();
        bValue = (b.risk_rating || '').toLowerCase();
        break;
      case 'swp_required':
        aValue = a.swp_required ? 1 : 0;
        bValue = b.swp_required ? 1 : 0;
        break;
      case 'date_added':
        aValue = a.created_at ? new Date(a.created_at) : new Date(a.id);
        bValue = b.created_at ? new Date(b.created_at) : new Date(b.id);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return '↕️';
    }
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return '—';
    }
    try {
      return new Date(dateString).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const getDateStatus = (dateString: string | null) => {
    if (!dateString) {
      return null;
    }

    try {
      const issueDate = new Date(dateString);
      const today = new Date();
      const fiveYearsFromIssue = new Date(issueDate);
      fiveYearsFromIssue.setFullYear(fiveYearsFromIssue.getFullYear() + 5);

      const sixMonthsBeforeExpiry = new Date(fiveYearsFromIssue);
      sixMonthsBeforeExpiry.setMonth(sixMonthsBeforeExpiry.getMonth() - 6);

      if (today > fiveYearsFromIssue) {
        return {
          status: 'expired',
          class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
      } else if (today > sixMonthsBeforeExpiry) {
        return {
          status: 'expiring-soon',
          class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
      } else {
        return {
          status: 'current',
          class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
      }
    } catch {
      return null;
    }
  };

  const getDangerousGoodsClassDescription = (dgClass: string | null) => {
    if (!dgClass) {
      return '—';
    }

    // Normalize the class by removing trailing .0
    const normalizedClass = dgClass.replace(/\.0$/, '');

    const descriptions: { [key: string]: string } = {
      '1': 'Explosives',
      '2': 'Gases',
      '2.1': 'Flammable gases',
      '2.2': 'Non-flammable, non-toxic gases',
      '2.3': 'Toxic gases',
      '3': 'Flammable liquids',
      '4': 'Flammable solids',
      '4.1': 'Flammable solids',
      '4.2': 'Substances liable to spontaneous combustion',
      '4.3': 'Substances which emit flammable gases when in contact with water',
      '5': 'Oxidizing substances and organic peroxides',
      '5.1': 'Oxidizing substances',
      '5.2': 'Organic peroxides',
      '6': 'Toxic and infectious substances',
      '6.1': 'Toxic substances',
      '6.2': 'Infectious substances',
      '7': 'Radioactive material',
      '8': 'Corrosive substances',
      '9': 'Miscellaneous dangerous substances and articles',
    };

    // First try exact match, then try normalized match
    return descriptions[dgClass] || descriptions[normalizedClass] || dgClass;
  };

  const renderEditableCell = (
    watchListId: string,
    field: string,
    value: string | number | null,
    isTextArea = false
  ) => {
    const editKey = `${watchListId}-${field}`;
    const isEditing = editingField === editKey;

    if (isEditing) {
      return (
        <div className="flex gap-1">
          {isTextArea ? (
            <textarea
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit(watchListId, field);
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              className="flex-1 p-1 border rounded text-xs"
              rows={2}
              autoFocus
            />
          ) : (
            <input
              type={field === 'quantity_on_hand' ? 'number' : 'text'}
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSaveEdit(watchListId, field);
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              className="flex-1 p-1 border rounded text-xs"
              autoFocus
            />
          )}
          <button
            onClick={() => handleSaveEdit(watchListId, field)}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs"
          >
            ✓
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
          >
            ✗
          </button>
        </div>
      );
    }

    return (
      <div
        onClick={() => handleInlineEdit(watchListId, field, value)}
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
        title="Click to edit"
      >
        {value || '—'}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <AddChemicalForm onSuccess={refresh} />
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh the chemical register list"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>
        <h1 className="text-2xl font-bold">Chemical Register List</h1>
      </div>

      {statusMsg && (
        <div className="rounded border p-2 text-sm bg-gray-50 dark:bg-gray-800">{statusMsg}</div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data.length === 0 && !loading ? (
        <p>No entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('product_name')}
                  title="Click to sort by Product Name"
                >
                  Product Name {getSortIcon('product_name')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('manufacturer')}
                  title="Click to sort by Manufacturer"
                >
                  Manufacturer {getSortIcon('manufacturer')}
                </th>
                <th className="p-2 border text-left">Item Description</th>
                <th
                  className="p-2 border text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('quantity')}
                  title="Click to sort by Quantity"
                >
                  Quantity {getSortIcon('quantity')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('location')}
                  title="Click to sort by Location"
                >
                  Location {getSortIcon('location')}
                </th>
                <th className="p-2 border text-center">SDS Available?</th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('sds_issue_date')}
                  title="Click to sort by SDS Issue Date"
                >
                  SDS Issue Date {getSortIcon('sds_issue_date')}
                </th>
                <th
                  className="p-2 border text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('hazardous_substance')}
                  title="Click to sort by Hazardous Substance"
                >
                  Hazardous Substance? {getSortIcon('hazardous_substance')}
                </th>
                <th
                  className="p-2 border text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('dangerous_good')}
                  title="Click to sort by Dangerous Good"
                >
                  Dangerous Good? {getSortIcon('dangerous_good')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('dangerous_goods_class')}
                  title="Click to sort by Dangerous Goods Class"
                >
                  Dangerous Goods Class {getSortIcon('dangerous_goods_class')}
                </th>
                <th className="p-2 border text-left">Dangerous Goods Class Description</th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('packing_group')}
                  title="Click to sort by Packing Group"
                >
                  Packing Group {getSortIcon('packing_group')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('subsidiary_risks')}
                  title="Click to sort by Subsidiary Risk"
                >
                  Subsidiary Risk {getSortIcon('subsidiary_risks')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('consequence')}
                  title="Click to sort by Consequence"
                >
                  Consequence {getSortIcon('consequence')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('likelihood')}
                  title="Click to sort by Likelihood"
                >
                  Likelihood {getSortIcon('likelihood')}
                </th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('risk_rating')}
                  title="Click to sort by Risk Rating"
                >
                  Risk Rating {getSortIcon('risk_rating')}
                </th>
                <th
                  className="p-2 border text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('swp_required')}
                  title="Click to sort by SWP Requirement"
                >
                  SWP Requirement? {getSortIcon('swp_required')}
                </th>
                <th className="p-2 border text-left">Comments/SWP</th>
                <th
                  className="p-2 border text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('date_added')}
                  title="Click to sort by Date Added"
                >
                  Date Added {getSortIcon('date_added')}
                </th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map(entry => {
                const product = entry.product;
                const meta = product.sds_metadata;

                const hasPdf = Boolean(product.sds_url);
                const isUpdating = updatingId === product.id;
                const isDeleting = deletingId === entry.id;

                return (
                  <tr key={entry.id} className="border-t">
                    <td className="p-2 border">
                      {hasPdf ? (
                        <a
                          href={product.sds_url!}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {product.name}
                        </a>
                      ) : (
                        product.name
                      )}
                    </td>

                    <td className="p-2 border">{meta?.vendor ?? product.manufacturer ?? '—'}</td>

                    <td className="p-2 border">
                      {product.contents_size_weight ?? entry.description ?? '—'}
                    </td>

                    <td className="p-2 border text-center">
                      {renderEditableCell(entry.id, 'quantity_on_hand', entry.quantity_on_hand)}
                    </td>

                    <td className="p-2 border">
                      {renderEditableCell(entry.id, 'location', entry.location)}
                    </td>

                    <td className="p-2 border text-center">{hasPdf ? 'Yes' : 'No'}</td>

                    <td className="p-2 border">
                      {(() => {
                        const issueDate: string | null =
                          meta?.issue_date ?? entry.sds_issue_date ?? null;
                        const dateStatus = getDateStatus(issueDate);
                        const formattedDate = formatDate(issueDate);

                        if (formattedDate === '—') {
                          return formattedDate;
                        }

                        return (
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              dateStatus ? dateStatus.class : ''
                            }`}
                            title={
                              dateStatus?.status === 'expired'
                                ? 'SDS is expired (over 5 years old)'
                                : dateStatus?.status === 'expiring-soon'
                                  ? 'SDS expires within 6 months'
                                  : 'SDS is current'
                            }
                          >
                            {formattedDate}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="p-2 border text-center">
                      {(meta?.hazardous_substance ?? entry.hazardous_substance) ? 'Yes' : 'No'}
                    </td>

                    <td className="p-2 border text-center">
                      {(meta?.dangerous_good ?? entry.dangerous_good) ? 'Yes' : 'No'}
                    </td>

                    <td className="p-2 border">
                      {meta?.dangerous_goods_class ?? entry.dangerous_goods_class ?? '—'}
                    </td>

                    <td className="p-2 border">
                      {getDangerousGoodsClassDescription(
                        meta?.dangerous_goods_class ?? entry.dangerous_goods_class ?? null
                      )}
                    </td>

                    <td className="p-2 border">
                      {meta?.packing_group ?? entry.packing_group ?? '—'}
                    </td>

                    <td className="p-2 border">
                      {meta?.subsidiary_risks ?? entry.subsidiary_risks ?? '—'}
                    </td>

                    <td className="p-2 border">{entry.consequence ?? '—'}</td>

                    <td className="p-2 border">{entry.likelihood ?? '—'}</td>

                    <td className="p-2 border">{entry.risk_rating ?? '—'}</td>

                    <td className="p-2 border text-center">{entry.swp_required ? 'Yes' : 'No'}</td>

                    <td className="p-2 border">
                      {renderEditableCell(entry.id, 'comments_swp', entry.comments_swp, true)}
                    </td>

                    <td className="p-2 border">{formatDate(entry.created_at ?? null)}</td>

                    <td className="p-2 border text-center">
                      <div className="flex gap-2 justify-center">
                        {hasPdf && (
                          <a
                            href={product.sds_url!}
                            target="_blank"
                            title="Download SDS"
                            className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                          >
                            Download SDS
                          </a>
                        )}

                        <button
                          onClick={() => handleUpdate(product.id, product.sds_url)}
                          disabled={isUpdating || isDeleting || !hasPdf}
                          title={
                            hasPdf
                              ? 'Parse SDS and update metadata'
                              : 'Add an SDS PDF URL to this product first'
                          }
                          className="rounded bg-blue-600 px-3 py-1 text-xs text-white disabled:opacity-50 hover:bg-blue-700"
                        >
                          {isUpdating ? 'Updating…' : 'Update SDS'}
                        </button>

                        <button
                          onClick={() => handleDelete(entry.id, product.name)}
                          disabled={isUpdating || isDeleting}
                          title="Delete this item from your chemical register"
                          className="rounded bg-red-600 px-3 py-1 text-xs text-white disabled:opacity-50 hover:bg-red-700"
                        >
                          {isDeleting ? 'Deleting…' : 'Delete Item'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
