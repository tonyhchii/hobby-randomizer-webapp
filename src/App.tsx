import { useState, useEffect } from "react";
import Wheel from "./components/Wheel";

function App() {
  const [hobbies, setHobbies] = useState<string[]>(() => {
    const savedHobbies = localStorage.getItem("hobbies");
    return savedHobbies ? JSON.parse(savedHobbies) : [];
  });
  const [rotation, setRotation] = useState<number>(0);
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State to control side tab visibility

  // Save hobbies to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hobbies", JSON.stringify(hobbies));
  }, [hobbies]);

  const addHobby = (hobby: string) => {
    if (hobby.trim()) {
      setHobbies((prevHobbies) => [...prevHobbies, hobby.trim()]);
    }
  };

  const removeHobby = (index: number) => {
    setHobbies((prevHobbies) => prevHobbies.filter((_, i) => i !== index));
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
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isEditing ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Edit Hobbies</h2>

          {/* Add Hobby Input */}
          <input
            type="text"
            placeholder="Add a new hobby"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                addHobby(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
            className="w-full px-2 py-1 border rounded mb-4"
          />

          {/* List of Hobbies */}
          <ul>
            {hobbies.map((hobby, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{hobby}</span>
                <button
                  onClick={() => removeHobby(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Wheel hobbies={hobbies} rotation={rotation} />
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Edit Hobbies
        </button>
        <button
          onClick={spinWheel}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Spin the Wheel
        </button>
      </div>
      {selectedHobby && (
        <p className="mt-4 text-xl font-semibold">
          Selected Hobby: {selectedHobby}
        </p>
      )}
    </div>
  );
}

export default App;
