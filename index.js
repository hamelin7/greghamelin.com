/* ===================================================
   GREG HAMELIN — Site JavaScript
   Typing animation, scroll reveals, nav, chatbot, form
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== TYPING ANIMATION =====
  const typedElement = document.getElementById('typed-text');
  const titles = [
    'vCIO & IT Strategist',
    'CMMC Compliance Specialist',
    'Cybersecurity Strategist',
    'AI Integration & Automation',
    'AWS Cloud & IT Infrastructure',
    'IT Leadership & Board Member',
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    const current = titles[titleIndex];

    if (!isDeleting) {
      typedElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else {
        typeSpeed = 70 + Math.random() * 40;
      }
    } else {
      typedElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 400; // Pause before next word
      } else {
        typeSpeed = 35;
      }
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();


  // ===== SCROLL REVEAL (Intersection Observer) =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => navObserver.observe(section));


  // ===== MOBILE MENU TOGGLE =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===== CONTACT FORM (Formspree-compatible) =====
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formAction = contactForm.getAttribute('action');

      // Check if Formspree is configured
      if (formAction.includes('placeholder')) {
        formStatus.textContent = 'Form is ready! Please set up a free Formspree endpoint to enable submissions.';
        formStatus.className = 'form-status error';

        // Fallback: open mailto
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        const mailtoLink = `mailto:greg@greghamelin.com?subject=${encodeURIComponent(subject || 'Website Inquiry')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoLink;
        return;
      }

      const submitBtn = document.getElementById('form-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const response = await fetch(formAction, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        formStatus.textContent = 'Something went wrong. Please email me directly.';
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }


  // ===== CHATBOT =====
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');

  // Knowledge base for the chatbot
  const knowledgeBase = {
    greeting: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
      response: "Hey there! 👋 I'm Greg's virtual assistant. I can tell you about his experience, skills, certifications, education, or how to get in touch. What would you like to know?"
    },
    experience: {
      keywords: ['experience', 'work', 'career', 'job', 'history', 'background', 'years', 'how long'],
      response: "Greg has 10+ years of IT leadership experience. He's currently an Account Relationship Manager & vCIO at Paragus Strategic I.T. (since 2016), where he develops multi-year IT roadmaps, leads CMMC compliance efforts, and architects AWS cloud infrastructure. He also runs Western Mass Web Design and Programming as a technical consultant."
    },
    vcio: {
      keywords: ['vcio', 'cio', 'strategic', 'strategy', 'roadmap', 'planning', 'virtual cio'],
      response: "As a vCIO, Greg develops and executes multi-year IT roadmaps aligned with client business goals. He focuses on risk mitigation, digital transformation, and client retention. He brings a unique blend of strategic vision and hands-on technical depth to every engagement."
    },
    cmmc: {
      keywords: ['cmmc', 'compliance', 'certification', 'ccp', 'dod', 'defense', 'department of defense', 'cyber ab'],
      response: "Greg has passed the CMMC Certified Professional (CCP) exam through The Cyber AB. His certification is pending completion of a Tier 3 background check. He leads clients through the CMMC compliance process, ensuring both technical and administrative adherence to Department of Defense standards. This is a highly in-demand credential in the Defense Industrial Base."
    },
    skills: {
      keywords: ['skills', 'technologies', 'tech stack', 'tools', 'what can', 'programming', 'languages'],
      response: "Greg's skill set spans three areas:\n\n🎯 Strategic: vCIO Planning, Account Management, Business Development, Board Governance\n\n🛡️ Security: CMMC (CCP — exam passed, pending background check), Active Directory/GPO, TCP/IP, Security Auditing\n\n⚙️ Technical: AWS (Route 53, Lightsail, EC2, S3), Python, Node.js, AI Agents & Chatbots, Local LLM Hosting, Windows Server, Linux, ConnectWise"
    },
    aws: {
      keywords: ['aws', 'amazon', 'cloud', 'ec2', 'vpc', 's3', 'infrastructure', 'lightsail', 'route 53'],
      response: "Greg uses AWS to host websites and manage infrastructure. His hands-on experience includes Route 53 for DNS management, Lightsail for web hosting, EC2 instances for compute, and S3 for storage. He deploys and manages these services for both his own projects and client-facing applications."
    },
    education: {
      keywords: ['education', 'degree', 'college', 'university', 'school', 'study', 'major', 'academic'],
      response: "Greg holds a Bachelor of Arts in Computer Science with a dual major in Information Technology and Security from Our Lady of the Elms in Chicopee, MA. He graduated with High Honors."
    },
    board: {
      keywords: ['board', 'advisory', 'leadership', 'community', 'volunteer', 'director', 'governance'],
      response: "Greg has significant board and advisory experience:\n\n🏛️ Board of Directors — Paragus Strategic I.T. (2022–Present)\n🎓 CIT Advisory Board — Springfield Technical Community College (2019–Present)\n🚀 Career Ambassador — Tech Foundry (2016–2021)"
    },
    contact: {
      keywords: ['contact', 'reach', 'email', 'phone', 'hire', 'connect', 'available', 'opportunity'],
      response: "You can reach Greg at:\n\n📧 greg@greghamelin.com\n📱 (413) 992-4299\n💼 LinkedIn: linkedin.com/in/greg-hamelin-70429030\n\nOr use the contact form right here on this page! He's currently open to new opportunities."
    },
    location: {
      keywords: ['location', 'where', 'based', 'live', 'city', 'state', 'remote'],
      response: "Greg is based in Westfield, Massachusetts. He's open to both local and remote opportunities."
    },
    paragus: {
      keywords: ['paragus', 'company', 'employer', 'current', 'msp'],
      response: "Paragus Strategic I.T. is a managed service provider based in Hadley, MA. Greg has been with Paragus since 2015 — first as a System Support Specialist, then advancing to Account Relationship Manager & vCIO. He also serves on their Board of Directors."
    },
    python: {
      keywords: ['python', 'node', 'javascript', 'react', 'coding', 'development', 'developer', 'web dev'],
      response: "While Greg's primary focus is IT strategy and cybersecurity, he has strong technical chops. He develops with Python and JavaScript/Node.js, builds custom websites, and has hands-on experience with React, HTML/CSS, Linux, Bash, and Git. His technical depth gives him credibility when architecting solutions."
    },
    resume: {
      keywords: ['resume', 'cv', 'download', 'pdf'],
      response: "You can download Greg's resume by clicking the 'Download Resume' button in the hero section at the top of the page, or visit: greghamelin.com/Greg%20Hamelin%20-%20Resume%202025%20(v2).pdf"
    },
    why: {
      keywords: ['why hire', 'why should', 'what makes', 'stand out', 'unique', 'different', 'value'],
      response: "What makes Greg stand out is his rare combination of strategic IT leadership AND hands-on technical depth. He's not just an advisor — he can deploy AWS infrastructure, build AI agents, write Python code, and configure Active Directory. Add a CMMC certification (exam passed, pending background check) and board-level experience, and you get a leader who bridges the gap between business strategy and technical execution."
    },
    ai: {
      keywords: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'chatbot', 'agent', 'automation', 'gpt', 'language model', 'local llm'],
      response: "Greg has hands-on experience building AI agents, chatbots, and intelligent automation solutions. With a Computer Science educational background and deep Linux expertise, he can integrate AI using various APIs as well as deploy and manage locally hosted LLMs and AI agents on Linux infrastructure. He bridges the gap between AI capabilities and practical business applications."
    }
  };

  const defaultResponse = "I'm not sure about that specific topic, but I can tell you about Greg's experience, skills, certifications (like CMMC), education, board roles, or how to contact him. What interests you?";

  const initialSuggestions = ['Experience', 'Skills', 'CMMC', 'Contact'];

  function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function addSuggestions(suggestions) {
    const container = document.createElement('div');
    container.className = 'chat-suggestions';
    suggestions.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        container.remove();
        processUserInput(text);
      });
      container.appendChild(btn);
    });
    chatbotMessages.appendChild(container);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function findResponse(input) {
    const lower = input.toLowerCase().trim();

    // Check each knowledge base entry
    let bestMatch = null;
    let bestScore = 0;

    for (const [key, entry] of Object.entries(knowledgeBase)) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (lower.includes(keyword)) {
          score += keyword.length; // Longer matches score higher
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    return bestMatch ? bestMatch.response : defaultResponse;
  }

  function processUserInput(text) {
    addMessage(text, true);

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(text);
      addMessage(response);

      // Add contextual follow-up suggestions
      const lower = text.toLowerCase();
      let suggestions = [];
      if (lower.includes('experience') || lower.includes('work')) {
        suggestions = ['Skills', 'CMMC', 'Board Roles', 'Contact'];
      } else if (lower.includes('skill') || lower.includes('tech')) {
        suggestions = ['AWS Cloud', 'Experience', 'Education', 'Contact'];
      } else if (lower.includes('cmmc') || lower.includes('compliance')) {
        suggestions = ['Experience', 'Skills', 'Why Hire Greg', 'Contact'];
      } else if (lower.includes('contact') || lower.includes('hire')) {
        suggestions = ['Experience', 'Skills', 'Resume'];
      } else {
        suggestions = ['Experience', 'Skills', 'CMMC', 'Contact'];
      }
      addSuggestions(suggestions);
    }, 400 + Math.random() * 300);
  }

  // Initialize chatbot
  function initChatbot() {
    chatbotMessages.innerHTML = '';
    addMessage("👋 Hi! I'm Greg's virtual assistant. Ask me anything about his experience, skills, or how to get in touch!");
    addSuggestions(initialSuggestions);
  }

  // Toggle chatbot
  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
    if (chatbotWindow.classList.contains('open') && chatbotMessages.children.length === 0) {
      initChatbot();
    }
    if (chatbotWindow.classList.contains('open')) {
      chatbotInput.focus();
    }
  });

  chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('open');
  });

  // Send message
  function sendChatMessage() {
    const text = chatbotInput.value.trim();
    if (text) {
      // Remove any existing suggestions
      const existingSuggestions = chatbotMessages.querySelectorAll('.chat-suggestions');
      existingSuggestions.forEach(s => s.remove());

      processUserInput(text);
      chatbotInput.value = '';
    }
  }

  chatbotSend.addEventListener('click', sendChatMessage);
  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });

});