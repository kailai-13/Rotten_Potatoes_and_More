import React, { useState } from "react";
import axios from "axios";

const MainContent = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPrediction(null);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict-image", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPrediction(res.data.prediction);
    } catch (err) {
      console.error(err);
      alert("Error uploading file or getting prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Rotten Potatoes Classifier
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 
          file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

     
        {preview && (
          <div className="mb-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg border"
            />
          </div>
        )}

    
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Upload & Predict"}
        </button>

     
        {prediction !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg">
              Prediction:{" "}
              <span
                className={`font-bold ${
                  prediction === 1 ? "text-red-600" :"text-green-600" 
                }`}
              >
                {prediction === 1 ? "Rotten" : "Fresh"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
