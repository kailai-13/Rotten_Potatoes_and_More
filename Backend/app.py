from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import tensorflow as tf
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    app.state.model = tf.keras.models.load_model("models/rotten_potatoes.keras")
    yield

    del app.state.model

app = FastAPI(lifespan=lifespan)

@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    if not (file.filename.lower().endswith(".jpg") or 
            file.filename.lower().endswith(".png") or 
            file.filename.lower().endswith(".jpeg")):
        return JSONResponse(
            content={"error": "Invalid file format. Please upload a .jpg, .png, or .jpeg file."},
            status_code=400
        )

    file_bytes = await file.read()
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return JSONResponse(content={"error": "Invalid image"}, status_code=400)

    
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  
    img = cv2.resize(img, (224, 224))
    img = img.astype("float32") / 255.0 
    img = np.expand_dims(img, axis=0)

    model = app.state.model
    prediction = model.predict(img)
    print("Raw prediction:", prediction)  
    if prediction.shape[-1] == 1:
        result = int(prediction[0][0] > 0.5)
    else:
        result = int(np.argmax(prediction))

    return {"prediction": result}

