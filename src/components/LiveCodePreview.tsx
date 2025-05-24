import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

interface LiveCodePreviewProps {
  code: string;
  noInline?: boolean;
}

const LiveCodePreview: React.FC<LiveCodePreviewProps> = ({ code }) => {
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
    useRef: React.useRef,
    useContext: React.useContext,
    createContext: React.createContext,
    Fragment: React.Fragment,
  };

  const cleanCode = code
    .replace(/^import.*$/gm, '') // Remove import statements
    .replace(/^export default.*$/gm, '') // Remove export statements
    .trim();

  const shouldUseNoInline = true; // Force noInline rendering only

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 text-white text-sm font-medium">
            Generated Code
          </div>
          <LiveProvider code={cleanCode} scope={scope} noInline={shouldUseNoInline}>
            <LiveEditor
              className="text-sm"
              style={{
                fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
                fontSize: '14px',
                backgroundColor: '#1a202c',
                minHeight: '300px',
                padding: '16px',
              }}
            />
            <LiveError className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mb-4" />
          </LiveProvider>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-gray-700 text-sm font-medium border-b">
            Live Preview
          </div>
          <div className="p-4 min-h-[300px] overflow-auto">
            <LiveProvider code={cleanCode} scope={scope} noInline={true}>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <LivePreview />
                <LiveError className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded mt-2 text-xs" />
              </div>
            </LiveProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCodePreview;
