import { useState, useEffect } from "react";
import Wheel from "./components/Wheel";

function App() {
  const [hobbies, setHobbies] = useState<string[]>(() => {
    const savedHobbies = localStorage.getItem("hobbies");
    return savedHobbies ? JSON.parse(savedHobbies) : [];
  });
  const [input, setInput] = useState<string>("");
  const [rotation, setRotation] = useState<number>(0);
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);

  // Save hobbies to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hobbies", JSON.stringify(hobbies));
  }, [hobbies]);

  const addHobby = () => {
    if (input.trim() && !hobbies.includes(input.trim())) {
      setHobbies([...hobbies, input.trim()]);
      setInput("");
    }
  };

  const spinWheel = () => {
    if (hobbies.length === 0) return;
    const spins = 5;
    const randomIndex = Math.random() * hobbies.length;
    const newRotation =
      spins * 360 + (360 - randomIndex * (360 / hobbies.length)) + rotation;
    setRotation(newRotation);
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;

      // Calculate the selected slice based on the normalized rotation
      // The arrow points to the right (90 degrees), so we adjust the calculation
      const selectedSlice =
        Math.floor((360 - normalizedRotation) / (360 / hobbies.length)) %
        hobbies.length;

      // Set the selected hobby
      setSelectedHobby(hobbies[selectedSlice]);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Hobby Wheel</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded-md w-64"
          placeholder="Enter a hobby"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addHobby}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Hobby
        </button>
      </div>
      <Wheel hobbies={hobbies} rotation={rotation} />
      <button
        onClick={spinWheel}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Spin the Wheel
      </button>
      {selectedHobby && (
        <p className="mt-4 text-xl font-semibold">
          Selected Hobby: {selectedHobby}
        </p>
      )}
    </div>
  );
}

export default App;
