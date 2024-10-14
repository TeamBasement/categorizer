import "./App.css";
import React, { useState } from "react";
import { getCategories } from "./logic/get-categories";
import { Category } from "./types/category";

function App() {
  const [input, setInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCategorize = async () => {
    const objects = input.split(",").map((obj) => obj.trim());
    const result = await getCategories(objects, "ai");
    setCategories(result);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter objects separated by commas"
      />
      <button onClick={handleCategorize}>Get Categories</button>
      <div>
        {categories.map((category) => (
          <div key={category.name}>
            <h3>{category.name}</h3>
            <ul>
              {category.objects.map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
