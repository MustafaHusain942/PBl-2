# 🧠 NeuroInsight

**NeuroInsight** is an intelligent web application built to assist healthcare professionals, radiologists, and researchers in detecting brain tumors from MRI images using deep learning. With support for multiple pre-trained CNN models like **DenseNet**, **MobileNet**, and **VGG19**, the platform enables efficient classification of brain tumor types for better diagnosis support.

By uploading an MRI scan, the app processes the image through a chosen deep learning model to classify the condition, enhancing diagnostic speed and consistency. NeuroInsight is designed to bridge medical imaging and AI, aiming to support timely and data-driven healthcare decisions.

---

## 📚 Table of Contents

- ✨ Features  
- 🗂 Dataset Used  
- ⚙️ Installation  
- 🧰 Technologies Used  
- 🚀 How to Use  
- 🤝 Contributing  

---

## ✨ Features

- 🔍 MRI Brain Tumor Classification using AI  
- 🧠 Supports major CNN architectures  
- 🖼️ Easy-to-use interface for uploading and classifying MRI scans  
- 🛠️ Modular architecture to plug and switch between model types  
- 💡 Informative interface for health professionals and researchers  

---

## 🗂 Dataset Used

- **Source:** Publicly available Brain MRI dataset from [Kaggle](https://www.kaggle.com/datasets)
- **Categories:** Glioma, Meningioma, Pituitary Tumor, and No Tumor  
- Dataset split into:
```bash
dataset/
├── train/
├── test/
└── validation/
```

---

⚙️ Installation & Setup
1. Clone the Repository
```bash
git clone https://github.com/MustafaHusain942/PBl-2.git
cd PBl-2
```
2. Install Required Dependencies
```bash
pip install -r requirements.txt
```
3. Add Model Weights
Run the appropriate .ipynb training notebook for DenseNet, MobileNet, or VGG19

Save the trained model weights

Update app.py to load the path of your desired model weights for classification

4. Launch the Web App
````bash
python app.py
````
Then open your browser and go to:
```bash
http://127.0.0.1:5000
```

---

🧰 Technologies Used
- Python 3
- TensorFlow / Keras – Deep learning model building
- Flask – Lightweight web framework
- OpenCV & PIL – Image preprocessing
- Jupyter Notebook – Model training & evaluation
- HTML / CSS / JS – Frontend styling

---

🚀 How to Use
- Run the app and navigate to the browser URL
- Upload a valid MRI image of a brain scan
- The model will classify the image as one of the tumor categories
- View the classification result and take action accordingly

---

🤝 Contributing
We welcome contributions to improve NeuroInsight!
To contribute:

Fork the repo

Create a new feature branch

```bash
git checkout -b your-feature-name
```
Commit your changes

```bash
git commit -m "Describe your changes"
```
Push and submit a pull request

```bash
git push origin your-feature-name
```
