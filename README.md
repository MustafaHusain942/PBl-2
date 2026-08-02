# 🧠 NeuroInsight - Brain Tumor Detection & Classification

**Deep Learning-based MRI Classification for Brain Tumor Diagnosis Support**

---

## 📋 Project Overview

NeuroInsight is a Flask-based web application built to assist healthcare professionals, radiologists, and researchers in detecting brain tumors from MRI images using deep learning. The platform supports multiple pre-trained CNN architectures (DenseNet121, MobileNetV3, VGG19) for efficient classification of brain tumor types, and keeps a history of past detections for easy tracking. NeuroInsight aims to bridge medical imaging and AI to support timely, data-driven healthcare decisions.

### Key Features
- 🔍 MRI-based brain tumor classification using AI
- 🧠 Support for major CNN architectures (DenseNet121, MobileNetV3, VGG19)
- 🖼️ Easy-to-use interface for uploading and classifying MRI scans
- 🕒 Detection history tracking for reviewing past scans and results
- 🛠️ Modular architecture to plug and switch between model types
- 💡 Informative interface designed for health professionals and researchers

---

## 🏗️ Project Structure

```
Brain_Tumor_Detection_and_Classification/
│
├── app.py                          # Flask backend (main application)
│
├── data/
│   ├── detection_history.json      # Stored history of past detections
│   └── id_tracking.json            # Detection/session ID tracking
│
├── models/
│   ├── DenseNet121.ipynb           # DenseNet121 training notebook
│   ├── MobileNetV3.ipynb           # MobileNetV3 training notebook
│   └── Vgg19.ipynb                 # VGG19 training notebook
│
├── static/
│   ├── index.css                   # Custom CSS
│   ├── index.js                    # Frontend JS logic
│   └── neuroinsight_logo.png       # App logo
│
├── templates/
│   ├── index.html                  # Main upload/classification page
│   └── history.html                # Detection history page
│
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Trained model weights (or Jupyter Notebook to train your own)

### Step 1: Clone the Repository
```bash
git clone https://github.com/MustafaHusain942/Brain_Tumor_Detection_and_Classification.git
cd Brain_Tumor_Detection_and_Classification
```

### Step 2: Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Add Model Weights
1. Run the appropriate notebook from `models/` — `DenseNet121.ipynb`, `MobileNetV3.ipynb`, or `Vgg19.ipynb`
2. Save the trained model weights
3. Update `app.py` to load the path of your desired model weights for classification

### Step 5: Verify Data Directory
Ensure the `data/` directory contains `detection_history.json` and `id_tracking.json` (created automatically on first run if missing)

---

## ▶️ Running the Application

### Start the Flask Server
```bash
python app.py
```

You should see:
```
🧠 NeuroInsight - Brain Tumor Detection
============================================================
[INFO] Starting Flask Application...
[INFO] Access the app at: http://127.0.0.1:5000
============================================================
[INFO] Model weights loaded successfully!
 * Running on http://127.0.0.1:5000
