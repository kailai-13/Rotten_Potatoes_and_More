# 🥔 Rotten Potatoes AI - Fresh vs Rotten Fruit Detection System

A modern web application that uses artificial intelligence to detect the quality of various fruits from uploaded images. Built with React frontend and FastAPI backend powered by TensorFlow machine learning models. Despite the playful "potato" branding, this system works with multiple types of fruits!

## 🚀 Features

- **AI-Powered Detection**: Advanced deep learning model trained on diverse fruit datasets
- **Multi-Fruit Support**: Works with various types of fruits (apples, bananas, oranges, potatoes, etc.)
- **Real-time Predictions**: Get results in under 2 seconds
- **Modern UI/UX**: Glassmorphism design with responsive layout
- **File Validation**: Supports JPG, PNG, JPEG formats up to 10MB
- **Error Handling**: Comprehensive error management and user feedback
- **Multi-page Application**: Home, About, Services, and Contact pages
- **Mobile Responsive**: Optimized for all device sizes

## 🍎 About the Name

The "Rotten Potatoes" name is a playful branding choice! The actual system is a comprehensive **fruit quality detection** application that can analyze various types of fruits to determine if they're fresh or rotten. The underlying machine learning model (`fruit_fresh_rotten_model.h5`) is trained on diverse fruit datasets.

## 🛠️ Technologies Used

### Frontend
- **React 18+** - Modern JavaScript library for building user interfaces
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful & consistent icon toolkit
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **TensorFlow** - Machine learning platform
- **OpenCV** - Computer vision library for image preprocessing
- **NumPy** - Scientific computing library
- **Uvicorn** - ASGI web server

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager
- pip package manager

## 🚦 Installation & Setup

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rotten-potatoes-ai.git
cd rotten-potatoes-ai
```

2. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install fastapi uvicorn tensorflow opencv-python numpy python-multipart
```

4. **Place your trained model**
```bash
# Create models directory and place your model file
mkdir models
# Copy your fruit_fresh_rotten_model.h5 to models/ directory
```

5. **Run the FastAPI server**
```bash
uvicorn main:app --reload
```

The backend server will start at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory (or create new React app)**
```bash
npx create-react-app frontend
cd frontend
```

2. **Install frontend dependencies**
```bash
npm install axios lucide-react
```

3. **Install Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. **Configure Tailwind CSS**

Add to `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Replace App.js with the provided code**

6. **Start the React development server**
```bash
npm start
```

The frontend will start at `http://localhost:3000`

## 📁 Project Structure

```
rotten-potatoes-ai/
├── backend/
│   ├── main.py                       # FastAPI application
│   ├── models/
│   │   └── fruit_fresh_rotten_model.h5  # Trained ML model for fruits
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js                   # Main React component
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### POST `/predict-image`

Analyzes an uploaded fruit image to determine quality.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the fruit image

**Response:**
```json
{
  "prediction": 0  // 0 = Fresh, 1 = Rotten
}
```

**Error Response:**
```json
{
  "error": "Invalid file format. Please upload a .jpg, .png, or .jpeg file."
}
```

## 🎮 Usage

1. **Start both servers** (backend on :8000, frontend on :3000)

2. **Navigate to the application** in your web browser

3. **Upload a fruit image**:
   - Click on the upload area or drag and drop an image
   - Supported formats: JPG, PNG, JPEG (max 10MB)
   - Works with various fruits: apples, bananas, oranges, potatoes, etc.

4. **Get prediction**:
   - Click "Upload & Predict" button
   - View real-time results (Fresh ✅ or Rotten 🍟)

5. **Explore other pages**:
   - About: Learn about the AI technology
   - Services: View pricing plans
   - Contact: Get in touch

## 🧠 Machine Learning Model

The application uses a deep learning model trained on diverse fruit datasets:

- **Model Architecture**: Convolutional Neural Network (CNN)
- **Input Size**: 224x224 RGB images
- **Training Data**: Various fruit types in fresh and rotten states
- **Preprocessing**: Image resizing, normalization, and color space conversion
- **Output**: Binary classification (0 = Fresh, 1 = Rotten)

## 🍓 Supported Fruits

While branded as "Rotten Potatoes," the system can analyze various fruits including:
- 🍎 Apples
- 🍌 Bananas  
- 🍊 Oranges
- 🥔 Potatoes
- 🍓 Strawberries
- And many more!

*Note: Model performance may vary depending on the specific fruit type and how well it was represented in the training data.*

## 🔧 Configuration

### Backend Configuration

You can modify the backend settings in `main.py`:

```python
# Change model path
app.state.model = tf.keras.models.load_model("path/to/your/fruit_model.h5")

# Modify image preprocessing parameters
img = cv2.resize(img, (224, 224))  # Model input size
img = img/255.0  # Normalization

# Modify CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Restrict origins in production
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Frontend Configuration

Update the API endpoint in `App.js`:

```javascript
const response = await axios.post("http://your-backend-url/predict-image", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
});
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Create `requirements.txt`:
```
fastapi
uvicorn[standard]
tensorflow
opencv-python-headless
numpy
python-multipart
```

2. Create `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend Deployment (Netlify/Vercel)

1. Build the production version:
```bash
npm run build
```

2. Update API endpoint for production environment

3. Deploy the `build` folder

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Future Enhancements

- [ ] User authentication and profiles
- [ ] Batch image processing
- [ ] Confidence score display from model
- [ ] Fruit type classification (not just quality)
- [ ] Image history and analytics
- [ ] Mobile app development
- [ ] Expanded fruit variety support
- [ ] API rate limiting
- [ ] Database integration
- [ ] Model retraining interface

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Ensure all Python dependencies are installed
- Check if the `fruit_fresh_rotten_model.h5` file exists in the models/ directory
- Verify Python version compatibility with TensorFlow

**Frontend connection errors:**
- Confirm backend is running on port 8000
- Check CORS configuration
- Verify API endpoint URL in frontend code

**Model prediction errors:**
- Ensure model file is not corrupted
- Check image preprocessing steps match training pipeline
- Verify TensorFlow version compatibility
- Try with different fruit images for testing

**Poor prediction accuracy:**
- Ensure uploaded images are clear and well-lit
- Try with fruits that were well-represented in training data
- Consider retraining model with more diverse datasets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Dr. Sarah Chen** - AI Research Lead & Model Development
- **Mike Rodriguez** - Full Stack Development  
- **Prof. James Wilson** - Food Science & Agricultural Advisor

## 🙏 Acknowledgments

- TensorFlow team for the amazing ML framework
- React team for the powerful frontend library
- FastAPI team for the excellent backend framework
- Open source fruit datasets contributors
- Computer vision research community
- Contributors and beta testers

## 📞 Support

For support, email hello@rottenpotatoes.ai or join our community discussions.

**Need help with specific fruits or model performance? We're here to help!**

***

**Built with ❤️ for better food quality control across all fruits**

*P.S. - Yes, i know it's not potatoes! 🍎🍌🍊*
