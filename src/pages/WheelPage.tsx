import { useState, useEffect } from "react";
import Wheel from "../components/Wheel";
import { Hobby } from "../models/types";

function WheelPage() {
  const [hobbies, setHobbies] = useState<Hobby[]>(() => {
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
      setHobbies((prevHobbies) => [
        ...prevHobbies,
        { name: hobby.trim(), weight: 1 },
      ]); // Default weight is 1
    }
  };

  const removeHobby = (index: number) => {
    setHobbies((prevHobbies) => prevHobbies.filter((_, i) => i !== index));
  };

  const updateHobbyWeight = (index: number, weight: number) => {
    if (!isNaN(weight) && weight > 0) {
      setHobbies((prevHobbies) =>
        prevHobbies.map((hobby, i) =>
          i === index ? { ...hobby, weight } : hobby
        )
      );
    }
  };

  const spinWheel = () => {
    if (hobbies.length === 0) return;

    // Calculate total weight
    const totalWeight = hobbies.reduce((sum, hobby) => sum + hobby.weight, 0);

    // Determine which hobby is selected based on weights

    const spins = 10;
    const newRotation =
      (spins / 2) * 360 + spins * 360 * Math.random() + rotation;
    setRotation(newRotation);
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;

      // Calculate the selected slice based on the normalized rotation
      // The arrow points to the right (90 degrees), so we adjust the calculation

      let cumulativeWeight = 0;
      let selectedHobbyIndex = 0;
      for (let i = 0; i < hobbies.length; i++) {
        const startAngle = (cumulativeWeight / totalWeight) * 360;
        const endAngle =
          ((cumulativeWeight + hobbies[i].weight) / totalWeight) * 360;

        // Check if the effective rotation falls within this slice
        if (
          normalizedRotation >= 360 - endAngle &&
          normalizedRotation < 360 - startAngle
        ) {
          selectedHobbyIndex = i;
          break;
        }

        cumulativeWeight += hobbies[i].weight;
      }
      console.log(
        `cumulative * 360 / totalWeight: ${
          cumulativeWeight * (360 / totalWeight)
        }`,
        `normalizedRotation: ${normalizedRotation}`,
        360 / totalWeight
      );

      // Set the selected hobby
      setSelectedHobby(hobbies[selectedHobbyIndex].name);
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
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
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
                <span>{hobby.name}</span>
                <input
                  type="number"
                  value={hobby.weight}
                  onChange={(e) =>
                    updateHobbyWeight(index, parseInt(e.target.value, 10))
                  }
                  className="w-16 px-2 py-1 border rounded text-center"
                  min="1"
                />
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

export default WheelPage;
