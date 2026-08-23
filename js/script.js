// Mobile sidebar drawer
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileBackdrop = document.getElementById("mobile-menu-backdrop");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const menuLines = document.querySelectorAll(".menu-line");
let isMenuOpen = false;

function setMenuIcon(open) {
  if (!menuLines.length) return;
  if (open) {
    menuLines[0].style.transform = "rotate(45deg) translateY(15px)";
    menuLines[1].style.opacity = "0";
    menuLines[2].style.transform = "rotate(-45deg) translateY(-15px)";
  } else {
    menuLines[0].style.transform = "rotate(0) translateY(0)";
    menuLines[1].style.opacity = "1";
    menuLines[2].style.transform = "rotate(0) translateY(0)";
  }
}

function openMobileMenu() {
  if (!mobileMenu) return;
  isMenuOpen = true;
  mobileMenu.classList.remove("hidden");
  mobileBackdrop?.classList.remove("hidden");
  // force reflow then animate
  void mobileMenu.offsetWidth;
  mobileMenu.classList.add("is-open");
  mobileBackdrop?.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileBackdrop?.setAttribute("aria-hidden", "false");
  document.body.classList.add("sidebar-open");
  setMenuIcon(true);
}

function closeMobileMenu() {
  if (!mobileMenu || !isMenuOpen) return;
  isMenuOpen = false;
  mobileMenu.classList.remove("is-open");
  mobileBackdrop?.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileBackdrop?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sidebar-open");
  setMenuIcon(false);
  setTimeout(() => {
    if (!isMenuOpen) {
      mobileMenu.classList.add("hidden");
      mobileBackdrop?.classList.add("hidden");
    }
  }, 280);
}

menuToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (isMenuOpen) closeMobileMenu();
  else openMobileMenu();
});

mobileMenuClose?.addEventListener("click", closeMobileMenu);
mobileBackdrop?.addEventListener("click", closeMobileMenu);

// Close on nav link click
mobileMenu?.querySelectorAll("[data-sidebar-link]").forEach((el) => {
  el.addEventListener("click", () => closeMobileMenu());
});

// Sidebar search → command palette
document.getElementById("sidebar-search")?.addEventListener("click", () => {
  closeMobileMenu();
  document.getElementById("open-command-palette")?.click();
  // fallback: dispatch custom or focus palette
  const overlay = document.getElementById("command-palette-overlay");
  const input = document.getElementById("command-palette-input");
  if (overlay && overlay.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    setTimeout(() => input?.focus(), 50);
  }
});

// Favorites shortcut: show favorites filter if available
document.getElementById("sidebar-favorites")?.addEventListener("click", (e) => {
  // Let hash navigation happen; try to trigger favorites view
  const favBtn = document.getElementById("show-favorites") || document.querySelector("[data-filter='favorites']");
  if (favBtn) {
    e.preventDefault();
    closeMobileMenu();
    favBtn.click();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMenuOpen) closeMobileMenu();
});

// yw code courses ko ek arrey ki help se alag alag categories me decide krne ke liye hai.

