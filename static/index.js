document.addEventListener('DOMContentLoaded', function() {
    // Add sidebar functions
    window.openSidebar = function() {
        document.getElementById('sidebar').style.right = '0';
    }

    window.closeSidebar = function() {
        document.getElementById('sidebar').style.right = '-400px';
    }

    const symptomsSelect = document.getElementById('symptoms');
    const selectedSymptomsContainer = document.getElementById('selected-symptoms');
    const uploadContainer = document.getElementById('uploadContainer');
    const resultElement = document.getElementById('result');
    const predictBtn = document.getElementById('btn-predict');
    const patientNameInput = document.getElementById('patientName');
    const patientAgeInput = document.getElementById('patientAge');
    const patientGenderInput = document.getElementById('patientGender');
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
        currentFile = null;
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

    // Add drag and drop handlers
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#48CAE4';
        this.style.backgroundColor = 'rgba(72, 202, 228, 0.3)';
    });

    uploadContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#0077B6';
        this.style.backgroundColor = 'rgba(72, 202, 228, 0.2)';
    });

    uploadContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#0077B6';
        this.style.backgroundColor = 'rgba(72, 202, 228, 0.2)';
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Add event listener for symptoms selection
    symptomsSelect.addEventListener('mousedown', function(e) {
        e.preventDefault();
        const option = e.target;
        if (option.tagName === 'OPTION') {
            option.selected = !option.selected;
            updateSelectedSymptoms();
        }
    });

    function updateSelectedSymptoms() {
        selectedSymptomsContainer.innerHTML = '';
        const selectedOptions = Array.from(symptomsSelect.selectedOptions);
        
        if (selectedOptions.length === 0) {
            selectedSymptomsContainer.innerHTML = '<span style="color: #0077B6; font-weight: bold; font-size: 14px;">No symptoms selected</span>';
            return;
        }
        
        selectedOptions.forEach(option => {
            const symptomElement = document.createElement('span');
            symptomElement.className = 'selected-symptom';
            symptomElement.innerHTML = `
                ${option.text}
                <span class="remove-symptom" data-value="${option.value}">&times;</span>
            `;
            selectedSymptomsContainer.appendChild(symptomElement);
            
            const removeButton = symptomElement.querySelector('.remove-symptom');
            removeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const valueToRemove = e.target.dataset.value;
                const optionToDeselect = Array.from(symptomsSelect.options).find(
                    opt => opt.value === valueToRemove
                );
                if (optionToDeselect) {
                    optionToDeselect.selected = false;
                    updateSelectedSymptoms();
                }
            });
        });
    }

    // Handle prediction result UI
    predictBtn.addEventListener('click', async function() {
        try {
            if (!currentFile) {
                alert('Please upload an image first');
                return;
            }

            const patientName = patientNameInput.value.trim();
            if (!patientName) {
                alert('Please enter patient name');
                patientNameInput.focus();
                return;
            }

            const patientAge = patientAgeInput.value;
            if (!patientAge) {
                alert('Please enter patient age');
                patientAgeInput.focus();
                return;
            }

            const patientGender = patientGenderInput.value;
            if (!patientGender) {
                alert('Please select patient gender');
                patientGenderInput.focus();
                return;
            }

            // Get selected symptoms
            const selectedSymptoms = Array.from(symptomsSelect.selectedOptions).map(option => option.value);

            const formData = new FormData();
            formData.append('file', currentFile);
            formData.append('patient_name', patientName);
            formData.append('patient_age', patientAge);
            formData.append('patient_gender', patientGender);
            selectedSymptoms.forEach(symptom => {
                formData.append('symptoms[]', symptom);
            });

            predictBtn.disabled = true;
            predictBtn.innerHTML = 'Processing...';
            
            // Show loader
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'block';

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Error making prediction');
            }
            
            if (result.error) {
                throw new Error(result.error);
            }

            const prediction = result.prediction;
            const confidence = result.confidence ? (result.confidence * 100).toFixed(2) : '99.9';
            const isTumor = !prediction.includes('No Brain Tumor');
            
            resultElement.innerHTML = `
                <div class="prediction-result" data-tumor="${isTumor}" style="
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
                        color: ${isTumor ? '#FF4444' : '#00ff88'};
                        text-shadow: 0 0 15px rgba(${isTumor ? '255, 68, 68' : '0, 255, 136'}, 0.3);
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

        } catch (error) {
            console.error('Error:', error);
            resultElement.innerHTML = `
                <div class="prediction-result" style="
                    margin-top: 20px;
                    padding: 20px;
                    border-radius: 8px;
                    background: rgba(220, 38, 38, 0.15);
                    backdrop-filter: blur(8px);
                    border: 2px solid #DC2626;
                    text-align: center;
                    color: #DC2626;
                ">
                    ${error.message || 'Error processing request'}
                </div>
            `;
        } finally {
            predictBtn.disabled = false;
            predictBtn.innerHTML = `
                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
                Predict
            `;
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'none';
        }
    });

    // Initialize the upload container when the page loads
    window.initializeUploadContainer = initializeUploadContainer;
    initializeUploadContainer();

    // Initialize symptoms display
    updateSelectedSymptoms();
});
