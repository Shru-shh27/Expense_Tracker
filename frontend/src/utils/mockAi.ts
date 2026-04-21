// Mock AI based on gemini.md instructions

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface AIPromptData {
  expenses?: Expense[];
  monthlyTotal?: number;
  message: string;
}

export function generateAIResponse(data: AIPromptData): string {
  const msg = data.message.toLowerCase();

  // Basic categorization assistance
  if (msg.includes("categorize") || msg.includes("category")) {
    if (msg.includes("swiggy") || msg.includes("zomato")) return "Swiggy/Zomato order → Food";
    if (msg.includes("uber") || msg.includes("ola")) return "Uber/Ola ride → Transport";
    return "Please specify the expense name (e.g., 'Swiggy order') so I can suggest a category.";
  }

  // Without data -> general advice
  if (!data.expenses || data.expenses.length === 0) {
    if (msg.includes("save") || msg.includes("tips")) {
      return "Try setting a weekly spending limit and reducing small daily expenses to increase your savings.";
    }
    return "I don't have enough data yet. Add some expenses, or ask me for general saving tips.";
  }

  // With data -> specific insights
  if (msg.includes("where am i spending the most") || msg.includes("most")) {
    // Calculate simple mock insight
    return `Based on your recent data, you spent a significant amount this month. Consider checking your top categories to see where to cut back.`;
  }

  if (msg.includes("budget") || msg.includes("warn")) {
    if (data.monthlyTotal && data.monthlyTotal > 1000) {
      return "You are close to exceeding your budget. Consider reducing food or entertainment expenses to save more.";
    }
  }

  // Default response
  return "I'm your finance assistant. Ask me about your spending, budget recommendations, or how to categorize expenses.";
}
