'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { AuthForm } from '@/components/auth/auth-form';
import { StartHero } from '@/components/ui/start-hero';
import { FeaturesSection } from '@/components/features-section';
import { ImageComparison } from '@/components/image-comparison';
import { WatermarkEngine, type WatermarkInfo } from '@/lib/watermark-engine';
import { checkOriginal } from '@/lib/utils';
import { DashboardService } from '@/lib/dashboard-service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Home() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<'landing' | 'process'>('landing');
  const [files, setFiles] = useState<File[]>([]);

  // Processing State for Single File (Demo Mode / Simplest Case)
  // For Multi-file, we would need a list state, but for preserving original UX which had basic multi-support 
  // but emphasized single preview in `watermarkEngine.js` usage...
  // The original app supported multiple files in queue but showed one "Comparison" view or "List" view.
  // Let's implement single file flow first for "Comparison" which is the main wow factor.

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [watermarkInfo, setWatermarkInfo] = useState<WatermarkInfo | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string>('');
  const [engine, setEngine] = useState<WatermarkEngine | null>(null);

  useEffect(() => {
    // Initialize Engine
    WatermarkEngine.create().then(setEngine).catch(console.error);
  }, []);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setView('process');

    // Process the first file immediately
    if (selectedFiles.length > 0) {
      processFile(selectedFiles[0]);
    }
  };

  const processFile = async (file: File) => {
    setCurrentFile(file);
    setProcessing(true);
    setProcessedUrl(null);
    setWatermarkInfo(null);
    setOriginalStatus('');

    // Create Object URL for preview
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    try {
      // Check original
      const isOriginal = await checkOriginal(file);
      setOriginalStatus(isOriginal ? 'Original Image Detected' : 'Not an original image (Meta missing)');

      if (!engine) {
        console.error("Engine not ready");
        return;
      }

      // Process
      const result = await engine.process(file);
      setWatermarkInfo(result.watermarkInfo);

      // Create Result URL
      const resultUrl = URL.createObjectURL(result.blob);
      setProcessedUrl(resultUrl);

      // Track Success (Background)
      DashboardService.trackSuccess(file, result.blob).catch(console.error);

    } catch (error) {
      console.error('Processing failed:', error);
      setOriginalStatus('Processing failed: ' + (error as any).message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedUrl && currentFile) {
      saveAs(processedUrl, `clean_${currentFile.name}`);
    }
  };

  const handleReset = () => {
    setView('landing');
    setFiles([]);
    setCurrentFile(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setWatermarkInfo(null);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen">
      {view === 'landing' ? (
        <>
          <StartHero onFilesSelected={handleFilesSelected} />
          <FeaturesSection />
        </>
      ) : (
        <div className="py-12 animate-fade-in">
          {currentFile && originalUrl && (
            <ImageComparison
              originalUrl={originalUrl}
              processedUrl={processedUrl}
              width={watermarkInfo?.imageWidth || 0}
              height={watermarkInfo?.imageHeight || 0}
              watermarkInfo={watermarkInfo}
              originalStatus={originalStatus}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
          {/* If we have multiple files, we could list them here or provide a queue UI */}
        </div>
      )}
    </div>
  );
}
