function addEducation() {
  const eduEntry = document.querySelector('.education-entry');
  const clone = eduEntry.cloneNode(true);
  // Clear values in the cloned entry
  clone.querySelectorAll('input, textarea').forEach(input => input.value = "");
  document.getElementById('education-section').appendChild(clone);
}

function addExperience() {
  const expEntry = document.querySelector('.experience-entry');
  const clone = expEntry.cloneNode(true);
  clone.querySelectorAll('input, textarea').forEach(input => input.value = "");
  document.getElementById('experience-section').appendChild(clone);
}

function addProject() {
  const projEntry = document.querySelector('.project-entry');
  const clone = projEntry.cloneNode(true);
  clone.querySelectorAll('input, textarea').forEach(input => input.value = "");
  document.getElementById('project-section').appendChild(clone);
}

function addCertification() {
  const certEntry = document.querySelector('.certification-entry');
  const clone = certEntry.cloneNode(true);
  clone.querySelectorAll('input, textarea').forEach(input => input.value = "");
  document.getElementById('certification-section').appendChild(clone);
}

document.addEventListener("DOMContentLoaded", function () {
  renderTemplate();
  populatePortfolio();
  updateProfileImage();

  // Live preview: update on any input change
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener("input", populatePortfolio);
  });

  // Also update preview when new fields are added dynamically
  document.getElementById('education-section').addEventListener('input', populatePortfolio);
  document.getElementById('experience-section').addEventListener('input', populatePortfolio);
  document.getElementById('project-section').addEventListener('input', populatePortfolio);
  document.getElementById('certification-section').addEventListener('input', populatePortfolio);

  // When template changes, reload and update preview
  document.getElementById("templateSelector").addEventListener("change", function() {
    renderTemplate();
    populatePortfolio();
  });
});

function populatePortfolio() {
  // Get form values
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const about = document.getElementById("about").value;
  const skills = document.getElementById("skills").value; // <-- FIXED
  const linkedin = document.getElementById("linkedin").value;
  const github = document.getElementById("github").value;

  // Skills (split by comma)
  const skillList = skills.split(",").filter(s => s.trim()).map(skill => `<li>${skill.trim()}</li>`).join("");

  // Update preview
  if (document.getElementById("preview-name")) document.getElementById("preview-name").innerText = name;
  if (document.getElementById("preview-email")) document.getElementById("preview-email").innerText = email;
  if (document.getElementById("preview-phone")) document.getElementById("preview-phone").innerText = phone;
  if (document.getElementById("preview-about")) document.getElementById("preview-about").innerText = about;
  if (document.getElementById("preview-skills")) document.getElementById("preview-skills").innerHTML = skillList;
  if (document.getElementById("preview-linkedin"))
    document.getElementById("preview-linkedin").innerHTML = linkedin
      ? `<a href="${linkedin}" target="_blank">LinkedIn</a>`
      : "";
  if (document.getElementById("preview-github"))
    document.getElementById("preview-github").innerHTML = github
      ? `<a href="${github}" target="_blank">GitHub</a>`
      : "";

  getAllEducationEntries();
  getAllExperienceEntries();
  getAllProjectEntries();
  getAllCertifications();
}

function getAllEducationEntries() {
  const eduEntries = document.querySelectorAll('.education-entry');
  let html = "";
  eduEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    const degree = inputs[0].value;
    const institute = inputs[1].value;
    const start = inputs[2].value;
    const end = inputs[3].value;
    const desc = inputs[4].value;
    if (degree || institute || start || end || desc) {
      html += `<li><strong>${degree}</strong> – ${institute} (${start} to ${end})<br>${desc}</li>`;
    }
  });
  if (document.getElementById("preview-education")) document.getElementById("preview-education").innerHTML = html;
}

function getAllExperienceEntries() {
  const expEntries = document.querySelectorAll('.experience-entry');
  let html = "";
  expEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    const title = inputs[0].value;
    const company = inputs[1].value;
    const start = inputs[2].value;
    const end = inputs[3].value;
    const desc = inputs[4].value;
    if (title || company || start || end || desc) {
      html += `<li><strong>${title}</strong> at ${company} (${start} – ${end})<br>${desc}</li>`;
    }
  });
  if (document.getElementById("preview-experience")) document.getElementById("preview-experience").innerHTML = html;
}

