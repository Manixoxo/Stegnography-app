import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [encodeImage, setEncodeImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [decodeImage, setDecodeImage] = useState<File | null>(null);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation states
  const [bearState, setBearState] = useState<'waving' | 'normal' | 'eyesClosed' | 'excited' | 'peeking'>('waving');
  const [boxState, setBoxState] = useState<'hidden' | 'appearing' | 'visible' | 'opening' | 'opened'>('hidden');
  const [letterState, setLetterState] = useState<'hidden' | 'inBox' | 'floating' | 'open'>('hidden');
  const [welcomeText, setWelcomeText] = useState(true);
  
  // Welcome animation
  useEffect(() => {
    setTimeout(() => {
      setWelcomeText(false);
      setBearState('normal');
    }, 3000);
  }, []);

  // Handle message input - bear closes eyes when typing
  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.length > 0) {
      setBearState('eyesClosed');
    } else {
      setBearState('normal');
    }
  };

  const handleImageSelect = (type: 'encode' | 'decode', files: FileList | null) => {
    if (type === 'encode') {
      setEncodeImage(files?.[0] || null);
    } else {
      setDecodeImage(files?.[0] || null);
    }
    
    setBearState('excited');
    setTimeout(() => setBearState('normal'), 1000);
  };

  const handleEncode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encodeImage || !message) {
      setError('Please upload an image and enter a message');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Start animation sequence
    setBearState('excited');
    setBoxState('appearing');
    
    setTimeout(() => {
      setBoxState('visible');
      setLetterState('inBox');
    }, 800);

    const formData = new FormData();
    formData.append('image', encodeImage);
    formData.append('message', message);

    try {
      const response = await fetch('http://localhost:5000/api/encode', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Encoding failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'encoded_image.png';
      link.click();
      window.URL.revokeObjectURL(url);
      
      // Complete animation
      setTimeout(() => {
        setBearState('normal');
      }, 1500);
      
    } catch (err) {
      setError('Failed to encode image. Check the console for details.');
      console.error(err);
      setBearState('normal');
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decodeImage) {
      setError('Please upload an encoded image');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Start animation
    setBearState('peeking');
    setBoxState('opening');
    
    const formData = new FormData();
    formData.append('image', decodeImage);

    try {
      const response = await fetch('http://localhost:5000/api/decode', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Decoding failed');

      const data = await response.json();
      setDecodedMessage(data.message);
      
      // Show letter and message
      setTimeout(() => {
        setBoxState('opened');
        setLetterState('floating');
      }, 1000);
      
      setTimeout(() => {
        setLetterState('open');
        setBearState('excited');
      }, 1800);
      
    } catch (err) {
      setError('Failed to decode image. Check the console for details.');
      console.error(err);
      setBearState('normal');
    } finally {
      setLoading(false);
    }
  };

  const resetAnimations = () => {
    setBoxState('hidden');
    setLetterState('hidden');
    setBearState('normal');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Side - Bear Character */}
      <div className="w-1/3 relative flex items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Bear SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Bear body */}
            <circle cx="50" cy="55" r="25" fill="#b17f55" />
            
            {/* Face */}
            <circle cx="50" cy="45" r="22" fill="#d9b38c" />
            
            {/* Ears */}
            <circle cx="32" cy="32" r="8" fill="#915f3f" />
            <circle cx="68" cy="32" r="8" fill="#915f3f" />
            <circle cx="32" cy="32" r="4" fill="#d9b38c" opacity="0.6" />
            <circle cx="68" cy="32" r="4" fill="#d9b38c" opacity="0.6" />
            
            {/* Eyes */}
            {bearState === 'eyesClosed' ? (
              <>
                <path d="M40 42 Q44 40 48 42" fill="none" stroke="black" strokeWidth="1.5" />
                <path d="M52 42 Q56 40 60 42" fill="none" stroke="black" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <circle cx="44" cy="42" r="3.5" fill="black" />
                <circle cx="56" cy="42" r="3.5" fill="black" />
                <circle cx="43" cy="41" r="1" fill="white" />
                <circle cx="55" cy="41" r="1" fill="white" />
              </>
            )}
            
            {/* Nose */}
            <ellipse cx="50" cy="50" rx="5" ry="4" fill="#6d4c41" />
            
            {/* Mouth */}
            {bearState === 'excited' ? (
              <path d="M42 58 Q50 65 58 58" fill="none" stroke="black" strokeWidth="1.5" />
            ) : (
              <path d="M45 57 Q50 60 55 57" fill="none" stroke="black" strokeWidth="1.5" />
            )}
            
            {/* Arms */}
            <path d="M30 65 Q25 70 30 80" fill="none" stroke="#b17f55" strokeWidth="6" strokeLinecap="round" />
            
            {/* Waving arm - conditionally animated */}
            <g className={bearState === 'waving' ? 'bear-wave' : ''}>
              <path 
                d="M70 65 Q75 50 85 45" 
                fill="none" 
                stroke="#b17f55" 
                strokeWidth="6" 
                strokeLinecap="round"
                className={bearState === 'peeking' ? 'bear-peek-arm' : ''}
              />
              <circle cx="85" cy="45" r="5" fill="#d9b38c" />
            </g>
            
            {/* Speech bubble for welcome */}
            {welcomeText && (
              <g>
                <path d="M75 25 Q90 20 90 35 Q90 45 80 45 L75 50 L74 45 Q65 45 65 35 Q65 25 75 25" fill="white" stroke="#333" strokeWidth="1" />
                <text x="77.5" y="37" fontSize="10" textAnchor="middle" fill="#333">Hi!</text>
              </g>
            )}
          </svg>
        </div>
        
        {/* Box for message */}
        <div className={`absolute top-1/2 left-1/2 transform translate-x-8 ${
          boxState === 'hidden' ? 'opacity-0' : 
          boxState === 'appearing' ? 'animate-box-appear opacity-100' : 
          'opacity-100'
        }`}>
          <div className={`w-24 h-20 relative ${
            boxState === 'opening' || boxState === 'opened' ? 'animate-box-shake' : ''
          }`}>
            {/* Box body */}
            <div className="absolute inset-0 bg-amber-700 rounded-md shadow-md"></div>
            
            {/* Box lid */}
            <div className={`absolute top-0 left-0 right-0 h-5 bg-amber-900 rounded-t-md origin-bottom transition-transform duration-500 ${
              boxState === 'opening' || boxState === 'opened' ? '-rotate-110' : 'rotate-0'
            }`}></div>
            
            {/* Letter */}
            <div className={`absolute w-16 h-12 bg-white rounded-sm shadow-sm ${
              letterState === 'hidden' ? 'opacity-0' :
              letterState === 'inBox' ? 'top-6 left-4' :
              letterState === 'floating' ? 'top-0 left-4 animate-letter-float' :
              'top-0 left-4 animate-letter-open'
            }`}>
              {letterState === 'open' && (
                <div className="absolute inset-0 p-1 flex items-center justify-center">
                  <p className="text-xs text-center leading-tight">
                    {decodedMessage.length > 20 ? `${decodedMessage.substring(0, 20)}...` : decodedMessage}
                  </p>
                </div>
              )}
              
              {/* Envelope fold lines - only visible when not open */}
              {letterState !== 'open' && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-px bg-gray-300"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Forms */}
      <div className="w-2/3 p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Steganography Tool</h1>
        
        <div className="flex flex-col space-y-6">
          {/* Encode Form */}
          <form onSubmit={handleEncode} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Encode Secret Message
            </h2>
            
            {/* Image upload with animation */}
            <div 
              className="border-2 border-dashed border-blue-200 rounded-lg p-6 mb-4 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50"
              onClick={() => document.getElementById('encode-file-input')?.click()}
            >
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleImageSelect('encode', e.target.files)}
                className="hidden"
                id="encode-file-input"
                disabled={loading}
              />
              
              <div className="flex flex-col items-center cursor-pointer">
                <div className="mb-3 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-blue-600 font-medium">
                  {encodeImage ? encodeImage.name : 'Select Image to Hide Your Message'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG or JPG up to 5MB</p>
              </div>
            </div>
            
            {/* Message input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageInput}
                  placeholder="Enter your secret message..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            
            {/* Encode button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
              onClick={() => !loading && resetAnimations()}
            >
              {loading ? 'Encoding...' : 'Encode & Download'}
            </button>
          </form>
          
          {/* Decode Form */}
          <form onSubmit={handleDecode} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Decode Hidden Message
            </h2>
            
            {/* Image upload */}
            <div 
              className="border-2 border-dashed border-green-200 rounded-lg p-6 mb-4 text-center transition-all duration-300 hover:border-green-500 hover:bg-green-50"
              onClick={() => document.getElementById('decode-file-input')?.click()}
            >
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleImageSelect('decode', e.target.files)}
                className="hidden"
                id="decode-file-input"
                disabled={loading}
              />
              
              <div className="flex flex-col items-center cursor-pointer">
                <div className="mb-3 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-green-600 font-medium">
                  {decodeImage ? decodeImage.name : 'Select Image with Hidden Message'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Upload an image created with this tool</p>
              </div>
            </div>
            
            {/* Decode button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={loading}
              onClick={() => !loading && resetAnimations()}
            >
              {loading ? 'Decoding...' : 'Reveal Secret Message'}
            </button>
            
            {/* Decoded message (text version) */}
            {decodedMessage && letterState !== 'open' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Decoded message: <span className="font-medium">{decodedMessage}</span></p>
              </div>
            )}
          </form>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;