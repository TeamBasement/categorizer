import "./App.css";
import { getCategories } from "./logic/get-categories";

function App() {
  return (
    <button
      onClick={() =>
        getCategories(
          ["The Odessy", "Pride and Prejudance", "The Way of Kings", "It"],
          "ai"
        ).then(console.log)
      }
    >
      Click Me
    </button>
  );
}

export default App;
