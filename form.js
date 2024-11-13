let selectedFile = null;
let isLoading = false;
let selectedTab = 'skin';

const skinResultInfoMap = {
  'benign_keratosis-like_lesions': {
    category: 'Benign Keratosis',
    definition: "Non-cancerous skin growths, often appearing as rough, brown or black patches.",
    precautions: "Avoid excessive sun exposure, use sunscreen, and avoid scratching.",
    nextSteps: "Regularly monitor for changes, and consult a dermatologist if the appearance changes."
  },
  'basal_cell_carcinoma': {
    category: 'Basal Cell Carcinoma',
    definition: "A common form of skin cancer that usually appears as a pearly bump or flat lesion.",
    precautions: "Protect skin from UV rays, apply sunscreen daily, and avoid tanning beds.",
    nextSteps: "Consult a dermatologist for evaluation. Treatments may include surgical removal or topical therapies."
  },
  'actinic_keratoses': {
    category: 'Actinic Keratoses',
    definition: "Rough, scaly patches on the skin caused by sun exposure, can be precancerous.",
    precautions: "Limit sun exposure, use sunscreen, and wear protective clothing.",
    nextSteps: "See a dermatologist for assessment. Treatments include cryotherapy, laser therapy, or topical treatments."
  },
  'vascular_lesions': {
    category: 'Vascular Lesions',
    definition: "Blood vessel growths that may appear red or purple, often benign.",
    precautions: "Avoid trauma to affected areas, and monitor for any changes in size or color.",
    nextSteps: "Consult a dermatologist if the lesion grows or changes. Options include laser treatment if needed."
  },
  'melanocytic_Nevi': {
    category: 'Melanocytic Nevi',
    definition: "Common moles, typically benign, but some may develop into melanoma.",
    precautions: "Monitor for asymmetry, border changes, and color variations (ABCDE rule).",
    nextSteps: "Schedule regular skin exams, and seek medical advice for any concerning changes."
  },
  'melanoma': {
    category: 'Melanoma',
    definition: "A serious type of skin cancer that can spread to other parts of the body.",
    precautions: "Protect skin from UV exposure, avoid tanning beds, and monitor moles carefully.",
    nextSteps: "Seek immediate medical attention. Treatment options include surgery, immunotherapy, and chemotherapy."
  },
  'dermatofibroma': {
    category: 'Dermatofibroma',
    definition: "A benign, small, firm skin nodule, often red-brown and typically harmless.",
    precautions: "Avoid trauma to the area, as it may cause irritation.",
    nextSteps: "Generally no treatment is needed, but consult a dermatologist if it changes or becomes painful."
  },
  'malignant': {
    category: 'Malignant',
    definition: "Breast cancer that requires prompt medical attention for treatment.",
    precautions: "Maintain a healthy lifestyle, perform regular self-exams, and seek medical advice if there are changes.",
    nextSteps: "Consult an oncologist for treatment options, which may include surgery, chemotherapy, or radiation therapy."
  },
  'benign': {
    category: 'Benign',
    definition: "Non-cancerous breast lump, often harmless but should be monitored.",
    precautions: "Regular self-exams, maintain a healthy diet, and avoid high-fat foods.",
    nextSteps: "Regular follow-up with a healthcare provider. Ultrasound or mammography may be recommended for monitoring."
  },
  'unknown': {
    category: 'Unknown',
    definition: 'I\'m not too sure about this one',
    precautions: 'I\'m not too sure about this one too',
    nextSteps: 'You should probably go see a specialist to learn more about this'
  }
};

function handleFileChange(event) {
  const fileInput = event.target;
  console.log("File input change detected.");
  if (fileInput.files && fileInput.files[0]) {
    selectedFile = fileInput.files[0];
    console.log("Selected file:", selectedFile.name);
    document.getElementById('file-name').innerText = selectedFile.name;
    document.getElementById('upload-btn').disabled = false;
  } else {
    console.log("No file selected.");
  }
}

function handleDrop(event) {
  event.preventDefault();
  console.log("File dropped.");
  const files = event.dataTransfer.files;
  if (files && files[0]) {
    selectedFile = files[0];
    console.log("Selected file from drop:", selectedFile.name);
    document.getElementById('file-name').innerText = selectedFile.name;
    document.getElementById('upload-btn').disabled = false;
  } else {
    console.log("No file dropped.");
  }
}

function selectTab(tab) {
  selectedTab = tab;
  console.log("Tab selected:", selectedTab);
  document.querySelectorAll('.tab-trigger').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelector(`.tab-trigger[onclick="selectTab('${tab}')"]`).classList.add('active');
}

async function handleSubmit(event) {
  event.preventDefault();
  console.log("Submit button clicked.");

  if (!selectedFile) {
    console.log("No file selected. Aborting submission.");
    return;
  }

  if (isLoading) {
    console.log("Submission in progress. Please wait.");
    return;
  }

  isLoading = true;
  console.log("Submission started. Uploading...");
  document.getElementById('upload-btn').innerText = 'Uploading...';

  apiCall();
}

async function apiCall() {
    try {
        let condition;
        condition = await postImage(selectedFile, selectedTab);
    
        console.log("Condition received:", condition);
        const info = skinResultInfoMap[condition] || { definition: "Unknown condition", precautions: "N/A", nextSteps: "Consult a specialist." };
    
        document.getElementById('api-response').innerHTML = `
          <table>
            <tr style="height: 32px;"><th style="padding-right: 18px;">Condition</th><td>${info.category}</td></tr>
            <tr style="height: 32px;"><th style="padding-right: 18px;">Definition</th><td>${info.definition}</td></tr>
            <tr style="height: 32px;"><th style="padding-right: 18px;">Precautions</th><td>${info.precautions}</td></tr>
            <tr style="height: 32px;"><th style="padding-right: 18px;">Next Steps</th><td>${info.nextSteps}</td></tr>
          </table>
        `;
      } catch (error) {
        document.getElementById('api-response').innerText = "Error: API call failed.";
      }
    
      document.getElementById('upload-btn').innerText = 'Upload';
      isLoading = false;
      console.log("Submission completed.");
}

async function postImage(file, type) {
    console.log(`Uploading ${type} image with file: ${file.name}`);
    
    const formData = new FormData();
    formData.append('image', file); // Use 'image' as the key, matching the curl request
    
    try {
      // Determine the correct endpoint based on the selectedTab value
      const url = selectedTab === 'skin' ? 'http://127.0.0.1:5000/skin-predict' : 'http://127.0.0.1:5000/breast-predict';
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
    
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
    
      const data = await response.json();
      console.log("API response:", data);
    
      return data.label; // Assuming the API returns 'condition' in this format
    } catch (error) {
      console.error("Error during API call:", error);
      throw error;
    }
  }  