function getAllProjectEntries() {
  const projEntries = document.querySelectorAll('.project-entry');
  let html = "";
  projEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    const title = inputs[0].value;
    const url = inputs[1].value;
    const tech = inputs[2].value;
    const desc = inputs[3].value;
    if (title || url || tech || desc) {
      html += `<li><strong>${title}</strong> – <a href="${url}" target="_blank">${url}</a><br>${desc}<br><em>${tech}</em></li>`;
    }
  });
  if (document.getElementById("preview-projects")) document.getElementById("preview-projects").innerHTML = html;
}

function getAllCertifications() {
  const certEntries = document.querySelectorAll('.certification-entry');
  let html = "";
  certEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    const title = inputs[0].value;
    const issuedBy = inputs[1].value;
    const year = inputs[2].value;
    const desc = inputs[3].value;
    if (title || issuedBy || year || desc) {
      html += `<li>${title} – ${issuedBy} (${year})<br>${desc}</li>`;
    }
  });
  if (document.getElementById("preview-certifications")) document.getElementById("preview-certifications").innerHTML = html;
}

function generatePreview() {
  renderTemplate();        // Loads the selected template into preview area
  populatePortfolio();     // Fills in the data from the form
}

function updateProfileImage() {
  const fileInput = document.getElementById('profileImg');
  const template = document.getElementById("templateSelector").value;
  if (template === "template3") {
    // For template3, handle the preview-img-container
    const imgContainer = document.getElementById('preview-img-container');
    const img = document.getElementById('preview-img');
    if (!imgContainer || !img) return;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      // Show container and image, set src
      imgContainer.style.display = '';
      img.style.display = '';
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      // Hide container and image, remove src
      imgContainer.style.display = 'none';
      img.style.display = 'none';
      img.src = '';
    }
    return;
  }
  // Default for template1 and template2
  let imgContainer;
  if (template === "template1") {
    imgContainer = document.querySelector('.col-md-4.text-center.border-end');
  } else if (template === "template2") {
    imgContainer = document.querySelector('.w-100.text-center.mb-3');
  }
  if (!imgContainer) return;
  // Remove any existing preview image
  const oldImg = imgContainer.querySelector('#preview-img');
  if (oldImg) oldImg.remove();
  if (fileInput && fileInput.files && fileInput.files[0]) {
    // Only create and insert image if a file is uploaded
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.id = "preview-img";
      img.src = e.target.result;
      img.alt = "Profile";
      img.style.width = "120px";
      img.style.height = "120px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "100px";
      img.style.border = template === "template2" ? "4px solid #ffc107" : "";
      img.className = template === "template2"
        ? "photo mb-3 mx-auto d-block"
        : "img-fluid rounded-circle mb-3 photo mb-3 mx-auto d-block";
      imgContainer.insertBefore(img, imgContainer.firstChild);
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
}

// Call this after rendering the template and on file input change
document.getElementById('profileImg').addEventListener('change', function () {
  updateProfileImage();
});

// Remove duplicate event handler for profileImg (handled in updateProfileImage)

