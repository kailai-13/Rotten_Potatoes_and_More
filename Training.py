import os
import pathlib
import numpy as np
import cv2
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import matplotlib.pyplot as plt

# --------------------
# SETTINGS
# --------------------
DATASET_DIR = "Datasets"
IMG_SIZE = (224, 224)

# --------------------
# IMAGE READING FUNCTION
# --------------------
def read_image(img_path):
    """Read and preprocess image."""
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0  # normalize
    return img

# --------------------
# LOAD DATASET PATHS
# --------------------
def load_image_paths():
    dataset_path = pathlib.Path(DATASET_DIR)
    fresh = [str(f) for f in dataset_path.glob("**/FRESH/**/*") if f.suffix.lower() == ".jpg"]
    rotten = [str(f) for f in dataset_path.glob("**/ROTTEN/**/*") if f.suffix.lower() == ".jpg"]

    # Balance the dataset: truncate larger set
    min_len = min(len(fresh), len(rotten))
    fresh = fresh[:min_len]
    rotten = rotten[:min_len]
    return fresh, rotten

# --------------------
# BUILD DATASET ARRAYS
# --------------------
def build_dataset(fresh_paths, rotten_paths):
    X, y = [], []
    for img_path in fresh_paths:
        X.append(read_image(img_path))
        y.append(0)  # fresh label

    for img_path in rotten_paths:
        X.append(read_image(img_path))
        y.append(1)  # rotten label

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int32)
    return X, y

# --------------------
# SIMPLE CNN MODEL
# --------------------
def create_cnn(input_shape):
    model = models.Sequential([
        layers.Conv2D(32, (3,3), activation='relu', input_shape=input_shape),
        layers.MaxPooling2D((2,2)),
        layers.Conv2D(64, (3,3), activation='relu'),
        layers.MaxPooling2D((2,2)),
        layers.Conv2D(128, (3,3), activation='relu'),
        layers.MaxPooling2D((2,2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid')  # binary classification
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# --------------------
# MAIN EXECUTION
# --------------------
if __name__ == "__main__":
    print("[INFO] Loading dataset paths...")
    fresh_paths, rotten_paths = load_image_paths()
    print(f"Found {len(fresh_paths)} fresh images and {len(rotten_paths)} rotten images.")

    print("[INFO] Reading & preprocessing images...")
    X, y = build_dataset(fresh_paths, rotten_paths)
    print("Dataset shape:", X.shape, y.shape)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("[INFO] Creating model...")
    model = create_cnn((IMG_SIZE[0], IMG_SIZE[1], 3))

    print("[INFO] Training model...")
    history = model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=5, batch_size=32)

    # Evaluate
    print("[INFO] Evaluating model...")
    y_pred = (model.predict(X_test) > 0.5).astype("int32").flatten()
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Precision:", precision_score(y_test, y_pred))
    print("Recall:", recall_score(y_test, y_pred))
    print("F1 Score:", f1_score(y_test, y_pred))

    # Save model
    model.save("fruit_fresh_rotten_model.h5")
    print("[INFO] Model saved as fruit_fresh_rotten_model.h5")
