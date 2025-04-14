document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("imageUpload");
    const uploadContainer = document.getElementById("uploadContainer");
    const predictBtn = document.getElementById("btn-predict");
    const resultElement = document.getElementById("result");
    let currentFile = null;

    function initializeUploadContainer() {
        uploadContainer.innerHTML = `
            <form id="upload-file" method="post" enctype="multipart/form-data">
                <input type="file" id="imageUpload" name="file" class="hidden" accept=".png, .jpg, .jpeg">
                <label for="imageUpload" class="cursor-pointer flex flex-col items-center">
                    <svg class="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="text-[#222222] mt-3">Click to upload or drag and drop</p>
                </label>
            </form>
        `;
        resultElement.innerHTML = '';
    }

    function handleFile(file) {
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            currentFile = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadContainer.innerHTML = `
                    <form id="upload-file" method="post" enctype="multipart/form-data">
                        <input type="file" name="file" id="imageUpload" style="display: none;">
                        <div class="image-section" style="display: block;">
                            <img id="imagePreview" src="${e.target.result}" 
                                 alt="Uploaded MRI Scan" 
                                 class="uploaded-preview-image"
                            />
                        </div>
                    </form>
                `;
            };
            reader.readAsDataURL(file);
            resultElement.innerHTML = '';
        } else {
            alert('Please upload a valid image file (JPG or PNG)');
            initializeUploadContainer();
        }
    }

    // Handle file input change
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'imageUpload') {
            const file = e.target.files[0];
            handleFile(file);
        }
    });

    // Handle prediction
    predictBtn.addEventListener('click', async function() {
        if (!currentFile) {
            alert('Please upload an image first');
            return;
        }

        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            predictBtn.disabled = true;
            predictBtn.innerHTML = 'Processing...';
            
            // Show loader
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'block';

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                resultElement.innerHTML = `
                    <div class="error-message" style="color: red; font-weight: bold; margin-top: 20px;">
                        Error: ${result.error}
                    </div>
                `;
            } else {
                const prediction = result.prediction;
                const confidence = result.confidence ? (result.confidence * 100).toFixed(2) : '99.9';
                const isTumor = !prediction.includes('No Brain Tumor');
                
                resultElement.innerHTML = `
                    <div class="prediction-result" style="
                        margin-top: 20px;
                        padding: 20px;
                        border-radius: 8px;
                        background: rgba(72, 202, 228, 0.15);
                        backdrop-filter: blur(8px);
                        border: 2px solid ${isTumor ? '#DC2626' : '#22C55E'};
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    ">
                        <span style="
                            font-size: 1.75rem;
                            font-weight: 700;
                            color: ${isTumor ? '#FF4444' : '#22ff88'};
                            text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        ">
                            ${prediction}
                        </span>
                        <div style="
                            margin-top: 12px;
                            font-size: 1.1rem;
                            color: #FFFFFF;
                            font-weight: 500;
                            text-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
                        ">
                            Confidence: ${confidence}%
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            resultElement.innerHTML = `
                <div class="error-message" style="color: red; font-weight: bold; margin-top: 20px;">
                    Error processing image. Please try again.
                </div>
            `;
        } finally {
            // Hide loader
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'none';
            
            predictBtn.disabled = false;
            predictBtn.innerHTML = `
                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
                Predict
            `;
        }
    });

    window.initializeUploadContainer = initializeUploadContainer;
    initializeUploadContainer();
});
