// Outlandr - JavaScript functionality

// Application data with updated Outlandr branding
const appData = {
    countries: [
        {
            name: "United States",
            code: "USA",
            flag: "🇺🇸",
            description: "Land of opportunity with diverse visa pathways for skilled professionals and investors",
            keyFacts: ["EB-5 Investor Program", "H1-B Skilled Worker", "275k+ South Africans living there", "12-36 months processing"]
        },
        {
            name: "Australia", 
            code: "AUS",
            flag: "🇦🇺", 
            description: "Points-based system favoring young, skilled professionals with excellent lifestyle",
            keyFacts: ["Skilled Independent visa", "Employer Sponsored program", "207k+ South Africans there", "8-12 months processing"]
        },
        {
            name: "New Zealand",
            code: "NZL", 
            flag: "🇳🇿",
            description: "Beautiful landscapes and streamlined immigration for skilled workers",
            keyFacts: ["Skilled Migrant Category", "Work to Residence", "71k+ South Africans there", "6-12 months processing"]
        },
        {
            name: "United Kingdom",
            code: "GBR",
            flag: "🇬🇧", 
            description: "Historic connections with South Africa and strong professional opportunities",
            keyFacts: ["Skilled Worker visa", "Global Talent program", "217k+ South Africans there", "3-8 months processing"]
        },
        {
            name: "Netherlands",
            code: "NLD",
            flag: "🇳🇱",
            description: "Gateway to Europe with excellent work-life balance and English-friendly environment", 
            keyFacts: ["Highly Skilled Migrant", "EU Blue Card", "28k+ South Africans there", "2-4 months processing"]
        },
        {
            name: "Ireland",
            code: "IRL",
            flag: "🇮🇪",
            description: "EU access with English-speaking culture and growing tech sector",
            keyFacts: ["Critical Skills permit", "General Work Permit", "16k+ South Africans there", "2-6 months processing"]
        },
        {
            name: "Canada", 
            code: "CAN",
            flag: "🇨🇦",
            description: "Welcoming immigration policies and excellent quality of life",
            keyFacts: ["Express Entry system", "Provincial Nominee", "52k+ South Africans there", "6-12 months processing"]
        }
    ],
    provinces: [
        "Western Cape", "Gauteng", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "Northern Cape", "North West"
    ],
    educationLevels: [
        "Matric/Grade 12",
        "Certificate/Diploma", 
        "Bachelor's Degree",
        "Honours Degree",
        "Master's Degree", 
        "Doctoral Degree (PhD)"
    ],
    salaryRanges: [
        "Under R200,000",
        "R200,000 - R400,000", 
        "R400,000 - R600,000",
        "R600,000 - R800,000",
        "R800,000 - R1,000,000",
        "Over R1,000,000"
    ],
    testimonials: [
        {
            name: "Sarah Mitchell",
            location: "Cape Town → Toronto", 
            text: "Outlandr made the impossible feel achievable. Their assessment showed me exactly what I needed to do to qualify for Canada's Express Entry program.",
            rating: 5
        },
        {
            name: "Michael van der Merwe",
            location: "Johannesburg → Sydney",
            text: "The country-specific guidance was invaluable. I knew exactly what to expect and how to strengthen my application for Australia.",
            rating: 5  
        },
        {
            name: "Priya Patel",
            location: "Durban → London",
            text: "Professional, thorough, and supportive throughout the entire process. Made my UK visa application stress-free.",
            rating: 5
        }
    ]
};

// Form state management
let currentStep = 1;
const totalSteps = 10;
let formData = {};
let selectedCountry = null;

// Theme management
let currentTheme = 'light';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Outlandr application...');
    initializeTheme();
    initializeLandingPage();
    initializeForm();
    setupEventListeners();
    loadFormProgress();
    updateButtons();
});

// Theme functionality
function initializeTheme() {
    // Try to load saved theme preference
    try {
        const savedTheme = window.savedTheme || 'light';
        currentTheme = savedTheme;
    } catch (error) {
        console.log('Using default theme');
    }
    
    // Apply theme
    applyTheme(currentTheme);
}