```

### Access the Application
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🧪 Testing the Application

### Test Case 1: Basic MRI Upload
1. Open the application in your browser
2. Click "Upload Image" and select a valid MRI scan
3. Click "Classify" / "Analyze"
4. Observe the console logs showing model inference
5. Verify the classification result displays one of: Glioma, Meningioma, Pituitary Tumor, or No Tumor

### Test Case 2: Detection History
1. Perform a few classifications
2. Navigate to the History page (`history.html`)
3. Verify past detections are listed with their results and tracked IDs from `detection_history.json` / `id_tracking.json`

### Test Case 3: Error Handling
Test invalid inputs:
- Try uploading without selecting an image
- Upload a non-image file (should be rejected)
- Check browser console for proper error messages

---

## 🔍 How It Works

### Backend Flow (app.py)

1. **User uploads MRI image** → Flask receives POST request for classification
2. **Image validation** → Checks file type and size
3. **Preprocessing** (OpenCV & PIL)
   - Resizes and normalizes the MRI scan for model input
4. **Model Inference**
   - Loads the selected pre-trained CNN (DenseNet121 / MobileNetV3 / VGG19)
   - Runs classification across the four categories
5. **History logging** → Appends result and ID to `detection_history.json` / `id_tracking.json`
6. **Response generation** → Formats classification result and confidence score
7. **Result sent to frontend** → Frontend displays the diagnosis support output

### Frontend Flow (index.html / history.html)

1. User interaction with UI
2. FormData creation with MRI image
3. AJAX POST request to the classification endpoint
4. Progress indicators during processing
5. Dynamic result rendering with predicted tumor category
6. Detection history browsable via a dedicated history page
7. Error handling with user-friendly messages

---

## 🗂 Dataset Used

- **Source:** Publicly available Brain MRI dataset from [Kaggle](https://www.kaggle.com/datasets)
- **Categories:** Glioma, Meningioma, Pituitary Tumor, and No Tumor
- Dataset split into `train/`, `test/`, and `validation/` sets for model training (see `models/` notebooks)

---

## 🐛 Troubleshooting

### Issue: "Model weights not found"
**Solution**: Ensure you've run a training notebook from `models/` and updated the model path in `app.py`

### Issue: "Module not found" errors
**Solution**: Ensure virtual environment is activated and run:
```bash
pip install -r requirements.txt
```

### Issue: "Port already in use"
**Solution**: Change port in app.py:
```python
app.run(debug=True, port=5001)  # Use different port
```

### Issue: Images not uploading
**Solution**: Verify the app has write permissions to save uploads

### Issue: Detection history not updating
**Solution**: Confirm `data/detection_history.json` and `data/id_tracking.json` exist and are writable

### Issue: Incorrect or inconsistent predictions
**Solution**:
- Verify the correct model weights are loaded for the selected architecture
- Confirm the MRI image is clear and correctly preprocessed
- Retrain the model if accuracy is consistently low

---

## 📊 System Requirements

### Minimum Requirements
- **Python**: 3.8+
- **RAM**: 4GB
- **Storage**: 500MB for dependencies (excluding dataset)
- **GPU**: Optional (recommended for training, not required for inference)

### Recommended Requirements
- **Python**: 3.10+
- **RAM**: 8GB+
- **Storage**: 2GB+ (including dataset and model weights)
- **GPU**: Recommended for faster training of CNN models

---

## 🔐 Security Notes

- ✅ Secure filename handling for uploaded MRI images
- ✅ File type validation (only PNG, JPG, JPEG allowed)
- ✅ File size limits enforced on uploads
- ✅ NeuroInsight is intended for research and diagnosis **support** only, not as a replacement for professional medical diagnosis

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| Flask | Web framework |
| TensorFlow / Keras | Deep learning model building |
| OpenCV | Image preprocessing |
| Pillow (PIL) | Image processing |
| numpy | Numerical operations |
| Jupyter Notebook | Model training & evaluation |

---

## 🎯 Future Enhancements

- [ ] Add Grad-CAM visualization for model interpretability
- [ ] Migrate detection history from JSON to a proper database
- [ ] Add user authentication for clinical use
- [ ] Support batch MRI processing
- [ ] Add ensemble model predictions
- [ ] Deploy to cloud (AWS/GCP/Azure)
- [ ] Mobile app version

---

## 🤝 Contributing

We welcome contributions to improve NeuroInsight!

To contribute:
1. Fork the repo
2. Create a new feature branch
```bash
git checkout -b your-feature-name
```
3. Commit your changes
```bash
git commit -m "Describe your changes"
```
4. Push and submit a pull request
```bash
git push origin your-feature-name
```

---

## 📄 License

See LICENSE file for details

---

## 👨‍💻 Author

**Mustafa Husain**

---

## 🙏 Acknowledgments

- Kaggle for the Brain MRI dataset
- TensorFlow and Keras teams
- Flask framework developers
- OpenCV and Pillow contributors

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review console logs for error details
3. Verify all setup steps were completed
4. Confirm model weights are correctly loaded

---

**Last Updated**: August 2026  
**Version**: 1.0.0
