// Application data and existing content remain the same as previous file

const appData = {
  services: {
    preAssessment: {
      price: "R1,099",
      title: "Professional Pre-Assessment",
      description: "Comprehensive evaluation of your emigration eligibility and pathway recommendations",
      features: [
        "Detailed eligibility assessment for all target countries",
        "Personalized immigration pathway recommendations",
        "Document requirements checklist",
        "Timeline and cost estimates",
        "Priority processing assessment",
        "Written report with actionable next steps"
      ]
    },
    ongoingSupport: {
      title: "Dedicated Travel Specialist Support",
      description: "Ongoing guidance from experienced immigration specialists",
      features: [
        "Dedicated specialist assigned to your case",
        "Regular progress check-ins and updates",
        "Document preparation assistance",
        "Application review and optimization",
        "Interview preparation support",
        "Post-arrival settlement guidance"
      ]
    }
  },
  countries: [
    {
      name: "USA",
      flag: "🇺🇸",
      topics: ["Green Card", "H1B Visa", "EB-5 Investor", "Family Sponsorship", "Diversity Visa"],
      keyInfo: {
        popularVisas: ["H1B Work Visa", "Green Card (EB categories)", "EB-5 Investor Visa"],
        minimumInvestment: "$500,000 - $1,000,000 (EB-5)",
        processingTime: "6 months - 2+ years",
        keyRequirements: "Job offer or investment, English proficiency, clean background"
      }
    },
    {
      name: "UK",
      flag: "🇬🇧",
      topics: ["Skilled Worker Visa", "Global Talent", "Ancestry Visa", "Student Visa", "Investor Visa"],
      keyInfo: {
        popularVisas: ["Skilled Worker Visa", "UK Ancestry Visa", "Global Talent Visa"],
        minimumSalary: "£38,700+ (Skilled Worker)",
        processingTime: "3-8 weeks",
        keyRequirements: "Job offer, English proficiency, financial requirements"
      }
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      topics: ["Express Entry", "Provincial Nominee", "Quebec Immigration", "Family Sponsorship", "Student Visa"],
      keyInfo: {
        popularVisas: ["Express Entry", "Provincial Nominee Program (PNP)"],
        minimumPoints: "75+ (Express Entry)",
        processingTime: "6 months (Express Entry)",
        keyRequirements: "Points-based system, language test, education assessment"
      }
    },
    {
      name: "Ireland",
      flag: "🇮🇪",
      topics: ["Critical Skills", "General Work Permit", "EU Blue Card", "Student Visa", "Investment"],
      keyInfo: {
        popularVisas: ["Critical Skills Employment Permit", "General Employment Permit"],
        minimumSalary: "€32,000+ (Critical Skills)",
        processingTime: "8-12 weeks",
        keyRequirements: "Job offer, qualification assessment, English proficiency"
      }
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      topics: ["Skilled Independent", "Employer Sponsored", "Regional Visa", "Business Innovation", "Family Visa"],
      keyInfo: {
        popularVisas: ["Skilled Independent (189)", "Skilled Nominated (190)", "Employer Sponsored (482)"],
        minimumPoints: "65+ points",
        processingTime: "4-8 months",
        keyRequirements: "Skills assessment, English test, age under 45"
      }
    },
    {
      name: "Netherlands",
      flag: "🇳🇱",
      topics: ["Highly Skilled Migrant", "EU Blue Card", "Self-Employment", "Family Reunification", "Student Visa"],
      keyInfo: {
        popularVisas: ["Highly Skilled Migrant Visa", "EU Blue Card"],
        minimumSalary: "€5,688/month (30+), €4,171/month (<30)",
        processingTime: "2-4 weeks",
        keyRequirements: "Job offer from recognized sponsor, salary threshold"
      }
    },
    {
      name: "New Zealand",
      flag: "🇳🇿",
      topics: ["Skilled Migrant", "Work to Residence", "Green List", "Investor Visa", "Family Category"],
      keyInfo: {
        popularVisas: ["Skilled Migrant Category", "Accredited Employer Work Visa"],
        minimumPoints: "6 points (new system)",
        processingTime: "4-7 weeks (priority applications)",
        keyRequirements: "Job offer, qualifications, salary threshold"
      }
    }
  ],
  quickActions: [
    "What are the visa requirements for skilled workers?",
    "How much does it cost to immigrate?",
    "What documents do I need to prepare?",
    "How long does the process take?",
    "Do I need a job offer first?",
    "What are the language requirements?",
    "Can I bring my family?",
    "Should I get a pre-assessment?"
  ]
};