function toggleTheme() {
    console.log('Toggling theme...');
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    
    // Save theme preference
    try {
        window.savedTheme = currentTheme;
    } catch (error) {
        console.log('Could not save theme preference');
    }
}

function applyTheme(theme) {
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        html.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    console.log('Theme applied:', theme);
}

// Landing page initialization
function initializeLandingPage() {
    console.log('Initializing Outlandr landing page...');
    populateCountriesGrid();
    populateTestimonials();
}

function populateCountriesGrid() {
    const grid = document.getElementById('countries-grid');
    if (!grid) {
        console.error('Countries grid element not found');
        return;
    }
    
    console.log('Populating countries grid...');
    grid.innerHTML = appData.countries.map(country => `
        <div class="country-card" onclick="selectCountryAndStart('${country.code}')" tabindex="0" role="button" 
             onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); selectCountryAndStart('${country.code}'); }">
            <div class="country-header">
                <span class="country-flag">${country.flag}</span>
                <h3>${country.name}</h3>
            </div>
            <p class="country-description">${country.description}</p>
            <ul class="country-facts">
                ${country.keyFacts.map(fact => `<li>${fact}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function populateTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) {
        console.error('Testimonials grid element not found');
        return;
    }
    
    console.log('Populating testimonials...');
    grid.innerHTML = appData.testimonials.map(testimonial => `
        <div class="testimonial-card">
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">${testimonial.name}</div>
            <div class="testimonial-location">${testimonial.location}</div>
            <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}</div>
        </div>
    `).join('');
}

// Form initialization
function initializeForm() {
    console.log('Initializing assessment form...');
    populateProvinces();
    populateEducationLevels();
    populateSalaryRanges();
    populateCountryOptions();
    setupFormValidation();
    setupConditionalLogic();
}

function populateProvinces() {
    const select = document.getElementById('province');
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    appData.provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        select.appendChild(option);
    });
}

function populateEducationLevels() {
    const select = document.getElementById('education');
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    appData.educationLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        select.appendChild(option);
    });
}

function populateSalaryRanges() {
    const select = document.getElementById('salary');
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    appData.salaryRanges.forEach(range => {
        const option = document.createElement('option');
        option.value = range;
        option.textContent = range;
        select.appendChild(option);
    });
}

function populateCountryOptions() {
    const container = document.getElementById('country-options');
    if (!container) return;
    
    container.innerHTML = appData.countries.map(country => `
        <div class="country-option" data-country="${country.code}" onclick="selectCountry('${country.code}')"
             tabindex="0" role="button" onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); selectCountry('${country.code}'); }">
            <div class="country-option-header">
                <span class="country-option-flag">${country.flag}</span>
                <h4>${country.name}</h4>
            </div>
            <p>${country.description}</p>
        </div>
    `).join('');
}

// Event listeners setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Smooth scrolling for navigation links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const assessmentForm = document.getElementById('assessment-form');
            const successPage = document.getElementById('success-page');
            
            if (assessmentForm && !assessmentForm.classList.contains('hidden')) {
                if (confirm('Are you sure you want to return to the home page? Your progress will be saved.')) {
                    showLandingPage();
                }
            } else if (successPage && !successPage.classList.contains('hidden')) {
                showLandingPage();
            }
        }
    });
}

// Navigation functions
function startAssessment() {
    console.log('Starting your Outlandr adventure assessment...');
    
    const landingPage = document.getElementById('landing-page');
    const assessmentForm = document.getElementById('assessment-form');
    
    if (!landingPage || !assessmentForm) {
        console.error('Landing page or assessment form elements not found');
        return;
    }
    
    landingPage.classList.add('hidden');
    assessmentForm.classList.remove('hidden');
    
    // Reset to step 1
    currentStep = 1;
    showStep(currentStep);
    updateProgress();
    updateButtons();
    
    // Focus on first form field for accessibility
    setTimeout(() => {
        const firstInput = document.querySelector('#step-1 input, #step-1 select');
        if (firstInput) firstInput.focus();
    }, 100);
}

