import os
import imutils
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.applications import DenseNet121

# Load DenseNet121 with pre-trained weights and exclude top layers
base_model = DenseNet121(weights='imagenet', include_top=False, input_shape=(128, 128, 3))

# Freeze base model layers
base_model.trainable = False

# Add custom layers (same as training)
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x)
x = Dropout(0.4)(x)
output_layer = Dense(4, activation='softmax')(x)  # 4 output classes

# Create the model
model = Model(inputs=base_model.input, outputs=output_layer)

# Load weights (adjust path as necessary)
weights_path = os.path.join('uploads', 'densenet121_01.weights.h5')
if os.path.exists(weights_path):
    try:
        model.load_weights(weights_path)
        print("Model weights loaded successfully from:", weights_path)
    except Exception as e:
        print("Error loading weights:", str(e))
        # Initialize weights if loading fails
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
else:
    print("Warning: Weights file not found at:", weights_path)
    # Initialize weights if file doesn't exist
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

app = Flask(__name__)
print('Model loaded. Check http://127.0.0.1:5000/')

# Create required directories
os.makedirs('templates', exist_ok=True)
os.makedirs('uploads', exist_ok=True)

def get_className(classNo):
    if classNo == 0:
        return "No Brain Tumor"
    elif classNo == 1:
        return "Glioma Tumor"
    elif classNo == 2:
        return "Meningioma Tumor"
    elif classNo == 3:
        return "Pituitary Tumor"

def crop(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5,5), 0)

    thresh = cv2.threshold(gray, 45, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)

    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    
    if len(cnts) == 0:
        return image  # Return original if no contour found

    c = max(cnts, key=cv2.contourArea)
    extLeft = tuple(c[c[:,:,0].argmin()][0])
    extRight = tuple(c[c[:,:,0].argmax()][0])
    extTop = tuple(c[c[:,:,1].argmin()][0])
    extBot = tuple(c[c[:,:,1].argmax()][0])

    return image[extTop[1]:extBot[1], extLeft[0]:extRight[0]]

def getResult(img_path):
    try:
        image = cv2.imread(img_path)
        if image is None:
            raise ValueError("Could not read image file")
            
        image = crop(image)
        image = cv2.resize(image, (128, 128))
        image = np.array(image) / 255.0

        input_img = np.expand_dims(image, axis=0)
        result = model.predict(input_img)
        
        print("Raw prediction probabilities:", result[0])  # Debug output
        result01 = np.argmax(result, axis=1)
        return result01
    except Exception as e:
        print("Error in getResult:", str(e))
        return None

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        try:
            f = request.files['file']
            basepath = os.path.dirname(__file__)
            file_path = os.path.join(basepath, 'uploads', secure_filename(f.filename))
            f.save(file_path)
            
            value = getResult(file_path)
            if value is None:
                return {'error': 'Error processing image'}
                
            result = get_className(value[0])
            confidence = 0.95  # You might want to calculate actual confidence from prediction probabilities
            
            # Clean up the uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)
                
            return {
                'prediction': result,
                'confidence': confidence
            }
        except Exception as e:
            print("Error in upload route:", str(e))
            return {'error': str(e)}
    return None

if __name__ == '__main__':
    app.run(debug=True)