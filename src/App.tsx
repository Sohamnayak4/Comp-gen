import { useState } from "react";
import { getGroq } from "./Api/groq";
import LiveCodePreview from "./components/LiveCodePreview";

function App() {
  const [content, setContent] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validResponsibilities = [
    "build react component",
    "create react component", 
    "generate react component",
    "build ui component",
    "create ui component",
    "generate ui component"
  ];

  const handleSubmit = async () => {
    if (!content.trim() || !responsibility) {
      alert("Please enter a prompt and select a responsibility");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getGroq(content, responsibility);
      setResponse(response);
    } catch (error) {
      console.error("Error generating component:", error);
      setResponse("Error generating component. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const testCode = `const Button = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button
      className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300"
      onClick={() => setCount(count + 1)}
    >
      Clicked {count} times
    </button>
  );
};

render(<Button />);`;

  const handleTest = () => {
    setResponse(testCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">React Component Builder</h1>
          <p className="text-gray-600">Generate and preview React components with AI</p>
        </div>

        {/* Input Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Component Description
              </label>
              <textarea
                id="prompt"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400 resize-none"
                rows={3}
                placeholder="Describe the React component you want to create..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="responsibility" className="block text-sm font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <select
                id="responsibility"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 text-gray-700"
                value={responsibility}
                onChange={(e) => setResponsibility(e.target.value)}
              >
                <option value="">Select a task type...</option>
                {validResponsibilities.map((resp, index) => (
                  <option key={index} value={resp}>
                    {resp}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Component...
                </div>
              ) : (
                "Generate Component"
              )}
            </button>
            
            <button 
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              onClick={handleTest}
            >
              Test with Sample Component
            </button>
          </div>
        </div>

        {/* Live Preview */}
        {response && !response.startsWith("Error:") && (
          <div className="max-w-7xl mx-auto">
            <LiveCodePreview code={response} />
          </div>
        )}

        {/* Error Display */}
        {response && response.startsWith("Error:") && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{response}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;