function showLandingPage() {
    console.log('Returning to Outlandr home...');
    
    const landingPage = document.getElementById('landing-page');
    const assessmentForm = document.getElementById('assessment-form');
    const successPage = document.getElementById('success-page');
    
    if (landingPage) landingPage.classList.remove('hidden');
    if (assessmentForm) assessmentForm.classList.add('hidden');
    if (successPage) successPage.classList.add('hidden');
    
    // Save current progress before resetting
    saveFormProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectCountryAndStart(countryCode) {
    console.log('Selecting destination and starting journey:', countryCode);
    
    selectedCountry = countryCode;
    formData.selectedCountry = countryCode;
    
    // Start assessment
    startAssessment();
    
    // Skip to step 2 and pre-select country
    currentStep = 2;
    showStep(currentStep);
    selectCountry(countryCode);
    updateProgress();
    updateButtons();
}

function selectCountry(countryCode) {
    console.log('Selecting dream destination:', countryCode);
    
    selectedCountry = countryCode;
    formData.selectedCountry = countryCode;
    
    // Update UI
    document.querySelectorAll('.country-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-country="${countryCode}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Update country-specific questions for step 7
    updateCountrySpecificQuestions();
    saveFormProgress();
}

// Step navigation
function nextStep() {
    console.log('Moving to next step, current step:', currentStep);
    
    if (!validateCurrentStep()) {
        return;
    }
    
    saveStepData();
    
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
        updateButtons();
        
        // Focus on first field of new step
        setTimeout(() => {
            const firstInput = document.querySelector(`#step-${currentStep} input, #step-${currentStep} select, #step-${currentStep} textarea`);
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function previousStep() {
    console.log('Going back a step, current step:', currentStep);
    
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
        updateButtons();
        
        // Focus on first field of previous step
        setTimeout(() => {
            const firstInput = document.querySelector(`#step-${currentStep} input, #step-${currentStep} select, #step-${currentStep} textarea`);
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function showStep(step) {
    console.log('Showing step:', step);
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${step}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('hidden');
        console.log('Step', step, 'is now visible');
    } else {
        console.error('Step element not found:', `step-${step}`);
    }
    
    // Special handling for review step
    if (step === 10) {
        populateReviewSummary();
        updateQualificationIndicator();
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill && progressText) {
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
        console.log('Progress updated:', percentage + '%');
    }
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const payBtn = document.getElementById('payBtn');
    
    if (prevBtn) {
        if (currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-flex';
        }
    }
    
    if (nextBtn && payBtn) {
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            payBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            payBtn.style.display = 'none';
        }
    }
    
    console.log('Buttons updated for step:', currentStep);
}

// Form validation
function validateCurrentStep() {
    console.log('Validating step:', currentStep);
    
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--color-error)';
            if (!firstInvalidField) firstInvalidField = field;
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    // Special validation for step 2 (country selection)
    if (currentStep === 2 && !selectedCountry) {
        alert('Please choose your dream destination to continue your journey!');
        return false;
    }
    
    // Special validation for step 10 (payment)
    if (currentStep === 10) {
        const agreeTerms = document.getElementById('agreeTerms');
        if (agreeTerms && !agreeTerms.checked) {
            alert('Please agree to our terms and conditions to unlock your adventure roadmap!');
            return false;
        }
    }
    
    if (!isValid) {
        alert('Please complete all required fields to continue your journey.');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    }
    
    console.log('Validation result:', isValid);
    return isValid;
}

// Save step data
function saveStepData() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (!currentStepElement) return;
    
    console.log('Saving adventure data for step:', currentStep);
    
    // Save form inputs
    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else {
            formData[input.id] = input.value;
        }
    });
    
    saveFormProgress();
}

// Country-specific questions with Outlandr tone
function updateCountrySpecificQuestions() {
    const container = document.getElementById('country-specific-questions');
    const title = document.getElementById('country-specific-title');
    
    if (!container || !selectedCountry) {
        console.log('Cannot update country-specific questions');
        return;
    }
    
    const country = appData.countries.find(c => c.code === selectedCountry);
    if (!country) return;
    
    console.log('Updating destination-specific questions for:', country.name);
    title.textContent = `Your ${country.name} Adventure Details`;
    
    let questions = '';
    
    switch (selectedCountry) {
        case 'USA':
            questions = `
                <div class="form-group">
                    <label class="form-label">Do you have a job offer from a US employer?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="usJobOffer" value="yes"> Yes, I'm all set!</label>
                        <label><input type="radio" name="usJobOffer" value="no"> Not yet, but I'm hopeful</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Have you previously applied for a US visa?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="usPreviousVisa" value="yes"> Yes, I've tried before</label>
                        <label><input type="radio" name="usPreviousVisa" value="no"> First time adventurer</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Do you have family in the USA?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="usFamily" value="yes"> Yes, connections await!</label>
                        <label><input type="radio" name="usFamily" value="no"> Going solo</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Interested in investing in a US business?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="usInvestment" value="yes"> Absolutely!</label>
                        <label><input type="radio" name="usInvestment" value="no"> Not at this time</label>
                    </div>
                </div>
            `;
            break;
            
        case 'AUS':
            questions = `
                <div class="form-group">
                    <label class="form-label" for="ausOccupation">What's your profession?</label>
                    <input type="text" id="ausOccupation" class="form-control" placeholder="e.g., Software Engineer, Nurse, Teacher">
                    <small>We'll check this against Australia's skills shortage list</small>
                </div>
                <div class="form-group">
                    <label class="form-label">Have your qualifications been assessed by Australian authorities?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="ausQualAssessed" value="yes"> Yes, certified and ready!</label>
                        <label><input type="radio" name="ausQualAssessed" value="no"> Not yet</label>
                        <label><input type="radio" name="ausQualAssessed" value="planning"> Planning to get assessed</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Open to living in regional areas initially?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="ausRegional" value="yes"> Bring on the adventure!</label>
                        <label><input type="radio" name="ausRegional" value="no"> City life for me</label>
                        <label><input type="radio" name="ausRegional" value="maybe"> Open to possibilities</label>
                    </div>
                </div>
            `;
            break;
            
        case 'GBR':
            questions = `
                <div class="form-group">
                    <label class="form-label">Do you have a UK employer sponsor?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="ukSponsor" value="yes"> Yes, sponsor secured!</label>
                        <label><input type="radio" name="ukSponsor" value="no"> Not yet</label>
                        <label><input type="radio" name="ukSponsor" value="seeking"> Actively searching</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="ukSalaryOffer">Expected UK salary? (GBP)</label>
                    <select id="ukSalaryOffer" class="form-control">
                        <option value="">Select your range</option>
                        <option value="under-25k">Under £25,000</option>
                        <option value="25k-35k">£25,000 - £35,000</option>
                        <option value="35k-45k">£35,000 - £45,000</option>
                        <option value="45k-60k">£45,000 - £60,000</option>
                        <option value="over-60k">Over £60,000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Do you have UK ancestry (grandparents born in UK)?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="ukAncestry" value="yes"> Yes, family roots!</label>
                        <label><input type="radio" name="ukAncestry" value="no"> No ancestral ties</label>
                        <label><input type="radio" name="ukAncestry" value="unsure"> Need to investigate</label>
                    </div>
                </div>
            `;
            break;
            
        case 'CAN':
            questions = `
                <div class="form-group">
                    <label class="form-label">Interested in Canada's Express Entry system?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="canExpressEntry" value="yes"> Absolutely!</label>
                        <label><input type="radio" name="canExpressEntry" value="no"> Looking at other options</label>
                        <label><input type="radio" name="canExpressEntry" value="learn-more"> Tell me more!</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Do you have Canadian work experience?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="canWorkExp" value="yes"> Yes, I've worked there</label>
                        <label><input type="radio" name="canWorkExp" value="no"> Not yet</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Interested in a Provincial Nominee Program?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="canPNP" value="yes"> Definitely interested</label>
                        <label><input type="radio" name="canPNP" value="no"> Not for me</label>
                        <label><input type="radio" name="canPNP" value="learn-more"> Need more info</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="canFrench">Parlez-vous français?</label>
                    <select id="canFrench" class="form-control">
                        <option value="">Select your level</option>
                        <option value="none">No French (yet!)</option>
                        <option value="basic">Basic bonjour level</option>
                        <option value="intermediate">Getting conversational</option>
                        <option value="fluent">Fluent speaker</option>
                        <option value="native">Native speaker</option>
                    </select>
                </div>
            `;
            break;
            
        case 'NZL':
            questions = `
                <div class="form-group">
                    <label class="form-label" for="nzOccupation">What's your occupation?</label>
                    <input type="text" id="nzOccupation" class="form-control" placeholder="e.g., Teacher, Engineer, Healthcare">
                    <small>We'll check against New Zealand's skills shortage lists</small>
                </div>
                <div class="form-group">
                    <label class="form-label">Do you have a New Zealand job offer?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="nzJobOffer" value="yes"> Yes, offer in hand!</label>
                        <label><input type="radio" name="nzJobOffer" value="no"> Not yet</label>
                        <label><input type="radio" name="nzJobOffer" value="seeking"> Actively looking</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="nzSettlementFunds">Settlement funds available? (NZ$)</label>
                    <select id="nzSettlementFunds" class="form-control">
                        <option value="">Select amount</option>
                        <option value="under-20k">Under NZ$20,000</option>
                        <option value="20k-40k">NZ$20,000 - NZ$40,000</option>
                        <option value="40k-60k">NZ$40,000 - NZ$60,000</option>
                        <option value="over-60k">Over NZ$60,000</option>
                    </select>
                </div>
            `;
            break;
            
        case 'NLD':
            questions = `
                <div class="form-group">
                    <label class="form-label">Do you have EU citizenship?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="nlEUCitizen" value="yes"> Yes, EU passport holder</label>
                        <label><input type="radio" name="nlEUCitizen" value="no"> No EU citizenship</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Meet the highly skilled migrant criteria?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="nlHighlySkilled" value="yes"> Yes, highly skilled</label>
                        <label><input type="radio" name="nlHighlySkilled" value="no"> Not sure I qualify</label>
                        <label><input type="radio" name="nlHighlySkilled" value="unsure"> Need assessment</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="nlDutch">Spreekt u Nederlands?</label>
                    <select id="nlDutch" class="form-control">
                        <option value="">Select your level</option>
                        <option value="none">Geen Nederlands</option>
                        <option value="basic">Basic (A1-A2)</option>
                        <option value="intermediate">Intermediate (B1-B2)</option>
                        <option value="advanced">Advanced (C1-C2)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Have a Dutch employer sponsor?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="nlJobOffer" value="yes"> Yes, sponsor secured</label>
                        <label><input type="radio" name="nlJobOffer" value="no"> Not yet</label>
                        <label><input type="radio" name="nlJobOffer" value="seeking"> Actively searching</label>
                    </div>
                </div>
            `;
            break;
            
        case 'IRL':
            questions = `
                <div class="form-group">
                    <label class="form-label">Do you have EU citizenship?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="irEUCitizen" value="yes"> Yes, EU passport</label>
                        <label><input type="radio" name="irEUCitizen" value="no"> No EU citizenship</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Have an Irish employer sponsor?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="irJobOffer" value="yes"> Yes, job secured</label>
                        <label><input type="radio" name="irJobOffer" value="no"> Not yet</label>
                        <label><input type="radio" name="irJobOffer" value="seeking"> Actively looking</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Is your occupation on Ireland's Critical Skills list?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="irCriticalSkills" value="yes"> Yes, critical skills</label>
                        <label><input type="radio" name="irCriticalSkills" value="no"> No, general skills</label>
                        <label><input type="radio" name="irCriticalSkills" value="unsure"> Need to check</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Considering investment-based immigration?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="irInvestment" value="yes"> Yes, ready to invest</label>
                        <label><input type="radio" name="irInvestment" value="no"> Not interested</label>
                        <label><input type="radio" name="irInvestment" value="maybe"> Possibly</label>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = questions;
}

// Review and payment
function populateReviewSummary() {
    const summaryContainer = document.getElementById('review-summary');
    if (!summaryContainer) return;
    
    const country = appData.countries.find(c => c.code === selectedCountry);
    const countryName = country ? country.name : 'Not selected';
    
    summaryContainer.innerHTML = `
        <h4>Your Adventure Summary</h4>
        <div class="summary-item">
            <span class="summary-label">Adventurer:</span>
            <span class="summary-value">${formData.fullName || 'Not provided'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Contact:</span>
            <span class="summary-value">${formData.email || 'Not provided'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Dream Destination:</span>
            <span class="summary-value">${countryName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Age:</span>
            <span class="summary-value">${formData.age || 'Not provided'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Education:</span>
            <span class="summary-value">${formData.education || 'Not provided'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Profession:</span>
            <span class="summary-value">${formData.jobTitle || 'Not provided'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Experience:</span>
            <span class="summary-value">${formData.workExperience || 'Not provided'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">English Level:</span>
            <span class="summary-value">${formData.englishLevel || 'Not provided'}</span>
        </div>
    `;
}

function updateQualificationIndicator() {
    const indicator = document.getElementById('qualification-indicator');
    if (!indicator) return;
    
    // Enhanced qualification scoring algorithm for Outlandr
    let score = 0;
    
    // Age scoring (optimal ranges for different countries)
    const age = parseInt(formData.age);
    if (age >= 18 && age <= 30) score += 25;
    else if (age <= 35) score += 20;
    else if (age <= 40) score += 15;
    else if (age <= 45) score += 10;
    else if (age <= 50) score += 5;
    
    // Education scoring
    if (formData.education === 'Doctoral Degree (PhD)') score += 25;
    else if (formData.education === 'Master\'s Degree') score += 20;
    else if (formData.education === 'Honours Degree') score += 15;
    else if (formData.education === 'Bachelor\'s Degree') score += 12;
    else if (formData.education === 'Certificate/Diploma') score += 8;
    
    // Work experience scoring
    if (formData.workExperience === '10+') score += 20;
    else if (formData.workExperience === '6-10') score += 15;
    else if (formData.workExperience === '4-5') score += 10;
    else if (formData.workExperience === '2-3') score += 6;
    
    // English proficiency scoring
    if (formData.englishLevel === 'native' || formData.englishLevel === 'fluent') score += 20;
    else if (formData.englishLevel === 'intermediate') score += 10;
    else if (formData.englishLevel === 'basic') score += 4;
    
    // Financial capacity scoring
    if (formData.savings === 'over-1m') score += 15;
    else if (formData.savings === '500k-1m') score += 12;
    else if (formData.savings === '250k-500k') score += 8;
    else if (formData.savings === '100k-250k') score += 5;
    
    // Salary scoring
    if (formData.salary === 'Over R1,000,000') score += 10;
    else if (formData.salary === 'R800,000 - R1,000,000') score += 8;
    else if (formData.salary === 'R600,000 - R800,000') score += 6;
    else if (formData.salary === 'R400,000 - R600,000') score += 4;
    else if (formData.salary === 'R200,000 - R400,000') score += 2;
    
    // Determine qualification level with Outlandr messaging
    let level, message, className;
    if (score >= 75) {
        level = 'Adventure Ready!';
        message = 'Outstanding! Your profile shows excellent potential for your chosen destination. Your journey is looking very promising!';
        className = 'high';
    } else if (score >= 50) {
        level = 'Strong Potential';
        message = 'Great foundation! With some strategic improvements, you could be well-positioned for your dream destination.';
        className = 'medium';
    } else {
        level = 'Building Your Path';
        message = 'Every adventure starts with a first step! Let\'s identify the areas to strengthen for your journey ahead.';
        className = 'low';
    }
    
    indicator.className = `indicator ${className}`;
    indicator.innerHTML = `
        <div style="font-size: var(--font-size-2xl); margin-bottom: var(--space-8);">${level}</div>
        <div>${message}</div>
    `;
}

// Payment processing
function completePayment() {
    console.log('Completing payment and unlocking adventure roadmap...');
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Save final step data
    saveStepData();
    
    // Generate confirmation number
    const confirmationNumber = 'OL' + Date.now().toString().slice(-8);
    
    // Show success page
    const assessmentForm = document.getElementById('assessment-form');
    const successPage = document.getElementById('success-page');
    
    if (assessmentForm) assessmentForm.classList.add('hidden');
    if (successPage) successPage.classList.remove('hidden');
    
    // Update confirmation number
    const confirmationElement = document.getElementById('confirmationNumber');
    if (confirmationElement) {
        confirmationElement.textContent = confirmationNumber;
    }
    
    // Clear form progress
    clearFormProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('Adventure unlocked with confirmation:', confirmationNumber);
}

// Form progress persistence
function saveFormProgress() {
    const progressData = {
        currentStep,
        formData,
        selectedCountry,
        timestamp: Date.now()
    };
    
    try {
        // Store in window object for sandbox environment
        window.outlandrProgress = progressData;
        console.log('Adventure progress saved');
    } catch (error) {
        console.log('Could not save adventure progress');
    }
}

function loadFormProgress() {
    try {
        const progressData = window.outlandrProgress;
        
        if (progressData && (Date.now() - progressData.timestamp < 24 * 60 * 60 * 1000)) {
            currentStep = progressData.currentStep;
            formData = progressData.formData;
            selectedCountry = progressData.selectedCountry;
            
            // Restore form values
            restoreFormValues();
            console.log('Adventure progress loaded');
        }
    } catch (error) {
        console.log('Could not load adventure progress');
    }
}

function restoreFormValues() {
    Object.keys(formData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'radio') {
                const radio = document.querySelector(`input[name="${key}"][value="${formData[key]}"]`);
                if (radio) radio.checked = true;
            } else if (element.type === 'checkbox') {
                element.checked = formData[key];
            } else {
                element.value = formData[key];
            }
        }
    });
    
    // Restore country selection
    if (selectedCountry) {
        selectCountry(selectedCountry);
    }
}

function clearFormProgress() {
    try {
        window.outlandrProgress = null;
        console.log('Adventure progress cleared');
    } catch (error) {
        console.log('Could not clear adventure progress');
    }
}

// Conditional logic setup
function setupConditionalLogic() {
    // Show/hide language test scores
    document.addEventListener('change', function(e) {
        if (e.target.name === 'languageTest') {
            const testScores = document.getElementById('testScores');
            if (testScores) {
                if (e.target.value === 'yes') {
                    testScores.classList.remove('hidden');
                } else {
                    testScores.classList.add('hidden');
                }
            }
        }
    });
}

// Form validation setup
function setupFormValidation() {
    // Email validation
    document.addEventListener('blur', function(e) {
        if (e.target.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (e.target.value && !emailRegex.test(e.target.value)) {
                e.target.style.borderColor = 'var(--color-error)';
            } else {
                e.target.style.borderColor = '';
            }
        }
    }, true);
    
    // Input formatting and validation
    document.addEventListener('input', function(e) {
        if (e.target.id === 'phone') {
            // Format phone number
            e.target.value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
        }
        
        // Card number formatting
        if (e.target.id === 'cardNumber') {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        }
        
        // Expiry date formatting
        if (e.target.id === 'expiryDate') {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        }
        
        // CVV validation
        if (e.target.id === 'cvv') {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        }
    }, true);
    
    // Real-time feedback for form fields
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-control') && e.target.hasAttribute('required')) {
            if (e.target.value.trim()) {
                e.target.style.borderColor = '';
            }
        }
    }, true);
}

// Make functions globally available - this is crucial for the HTML onclick handlers to work
window.toggleTheme = toggleTheme;
window.startAssessment = startAssessment;
window.showLandingPage = showLandingPage;
window.selectCountryAndStart = selectCountryAndStart;
window.selectCountry = selectCountry;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.completePayment = completePayment;
