import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

function App() {
  let [length, setLength] = useState(8);
  let [numAllowed, setnumAllowed] = useState(false);
  let [charAllowed, setcharAllowed] = useState(false);
  let [password, setPassword] = useState("");
  let passRef = useRef(null);

  let passwordGenerator = useCallback(() => {
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*.";
    let tempPass = "";
    for (let i = 0; i < length; i++) {
      let index = Math.floor(Math.random() * str.length);
      tempPass += str.charAt(index);
    }
    setPassword(tempPass);
  });
  useEffect(() => {
    passwordGenerator();
  }, [length, numAllowed, charAllowed]);

  function copyText() {
    window.navigator.clipboard.writeText(password);
    passRef.current.select();
  }
  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <div className="relative">
            <input
              id="password"
              type="text"
              value={password}
              readOnly
              className="w-full bg-gray-700 text-white py-2 px-4 pr-16 rounded-lg focus:outline-none"
              ref={passRef}
            />
            <button
              onClick={copyText}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Copy
            </button>
          </div>

          <div>
            <label htmlFor="length" className="block mb-1 text-sm">
              Length: {length}
            </label>
            <input
              id="length"
              type="range"
              min={6}
              max={16}
              value={length}
              className="w-full cursor-pointer"
              onChange={(e) => setLength(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500"
                checked={numAllowed}
                onChange={(e) => setnumAllowed(e.target.checked)}
              />
              <span className="ml-2">Add numbers</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500"
                checked={charAllowed}
                onChange={(e) => setcharAllowed(e.target.checked)}
              />
              <span className="ml-2">Add characters</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
