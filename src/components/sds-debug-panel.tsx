// src/components/sds-debug-panel.tsx
'use client';

import { useEffect, useState } from 'react';

type CurrentMetadata = {
  issue_date?: string | null;
  vendor?: string | null;
  hazardous_substance?: boolean | null;
  dangerous_good?: boolean | null;
  dangerous_goods_class?: string | null;
  packing_group?: string | null;
};

type SdsDebugPanelProps = {
  productId: string;
  productName: string;
  sdsUrl: string | null;
  currentMetadata: CurrentMetadata;
};

type ParsedDataEntry = {
  confidence?: number;
  [key: string]: unknown;
};

type DebugResults = {
  error?: string;
  debug: boolean;
  parser_type: string;
  parsed_data?: Record<string, ParsedDataEntry>;
  [key: string]: unknown;
};

export function SdsDebugPanel({
  productId,
  productName,
  sdsUrl,
  currentMetadata,
}: SdsDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [debugResults, setDebugResults] = useState<DebugResults | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', onEsc);
    }
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen]);

  const handleDebugParse = async (useEnhancedParser = false) => {
    if (!sdsUrl) {
      return;
    }
    setParsing(true);
    setDebugResults(null);

    try {
      const endpoint = useEnhancedParser ? '/api/debug-sds-parse-enhanced' : '/api/debug-sds-parse';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          sds_url: sdsUrl,
          force: true,
          use_direct_parser: useEnhancedParser,
        }),
      });

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        // ignore JSON parse error and surface status text instead
      }

      if (!response.ok) {
        const body = payload as Record<string, unknown> | null;
        setDebugResults({
          error:
            (body && ((body.error as string) || (body.message as string))) ||
            `HTTP ${response.status} ${response.statusText}`,
          debug: true,
          parser_type: useEnhancedParser ? 'enhanced' : 'legacy',
        });
        return;
      }

      setDebugResults({
        ...(payload as Record<string, unknown>),
        parser_type: useEnhancedParser ? 'enhanced' : 'legacy',
      } as DebugResults);
    } catch (error) {
      setDebugResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: true,
        parser_type: useEnhancedParser ? 'enhanced' : 'legacy',
      });
    } finally {
      setParsing(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
        title="Debug SDS parsing"
        type="button"
      >
        🔍 Debug
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4 overflow-auto"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`SDS Debug Panel - ${productName}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">SDS Debug Panel — {productName}</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
            type="button"
            aria-label="Close debug panel"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Current Information</h4>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
              <p>
                <strong>Product ID:</strong> {productId}
              </p>
              <p>
                <strong>SDS URL:</strong>{' '}
                {sdsUrl ? (
                  <a href={sdsUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {sdsUrl}
                  </a>
                ) : (
                  'None'
                )}
              </p>
              <p>
                <strong>Current Issue Date:</strong> {currentMetadata?.issue_date ?? 'Not set'}
              </p>
              <p>
                <strong>Vendor:</strong> {currentMetadata?.vendor ?? 'Not set'}
              </p>
              <p>
                <strong>Hazardous:</strong>{' '}
                {currentMetadata?.hazardous_substance === null ||
                currentMetadata?.hazardous_substance === undefined
                  ? 'Not set'
                  : currentMetadata.hazardous_substance
                    ? 'Yes'
                    : 'No'}
              </p>
              <p>
                <strong>Dangerous Good:</strong>{' '}
                {currentMetadata?.dangerous_good === null ||
                currentMetadata?.dangerous_good === undefined
                  ? 'Not set'
                  : currentMetadata.dangerous_good
                    ? 'Yes'
                    : 'No'}
              </p>
              <p>
                <strong>DG Class:</strong> {currentMetadata?.dangerous_goods_class ?? 'Not set'}
              </p>
              <p>
                <strong>Packing Group:</strong> {currentMetadata?.packing_group ?? 'Not set'}
              </p>
            </div>
          </div>

          {sdsUrl && (
            <div>
              <div className="space-x-2">
                <button
                  onClick={() => handleDebugParse(false)}
                  disabled={parsing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  type="button"
                >
                  {parsing ? 'Parsing...' : 'Test Legacy Parser'}
                </button>
                <button
                  onClick={() => handleDebugParse(true)}
                  disabled={parsing}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  type="button"
                >
                  {parsing ? 'Parsing...' : 'Test Enhanced Parser'}
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Compare results between the legacy and enhanced SDS parsers
              </p>
            </div>
          )}

          {debugResults && (
            <div>
              <h4 className="font-medium mb-2">
                Parse Results
                {debugResults.parser_type && (
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded ${
                      debugResults.parser_type === 'enhanced'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {debugResults.parser_type === 'enhanced' ? 'Enhanced Parser' : 'Legacy Parser'}
                  </span>
                )}
              </h4>

              {/* Show confidence scores for enhanced parser */}
              {debugResults.parser_type === 'enhanced' && debugResults.parsed_data && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                  <h5 className="font-medium text-sm mb-2">Confidence Scores:</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {typeof debugResults.parsed_data === 'object' &&
                      debugResults.parsed_data !== null &&
                      Object.entries(debugResults.parsed_data as Record<string, unknown>).map(
                        ([key, value]) => {
                          if (value && typeof value === 'object' && 'confidence' in value) {
                            const confidence = (value as ParsedDataEntry).confidence || 0;
                            const confidenceColor =
                              confidence > 0.8
                                ? 'text-green-600'
                                : confidence > 0.5
                                  ? 'text-yellow-600'
                                  : 'text-red-600';
                            return (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className={confidenceColor}>
                                  {(confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }
                      )}
                  </div>
                </div>
              )}

              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm max-h-96 overflow-auto">
                <pre className="whitespace-pre-wrap break-words">
                  {(() => {
                    try {
                      return JSON.stringify(debugResults, null, 2);
                    } catch {
                      return String(debugResults);
                    }
                  })()}
                </pre>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Troubleshooting Tips</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400 list-disc pl-5">
              <li>Ensure the SDS URL points to a valid PDF file.</li>
              <li>Check if the PDF contains machine-readable text (not just images).</li>
              <li>Issue dates are typically found in headers or document information sections.</li>
              <li>Dates may appear as DD/MM/YYYY, YYYY-MM-DD, etc.</li>
              <li>The backend parsing service may need rules for vendor-specific formats.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
