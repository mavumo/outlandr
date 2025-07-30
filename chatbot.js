// Outlandr Emigration Assistant - Fixed Version
(() => {
  'use strict';

  const appData = {
    countries: [
      { name: 'USA', flag: '🇺🇸', topics: ['Green Card', 'H1B Visa', 'EB-5 Investor', 'Family Sponsorship', 'Diversity Visa'], keyInfo: { popularVisas: ['H1B Work Visa', 'Green Card (EB categories)', 'EB-5 Investor Visa'], minimumInvestment: '$500,000 - $1,000,000 (EB-5)', processingTime: '6 months - 2+ years', keyRequirements: 'Job offer or investment, English proficiency, clean background' } },
      { name: 'UK', flag: '🇬🇧', topics: ['Skilled Worker Visa', 'Global Talent', 'Ancestry Visa', 'Student Visa', 'Investor Visa'], keyInfo: { popularVisas: ['Skilled Worker Visa', 'UK Ancestry Visa', 'Global Talent Visa'], minimumSalary: '£38,700+ (Skilled Worker)', processingTime: '3-8 weeks', keyRequirements: 'Job offer, English proficiency, financial requirements' } },
      { name: 'Canada', flag: '🇨🇦', topics: ['Express Entry', 'Provincial Nominee', 'Quebec Immigration', 'Family Sponsorship', 'Student Visa'], keyInfo: { popularVisas: ['Express Entry', 'Provincial Nominee Program (PNP)'], minimumPoints: '75+ (Express Entry)', processingTime: '6 months (Express Entry)', keyRequirements: 'Points-based system, language test, education assessment' } },
      { name: 'Ireland', flag: '🇮🇪', topics: ['Critical Skills', 'General Work Permit', 'EU Blue Card', 'Student Visa', 'Investment'], keyInfo: { popularVisas: ['Critical Skills Employment Permit', 'General Employment Permit'], minimumSalary: '€32,000+ (Critical Skills)', processingTime: '8-12 weeks', keyRequirements: 'Job offer, qualification assessment, English proficiency' } },
      { name: 'Australia', flag: '🇦🇺', topics: ['Skilled Independent', 'Employer Sponsored', 'Regional Visa', 'Business Innovation', 'Family Visa'], keyInfo: { popularVisas: ['Skilled Independent (189)', 'Skilled Nominated (190)', 'Employer Sponsored (482)'], minimumPoints: '65+ points', processingTime: '4-8 months', keyRequirements: 'Skills assessment, English test, age under 45' } },
      { name: 'Netherlands', flag: '🇳🇱', topics: ['Highly Skilled Migrant', 'EU Blue Card', 'Self-Employment', 'Family Reunification', 'Student Visa'], keyInfo: { popularVisas: ['Highly Skilled Migrant Visa', 'EU Blue Card'], minimumSalary: '€5,688/month (30+), €4,171/month (<30)', processingTime: '2-4 weeks', keyRequirements: 'Job offer from recognized sponsor, salary threshold' } },
      { name: 'New Zealand', flag: '🇳🇿', topics: ['Skilled Migrant', 'Work to Residence', 'Green List', 'Investor Visa', 'Family Category'], keyInfo: { popularVisas: ['Skilled Migrant Category', 'Accredited Employer Work Visa'], minimumPoints: '6 points (new system)', processingTime: '4-7 weeks (priority applications)', keyRequirements: 'Job offer, qualifications, salary threshold' } }
    ],
    quickActions: [
      'What are the visa requirements for skilled workers?',
      'How much does it cost to immigrate?',
      'What documents do I need to prepare?',
      'How long does the process take?',
      'Do I need a job offer first?',
      'What are the language requirements?',
      'Can I bring my family?',
      'What is the points-based system?'
    ],
    apiInfo: {
      endpoint: 'https://api.perplexity.ai/chat/completions',
      models: ['sonar-pro', 'sonar-medium-online', 'sonar-small-online'],
      systemPrompt: 'You are an expert immigration consultant specializing in helping South Africans emigrate to major English-speaking countries and European destinations. Provide accurate, up-to-date information about visa requirements, processes, costs, and timelines. Always cite your sources and provide practical, actionable advice. Focus specifically on the requirements and processes for South African passport holders.'
    }
  };

  // DOM Elements
  const elements = {
    countryList: document.getElementById('countryList'),
    quickActions: document.getElementById('quickActions'),
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    statusIndicator: document.getElementById('statusIndicator'),
    apiKeyToggle: document.getElementById('apiKeyToggle'),
    apiConfig: document.getElementById('apiConfig'),
    apiKeyInput: document.getElementById('apiKey'),
    saveApiKeyBtn: document.getElementById('saveApiKey'),
    clearChatBtn: document.getElementById('clearChat'),
    chatTitle: document.getElementById('chatTitle')
  };

  // App State
  let apiKey = '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';
  let currentCountry = null;
  const conversation = [];

  /* --------------------------------------------------
   * Utility Functions
   * -------------------------------------------------- */
  function setStatus(text, online = false) {
    elements.statusIndicator.innerHTML = `<span class="status-dot ${online ? 'online' : 'offline'}"></span> ${text}`;
  }

  function scrollToBottom() {
    setTimeout(() => {
      elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }, 50);
  }

  function createMessage(content, isUser = false, sources = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    // Split content into paragraphs
    const paragraphs = content.trim().split(/\n\n+/);
    paragraphs.forEach(para => {
      if (para.trim()) {
        if (para.includes('•')) {
          // Handle bullet lists
          const lines = para.split('\n');
          const ul = document.createElement('ul');
          lines.forEach(line => {
            if (line.trim().startsWith('•')) {
              const li = document.createElement('li');
              li.textContent = line.replace('•', '').trim();
              ul.appendChild(li);
            }
          });
          if (ul.children.length > 0) {
            textDiv.appendChild(ul);
          }
        } else {
          const p = document.createElement('p');
          p.textContent = para.trim();
          textDiv.appendChild(p);
        }
      }
    });

    contentDiv.appendChild(textDiv);

    // Add sources if provided
    if (sources && sources.length > 0) {
      const sourcesDiv = document.createElement('div');
      sourcesDiv.className = 'message-sources';
      const h4 = document.createElement('h4');
      h4.textContent = 'Sources';
      sourcesDiv.appendChild(h4);

      sources.forEach(source => {
        const link = document.createElement('a');
        link.className = 'source-link';
        link.href = source;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = source;
        sourcesDiv.appendChild(link);
      });

      contentDiv.appendChild(sourcesDiv);
    }

    messageDiv.appendChild(contentDiv);
    return messageDiv;
  }

  function addMessage(content, isUser = false, sources = []) {
    const messageEl = createMessage(content, isUser, sources);
    elements.chatMessages.appendChild(messageEl);
    scrollToBottom();
    return messageEl;
  }

  /* --------------------------------------------------
   * Country Selection
   * -------------------------------------------------- */
  function selectCountry(country) {
    currentCountry = country.name;
    elements.chatTitle.textContent = `Emigration to ${country.name}`;

    // Update active state
    document.querySelectorAll('.country-item').forEach(item => {
      item.classList.toggle('active', item.dataset.country === country.name);
    });

    // Create info message
    const infoLines = Object.entries(country.keyInfo).map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const val = Array.isArray(value) ? value.join(', ') : value;
      return `• ${label}: ${val}`;
    }).join('\n');

    const message = `Here are key facts about emigrating to ${country.name}:\n\n${infoLines}\n\nCommon visa types: ${country.topics.join(', ')}.\n\nFeel free to ask detailed questions about ${country.name} immigration!`;

    addMessage(message);
  }

  /* --------------------------------------------------
   * Populate Sidebar
   * -------------------------------------------------- */
  function populateSidebar() {
    // Clear existing content
    elements.countryList.innerHTML = '';
    elements.quickActions.innerHTML = '';

    // Add countries
    appData.countries.forEach(country => {
      const item = document.createElement('div');
      item.className = 'country-item';
      item.dataset.country = country.name;

      const flag = document.createElement('span');
      flag.className = 'country-flag';
      flag.textContent = country.flag;

      const name = document.createElement('span');
      name.className = 'country-name';
      name.textContent = country.name;

      item.appendChild(flag);
      item.appendChild(name);

      // Add click handler for country selection
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectCountry(country);
      });

      elements.countryList.appendChild(item);
    });

    // Add quick actions
    appData.quickActions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'quick-action-btn';
      button.textContent = action;
      button.type = 'button';

      // CRITICAL FIX: Only populate input, don't trigger country selection
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Simply set the input value and focus
        elements.messageInput.value = action;
        elements.messageInput.focus();
      });

      elements.quickActions.appendChild(button);
    });
  }

  /* --------------------------------------------------
   * Chat Functions
   * -------------------------------------------------- */
  function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, true);
    conversation.push({ role: 'user', content: text });
    elements.messageInput.value = '';

    if (!apiKey) {
      // Show offline notice immediately
      setTimeout(() => {
        addMessage('🔒 To receive detailed, up-to-date emigration guidance, please configure your Perplexity API key first. Click "Configure API Key" at the top to get started.\n\nOnce configured, I can provide comprehensive, current information about visa requirements, costs, and immigration processes.');
      }, 500);
      return;
    }

    // Call API if key is available
    fetchResponse();
  }

  async function fetchResponse() {
    showLoading(true);
    setStatus('Getting response...', true);

    try {
      const systemPrompt = currentCountry 
        ? `${appData.apiInfo.systemPrompt} Focus specifically on ${currentCountry} immigration.`
        : appData.apiInfo.systemPrompt;

      const response = await fetch(appData.apiInfo.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: appData.apiInfo.models[0],
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversation.slice(-10)
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'I apologize, but I cannot provide a response right now.';
      const sources = data.choices?.[0]?.message?.sources || [];

      addMessage(content, false, sources);
      conversation.push({ role: 'assistant', content });
      setStatus('Online', true);

    } catch (error) {
      console.error('API Error:', error);
      addMessage('⚠️ I encountered an error while getting your answer. Please check your API key and try again.');
      setStatus('Error - Check API key', false);
    } finally {
      showLoading(false);
    }
  }

  function showLoading(show) {
    if (show) {
      elements.loadingIndicator.classList.remove('hidden');
    } else {
      elements.loadingIndicator.classList.add('hidden');
    }
  }

  function clearChat() {
    elements.chatMessages.innerHTML = '';
    conversation.length = 0;
    currentCountry = null;
    elements.chatTitle.textContent = 'Emigration Assistant';
    
    // Remove active state from countries
    document.querySelectorAll('.country-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add welcome message
    setTimeout(() => {
      addMessage('👋 Hello! I\'m your Outlandr emigration assistant. I can help you with information about moving from South Africa to the USA, UK, Canada, Ireland, Australia, Netherlands, or New Zealand.\n\nYou can:\n• Ask me questions about visa requirements, costs, and processes\n• Select a country from the sidebar for specific information\n• Use the quick action buttons for common questions\n\n' + (apiKey ? 'Your API key is configured - feel free to ask me anything!' : 'Please configure your API key to get detailed, up-to-date information.'));
    }, 100);
  }

  /* --------------------------------------------------
   * API Key Management
   * -------------------------------------------------- */
  function toggleApiConfig() {
    const isHidden = elements.apiConfig.classList.contains('hidden');
    
    if (isHidden) {
      elements.apiConfig.classList.remove('hidden');
      elements.apiKeyInput.focus();
    } else {
      elements.apiConfig.classList.add('hidden');
    }
  }

  function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();
    if (!key) {
      alert('Please enter a valid API key');
      return;
    }

    apiKey = key;
    elements.apiConfig.classList.add('hidden');
    elements.apiKeyToggle.textContent = 'Update API Key';
    setStatus('API key configured - Ready to chat', true);
  }

  /* --------------------------------------------------
   * Event Listeners
   * -------------------------------------------------- */
  function setupEventListeners() {
    // API key management
    elements.apiKeyToggle.addEventListener('click', toggleApiConfig);
    elements.saveApiKeyBtn.addEventListener('click', saveApiKey);

    // Chat functions
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.clearChatBtn.addEventListener('click', clearChat);

    // Input handling
    elements.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    elements.apiKeyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveApiKey();
      }
    });
  }

  /* --------------------------------------------------
   * Initialize App
   * -------------------------------------------------- */
  function initialize() {
    populateSidebar();
    setupEventListeners();
    setStatus('Ready - Configure API key to start', false);
    clearChat();
  }

  // Start the application
  initialize();

})();