// In renderTemplate, set display:none for the image by default in both templates:
function renderTemplate() {
  const selectedTemplate = document.getElementById("templateSelector").value;
  const output = document.getElementById("portfolio-output");
  let templateHTML = "";

  if (selectedTemplate === "template1") {
    templateHTML = `
      <div class="card shadow p-4">
        <div class="row">
          <div class="col-md-4 text-center border-end">
            <!-- Profile image will be inserted here by JS if uploaded -->
            <div id="preview-img-container"></div>
            <h4 id="preview-name"></h4>
            <p id="preview-email" class="mb-1"></p>
            <p id="preview-phone"></p>
            <p id="preview-linkedin"></p>
            <p id="preview-github"></p>
            <hr>
            <h6>Skills</h6>
            <ul id="preview-skills" class="list-unstyled"></ul>
          </div>
          <div class="col-md-8">
            <section class="mb-4"><h5>About Me</h5><p id="preview-about"></p></section>
            <section class="mb-4"><h5>Education</h5><ul id="preview-education"></ul></section>
            <section class="mb-4"><h5>Experience</h5><ul id="preview-experience"></ul></section>
            <section class="mb-4"><h5>Projects</h5><ul id="preview-projects"></ul></section>
            <section><h5>Certifications</h5><ul id="preview-certifications"></ul></section>
          </div>
        </div>
      </div>`;
  }

  if (selectedTemplate === "template2") {
    templateHTML = `
      <div class="d-flex" style="min-height:100vh;">
        <!-- Left Panel -->
        <div class="col-md-4 left-panel d-flex flex-column align-items-center" style="background:#1a1a1a;color:white;padding:2rem;min-height:100vh;">
          <div class="w-100 text-center mb-3">
            <!-- Profile image will be inserted here by JS if uploaded -->
            <div id="preview-img-container"></div>
            <h3 id="preview-name" class="mt-2 mb-0"></h3>
            <div class="highlight" id="preview-role" style="color:#ffc107;font-weight:bold;"></div>
          </div>
          <hr class="w-100 mb-3" style="border-top:2px solid #ffc107;opacity:1;"/>
          <div class="section w-100">
            <h5 style="margin-top:2rem;font-weight:bold;"><i class="fa fa-phone contact-icon" style="color:#ffc107;margin-right:8px;"></i>Contact Me</h5>
            <div class="mb-1"><i class="fa fa-phone contact-icon" style="color:#ffc107;margin-right:8px;"></i><span id="preview-phone"></span></div>
            <div class="mb-1"><i class="fa fa-envelope contact-icon" style="color:#ffc107;margin-right:8px;"></i><span id="preview-email"></span></div>
            <div class="mb-1"><i class="fa-brands fa-linkedin contact-icon" style="color:#ffc107;margin-right:8px;"></i><span id="preview-linkedin"></span></div>
            <div class="mb-1"><i class="fa-brands fa-github contact-icon" style="color:#ffc107;margin-right:8px;"></i><span id="preview-github"></span></div>
          </div>
          <div class="section w-100">
            <h5 style="margin-top:2rem;font-weight:bold;"><i class="fa fa-graduation-cap contact-icon" style="color:#ffc107;margin-right:8px;"></i>Education</h5>
            <ul id="preview-education" class="mb-0"></ul>
          </div>
        </div>
        <!-- Right Panel -->
        <div class="col-md-8 right-panel text-dark" style="background:#fff;padding:2rem 2.5rem;min-height:100vh;">
          <div class="section-divider" style="border-left:3px solid #ffc107;padding-left:20px;margin-bottom:2.5rem;margin-top:2.5rem;">
            <div class="icon-title" style="font-weight:700;font-size:1.2rem;margin-bottom:1rem;display:flex;align-items:center;gap:10px;">
              <i class="fa fa-user" style="color:#ffc107;font-size:1.2rem;"></i>About Me
            </div>
            <p id="preview-about"></p>
          </div>
          <div class="section-divider" style="border-left:3px solid #ffc107;padding-left:20px;margin-bottom:2.5rem;margin-top:2.5rem;">
            <div class="icon-title" style="font-weight:700;font-size:1.2rem;margin-bottom:1rem;display:flex;align-items:center;gap:10px;">
              <i class="fa fa-briefcase" style="color:#ffc107;font-size:1.2rem;"></i>Job Experience
            </div>
            <ul id="preview-experience" class="mb-0"></ul>
          </div>
          <div class="section-divider" style="border-left:3px solid #ffc107;padding-left:20px;margin-bottom:2.5rem;margin-top:2.5rem;">
            <div class="icon-title" style="font-weight:700;font-size:1.2rem;margin-bottom:1rem;display:flex;align-items:center;gap:10px;">
              <i class="fa fa-folder-open" style="color:#ffc107;font-size:1.2rem;"></i>Projects
            </div>
            <ul id="preview-projects" class="mb-0"></ul>
          </div>
          <div class="section-divider" style="border-left:3px solid #ffc107;padding-left:20px;margin-bottom:2.5rem;margin-top:2.5rem;">
            <div class="icon-title" style="font-weight:700;font-size:1.2rem;margin-bottom:1rem;display:flex;align-items:center;gap:10px;">
              <i class="fa fa-cogs" style="color:#ffc107;font-size:1.2rem;"></i>Skills
            </div>
            <ul id="preview-skills" class="list-unstyled d-flex flex-row flex-wrap gap-2 justify-content-center align-items-center mb-3"></ul>
          </div>
          <div class="section-divider" style="border-left:3px solid #ffc107;padding-left:20px;margin-bottom:2.5rem;margin-top:2.5rem;">
            <div class="icon-title" style="font-weight:700;font-size:1.2rem;margin-bottom:1rem;display:flex;align-items:center;gap:10px;">
              <i class="fa fa-certificate" style="color:#ffc107;font-size:1.2rem;"></i>Certifications
            </div>
            <ul id="preview-certifications" class="list-unstyled mb-0"></ul>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    `;
  }

  if (selectedTemplate === "template3") {
    templateHTML = `
      <div class="template3-card" style="background:#749BC2;color:#FFFBDE;border-radius:10px;max-width:800px;margin:auto;padding: 20px;">
        <div class="template3-header">
          <div id="preview-img-container" style="display:none;">
            <img id="preview-img" src="" class="template3-img  mb-3 photo mb-3 mx-auto d-block" width="120" height="120" style="object-fit:cover; display:none;" alt="Profile Photo">
          </div>
          <div>
            <h1 id="preview-name" class="template3-title"></h1>
            <div id="preview-role" class="fw-bold" style="color:#FFFBDE;"></div>
          </div>
        </div>
        <div class="template3-contact">
          <div><i class="fa fa-envelope"></i><span id="preview-email"></span></div>
          <div><i class="fa fa-phone"></i><span id="preview-phone"></span></div>
          <div><i class="fa-brands fa-linkedin"></i><span id="preview-linkedin"></span></div>
          <div><i class="fa-brands fa-github"></i><span id="preview-github"></span></div>
        </div>
        <div class="template3-section">
          <h5>About Me</h5>
          <p id="preview-about"></p>
        </div>
        <div class="template3-section">
          <h5>Education</h5>
          <ul id="preview-education"></ul>
        </div>
        <div class="template3-section">
          <h5>Experience</h5>
          <ul id="preview-experience"></ul>
        </div>
        <div class="template3-section">
          <h5>Projects</h5>
          <ul id="preview-projects"></ul>
        </div>
        <div class="template3-section">
          <h5>Certifications</h5>
          <ul id="preview-certifications"></ul>
        </div>
        <div class="template3-section">
          <h5>Skills</h5>
          <ul id="preview-skills" class="template3-skills"></ul>
        </div>
      </div>
      <style>
        body { background: #749BC2; color: #FFFBDE; }
        @media print {
        .template3-card {
          background-color: #749bc2;
          color: #fffbde;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        #preview-img-container[style*='display:none'] { display: none !important; }
        #preview-img[style*='display:none'] { display: none !important; }
      </style>
    `;
  }

  output.innerHTML = templateHTML;
  // Ensure Template 3 preview always uses correct colors
  if (selectedTemplate === "template3") {
    const card = output.querySelector('.template3-card');
    if (card) {
      card.style.background = "#749BC2";
      card.style.color = "#FFFBDE";
    }
    const skillsList = output.querySelector('.template3-skills');
    if (skillsList) {
      skillsList.querySelectorAll('li').forEach(li => {
        li.style.background = "#5b7fa3";
        li.style.color = "#FFFBDE";
        li.style.border = "1px solid #FFFBDE";
      });
    }
    // Add spacing to contact icons in preview (clean, JS-based)
    const contactDivs = document.querySelectorAll('.template3-contact > div > i');
    contactDivs.forEach(icon => {
      // Add a spacing class or inline style for margin-right
      icon.style.marginRight = '10px';
    });
  }
  // Always update image preview after rendering
  updateProfileImage();
}