let conversationHistory = [];
let selectedCountry = null;
let apiKey = '';

const elements = {
  apiKeyInput: document.getElementById('apiKey'),
  chatMessages: document.getElementById('chatMessages'),
  chatInput: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn'),
  typingIndicator: document.getElementById('typingIndicator'),
  exportBtn: document.getElementById('exportBtn'),
  clearBtn: document.getElementById('clearBtn'),
  serviceModal: document.getElementById('serviceModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.getElementById('modalClose'),
  modalCancel: document.getElementById('modalCancel'),
  modalAction: document.getElementById('modalAction')
};

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  setupQuickActions();
  setupCountryButtons();
  setupServiceButtons();
});

function initializeEventListeners() {
  elements.apiKeyInput.addEventListener('input', function () {
    apiKey = this.value.trim();
  });

  elements.chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  elements.sendBtn.addEventListener('click', sendMessage);
  elements.exportBtn.addEventListener('click', exportConversation);
  elements.clearBtn.addEventListener('click', clearConversation);

  elements.modalClose.addEventListener('click', closeModal);
  elements.modalCancel.addEventListener('click', closeModal);

  elements.serviceModal.addEventListener('click', function (e) {
    if (e.target === elements.serviceModal || e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  document.getElementById('preAssessmentBtn').addEventListener('click', () => showServiceModal('preAssessment'));
  document.getElementById('consultationBtn').addEventListener('click', () => showServiceModal('consultation'));
  document.getElementById('footerAssessmentBtn').addEventListener('click', () => showServiceModal('preAssessment'));
}

function setupQuickActions() {
  const quickActionBtns = document.querySelectorAll('.quick-action-btn');
  quickActionBtns.forEach((btn, idx) => {
    btn.textContent = appData.quickActions[idx] || btn.textContent;
    btn.addEventListener('click', function () {
      elements.chatInput.value = this.textContent;
      sendMessage();
    });
  });
}

function setupCountryButtons() {
  const countryBtns = document.querySelectorAll('.country-btn');
  countryBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      countryBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      const countryName = this.dataset.country;
      selectedCountry = appData.countries.find((c) => c.name === countryName);
      const message = `Tell me about immigration to ${countryName}`;
      elements.chatInput.value = message;
      sendMessage();
    });
  });
}

function setupServiceButtons() {
  // Delegated event handling (in case future dynamic elements are added)
  document.body.addEventListener('click', function (e) {
    const target = e.target.closest('.service-btn');
    if (!target) return;
    const service = target.dataset.service;
    if (service === 'preAssessment') {
      showServiceModal('preAssessment');
    } else if (service === 'specialist') {
      showServiceModal('specialist');
    }
  });
}

async function sendMessage() {
  const message = elements.chatInput.value.trim();
  if (!message) return;

  if (!apiKey) {
    showError('Please enter your Perplexity API key first.');
    return;
  }

  addMessage(message, 'user');
  elements.chatInput.value = '';
  showTypingIndicator();

  try {
    const responseText = await getPerplexityResponse(message);
    hideTypingIndicator();
    addMessage(responseText, 'bot');
    checkForServiceRecommendation(message, responseText);
  } catch (err) {
    hideTypingIndicator();
    showError('Unable to retrieve response. Please verify your API key.');
    console.error(err);
  }
}

