'use client';

import { useWatchList } from '@/lib/hooks/useWatchList';
import { MobileAppReminder } from '@/components/MobileAppReminder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, MapPin, Calendar, AlertTriangle, FileText } from 'lucide-react';

export default function WatchlistPage() {
  const { data, loading, error, refresh } = useWatchList();

  const handleRefresh = () => {
    refresh();
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Chemical Register</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle size={20} />
            <span className="font-medium">Error loading chemical register</span>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="mt-3 text-red-700 border-red-300 hover:bg-red-50"
          >
            <RefreshCcw size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chemical Register</h1>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <MobileAppReminder />

      {loading ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chemical register...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h3 className="text-lg font-semibold mb-2">No chemicals registered yet</h3>
          <p className="text-gray-600 mb-4">
            Start by using the ChemFetch mobile app to scan barcodes or manually add chemicals to
            your register.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-blue-900 mb-2">Get started:</h4>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Use the mobile app to scan product barcodes</li>
              <li>• Manually add chemicals through the app</li>
              <li>• All scanned products will appear here automatically</li>
            </ul>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              <strong>{data.length}</strong> chemical{data.length !== 1 ? 's' : ''} registered in
              your system
            </p>
          </div>

          <div className="grid gap-4">
            {data.map(item => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product.name || 'Unknown Product'}
                      </h3>
                      {item.hazardous_substance && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Hazardous
                        </span>
                      )}
                      {item.dangerous_good && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                          Dangerous Good
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="font-medium">Barcode:</div>
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.product.barcode}
                        </div>
                      </div>

                      {item.product.manufacturer && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="font-medium">Manufacturer:</div>
                          <div>{item.product.manufacturer}</div>
                        </div>
                      )}

                      {item.quantity_on_hand && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="font-medium">Quantity:</div>
                          <div>{item.quantity_on_hand}</div>
                        </div>
                      )}

                      {item.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={14} />
                          <div>{item.location}</div>
                        </div>
                      )}
                    </div>

                    {item.product.contents_size_weight && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Size/Weight:</span>{' '}
                        {item.product.contents_size_weight}
                      </div>
                    )}

                    {item.dangerous_goods_class && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">DG Class:</span> {item.dangerous_goods_class}
                        {item.packing_group && <span> | PG: {item.packing_group}</span>}
                      </div>
                    )}

                    {item.risk_rating && (
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            item.risk_rating.toLowerCase().includes('high')
                              ? 'bg-red-100 text-red-800'
                              : item.risk_rating.toLowerCase().includes('medium')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          Risk: {item.risk_rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {item.product.sds_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(item.product.sds_url!, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <FileText size={14} />
                        SDS
                      </Button>
                    )}

                    {item.created_at && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Added: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {item.description && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                )}

                {item.comments_swp && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                    <span className="font-medium text-blue-700">SWP Comments:</span>
                    <p className="text-blue-600 mt-1">{item.comments_swp}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
