"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FrameData {
  imageFile: File | null;
  imageUrl: string | null;
  
  scale: number;
  rotate: number;
  frameColor: string;
  caption: string;
  templateName: string;
  
  frameId: string | null;
}

interface FrameContextType extends FrameData {
  setImageFile: (file: File | null) => void;
  setImageUrl: (url: string | null) => void;
  setScale: (scale: number) => void;
  setRotate: (rotate: number) => void;
  setFrameColor: (color: string) => void;
  setCaption: (caption: string) => void;
  setTemplateName: (name: string) => void;
  setFrameId: (id: string | null) => void;
  
  resetFrame: () => void;
  loadFrame: (data: Partial<FrameData>) => void;
}

const defaultFrameData: FrameData = {
  imageFile: null,
  imageUrl: null,
  scale: 100,
  rotate: 0,
  frameColor: '#4A90E2',
  caption: '',
  templateName: '',
  frameId: null,
};

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export function FrameProvider({ children }: { children: ReactNode }) {
  const [frameData, setFrameData] = useState<FrameData>(defaultFrameData);

  const setImageFile = (file: File | null) => {
    setFrameData(prev => ({ ...prev, imageFile: file }));
    
    if (file) {
      const url = URL.createObjectURL(file);
      setFrameData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const setImageUrl = (url: string | null) => {
    setFrameData(prev => ({ ...prev, imageUrl: url }));
  };

  const setScale = (scale: number) => {
    setFrameData(prev => ({ ...prev, scale }));
  };

  const setRotate = (rotate: number) => {
    setFrameData(prev => ({ ...prev, rotate }));
  };

  const setFrameColor = (color: string) => {
    setFrameData(prev => ({ ...prev, frameColor: color }));
  };

  const setCaption = (caption: string) => {
    setFrameData(prev => ({ ...prev, caption }));
  };

  const setTemplateName = (name: string) => {
    setFrameData(prev => ({ ...prev, templateName: name }));
  };

  const setFrameId = (id: string | null) => {
    setFrameData(prev => ({ ...prev, frameId: id }));
  };

  const resetFrame = () => {
    if (frameData.imageUrl && frameData.imageFile) {
      URL.revokeObjectURL(frameData.imageUrl);
    }
    setFrameData(defaultFrameData);
  };

  const loadFrame = (data: Partial<FrameData>) => {
    setFrameData(prev => ({ ...prev, ...data }));
  };

  const value: FrameContextType = {
    ...frameData,
    setImageFile,
    setImageUrl,
    setScale,
    setRotate,
    setFrameColor,
    setCaption,
    setTemplateName,
    setFrameId,
    resetFrame,
    loadFrame,
  };

  return (
    <FrameContext.Provider value={value}>
      {children}
    </FrameContext.Provider>
  );
}

export function useFrame() {
  const context = useContext(FrameContext);
  if (context === undefined) {
    throw new Error('useFrame must be used within a FrameProvider');
  }
  return context;
}