async function getPerplexityResponse(message) {
  const context = buildContextPrompt();
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

function buildContextPrompt() {
  let context = `You are Outlandr's professional immigration assistant, helping South Africans emigrate to USA, UK, Canada, Ireland, Australia, Netherlands, and New Zealand.\n\n`;
  context += `Services to promote when relevant:\n• Pre-Assessment (R1,099)\n• Dedicated Specialist Support\n\n`;
  appData.countries.forEach((c) => {
    context += `${c.name} ${c.flag}: Popular visas - ${c.keyInfo.popularVisas.join(', ')}. Key requirements - ${c.keyInfo.keyRequirements}. Processing time - ${c.keyInfo.processingTime}.\n`;
  });
  if (selectedCountry) {
    context += `\nUser is particularly interested in ${selectedCountry.name}. Focus advice on this country.\n`;
  }
  if (conversationHistory.length) {
    context += `\nRecent conversation context:\n` + conversationHistory.slice(-3).map((msg) => `${msg.type}: ${msg.content}`).join('\n');
  }
  return context;
}

function addMessage(content, type) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${type}-message`;
  const inner = document.createElement('div');
  inner.className = 'message-content';
  inner.innerHTML = formatMessage(content);
  wrapper.appendChild(inner);
  elements.chatMessages.appendChild(wrapper);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  conversationHistory.push({ type, content, timestamp: new Date().toISOString() });
}

function formatMessage(text) {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  html = html.replace(/^[-•]\s(.+)$/gm, '<li>$1</li>');
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  }
  return html;
}

function checkForServiceRecommendation(userMsg, botMsg) {
  const triggers = ['cost', 'price', 'eligibility', 'requirement', 'document', 'timeline', 'assess', 'qualify'];
  const needs = triggers.some((t) => userMsg.toLowerCase().includes(t) || botMsg.toLowerCase().includes(t));
  if (needs && Math.random() > 0.6) {
    const promo = `<p><strong>💡 Professional Recommendation:</strong> You may benefit from our <strong>Pre-Assessment service (R1,099)</strong> for personalized eligibility insights and pathway suggestions.</p>`;
    setTimeout(() => addMessage(promo, 'bot'), 1500);
  }
}

function showTypingIndicator() {
  elements.typingIndicator.classList.remove('hidden');
}
function hideTypingIndicator() {
  elements.typingIndicator.classList.add('hidden');
}
function showError(msg) {
  const div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = msg;
  elements.chatMessages.appendChild(div);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  setTimeout(() => div.remove(), 5000);
}
function exportConversation() {
  if (!conversationHistory.length) {
    alert('No conversation to export.');
    return;
  }
  const blob = new Blob([JSON.stringify({ conversationHistory, selectedCountry }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `outlandr-conversation-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function clearConversation() {
  if (conversationHistory.length && confirm('Clear conversation history?')) {
    conversationHistory = [];
    const msgs = elements.chatMessages.querySelectorAll('.message');
    msgs.forEach((m, i) => {
      if (i) m.remove(); // keep welcome
    });
  }
}
function showServiceModal(type) {
  let title = '', bodyHtml = '', actionLabel = '', actionFn = null;
  if (type === 'preAssessment') {
    const s = appData.services.preAssessment;
    title = s.title;
    bodyHtml = `<div class="service-details"><div class="price">${s.price}</div><p>${s.description}</p><h4>Included:</h4><ul class="features-list">${s.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`;
    actionLabel = `Get Pre-Assessment - ${s.price}`;
    actionFn = () => {
      window.open('mailto:info@outlandr.com?subject=Pre-Assessment Inquiry&body=I would like to purchase the Pre-Assessment service.', '_blank');
      closeModal();
    };
  } else if (type === 'specialist') {
    const s = appData.services.ongoingSupport;
    title = s.title;
    bodyHtml = `<div class="service-details"><p>${s.description}</p><h4>Support Includes:</h4><ul class="features-list">${s.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`;
    actionLabel = 'Contact Specialist';
    actionFn = () => {
      window.open('mailto:info@outlandr.com?subject=Dedicated Specialist Support Inquiry', '_blank');
      closeModal();
    };
  } else if (type === 'consultation') {
    title = 'Free Consultation';
    bodyHtml = `<div class="service-details"><p>Book a free 15-minute consultation to discuss your immigration goals.</p></div>`;
    actionLabel = 'Book Consultation';
    actionFn = () => {
      window.open('mailto:info@outlandr.com?subject=Free Consultation Request', '_blank');
      closeModal();
    };
  }
  elements.modalTitle.textContent = title;
  elements.modalBody.innerHTML = bodyHtml;
  elements.modalAction.textContent = actionLabel;
  elements.modalAction.onclick = actionFn;
  elements.serviceModal.classList.remove('hidden');
}
function closeModal() {
  elements.serviceModal.classList.add('hidden');
}

// Initial welcome already in HTML; ensure chat scroll at bottom
elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;