let courses = [
  {
    category: "Information Technology",
    
    name: "CS50's Introduction to Computer Science", description: "Harvard's legendary intro to CS — covers C, Python, SQL, and web dev with famously engaging lectures.",
    
    provider: "EDX",
    
    duration: "6-18 hours per week",
    
    type: "Free",
    
    image: "https://i.ibb.co/P6kgBms/IMG-20250101-102200.jpg",
    
    link: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
  },
  
  {
    category: "Information Technology",
    
    name: "Introduction to Cyber Security", description: "Beginner-friendly overview of cybersecurity threats, safe practices, and how attackers exploit systems.",
    
    provider: "Udemy",
    
    duration: "1 hour 8 min",
    
    type: "Free",
    
    image: "https://i.ytimg.com/vi/6nEgecLcQb4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAQC5F6xlIuWGE4qpAa1T0pQVSy_w",
    
    link: "https://www.udemy.com/course/certified-secure-netizen/",
  },
  
  {
    category: "Information Technology",
    
    name: "Web Development Basics", description: "Covers HTML, CSS, and JavaScript fundamentals to build your first responsive web pages.",
    
    provider: "EDX",
    
    duration: "1 hour",
    
    type: "Free",
    
    image: "https://i.ytimg.com/vi/QvV2tf9jayI/hqdefault.jpg",
    
    link: "https://www.edx.org/learn/computer-science/ibm-guided-project-web-development-w-html-css-for-beginners",
  },
  
  {
    category: "Information Technology",
    
    name: "Google IT Automation with Python", description: "Learn Python scripting, Git, and automation to streamline IT support and system administration tasks.",
    
    provider: "Coursera",
    
    duration: "6 months (part-time)",
    
    type: "Paid",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nxa0KsF35OILzugyN_S3Iq9pQHUeD557LQ&usqp=CAU",
    
    link: "https://www.coursera.org/professional-certificates/google-it-automation",
  },
  
  {
    category: "Business & Entrepreneurship",
    
    name: "Entrepreneurship in Emerging Economies", description: "Explores how entrepreneurs build ventures amid resource constraints in developing markets.",
    
    provider: "EDX",
    
    duration: "18 hours",
    
    type: "Paid",
    
    image: "https://ajcampus.com/wp-content/uploads/2024/11/Entrepreneurship-copy-1.jpg",
    
    link: "https://www.edx.org/learn/entrepreneurship/harvard-university-entrepreneurship-in-emerging-economies",
  },
  
  {
    category: "Business & Entrepreneurship",
    
    name: "Innovation for Entrepreneurs", description: "Frameworks for identifying opportunities and driving innovation within new or existing businesses.",
    
    provider: "Udemy",
    
    duration: "1 hour",
    
    type: "Free",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSANYjc75iEO6X_L6HqWqEBVxZNz33RXc_9mA&usqp=CAU",
    
    link: "https://www.udemy.com/course/60-day-startup-introduction-to-startups/",
  },
  
  {
    category: "Business & Entrepreneurship",
    
    name: "Fundamentals of Digital Marketing", description: "Google Digital Garage's free, certified intro to core digital marketing concepts.",
    
    provider: "Udemy",
    
    duration: "1 hour",
    
    type: "Free",
    
    image: "https://digitalvidyaniketan.com/wp-content/uploads/2024/08/6-1200x600.jpg",
    
    link: "https://www.udemy.com/course/the-fundamentals-of-the-digital-marketing/",
  },
  
  {
    category: "Business & Entrepreneurship",
    
    name: "Business Fundamentals", description: "Core concepts in management, finance, marketing, and operations for aspiring business professionals.",
    
    provider: "EDX",
    
    duration: "18 hours",
    
    type: "Paid",
    
    image: "https://www.maharasouthsudan.com/store/1/cover.jpg",
    
    link: "https://www.edx.org/learn/business-administration/university-of-british-columbia-business-foundations",
  },
  
  {
    category: "Healthcare & Wellness",
    
    name: "Introduction to Psychology", description: "Explores the science of the mind and behavior, from cognition to mental health basics.",
    
    provider: "EDX",
    
    duration: "50 hours",
    
    type: "Paid",
    
    image: "https://img.freepik.com/free-vector/psychology-typographic-header-mental-health-diagnostic-doctor-treating-human-mind-psychological-test-help-thoughts-emotions-analysis-vector-illustration-cartoon-style_613284-708.jpg",
    
    link: "https://www.edx.org/learn/python/st-margarets-episcopal-school-introduction-to-psychology",
  },
  
  {
    category: "Healthcare & Wellness",
    
    name: "COVID-19: Tackling the Novel Coronavirus", description: "Explains the science of COVID-19, transmission, and the public health response from Imperial College experts.",
    
    provider: "FutureLearn",
    
    duration: "3 weeks, 4 hours/week",
    
    type: "Free",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTErFnFXTpihFKu9Qjv2aXyt3ASWwpIgJ7o7A&usqp=CAU",
    
    link: "https://www.futurelearn.com/courses/covid19-novel-coronavirus",
  },
  
  {
    category: "Healthcare & Wellness",
    
    name: "Health Informatics on FHIR", description: "Learn the FHIR standard used to exchange healthcare data between hospital systems.",
    
    provider: "Coursera",
    
    duration: "4 weeks, 5-7 hours/week",
    
    type: "Free",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAXjn-q6VWH_E85tiY4N1yyKwg7d5kvag5Pg&usqp=CAU",
    
    link: "https://www.coursera.org/learn/fhir",
  },
  
  {
    category: "Healthcare & Wellness",
    
    name: "Nutrition and Health: Macronutrients and Overnutrition", description: "Explains how carbs, fats, and proteins affect health, weight, and chronic disease risk.",
    
    provider: "EDX",
    
    duration: "52 hours",
    
    type: "Free",
    
    image: "https://www.blisslifesciences.com/wp-content/uploads/2024/09/1.png",
    
    link: "https://www.edx.org/learn/nutrition/wageningen-university-research-nutrition-and-health-macronutrients-and-overnutrition",
  },
  
  {
    category: "Art & Humanities",
    
    name: "Modern Art & Ideas", description: "MoMA-led exploration of what makes modern and contemporary art meaningful and relevant.",
    
    provider: "Coursera",
    
    duration: "5 weeks",
    
    type: "Free",
    
    image: "https://i.ytimg.com/vi/AfmMSHjXPBs/maxresdefault.jpg",
    
    link: "https://www.coursera.org/learn/modern-art-ideas",
  },
  
  {
    category: "Art & Humanities",
    
    name: "Shakespeare's Life and Work", description: "A closer look at Shakespeare's plays, sonnets, and the world that shaped his writing.",
    
    provider: "EDX",
    
    duration: "20 hours",
    
    type: "Paid",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcInZQcpB55mWcKQ0_VO4orXHWB7tLT9PrxrUPXa7NvGd10pDP2d7ERo4&s=10",
    
    link: "https://www.edx.org/learn/shakespeare/harvard-university-shakespeare-s-life-and-work",
  },
  
  {
    category: "Art & Humanities",
    
    name: "Introduction to Philosophy", description: "Introduces core philosophical questions on knowledge, ethics, mind, and existence.",
    
    provider: "Udemy",
    
    duration: "1 hour",
    
    type: "Free",
    
    image: "https://i.ytimg.com/vi/H9nc0BmPqyY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCg5voQ9a0Vdb_S3OdeCG9vjdpl5Q",
    
    link: "https://www.udemy.com/course/introduction-to-philosophy-with-plato/",
  },
  
  {
    category: "Art & Humanities",
    
    name: "Film, Images & Historical Interpretation", description: "Examines how film and photography shape our understanding of historical events.",
    
    provider: "Udemy",
    
    duration: "30 min",
    
    type: "Paid",
    
    image: "https://i.ibb.co/h9pYM1b/IMG-20250101-085100.jpg",
    
    link: "https://www.udemy.com/course/filmschoolcinema101/",
  },
  
  {
    category: "Environmental Studies",
    
    name: "The Science of Climate Change", description: "MIT-led course explaining the physics and global impact behind climate change.",
    
    provider: "EDX",
    
    duration: "16 hours",
    
    type: "Free",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTJUkvXXQ9btXl4ctgsdodQdQ8yePaH-VJ3RU-i2Pt5QEDJM-q-rzgIQ2&s=10",
    
    link: "https://www.edx.org/learn/climate-change/sdg-academy-climate-change-the-science-and-global-impact",
  },
  
  {
    category: "Environmental Studies",
    
    // TODO: link ko manually verify karo, correct course match confidently nahi mil paya
    name: "Biodiversity and Conservation", description: "Covers species diversity, ecosystem health, and strategies to protect the natural world.",
    
    provider: "EDX",
    
    duration: "7 hours",
    
    type: "Paid",
    
    image: "https://www.taxmann.com/post/wp-content/uploads/2022/06/All-about-Biodiversity-Conservation-in-Biology_June22.jpg",
    
    link: "https://www.edx.org/learn/ecosystems/ethx-environmental-dna-sensing-the-diversity-of-life-and-assessing-ecosystem-health",
  },
  
  {
    category: "Environmental Studies",
    
    // TODO: is course ne 2019 mein naye learners lena band kar diya tha, check karo abhi active hai ya nahi
    name: "Introduction to Environmental Law and Policy", description: "Overview of the laws and policy tools used to address environmental protection.",
    
    provider: "Coursera",
    
    duration: "5 hours",
    
    type: "Free",
    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGV1vDSyGRBfMzRVH_NfkFEsYVWwJHhhgtk1MxcrY70ixcVcGL1QaouKNc&s=10",
    
    link: "https://www.coursera.org/learn/environmental-law",
  },
  
  {
    category: "Environmental Studies",
    
    name: "Global Environmental Management", description: "Examines how organizations and policymakers manage environmental risks on a global scale.",
    
    provider: "FutureLearn",
    
    duration: "4 hours",
    
    type: "Paid",
    
    image: "https://effivityblog.blob.core.windows.net/effivitywebsite/images/BlogV2/Blogs%20Image/Why%20Environmental%20Management%20is%20Essential%20for%20Modern%20Businesses-01.webp",
    
    link: "https://www.futurelearn.com/courses/introduction-to-environmental-science",
  },

  // ===== Neeche wale courses user ke banaye "best-courses-database.md" se add kiye gaye hain =====
  { category: "Web Development", name: "Responsive Web Design + Full Curriculum", description: "freeCodeCamp's hands-on path covering HTML, CSS, JavaScript, and real coding projects.", provider: "freeCodeCamp", duration: "~300+ hrs (self-paced)", type: "Free", image: "https://logo.clearbit.com/freecodecamp.org", link: "https://www.freecodecamp.org/learn" },
  { category: "Web Development", name: "Foundations + Full Stack JavaScript", description: "The Odin Project's project-based path from web basics to full-stack JavaScript apps.", provider: "The Odin Project", duration: "~700+ hrs", type: "Free", image: "https://logo.clearbit.com/theodinproject.com", link: "https://www.theodinproject.com" },
  { category: "Web Development", name: "CS50x: Intro to Computer Science", description: "Harvard's free self-paced version of the famous CS50 course, open to everyone.", provider: "edX", duration: "11–12 weeks", type: "Free", image: "https://logo.clearbit.com/edx.org", link: "https://cs50.harvard.edu/x" },
  { category: "Web Development", name: "CS50 Web Programming with Python & JS", description: "Harvard's course on building dynamic web apps using Python, JavaScript, and SQL.", provider: "edX", duration: "12 weeks", type: "Free", image: "https://logo.clearbit.com/edx.org", link: "https://cs50.harvard.edu/web" },
  { category: "Web Development", name: "Front-End Developer Professional Certificate (Meta)", description: "Meta-designed program covering HTML, CSS, JavaScript, and React for job-ready front-end skills.", provider: "Coursera", duration: "7 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
  { category: "Web Development", name: "The Complete Web Developer Course", description: "Beginner-to-advanced bootcamp-style course covering full-stack web development from scratch.", provider: "Udemy", duration: "60+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/" },
  { category: "Web Development", name: "Full Stack Open", description: "University of Helsinki's rigorous, project-heavy course on React, Node.js, and modern web apps.", provider: "University of Helsinki", duration: "~200 hrs", type: "Free", image: "https://logo.clearbit.com/fullstackopen.com", link: "https://fullstackopen.com" },
  { category: "Web Development", name: "Learn HTML/CSS/JS (interactive)", description: "Bite-sized, interactive lessons to learn web fundamentals directly in your browser.", provider: "Scrimba", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/scrimba.com", link: "https://scrimba.com" },
  { category: "Web Development", name: "JavaScript.info", description: "A deeply detailed, free reference and tutorial covering JavaScript from basics to advanced.", provider: "JavaScript.info", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/javascript.info", link: "https://javascript.info" },
  { category: "Programming & CS", name: "CS50x", description: "Harvard's renowned computer science course, self-paced and free for independent learners.", provider: "edX", duration: "11–12 weeks", type: "Free", image: "https://logo.clearbit.com/edx.org", link: "https://cs50.harvard.edu/x" },
  { category: "Programming & CS", name: "Python for Everybody Specialization", description: "University of Michigan's beginner-friendly path to learning Python for data and web.", provider: "Coursera", duration: "8 months (light)", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/python" },
  { category: "Programming & CS", name: "MIT 6.0001 Intro to CS with Python", description: "MIT's official intro programming course using Python, taught by MIT faculty.", provider: "MIT OpenCourseWare", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/ocw.mit.edu", link: "https://ocw.mit.edu" },
  { category: "Programming & CS", name: "100 Days of Code: Python Bootcamp", description: "A 100-lesson, project-based bootcamp that builds real apps as you learn Python.", provider: "Udemy", duration: "100 days", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/100-days-of-code/" },
  { category: "Programming & CS", name: "DSA (Data Structures & Algorithms)", description: "GeeksforGeeks' practice-heavy course covering arrays, trees, graphs, and coding interview prep.", provider: "GeeksforGeeks", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/geeksforgeeks.org", link: "https://www.geeksforgeeks.org" },
  { category: "Programming & CS", name: "Java Programming Masterclass", description: "Comprehensive Java course covering OOP, real projects, and interview-ready programming skills.", provider: "Udemy", duration: "80+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/java-the-complete-java-developer-course/" },
  { category: "Data Science", name: "IBM Data Science Professional Certificate", description: "IBM's job-oriented program covering Python, SQL, data visualization, and machine learning basics.", provider: "Coursera", duration: "3–6 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/ibm-data-science" },
  { category: "Data Science", name: "Google Data Analytics Professional Certificate", description: "Google-designed program teaching spreadsheets, SQL, Tableau, and R for entry-level data analyst roles.", provider: "Coursera", duration: "3–6 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/google-data-analytics" },
  { category: "Data Science", name: "Data Science Specialization (Johns Hopkins)", description: "Johns Hopkins' 10-course path covering R programming, statistics, and machine learning.", provider: "Coursera", duration: "11 months", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/jhu-data-science" },
  { category: "Data Science", name: "Kaggle Learn (Pandas, SQL, ML micro-courses)", description: "Short, hands-on micro-courses on Pandas, SQL, and machine learning with real datasets.", provider: "Kaggle", duration: "Few hrs each", type: "Free", image: "https://logo.clearbit.com/kaggle.com", link: "https://www.kaggle.com/learn" },
  { category: "Data Science", name: "Data Analyst with Python", description: "freeCodeCamp's practical path to data analysis using Python, Pandas, and NumPy.", provider: "freeCodeCamp", duration: "~300 hrs", type: "Free", image: "https://logo.clearbit.com/freecodecamp.org", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
  { category: "Data Science", name: "Data Science: R Basics (Harvard)", description: "Harvard's beginner course teaching R programming for data analysis and visualization.", provider: "edX", duration: "8 weeks", type: "Free", image: "https://logo.clearbit.com/edx.org", link: "https://www.edx.org/harvard" },
  { category: "AI & Machine Learning", name: "Machine Learning Specialization (Andrew Ng)", description: "Andrew Ng's famous, beginner-friendly intro to machine learning concepts and algorithms.", provider: "Coursera", duration: "~2 months (10 hrs/wk)", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/machine-learning-introduction" },
  { category: "AI & Machine Learning", name: "Deep Learning Specialization", description: "Andrew Ng's in-depth path covering neural networks, CNNs, RNNs, and deep learning applications.", provider: "Coursera", duration: "~5 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/deep-learning" },
  { category: "AI & Machine Learning", name: "Practical Deep Learning for Coders", description: "fast.ai's code-first approach to deep learning, built for programmers not mathematicians.", provider: "fast.ai", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/fast.ai", link: "https://course.fast.ai" },
  { category: "AI & Machine Learning", name: "Google Machine Learning Crash Course", description: "Google's fast, practical intro to ML concepts using TensorFlow, with real exercises.", provider: "Google", duration: "~15 hrs", type: "Free", image: "https://logo.clearbit.com/developers.google.com", link: "https://developers.google.com/machine-learning/crash-course" },
  { category: "AI & Machine Learning", name: "AI For Everyone (Andrew Ng)", description: "A non-technical overview of AI for professionals who want to understand its business impact.", provider: "Coursera", duration: "~6 hrs", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/learn/ai-for-everyone" },
  { category: "AI & Machine Learning", name: "Elements of AI", description: "University of Helsinki's beginner-friendly introduction to AI concepts, no coding required.", provider: "University of Helsinki", duration: "~30 hrs", type: "Free", image: "https://logo.clearbit.com/elementsofai.com", link: "https://www.elementsofai.com" },
  { category: "AI & Machine Learning", name: "Prompt Engineering / ChatGPT Short Courses", description: "DeepLearning.AI's quick, hands-on courses on writing effective prompts for large language models.", provider: "DeepLearning.AI", duration: "1–2 hrs each", type: "Free", image: "https://logo.clearbit.com/deeplearning.ai", link: "https://www.deeplearning.ai/short-courses/" },
  { category: "UI/UX & Design", name: "Google UX Design Professional Certificate", description: "Google-designed program covering the full UX process — research, wireframing, prototyping, and testing.", provider: "Coursera", duration: "~6 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/google-ux-design" },
  { category: "UI/UX & Design", name: "Google Product Design (UX/UI) Certificate", description: "Google's certificate blending UX research with visual UI design for product careers.", provider: "Coursera", duration: "~6 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/google-product-design" },
  { category: "UI/UX & Design", name: "Meta Principles of UX/UI Design", description: "Meta's short course on foundational UX/UI design principles and best practices.", provider: "Coursera", duration: "~4 weeks", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/learn/principles-of-ux-ui-design" },
  { category: "UI/UX & Design", name: "Intro to UI Design Fundamentals", description: "A quick, beginner-friendly primer on UI design basics using Scrimba's interactive format.", provider: "Scrimba", duration: "~70 mins", type: "Free", image: "https://logo.clearbit.com/scrimba.com", link: "https://scrimba.com" },
  { category: "UI/UX & Design", name: "UX Academy", description: "DesignLab's structured, mentor-led bootcamp for building a professional UX design portfolio.", provider: "DesignLab", duration: "3–6 months", type: "Paid", image: "https://logo.clearbit.com/designlab.com", link: "https://designlab.com" },
  { category: "UI/UX & Design", name: "Figma UI/UX Design Essentials", description: "Hands-on Figma training covering wireframes, prototyping, and modern UI design workflows.", provider: "Coursera", duration: "4 weeks", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/beginnerfigmauiuxdesignessentials" },
  { category: "UI/UX & Design", name: "DesignCourse (YouTube)", description: "A popular YouTube channel with practical tutorials on UI/UX design and Figma.", provider: "YouTube", duration: "Ongoing", type: "Free", image: "https://logo.clearbit.com/youtube.com", link: "https://www.youtube.com/@DesignCourse" },
  { category: "Digital Marketing", name: "Google Digital Marketing & E-commerce Certificate", description: "Google's program covering SEO, social media, email marketing, and e-commerce fundamentals.", provider: "Coursera", duration: "~5 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce" },
  { category: "Digital Marketing", name: "Fundamentals of Digital Marketing", description: "Google Digital Garage's free, certified intro to core digital marketing concepts.", provider: "Google Digital Garage", duration: "~40 hrs", type: "Free", image: "https://logo.clearbit.com/google.com", link: "https://learndigital.withgoogle.com/digitalgarage" },
  { category: "Digital Marketing", name: "Meta Blueprint – Digital Marketing Associate", description: "Meta's official certification covering advertising strategy across Facebook and Instagram.", provider: "Meta", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/facebook.com", link: "https://www.facebook.com/business/learn" },
  { category: "Digital Marketing", name: "Digital Marketing Specialization (UIUC)", description: "University of Illinois' in-depth path covering marketing analytics, strategy, and channel planning.", provider: "Coursera", duration: "7 months", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/digital-marketing" },
  { category: "Digital Marketing", name: "Digital Marketing Nanodegree", description: "Udacity's project-based program covering SEO, social media, and marketing analytics.", provider: "Udacity", duration: "2–3 months", type: "Paid", image: "https://logo.clearbit.com/udacity.com", link: "https://www.udacity.com" },
  { category: "Digital Marketing", name: "SEO / Google Ads / Analytics Certifications", description: "Google's official certifications for search ads, analytics, and SEO best practices.", provider: "Google Skillshop", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/google.com", link: "https://skillshop.exceedlms.com" },
  { category: "Business & Finance", name: "Financial Markets (Yale)", description: "Yale's popular course on how banks, stocks, insurance, and financial institutions actually work.", provider: "Coursera", duration: "~30 hrs", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/learn/financial-markets-global" },
  { category: "Business & Finance", name: "Google Project Management Certificate", description: "Google's beginner-friendly path to core project management skills like Agile and Scrum.", provider: "Coursera", duration: "~4 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/google-project-management" },
  { category: "Business & Finance", name: "Introduction to Corporate Finance (Wharton)", description: "Wharton's foundational course covering time value of money, valuation, and financial decision-making.", provider: "Coursera", duration: "~10 hrs", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/learn/wharton-finance" },
  { category: "Business & Finance", name: "Entrepreneurship Specialization (Wharton)", description: "Wharton's practical path covering opportunity evaluation, funding, marketing, and growth strategy.", provider: "Coursera", duration: "4 months", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/wharton-entrepreneurship" },
  { category: "Business & Finance", name: "CORe (MBA-level content)", description: "HBS Online's credential-style program covering financial accounting, economics, and analytics — MBA fundamentals.", provider: "HBS Online", duration: "8 weeks", type: "Paid", image: "https://logo.clearbit.com/online.hbs.edu", link: "https://online.hbs.edu" },
  { category: "Cybersecurity", name: "Google Cybersecurity Professional Certificate", description: "Google's beginner path into cybersecurity, covering networks, threats, and incident response.", provider: "Coursera", duration: "~6 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
  { category: "Cybersecurity", name: "Introduction to Cyber Security", description: "TryHackMe's beginner-friendly, hands-on intro to core cybersecurity concepts and tools.", provider: "TryHackMe", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/tryhackme.com", link: "https://tryhackme.com" },
  { category: "Cybersecurity", name: "Hack The Box Academy", description: "Guided, hands-on cybersecurity training with real hacking labs for all skill levels.", provider: "Hack The Box", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/hackthebox.com", link: "https://academy.hackthebox.com" },
  { category: "Cybersecurity", name: "CompTIA Security+ Prep", description: "Free video series covering everything needed to pass the CompTIA Security+ exam.", provider: "Professor Messer", duration: "~30 hrs", type: "Free", image: "https://logo.clearbit.com/professormesser.com", link: "https://www.professormesser.com" },
  { category: "Cybersecurity", name: "PJPT / PNPT (Practical Network Penetration Tester)", description: "Hands-on certification testing real-world network penetration testing skills, not just theory.", provider: "TCM Security", duration: "Self-paced", type: "Paid", image: "https://logo.clearbit.com/tcm-sec.com", link: "https://certifications.tcm-sec.com" },
  { category: "Cybersecurity", name: "Offensive Security Certified Professional (OSCP)", description: "The industry's toughest hands-on pentesting certification, requiring a 24-hour practical exam.", provider: "OffSec", duration: "90 days lab access", type: "Paid", image: "https://logo.clearbit.com/offsec.com", link: "https://www.offsec.com/courses/pen-200/" },
  { category: "Cybersecurity", name: "Practical Ethical Hacking", description: "TCM Security's highly-rated, hands-on course covering real-world ethical hacking techniques.", provider: "TCM Security", duration: "24 hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/practical-ethical-hacking/" },
  { category: "Cybersecurity", name: "HackTheBox Academy – Penetration Tester Path", description: "A structured learning path from HTB Academy to build professional penetration testing skills.", provider: "Hack The Box", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/hackthebox.com", link: "https://academy.hackthebox.com" },
  { category: "Cybersecurity", name: "SANS Cyber Aces", description: "SANS Institute's free, foundational course covering operating systems, networking, and security basics.", provider: "SANS Institute", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/sans.org", link: "https://www.cyberaces.org" },
  { category: "Cybersecurity", name: "CISSP / CISM Prep", description: "Exam-focused prep covering the domains tested in the CISSP and CISM certifications.", provider: "Udemy", duration: "40+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/cisspcertification/" },
  { category: "Mobile Development", name: "The Complete Flutter Development Bootcamp", description: "Build cross-platform iOS and Android apps with Flutter and Dart from scratch.", provider: "Udemy", duration: "45+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/flutter-bootcamp-with-dart/" },
  { category: "Mobile Development", name: "iOS & Swift – The Complete Bootcamp", description: "A beginner-to-advanced bootcamp for building real iOS apps using Swift.", provider: "Udemy", duration: "60+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/ios-13-app-development-bootcamp/" },
  { category: "Mobile Development", name: "Android Basics with Compose", description: "Google's official course teaching modern Android app development using Jetpack Compose.", provider: "Google", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/developer.android.com", link: "https://developer.android.com/courses" },
  { category: "Mobile Development", name: "React Native – The Practical Guide", description: "Build native iOS and Android apps using React and JavaScript, taught by Max Schwarzmüller.", provider: "Udemy", duration: "30+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/react-native-the-practical-guide/" },
  { category: "Cloud & DevOps", name: "AWS Cloud Practitioner Essentials", description: "AWS's official intro to core cloud concepts, services, and pricing on AWS.", provider: "AWS Skill Builder", duration: "~6 hrs", type: "Free", image: "https://logo.clearbit.com/aws.amazon.com", link: "https://skillbuilder.aws" },
  { category: "Cloud & DevOps", name: "Google Cloud Digital Leader", description: "A non-technical overview of Google Cloud's core services and business value.", provider: "Google Cloud Skills Boost", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/cloudskillsboost.google", link: "https://www.cloudskillsboost.google" },
  { category: "Cloud & DevOps", name: "Docker & Kubernetes: The Practical Guide", description: "Learn containers, Docker Compose, and Kubernetes deployment from the ground up.", provider: "Udemy", duration: "20+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/" },
  { category: "Cloud & DevOps", name: "Microsoft Azure Fundamentals (AZ-900)", description: "Microsoft's official prep path for the AZ-900 exam covering core Azure concepts.", provider: "Microsoft Learn", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/microsoft.com", link: "https://learn.microsoft.com" },
  { category: "Photography", name: "Photography Basics and Beyond", description: "Michigan State's specialization covering camera settings, composition, and lighting fundamentals.", provider: "Coursera", duration: "3–6 months", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/photography" },
  { category: "Photography", name: "Master Photography", description: "A 28-hour deep dive into lighting, composition, and editing from a 30-year pro.", provider: "Udemy", duration: "28 hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/photography-learn-photography-from-pro-take-better-photos/" },
  { category: "Photography", name: "Exploring Photography (Adorama)", description: "Free YouTube series covering camera gear, technique, and creative photography tips.", provider: "YouTube", duration: "~50 hrs", type: "Free", image: "https://logo.clearbit.com/adorama.com", link: "https://www.youtube.com/@AdoramaTV" },
  { category: "Photography", name: "Photography Essentials", description: "Skillshare's practical intro to camera settings, composition, and everyday photography skills.", provider: "Skillshare", duration: "~20 hrs", type: "Paid", image: "https://logo.clearbit.com/skillshare.com", link: "https://www.skillshare.com" },
  { category: "Photography", name: "Digital Photography", description: "Harvard Extension's course covering technical and creative fundamentals of digital photography.", provider: "Harvard Extension School", duration: "Self-paced", type: "Paid", image: "https://logo.clearbit.com/extension.harvard.edu", link: "https://extension.harvard.edu" },
  { category: "Video Editing", name: "Video Editing and Production with Adobe Premiere Pro", description: "Coursera course covering the full Premiere Pro editing workflow for real projects.", provider: "Coursera", duration: "4–6 weeks", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/courses?query=video%20editing" },
  { category: "Video Editing", name: "Premiere Pro CC – Complete Video Editing Course", description: "A complete beginner's guide to editing videos professionally in Premiere Pro.", provider: "Udemy", duration: "15–20 hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/adobe_premiere_pro_2020_video_editing/" },
  { category: "Video Editing", name: "Exploring Video Editing", description: "Great Learning's quick, free intro to video editing concepts and workflow.", provider: "Great Learning Academy", duration: "Few hrs", type: "Free", image: "https://logo.clearbit.com/mygreatlearning.com", link: "https://www.mygreatlearning.com/academy" },
  { category: "Video Editing", name: "DaVinci Resolve Free Tutorials", description: "Free YouTube tutorials covering DaVinci Resolve's editing, color grading, and audio tools.", provider: "YouTube", duration: "Ongoing", type: "Free", image: "https://logo.clearbit.com/youtube.com", link: "https://www.youtube.com" },
  { category: "Video Editing", name: "After Effects Motion Graphics", description: "Domestika's creative course on building motion graphics and animation in After Effects.", provider: "Domestika", duration: "5–10 hrs", type: "Paid", image: "https://logo.clearbit.com/domestika.org", link: "https://www.domestika.org" },
  { category: "Productivity Tools", name: "Excel Skills for Business Specialization", description: "Macquarie University's practical path covering Excel formulas, data analysis, and dashboards.", provider: "Coursera", duration: "4 months", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/excel" },
  { category: "Productivity Tools", name: "Microsoft Excel – From Beginner to Advanced", description: "Kyle Pew's comprehensive Excel course covering formulas, pivot tables, macros, and VBA.", provider: "Udemy", duration: "17 hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/" },
  { category: "Productivity Tools", name: "Excel Free Tutorials (Leila Gharani)", description: "Popular free YouTube tutorials on advanced Excel formulas, dashboards, and productivity tricks.", provider: "YouTube", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/exceljet.net", link: "https://www.youtube.com/@LeilaGharani" },
  { category: "Productivity Tools", name: "Microsoft Learn – Excel/Office Paths", description: "Microsoft's official, free learning paths for mastering Excel and the Office suite.", provider: "Microsoft Learn", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/microsoft.com", link: "https://learn.microsoft.com" },
  { category: "Productivity Tools", name: "Google Sheets Full Course", description: "freeCodeCamp's free crash course covering formulas, functions, and data tools in Google Sheets.", provider: "freeCodeCamp", duration: "~2–4 hrs", type: "Free", image: "https://logo.clearbit.com/freecodecamp.org", link: "https://www.freecodecamp.org/news/" },
  { category: "Language Learning", name: "Duolingo (All Languages)", description: "Free, gamified lessons for learning dozens of languages at your own pace.", provider: "Duolingo", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/duolingo.com", link: "https://www.duolingo.com" },
  { category: "Language Learning", name: "Babbel", description: "Structured, conversation-focused lessons designed to build real-world speaking confidence.", provider: "Babbel", duration: "Self-paced", type: "Paid", image: "https://logo.clearbit.com/babbel.com", link: "https://www.babbel.com" },
  { category: "Language Learning", name: "English for Career Development (UPenn)", description: "University of Pennsylvania's course on professional English for job searching and workplace communication.", provider: "Coursera", duration: "~19 hrs", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/learn/careerdevelopment" },
  { category: "Language Learning", name: "Learn a Language with a Native Speaker", description: "1-on-1 lessons with native speakers for real conversational practice in any language.", provider: "italki", duration: "Flexible", type: "Paid", image: "https://logo.clearbit.com/italki.com", link: "https://www.italki.com" },
  { category: "Language Learning", name: "BBC Languages (Archived)", description: "BBC's classic free language-learning resource covering grammar, vocabulary, and audio lessons.", provider: "BBC", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/bbc.co.uk", link: "https://www.bbc.co.uk/languages" },
  { category: "Language Learning", name: "Busuu", description: "Interactive language lessons with feedback from a community of native speakers.", provider: "Busuu", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/busuu.com", link: "https://www.busuu.com" },
  { category: "Exam Preparation", name: "SSC CGL/CHSL Complete Course", description: "Complete prep covering reasoning, quant, English, and GK for SSC exams.", provider: "Testbook", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/testbook.com", link: "https://testbook.com" },
  { category: "Exam Preparation", name: "UPSC CSE Foundation", description: "Structured foundation course covering the syllabus for India's UPSC Civil Services Exam.", provider: "Unacademy", duration: "1–2 years", type: "Free", image: "https://logo.clearbit.com/unacademy.com", link: "https://unacademy.com" },
  { category: "Exam Preparation", name: "Banking (IBPS/SBI PO) Prep", description: "Covers quantitative aptitude, reasoning, and English for bank PO and clerk exams.", provider: "Adda247", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/adda247.com", link: "https://www.adda247.com" },
  { category: "Exam Preparation", name: "Railway (RRB) Exam Prep", description: "Complete prep covering the syllabus for RRB Group D and NTPC exams.", provider: "BYJU'S Exam Prep", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/byjusexamprep.com", link: "https://byjusexamprep.com" },
  { category: "Exam Preparation", name: "Current Affairs & GK Daily", description: "Daily current affairs and general knowledge updates for competitive exam preparation.", provider: "GKToday", duration: "Daily", type: "Free", image: "https://logo.clearbit.com/gktoday.in", link: "https://www.gktoday.in" },
  { category: "Exam Preparation", name: "NCERT-based Foundation (StudyIQ)", description: "NCERT-based foundational lessons covering key subjects for competitive exam preparation.", provider: "YouTube", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/youtube.com", link: "https://www.youtube.com" },

  // ===== Naye courses: Public Speaking, Writing, Game Dev, Blockchain, Product Management, Music Production =====
  { category: "Public Speaking & Communication", name: "Dynamic Public Speaking Specialization", description: "University of Washington's structured path to becoming a confident, persuasive public speaker.", provider: "Coursera", duration: "2 months", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/public-speaking" },
  { category: "Writing & Content Creation", name: "Content Marketing Certification", description: "HubSpot's free certification covering content strategy, blogging, and audience-building fundamentals.", provider: "HubSpot Academy", duration: "~6 hours", type: "Free", image: "https://logo.clearbit.com/hubspot.com", link: "https://academy.hubspot.com/courses/content-marketing" },
  { category: "Writing & Content Creation", name: "Technical Writing Courses for Engineers", description: "Google's official course on writing clear, concise technical documentation for engineers.", provider: "Google", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/google.com", link: "https://developers.google.com/tech-writing" },
  { category: "Game Development", name: "Complete C# Unity Game Developer 3D", description: "GameDev.tv's hands-on course teaching Unity and C# by building real 3D games.", provider: "Udemy", duration: "40+ hrs", type: "Paid", image: "https://logo.clearbit.com/udemy.com", link: "https://www.udemy.com/course/unitycourse2/" },
  { category: "Blockchain & Web3", name: "Blockchain Basics", description: "University at Buffalo's intro to how Bitcoin and Ethereum blockchains actually work.", provider: "Coursera", duration: "4 weeks", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/learn/blockchain-basics" },
  { category: "Product Management", name: "IBM Product Manager Professional Certificate", description: "IBM's job-focused program covering product strategy, roadmaps, and the full product lifecycle.", provider: "Coursera", duration: "3 months", type: "Paid", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/professional-certificates/ibm-product-manager" },
  { category: "Music Production", name: "Music Production Specialization", description: "Berklee's hands-on specialization covering recording, mixing, and producing music in a DAW.", provider: "Coursera", duration: "4 weeks", type: "Free", image: "https://logo.clearbit.com/coursera.org", link: "https://www.coursera.org/specializations/music-production" },
  { category: "Programming & CS", name: "Learn Python 3", description: "Codecademy's interactive, beginner-friendly path to learning Python programming from scratch.", provider: "Codecademy", duration: "~25 hrs", type: "Free", image: "https://logo.clearbit.com/codecademy.com", link: "https://www.codecademy.com/learn/learn-python-3" },
  { category: "Data Science", name: "Learn SQL", description: "Hands-on, interactive lessons for learning SQL queries and database fundamentals.", provider: "Codecademy", duration: "~8 hrs", type: "Free", image: "https://logo.clearbit.com/codecademy.com", link: "https://www.codecademy.com/learn/learn-sql" },
  { category: "Exam Preparation", name: "SAT Prep (Official)", description: "Khan Academy's official, free SAT prep with personalized practice from College Board data.", provider: "Khan Academy", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/khanacademy.org", link: "https://www.khanacademy.org/sat" },
  { category: "UI/UX & Design", name: "Canva Design School", description: "Canva's free tutorials covering graphic design basics, branding, and social media visuals.", provider: "Canva", duration: "Self-paced", type: "Free", image: "https://logo.clearbit.com/canva.com", link: "https://www.canva.com/designschool/" },
  { category: "Programming & CS", name: "Scientific Computing with Python", description: "freeCodeCamp's project-based path covering Python for data, math, and scientific computing.", provider: "freeCodeCamp", duration: "~300 hrs", type: "Free", image: "https://logo.clearbit.com/freecodecamp.org", link: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
  {
    category: "Information Technology",
    name: "CodeYogi — Free Coding & AI Course (Hindi)",
    description: "Smartphone-first free coding and AI fluency program by IIT Delhi alumni. Learn HTML, CSS, JavaScript and AI skills in Hindi — no laptop required.",
    provider: "CodeYogi",
    duration: "Self-paced",
    type: "Free",
    image: "https://www.google.com/s2/favicons?domain=codeyogi.org&sz=128",
    link: "https://codeyogi.org/",
  },
  {
    category: "Information Technology",
    name: "Computer Science Discoveries",
    description: "Code.org's free curriculum for grades 6–10. Build websites, apps, animations and games while learning core CS and AI concepts.",
    provider: "Code.org",
    duration: "Flexible / semester",
    type: "Free",
    image: "https://www.google.com/s2/favicons?domain=code.org&sz=128",
    link: "https://code.org/curriculum/computer-science-discoveries",
  }

];

let categorySelect = document.getElementById("category");
let typeSelect = document.getElementById("type");
let providerSelect = document.getElementById("provider");
let searchText = document.getElementById("search-text");
let clearBtn = document.getElementById("clear-btn");
let favoritesOnlyBtn = document.getElementById("favorites-only");
let courseList = document.getElementById("course-list");
let resultCount = document.getElementById("result-count");
let showFavoritesOnly = false;

// ye email jaha "Report broken link" click hone par mail jaayegi
const REPORT_EMAIL = "krixora404@gmail.com";

// FAVORITES: koi login nahi chahiye, sirf is browser mein localStorage mein save hote hain
const FAVORITES_KEY = "course_finder_favorites";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isFavorite(courseLink) {
  return getFavorites().includes(courseLink);
}

function toggleFavorite(courseLink) {
  let favorites = getFavorites();
  if (favorites.includes(courseLink)) {
    favorites = favorites.filter((link) => link !== courseLink);
  } else {
    favorites.push(courseLink);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Provider dropdown ko courses array se dynamically populate karo
// taaki naya provider add karne pe HTML edit na karna pade
function populateProviders() {
  const providers = [...new Set(courses.map((c) => c.provider))].sort();
  providers.forEach((provider) => {
    const option = document.createElement("option");
    option.value = provider;
    option.textContent = provider;
    providerSelect.appendChild(option);
  });
}

// Category dropdown bhi courses array se hi dynamically populate hota hai
// taaki nayi category add karne pe HTML edit na karna pade
function populateCategories() {
  const categories = [...new Set(courses.map((c) => c.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Course thumbnails alag-alag external sites se aate hain (bina compress/resize kiye)
// ye function unhe ek free proxy (images.weserv.nl) se WebP mein convert + resize karva deta hai
// isse scroll lag kam hota hai kyunki images chhoti aur lightweight ho jaati hain
/* Provider → domain map for reliable lightweight logos */
const PROVIDER_DOMAINS = {
  "udemy": "udemy.com",
  "coursera": "coursera.org",
  "edx": "edx.org",
  "futurelearn": "futurelearn.com",
  "freecodecamp": "freecodecamp.org",
  "the odin project": "theodinproject.com",
  "codecademy": "codecademy.com",
  "scrimba": "scrimba.com",
  "kaggle": "kaggle.com",
  "geeksforgeeks": "geeksforgeeks.org",
  "hack the box": "hackthebox.com",
  "tryhackme": "tryhackme.com",
  "microsoft": "microsoft.com",
  "google": "google.com",
  "aws": "aws.amazon.com",
  "meta": "meta.com",
  "ibm": "ibm.com",
  "harvard": "harvard.edu",
  "mit": "mit.edu",
  "stanford": "stanford.edu",
  "codeyogi": "codeyogi.org",
  "code.org": "code.org",
  "khan academy": "khanacademy.org",
  "duolingo": "duolingo.com",
  "babbel": "babbel.com",
  "skillshare": "skillshare.com",
  "udacity": "udacity.com",
  "linkedin learning": "linkedin.com",
  "pluralsight": "pluralsight.com",
  "datacamp": "datacamp.com",
  "fast.ai": "fast.ai",
  "elements of ai": "elementsofai.com",
  "university of helsinki": "helsinki.fi",
  "javascript.info": "javascript.info",
  "designcourse": "designcourse.com",
  "adorama": "adorama.com",
  "domestika": "domestika.org",
  "unacademy": "unacademy.com",
  "testbook": "testbook.com",
  "byju": "byjus.com",
  "italki": "italki.com",
  "busuu": "busuu.com",
};

const PROVIDER_COLORS = [
  "#1673e6", "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#6366f1", "#14b8a6", "#f97316",
];

function providerKey(provider) {
  return (provider || "").toLowerCase().trim();
}

function getProviderDomain(provider) {
  const key = providerKey(provider);
  if (PROVIDER_DOMAINS[key]) return PROVIDER_DOMAINS[key];
  // fuzzy match
  for (const [k, domain] of Object.entries(PROVIDER_DOMAINS)) {
    if (key.includes(k) || k.includes(key)) return domain;
  }
  // try extracting from common patterns
  const cleaned = key.replace(/[^a-z0-9]+/g, "");
  if (cleaned.length > 2) return cleaned + ".com";
  return null;
}

function monogramDataUri(provider) {
  const letter = ((provider || "?").trim()[0] || "?").toUpperCase();
  let hash = 0;
  for (let i = 0; i < (provider || "").length; i++) hash = (hash * 31 + provider.charCodeAt(i)) | 0;
  const color = PROVIDER_COLORS[Math.abs(hash) % PROVIDER_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="24" fill="${color}"/>
    <text x="64" y="64" dy="0.35em" text-anchor="middle" fill="#fff" font-family="system-ui,Segoe UI,sans-serif" font-size="56" font-weight="700">${letter}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Lightweight provider logo — Google favicon CDN (~1–2KB) with SVG monogram fallback */
function getCourseImage(course) {
  const domain = getProviderDomain(course.provider);
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }
  return monogramDataUri(course.provider);
}

function optimizeImageUrl(url, width = 128) {
  // data URIs and google favicons — no proxy needed
  if (!url || url.startsWith("data:") || url.includes("google.com/s2/favicons")) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=75`;
}

let hasRevealedOnce = false;

function displayCourses(filteredCourses) {
  courseList.innerHTML = "";
  
  if (filteredCourses.length === 0) {
    courseList.innerHTML = `
      <div class="empty-state col-span-full" data-reveal>
        <div class="empty-state__icon"><i class="fas fa-compass"></i></div>
        <p class="empty-state__title">No courses match</p>
        <p class="empty-state__sub">Try a different keyword, or clear filters to see the full catalog.</p>
        <button type="button" class="empty-state__btn" id="empty-clear-filters">
          <i class="fas fa-rotate-left"></i> Clear filters
        </button>
      </div>
    `;
    document.getElementById("empty-clear-filters")?.addEventListener("click", () => {
      document.getElementById("clear-btn")?.click();
    });
    resultCount.innerText = "";
    return;
  }
  
  const freeN = filteredCourses.filter((c) => c.type === "Free").length;
  const paidN = filteredCourses.length - freeN;
  resultCount.innerHTML = `<span class="result-stats"><strong>${filteredCourses.length}</strong> shown · <span class="text-emerald-600 dark:text-emerald-400">${freeN} free</span> · <span class="text-amber-600 dark:text-amber-400">${paidN} paid</span></span>`;
  
  filteredCourses.forEach((course, cardIndex) => {
    let saved = isFavorite(course.link);
    let reportSubject = encodeURIComponent(`Broken link report: ${course.name}`);
    let reportBody = encodeURIComponent(
      `Course: ${course.name}\nProvider: ${course.provider}\nLink: ${course.link}\n\nIssue: `
    );
    const stagger = hasRevealedOnce ? `style="--card-i:${Math.min(cardIndex, 12)}"` : "";
    let courseCard = `
      <div class="course-card ${hasRevealedOnce ? "card-enter" : ""}" data-link="${course.link}" ${hasRevealedOnce ? "" : "data-reveal"} ${stagger}>
        <div class="img-wrap">
          <img src="${optimizeImageUrl(getCourseImage(course))}" alt="${course.provider} logo" loading="lazy" decoding="async" width="128" height="128" onerror="this.onerror=null;this.src='${monogramDataUri(course.provider)}'">
          <button class="favorite-btn ${saved ? "saved" : ""}" data-link="${course.link}" aria-label="Save course" title="${saved ? "Remove from saved" : "Save for later"}">
            <i class="${saved ? "fas" : "far"} fa-heart"></i>
          </button>
        </div>
        <div class="details">
          <span class="category-tag">${course.category}</span>
          <h3>${course.name}</h3>
          <p class="course-description">${course.description}</p>
          <p><i class="fas fa-building-columns"></i> <strong>Provider:</strong> ${course.provider}</p>
          <p><i class="far fa-clock"></i> <strong>Duration:</strong> ${course.duration}</p>
          <span class="course-type ${
            course.type === "Free" ? "free" : "paid"
          }">${course.type}</span>
          <span class="grow"></span>
          <div class="card-actions">
            <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="btn-view" data-track-view="${course.link}">
              <i class="fas fa-arrow-up-right-from-square"></i> View Course
            </a>
            <button type="button" class="btn-details" data-link="${course.link}">
              <i class="fas fa-circle-info"></i> Details
            </button>
          </div>
          <a href="mailto:${REPORT_EMAIL}?subject=${reportSubject}&body=${reportBody}" class="report-link">
            <i class="fas fa-flag"></i> Report broken link
          </a>
        </div>
      </div>
    `;
    courseList.innerHTML += courseCard;
  });
  
  hasRevealedOnce = true;
}

function applyFilters() {
  let selectedCategory = categorySelect.value;
  let selectedType = typeSelect.value;
  let selectedProvider = providerSelect.value;
  let query = searchText.value.trim().toLowerCase();
  let tokens = query ? query.split(/\s+/).filter(Boolean) : [];
  let onlyFavorites = showFavoritesOnly;
  let favorites = getFavorites();
  const sortEl = document.getElementById("sort-select");
  const sortMode = sortEl ? sortEl.value : "relevance";

  let filteredCourses = courses.filter((course) => {
    let matchesCategory = selectedCategory === "" || course.category === selectedCategory;
    let matchesType = selectedType === "" || course.type === selectedType;
    let matchesProvider = selectedProvider === "" || course.provider === selectedProvider;
    const hay = `${course.name} ${course.provider} ${course.category} ${course.description || ""}`.toLowerCase();
    let matchesQuery = tokens.length === 0 || tokens.every((t) => hay.includes(t));
    let matchesFavorites = !onlyFavorites || favorites.includes(course.link);
    return matchesCategory && matchesType && matchesProvider && matchesQuery && matchesFavorites;
  });

  if (sortMode === "name-asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode === "name-desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortMode === "provider") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));
  } else if (sortMode === "free-first") {
    filteredCourses = [...filteredCourses].sort((a, b) => (a.type === "Free" ? 0 : 1) - (b.type === "Free" ? 0 : 1) || a.name.localeCompare(b.name));
  } else if (sortMode === "paid-first") {
    filteredCourses = [...filteredCourses].sort((a, b) => (a.type === "Paid" ? 0 : 1) - (b.type === "Paid" ? 0 : 1) || a.name.localeCompare(b.name));
  }

  displayCourses(filteredCourses);
  updateURLFromFilters();
  if (typeof window.__cmOnFiltersApplied === "function") {
    window.__cmOnFiltersApplied(filteredCourses, { query, selectedCategory, selectedType, selectedProvider, onlyFavorites });
  }
}

// Current filters ko URL query params mein reflect karta hai (bina page reload ke)
// taaki koi filtered view ka link WhatsApp/kahin bhi share kar sake
function updateURLFromFilters() {
  const params = new URLSearchParams();
  if (categorySelect.value) params.set("category", categorySelect.value);
  if (typeSelect.value) params.set("type", typeSelect.value);
  if (providerSelect.value) params.set("provider", providerSelect.value);
  if (searchText.value.trim()) params.set("q", searchText.value.trim());
  if (showFavoritesOnly) params.set("saved", "1");

  const query = params.toString();
  const newURL = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  history.replaceState(null, "", newURL);
}

// Page load pe URL mein already koi filters ho (shared link se aaye ho) to unhe load karta hai
function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) return false;

  if (params.has("category")) categorySelect.value = params.get("category");
  if (params.has("type")) typeSelect.value = params.get("type");
  if (params.has("provider")) providerSelect.value = params.get("provider");
  if (params.has("q")) searchText.value = params.get("q");
  if (params.get("saved") === "1") {
    showFavoritesOnly = true;
    updateFavoritesButtonUI();
  }
  return true;
}

// Page load pe agar URL mein shared filters hon to wahi apply karo, warna saare courses dikhao
populateProviders();
populateCategories();
const hadURLFilters = loadFiltersFromURL();
if (hadURLFilters) {
  applyFilters();
} else {
  displayCourses(courses);
}

// Enter dabane par bhi search ho jaye
searchText.addEventListener("keyup", (e) => {
  if (e.key === "Enter") applyFilters();
});

// Live filtering: typing/selecting turant results update kar deta hai
searchText.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
typeSelect.addEventListener("change", applyFilters);
providerSelect.addEventListener("change", applyFilters);

// "Saved" filter button ek toggle hai (checkbox nahi), click pe on/off hota hai
function updateFavoritesButtonUI() {
  const icon = favoritesOnlyBtn.querySelector("i");
  favoritesOnlyBtn.setAttribute("aria-pressed", String(showFavoritesOnly));
  if (showFavoritesOnly) {
    icon.className = "fas fa-heart";
    favoritesOnlyBtn.classList.add("bg-red-50", "dark:bg-red-900/20", "border-red-300", "dark:border-red-800", "text-red-500");
  } else {
    icon.className = "far fa-heart";
    favoritesOnlyBtn.classList.remove("bg-red-50", "dark:bg-red-900/20", "border-red-300", "dark:border-red-800", "text-red-500");
  }
}

favoritesOnlyBtn.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  updateFavoritesButtonUI();
  applyFilters();
});

clearBtn.addEventListener("click", () => {
  categorySelect.value = "";
  typeSelect.value = "";
  providerSelect.value = "";
  searchText.value = "";
  showFavoritesOnly = false;
  updateFavoritesButtonUI();
  displayCourses(courses);
  history.replaceState(null, "", window.location.pathname);
});

// Copy Link button: current filtered search ka shareable URL clipboard mein copy karta hai
const copyLinkBtn = document.getElementById("copy-link-btn");
copyLinkBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (e) {
    // Clipboard API fail ho (permissions/unsupported), to bhi UI feedback dikha do
  }
  const icon = copyLinkBtn.querySelector("i");
  icon.className = "fas fa-check text-sm text-green-500";
  copyLinkBtn.title = "Link copied!";
  setTimeout(() => {
    icon.className = "fas fa-link text-sm";
    copyLinkBtn.title = "Copy shareable link for this search";
  }, 1500);
});

// PWA Install: nav buttons + floating banner (browser-eligible hone par)
let deferredInstallPrompt = null;
const installBtn = document.getElementById("install-app-btn");
const installBtnMobile = document.getElementById("install-app-btn-mobile");
const installBanner = document.getElementById("install-banner");
const installBannerBtn = document.getElementById("install-banner-btn");
const installBannerDismiss = document.getElementById("install-banner-dismiss");
const INSTALL_DISMISS_KEY = "coursora_install_dismissed";

function showInstallButtons() {
  installBtn?.classList.remove("hidden");
  installBtn?.classList.add("inline-flex");
  installBtnMobile?.classList.remove("hidden");
  installBtnMobile?.classList.add("flex");
  // Floating banner — skip if user dismissed this session/week
  if (installBanner && !sessionStorage.getItem(INSTALL_DISMISS_KEY)) {
    installBanner.classList.remove("hidden");
  }
}

function hideInstallButtons() {
  installBtn?.classList.add("hidden");
  installBtn?.classList.remove("inline-flex");
  installBtnMobile?.classList.add("hidden");
  installBtnMobile?.classList.remove("flex");
  installBanner?.classList.add("hidden");
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallButtons();
});

async function triggerInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  hideInstallButtons();
}

installBtn?.addEventListener("click", triggerInstall);
installBtnMobile?.addEventListener("click", () => {
  closeMobileMenu();
  triggerInstall();
});
installBannerBtn?.addEventListener("click", triggerInstall);
installBannerDismiss?.addEventListener("click", () => {
  installBanner?.classList.add("hidden");
  sessionStorage.setItem(INSTALL_DISMISS_KEY, "1");
});

window.addEventListener("appinstalled", hideInstallButtons);

// Heart button click ko event delegation se handle karo
// kyunki cards baar baar dobara render hote hain
courseList.addEventListener("click", (e) => {
  const btn = e.target.closest(".favorite-btn");
  if (!btn) return;
  btn.classList.remove("heart-pop");
  void btn.offsetWidth;
  btn.classList.add("heart-pop");
  toggleFavorite(btn.dataset.link);
  applyFilters();
});
// =========================================================
// COMMAND PALETTE (⌘K search) — kahin se bhi instantly koi bhi
// course search karke naya tab mein khol sakte ho, bina scroll kiye
// =========================================================
const paletteOverlay = document.getElementById("command-palette-overlay");
const paletteInput = document.getElementById("command-palette-input");
const paletteResults = document.getElementById("command-palette-results");
let paletteSelectedIndex = 0;
let paletteMatches = [];

function openPalette() {
  if (!paletteOverlay) return;
  paletteOverlay.classList.remove("hidden");
  paletteInput.value = "";
  paletteInput.focus();
  renderPaletteResults("");
  document.body.style.overflow = "hidden";
}

function closePalette() {
  if (!paletteOverlay) return;
  paletteOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderPaletteResults(query) {
  const q = query.trim().toLowerCase();
  paletteMatches =
    q === ""
      ? courses.slice(0, 8)
      : courses
          .filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.provider.toLowerCase().includes(q) ||
              c.category.toLowerCase().includes(q)
          )
          .slice(0, 8);
  paletteSelectedIndex = 0;

  if (paletteMatches.length === 0) {
    paletteResults.innerHTML = `<p class="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No courses found</p>`;
    return;
  }

  paletteResults.innerHTML = paletteMatches
    .map(
      (c, i) => `
    <div class="palette-item ${i === 0 ? "active" : ""}" data-index="${i}" data-link="${c.link}">
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-800 dark:text-gray-100 truncate">${c.name}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 truncate">${c.provider} · ${c.category}</p>
      </div>
      <span class="text-xs px-2 py-0.5 rounded-full shrink-0 ${
        c.type === "Free"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }">${c.type}</span>
    </div>
  `
    )
    .join("");
}

function updatePaletteActive() {
  paletteResults.querySelectorAll(".palette-item").forEach((el, i) => {
    el.classList.toggle("active", i === paletteSelectedIndex);
  });
  const activeEl = paletteResults.querySelector(".palette-item.active");
  if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
}

paletteInput?.addEventListener("input", (e) => renderPaletteResults(e.target.value));

paletteResults?.addEventListener("click", (e) => {
  const item = e.target.closest(".palette-item");
  if (item) window.open(item.dataset.link, "_blank", "noopener,noreferrer");
});

paletteOverlay?.addEventListener("click", (e) => {
  if (e.target === paletteOverlay) closePalette();
});

document.getElementById("open-command-palette")?.addEventListener("click", openPalette);
document.getElementById("open-command-palette-mobile")?.addEventListener("click", () => {
  if (typeof closeMobileMenu === "function") closeMobileMenu(); else mobileMenu?.classList.add("hidden");
  openPalette();
});

document.addEventListener("keydown", (e) => {
  // Cmd+K (Mac) ya Ctrl+K (Windows/Linux) — kahin se bhi palette open/close ho jaaye
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (!paletteOverlay) return;
    paletteOverlay.classList.contains("hidden") ? openPalette() : closePalette();
    return;
  }

  if (paletteOverlay && !paletteOverlay.classList.contains("hidden")) {
    if (e.key === "Escape") {
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      paletteSelectedIndex = Math.min(paletteSelectedIndex + 1, paletteMatches.length - 1);
      updatePaletteActive();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      paletteSelectedIndex = Math.max(paletteSelectedIndex - 1, 0);
      updatePaletteActive();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const match = paletteMatches[paletteSelectedIndex];
      if (match) window.open(match.link, "_blank", "noopener,noreferrer");
      return;
    }
  }
});

// =========================================================
// CURATED LEARNING PATHS — existing courses ko sahi order mein
// chain karke ek step-by-step roadmap banata hai (sirf list nahi,
// ek guided path deta hai kisi bhi field mein shuru karne ke liye)
// =========================================================
const learningPaths = [
  {
    title: "Become a Web Developer",
    icon: "fa-code",
    level: "Beginner → Job Ready",
    description: "Go from zero to a portfolio-ready front-end developer.",
    courseNames: [
      "Responsive Web Design + Full Curriculum",
      "JavaScript.info",
      "Full Stack Open",
      "Front-End Developer Professional Certificate (Meta)",
    ],
  },
  {
    title: "Data Analyst Career Path",
    icon: "fa-chart-line",
    level: "Beginner → Job Ready",
    description: "Learn to work with data using Python, SQL, and real analytics tools.",
    courseNames: [
      "Python for Everybody Specialization",
      "Learn SQL",
      "Google Data Analytics Professional Certificate",
      "Kaggle Learn (Pandas, SQL, ML micro-courses)",
    ],
  },
  {
    title: "Cybersecurity Beginner to Job-Ready",
    icon: "fa-shield-alt",
    level: "Beginner → Intermediate",
    description: "Build practical security skills, from fundamentals to ethical hacking.",
    courseNames: [
      "Introduction to Cyber Security",
      "CompTIA Security+ Prep",
      "Practical Ethical Hacking",
      "Google Cybersecurity Professional Certificate",
    ],
  },
  {
    title: "AI & Machine Learning Foundations",
    icon: "fa-robot",
    level: "Beginner → Intermediate",
    description: "Understand AI concepts, then build real machine learning models.",
    courseNames: [
      "Elements of AI",
      "Python for Everybody Specialization",
      "Machine Learning Specialization (Andrew Ng)",
      "Deep Learning Specialization",
    ],
  },
  {
    title: "UI/UX Designer Path",
    icon: "fa-pencil-ruler",
    level: "Beginner → Job Ready",
    description: "Learn design principles, then master Figma and the full UX process.",
    courseNames: [
      "Intro to UI Design Fundamentals",
      "Meta Principles of UX/UI Design",
      "Figma UI/UX Design Essentials",
      "Google UX Design Professional Certificate",
    ],
  },
  {
    title: "Digital Marketing Career Path",
    icon: "fa-bullhorn",
    level: "Beginner → Job Ready",
    description: "Master the fundamentals, then specialize in SEO, ads, and strategy.",
    courseNames: [
      "Fundamentals of Digital Marketing",
      "Digital Marketing Specialization (UIUC)",
      "SEO / Google Ads / Analytics Certifications",
      "Google Digital Marketing & E-commerce Certificate",
    ],
  },
];

function renderLearningPaths() {
  const grid = document.getElementById("learning-paths-grid");
  if (!grid) return;

  grid.innerHTML = learningPaths
    .map((path) => {
      const steps = path.courseNames
        .map((name) => courses.find((c) => c.name === name))
        .filter(Boolean);

      return `
        <div class="learning-path-card" data-reveal>
          <button class="path-header" type="button">
            <span class="path-icon"><i class="fas ${path.icon}"></i></span>
            <span class="flex-1 text-left min-w-0">
              <span class="block font-semibold text-gray-800 dark:text-gray-100 text-sm">${path.title}</span>
              <span class="block text-xs text-gray-400">${path.level} · ${steps.length} courses</span>
            </span>
            <i class="fas fa-chevron-down path-chevron"></i>
          </button>
          <p class="path-description">${path.description}</p>
          <ol class="path-steps hidden">
            ${steps
              .map(
                (s, i) => `
              <li>
                <span class="step-num">${i + 1}</span>
                <a href="${s.link}" target="_blank" rel="noopener noreferrer">
                  <span class="step-name">${s.name}</span>
                  <span class="step-meta">${s.provider} · ${s.duration}</span>
                </a>
              </li>
            `
              )
              .join("")}
          </ol>
        </div>
      `;
    })
    .join("");

  // Har path card apne aap accordion ki tarah expand/collapse ho
  grid.querySelectorAll(".path-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".learning-path-card");
      card.querySelector(".path-steps").classList.toggle("hidden");
      card.querySelector(".path-chevron").classList.toggle("rotate-180");
    });
  });
}

renderLearningPaths();

/* ═══════════════════════════════════════════════════════════════════
   Advanced Disclaimer Ticker
   - Continuous scroll via rAF
   - Pointer-drag (mouse + touch) with live scrub
   - Inertia + friction after release
   - Hover: smooth velocity decay → pause, resume with ease
   - Edge-aware: never hard-clips (CSS fades)
   ═══════════════════════════════════════════════════════════════════ */
(function initAdvancedTicker() {
  const root = document.querySelector(".disclaimer-ticker");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const track = root.querySelector(".disclaimer-ticker__track");
  if (!track) return;

  // Wait one frame so layout is measured
  requestAnimationFrame(() => {
    let half = track.scrollWidth / 2;
    if (half < 10) return;

    // State
    let x = 0;
    let velocity = -0.45;          // px per frame @ 60fps baseline (right → left)
    const baseSpeed = -0.45;
    let targetVelocity = baseSpeed;
    let dragging = false;
    let lastPointerX = 0;
    let lastTime = performance.now();
    let pointerSamples = [];       // for velocity estimation on release

    const FRICTION = 0.94;         // inertia decay
    const HOVER_DECAY = 0.88;      // how fast velocity eases toward 0 on hover
    const RESUME_EASE = 0.06;      // how fast velocity eases back to baseSpeed
    const MAX_INERTIA = 18;

    function wrap() {
      // Seamless loop: content is duplicated, so wrap at half width
      if (x <= -half) x += half;
      if (x > 0) x -= half;
    }

    function apply() {
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    }

    function onPointerDown(e) {
      dragging = true;
      root.classList.add("is-dragging");
      root.classList.remove("is-paused-hover");
      lastPointerX = e.clientX;
      pointerSamples = [{ t: performance.now(), x: e.clientX }];
      velocity = 0;
      targetVelocity = 0;
      root.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      x += dx;
      wrap();
      apply();

      const now = performance.now();
      pointerSamples.push({ t: now, x: e.clientX });
      // keep last ~100ms of samples
      pointerSamples = pointerSamples.filter((s) => now - s.t < 100);
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");

      // Estimate release velocity from samples
      if (pointerSamples.length >= 2) {
        const first = pointerSamples[0];
        const last = pointerSamples[pointerSamples.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.01) {
          const vx = (last.x - first.x) / dt / 60; // → px per frame-ish
          velocity = Math.max(-MAX_INERTIA, Math.min(MAX_INERTIA, vx));
        }
      }
      pointerSamples = [];

      // After inertia dies, resume base scroll
      targetVelocity = baseSpeed;
    }

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("lostpointercapture", onPointerUp);

    // Hover: intentional soft pause (desktop)
    root.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return;
      if (dragging) return;
      root.classList.add("is-paused-hover");
      targetVelocity = 0;
    });
    root.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "touch") return;
      root.classList.remove("is-paused-hover");
      if (!dragging) targetVelocity = baseSpeed;
    });

    // Recalculate half-width on resize
    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
    });
    ro.observe(track);

    // Main loop
    function tick(now) {
      const dt = Math.min(32, now - lastTime) / 16.67; // normalize to ~60fps units
      lastTime = now;

      if (!dragging) {
        // Ease velocity toward target
        if (Math.abs(targetVelocity) < 0.01) {
          // approaching pause
          velocity *= HOVER_DECAY;
          if (Math.abs(velocity) < 0.02) velocity = 0;
        } else if (Math.abs(velocity) > Math.abs(baseSpeed) * 1.15) {
          // residual inertia — friction then ease back
          velocity *= FRICTION;
          if (Math.abs(velocity) < Math.abs(baseSpeed) * 1.05) {
            velocity += (targetVelocity - velocity) * RESUME_EASE * dt;
          }
        } else {
          // blend toward target (resume or continue)
          velocity += (targetVelocity - velocity) * RESUME_EASE * dt;
          // residual inertia damping when overshooting
          if (Math.abs(velocity) > Math.abs(baseSpeed) * 1.2) {
            velocity *= FRICTION;
          }
        }

        x += velocity * dt;
        wrap();
        apply();
      }

      requestAnimationFrame(tick);
    }

    apply();
    requestAnimationFrame(tick);
  });
})();
