// Default
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export const getGroq = async (content: string, responsibility: string) => {
    // Validate that the responsibility is for building React UI components
    const validResponsibilities = [
        "build react component",
        "create react component", 
        "generate react component",
        "build ui component",
        "create ui component",
        "generate ui component"
    ];
    
    const isValidResponsibility = validResponsibilities.some(valid => 
        responsibility.toLowerCase().includes(valid.toLowerCase())
    );
    
    if (!isValidResponsibility) {
        return "Error: This function only handles React UI component building requests. Please specify a responsibility related to building/creating/generating React or UI components.";
    }

    try {
        const systemPrompt = `You are a React component builder. Your responsibility is to ${responsibility}. 
        
        IMPORTANT RULES:
        - Return ONLY pure React/TypeScript functional component code and nothing else, no text, no comments, no anything else
        - Do NOT include import statements (React is already available)
        - Do NOT include export statements
        - Start directly with the component function definition
        - Use modern React with hooks (useState, useEffect, etc. are available)
        - Use inline styling always
        - Make components interactive and functional
        - End with a render statement like: render(<ComponentName />)
        - Use arrow function or regular function syntax
        - Keep components self-contained and working
        
        Example format:
        const MyComponent = () => {
          const [state, setState] = useState('');
          return (
            <div className="p-4">
              {/* component content */}
            </div>
          );
        };

        render(<MyComponent label="MyComponent" />);`;

        const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content,
                },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            max_tokens: 2048,
        });

        const response = completion.choices[0]?.message?.content || "No response generated";
        
        // Clean up the response to ensure it's pure code
        return response
            .replace(/```[a-zA-Z]*\n?/g, '') // Remove code block markers
            .replace(/```/g, '') // Remove any remaining backticks
            .trim();
            
    } catch (error) {
        console.error("Error calling Groq API:", error);
        return "Error generating response";
    }
}