function printPortfolio() {
  window.print();
}

function validateForm() {
  // Name: only letters and spaces, required
  const name = document.getElementById("fullName").value.trim();
  if (!/^[A-Za-z\s]+$/.test(name) || name === "") {
    alert("Please enter a valid name (letters and spaces only).");
    document.getElementById("fullName").focus();
    return false;
  }

  // Email: basic pattern, required
  const email = document.getElementById("email").value.trim();
  if (!/^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(email)) {
    alert("Please enter a valid email address.");
    document.getElementById("email").focus();
    return false;
  }

  // Phone: digits, +, -, spaces allowed, required, min 7 chars
  const phone = document.getElementById("phone").value.trim();
  if (!/^[\d\+\-\s]+$/.test(phone) || phone.length < 7) {
    alert("Please enter a valid phone number.");
    document.getElementById("phone").focus();
    return false;
  }

  // LinkedIn: must start with https://linkedin.com/
  const linkedin = document.getElementById("linkedin").value.trim();
  if (linkedin && !/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedin)) {
    alert("Please enter a valid LinkedIn URL (must start with https://linkedin.com/).");
    document.getElementById("linkedin").focus();
    return false;
  }

  // GitHub: must start with https://github.com/
  const github = document.getElementById("github").value.trim();
  if (github && !/^https:\/\/(www\.)?github\.com\/.*$/.test(github)) {
    alert("Please enter a valid GitHub URL (must start with https://github.com/).");
    document.getElementById("github").focus();
    return false;
  }

  // Address: required
  const address = document.getElementById("address").value.trim();
  if (address === "") {
    alert("Please enter your address.");
    document.getElementById("address").focus();
    return false;
  }

  // About Me: required, min 10 chars
  const about = document.getElementById("about").value.trim();
  if (about.length < 10) {
    alert("Please enter at least 10 characters in About Me.");
    document.getElementById("about").focus();
    return false;
  }

  // Skills: required
  const skills = document.getElementById("skills").value.trim();
  if (skills === "") {
    alert("Please enter at least one skill.");
    document.getElementById("skills").focus();
    return false;
  }

  // Education: at least one, all fields required
  const eduEntries = document.querySelectorAll('.education-entry');
  let eduValid = false;
  eduEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    if ([...inputs].every(input => input.value.trim() !== "")) eduValid = true;
  });
  if (!eduValid) {
    alert("Please fill all fields in at least one Education entry.");
    eduEntries[0].querySelector('input').focus();
    return false;
  }

  // Experience: at least one, all fields required
  const expEntries = document.querySelectorAll('.experience-entry');
  let expValid = false;
  expEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    if ([...inputs].every(input => input.value.trim() !== "")) expValid = true;
  });
  if (!expValid) {
    alert("Please fill all fields in at least one Work Experience entry.");
    expEntries[0].querySelector('input').focus();
    return false;
  }

  // Projects: at least one, all fields required
  const projEntries = document.querySelectorAll('.project-entry');
  let projValid = false;
  projEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    if ([...inputs].every(input => input.value.trim() !== "")) projValid = true;
  });
  if (!projValid) {
    alert("Please fill all fields in at least one Project entry.");
    projEntries[0].querySelector('input').focus();
    return false;
  }

  // Certifications: at least one, all fields required
  const certEntries = document.querySelectorAll('.certification-entry');
  let certValid = false;
  certEntries.forEach(entry => {
    const inputs = entry.querySelectorAll('input, textarea');
    if ([...inputs].every(input => input.value.trim() !== "")) certValid = true;
  });
  if (!certValid) {
    alert("Please fill all fields in at least one Certification entry.");
    certEntries[0].querySelector('input').focus();
    return false;
  }

  return true; // All validations passed
}

// Prevent numbers in name field as user types
document.getElementById("fullName").addEventListener("input", function(e) {
  this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

document.getElementById('portfolio-form').addEventListener('reset', function (e) {
  setTimeout(() => {
    // Remove extra dynamic entries (keep only the first one)
    ['education', 'experience', 'project', 'certification'].forEach(section => {
      const container = document.getElementById(`${section}-section`);
  let imgContainer = document.getElementById('preview-img-container');
    });
    // Clear preview area
    document.getElementById('portfolio-output').innerHTML =
      '<p class="text-muted">Fill out the form to see your portfolio here...</p>';
  }, 10); // Timeout ensures form fields are cleared first
});
