import { useState, useRef, useEffect } from 'react';

function App() {
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Text animation states
  const [currentText, setCurrentText] = useState('');
  const [animationPhase, setAnimationPhase] = useState('typing');
  const [highlightStart, setHighlightStart] = useState(0);
  const [highlightEnd, setHighlightEnd] = useState(0);

  // The original text from Gettysburg Address
  const originalText = "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.";
  
  // The editing sequence
  const editingSequence = [
    { action: 'type', text: originalText, duration: 2000 },
    { action: 'highlight', start: 0, end: 15, duration: 800 },
    { action: 'delete', newText: "In 1863", duration: 1200 },
    { action: 'type', text: "In 1863 our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.", duration: 1000 },
    { action: 'highlight', start: 57, end: 88, duration: 800 },
    { action: 'delete', newText: "In 1863 our fathers brought forth on this continent, a nation of freedom", duration: 1200 },
    { action: 'type', text: "In 1863 our fathers brought forth on this continent, a nation of freedom and equality.", duration: 1000 },
    { action: 'highlight', start: 0, end: 94, duration: 800 },
    { action: 'delete', newText: "A nation founded on freedom and equality", duration: 1200 },
    { action: 'type', text: "A nation founded on freedom and equality is what America stands for.", duration: 1000 },
    { action: 'highlight', start: 45, end: 73, duration: 800 },
    { action: 'delete', newText: "A nation founded on freedom and equality.", duration: 1200 },
    { action: 'reset', duration: 1500 }
  ];

  useEffect(() => {
    let currentStep = 0;
    let timeoutId;

    const runEditingSequence = () => {
      if (currentStep >= editingSequence.length) {
        currentStep = 0;
      }
      
      const step = editingSequence[currentStep];
      
      switch (step.action) {
        case 'type':
          setAnimationPhase('typing');
          setCurrentText(step.text);
          break;
        case 'highlight':
          setAnimationPhase('highlighting');
          setHighlightStart(step.start);
          setHighlightEnd(step.end);
          break;
        case 'delete':
          setAnimationPhase('deleting');
          setCurrentText(step.newText);
          break;
        case 'reset':
          setAnimationPhase('reset');
          setCurrentText('');
          setHighlightStart(0);
          setHighlightEnd(0);
          break;
      }
      
      currentStep++;
      timeoutId = setTimeout(runEditingSequence, step.duration);
    };
    
    // Start the sequence
    setCurrentText('');
    runEditingSequence();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Function to render text with highlighting
  const renderEditingText = () => {
    if (animationPhase === 'highlighting') {
      const beforeHighlight = currentText.substring(0, highlightStart);
      const highlighted = currentText.substring(highlightStart, highlightEnd);
      const afterHighlight = currentText.substring(highlightEnd);
      
      return (
        <>
          <span>{beforeHighlight}</span>
          <span className="bg-blue-200 text-blue-800">{highlighted}</span>
          <span>{afterHighlight}</span>
        </>
      );
    } else {
      return <span>{currentText}</span>;
    }
  };

  // Class for the cursor effect
  const getCursorClass = () => {
    if (animationPhase === 'typing' || animationPhase === 'deleting') {
      return "after:content-['|'] after:ml-0.5 after:text-blue-600 after:animate-blink";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">Synapsis</h1>
          <div className="space-x-4">
            <button onClick={() => scrollToSection(aboutRef)} className="px-4 py-2 font-medium hover:text-blue-600 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection(contactRef)} className="px-4 py-2 font-medium hover:text-blue-600 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-bold mb-6 text-blue-800">Information Overload?</h2>
          <p className="text-xl mb-12 text-gray-600">Let Synapsis distill the essence of any text into a fun & engaging video!</p>
          
          <div className="relative overflow-hidden bg-white rounded-xl shadow-lg p-8 mb-16">
            <div className="absolute top-3 right-3 flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            {/* Editor-like interface */}
            <div className="border-b border-gray-200 pb-2 mb-6 flex items-center">
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">Editing text...</div>
              <div className="ml-auto text-xs text-gray-400">Synapsis AI Editor</div>
            </div>
            
            <div className="flex items-center justify-center min-h-40 p-4 bg-gray-50 rounded-lg text-left">
              <p className={`text-lg leading-relaxed font-mono ${getCursorClass()}`}>
                {renderEditingText()}
              </p>
            </div>
            
            <div className="flex justify-between mt-6 text-xs text-gray-500">
              <div>Lines: 1</div>
              <div className="flex space-x-4">
                <span>Words: {currentText.split(/\s+/).filter(Boolean).length}</span>
                <span>Characters: {currentText.length}</span>
              </div>
            </div>
          </div>
          
          <a 
            href="#tool"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-xl hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg inline-flex items-center"
          >
            Generate Video Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">About Synapsis AI</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6 text-gray-700">
              Synapsis AI transforms overwhelming text into concise, actionable summaries. 
              Our cutting-edge AI understands context, extracts key information, and delivers 
              insights that matter to you.
            </p>
            <p className="text-lg mb-6 text-gray-700">
              Whether you're dealing with research papers, news articles, or lengthy reports, 
              Synapsis AI helps you cut through the noise and focus on what's important.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Summarization</h3>
                <p className="text-gray-600">Our AI understands context and identifies the most important information.</p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Time Saving</h3>
                <p className="text-gray-600">Get through hours of reading in just minutes with AI-powered summaries.</p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Actionable Insights</h3>
                <p className="text-gray-600">Extract key points and action items from any document instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder Tool Section */}
      <section id="tool" className="py-24 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-blue-800">Synapsis Tool</h2>
          <p className="text-xl mb-12 text-gray-600 max-w-3xl mx-auto">Our actual tool will be available here soon. Stay tuned!</p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-12 flex flex-col items-center">
            <div className="w-20 h-20 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Coming Soon</h3>
            <p className="text-gray-600 mb-8">We're working hard to bring you the Synapsis AI tool. Enter your email to be notified when we launch.</p>
            
            <div className="flex w-full max-w-md">
              <input type="email" placeholder="your@email.com" className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-r-lg font-medium hover:bg-blue-700 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">Contact Us</h2>
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-10">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" placeholder="Your message"></textarea>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Synapsis AI</h2>
              <p className="mt-2 text-gray-400">Transforming how you consume information</p>
            </div>
            
            <p className="text-gray-400 mb-6 md:mb-0">© {new Date().getFullYear()} Synapsis AI. All rights reserved.</p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;