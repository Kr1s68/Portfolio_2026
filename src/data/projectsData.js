export const projects = [
  {
    id: "aromatica-bulgaria",
    name: "Aromatica Bulgaria",
    fileName: "aromatica-bulgaria.md",
    tags: ["UX/UI Design", "Development", "Continuous Support"],
    image: "/aromatica-main-page.png",
    description: `I had the opportunity to develop this online store from the ground up, utilizing React and Firebase to meet the client's specific requirements. This project was particularly meaningful to me, as it allowed me to merge my technical expertise with my passion for creative design. Not only did I build the entire e-commerce platform, but I also crafted all the branding elements, ensuring a cohesive and visually appealing identity for the store.`,
    sections: [
      {
        heading: "Challenges",
        text: `Building a full e-commerce platform from scratch came with its fair share of hurdles. The product catalog had to support dynamic filtering, real-time inventory updates, and a seamless checkout flow — all without a traditional backend. I opted for Firebase as the backbone, which meant architecting the entire data layer around a NoSQL structure. Getting the Firestore security rules right while keeping the admin panel flexible enough for the client to manage products independently was one of the trickier puzzles I had to solve. On the design side, I built the entire brand identity from zero — logo, color palette, typography — which meant wearing the designer hat just as much as the developer one.`,
      },
      {
        heading: "Communication with client",
        text: `The client had a clear vision for what the store should feel like but not necessarily how it should work under the hood. That gap gave me room to propose solutions and make technical decisions, but it also meant I had to translate complex implementation details into language they could follow. We kept a tight feedback loop — weekly check-ins, shared Figma boards for design approval, and quick async updates over messaging. The trust we built early on is why I'm still providing continuous support for the platform today.`,
      },
      {
        heading: "The time it took",
        text: `From the first wireframe to the live deployment, the project spanned roughly three months. The first month was heavy on design and branding — establishing the visual identity before writing a single line of production code. The second month was dedicated to building out the core platform: product pages, cart logic, checkout, and the admin dashboard. The final stretch focused on polish, performance optimization, and making sure the client felt confident managing the store on their own.`,
      },
      {
        heading: "Technologies I learned and practices I applied",
        text: `This project deepened my understanding of Firebase's ecosystem — Firestore for the database, Firebase Auth for admin access, and Firebase Hosting for deployment. On the frontend, I sharpened my React skills significantly, particularly around state management for cart and checkout flows. I also got hands-on with responsive design principles that went beyond just media queries — thinking about the shopping experience across devices from day one. Perhaps most importantly, I learned what it takes to deliver a product end-to-end: not just writing code, but owning the design, the deployment, and the ongoing relationship with the client.`,
      },
    ],
  },
  {
    id: "studify-ai",
    name: "Studify AI",
    fileName: "studify-ai.md",
    tags: ["Full Stack Development", "Continuous Support", "Consulting"],
    image: "/studify-ai-main-page.png",
    description: `Initially brought on as a full stack developer for a specific task, I soon found that my alignment with the product's target demographic positioned me to contribute beyond the original scope. As a result, I took on additional responsibilities as a consultant, providing valuable insights and strategic guidance. Ultimately, I played a key role in the successful launch of the product.`,
    sections: [
      {
        heading: "Challenges",
        text: `Studify AI was an education platform that leaned heavily on AI-generated content, which meant the technical challenges were anything but conventional. Integrating GPT-based features into a learning flow required careful prompt engineering and a robust backend to handle API calls without blowing through rate limits or budgets. On the frontend, presenting AI-generated course material in a way that felt structured and trustworthy — not like a chatbot dump — was a design challenge in itself. I also had to build real-time progress tracking so students could pick up exactly where they left off across sessions.`,
      },
      {
        heading: "Communication with client",
        text: `What started as a developer-client relationship quickly evolved into something closer to a partnership. Because I was part of the same age group as the target audience, the team valued my perspective beyond just code. I sat in on product strategy meetings, gave feedback on feature prioritization, and pushed back when I thought a feature would miss the mark with students. The communication was fast-paced and direct — Slack channels, quick calls, and shared docs. That openness is what allowed me to grow from a developer into a consultant on the project.`,
      },
      {
        heading: "The time it took",
        text: `My involvement with Studify AI stretched over several months. The initial development sprint — building the core platform, user authentication, and the first AI-powered course flow — took about six weeks. After that, I transitioned into an ongoing role where I was shipping features, fixing edge cases, and consulting on product direction. The launch itself was a coordinated effort, and I was involved right up to and beyond it, handling post-launch iterations based on early user feedback.`,
      },
      {
        heading: "Technologies I learned and practices I applied",
        text: `This was my first deep dive into AI integration within a production application. I worked extensively with OpenAI's API, learning how to structure prompts for consistent educational output and how to manage token usage efficiently. On the stack side, I worked across the full spectrum — React on the frontend, Node.js on the backend, and PostgreSQL for persistent data. I also picked up practical knowledge around deployment pipelines, environment management, and the kind of error handling you need when a third-party AI service is a core dependency. The consulting side taught me something no framework can: how to think about a product from the user's perspective, not just the developer's.`,
      },
    ],
  },
  {
    id: "dream-builder",
    name: "Dream Builder",
    fileName: "dream-builder.md",
    tags: ["UX/UI Design", "Development", "Personal Project"],
    image: "/dream-builder-home-page.png",
    description: `My inaugural venture into software product development and marketing served as a pivotal learning experience, encompassing diverse facets of software engineering, social media outreach, and the intricacies of launching a digital service. This project stands as a testament to my unwavering commitment to professional growth and mastery of my craft.`,
    sections: [
      {
        heading: "Challenges",
        text: `Dream Builder was a PC customization web app — users could configure their ideal computer build, compare components, and get guided recommendations. The biggest challenge was managing the complexity of hardware compatibility. Not every CPU fits every motherboard, not every PSU can power every GPU configuration. I had to build a filtering and validation system that felt effortless to the user but handled dozens of compatibility rules behind the scenes. On top of that, this was my first time handling the full product lifecycle solo: design, development and deployment`,
      },
      {
        heading: "Motivation",
        text: `I built Dream Builder because I wanted to prove to myself that I could ship a real product — not just a tutorial project or a code exercise, but something people could actually use. I was deep into the PC building community at the time, and I noticed that existing configurator tools were either too technical for beginners or too limited for enthusiasts. I wanted to bridge that gap. Beyond the product itself, I was hungry to learn what it takes to put something out into the world. This project was about growth as much as it was about code.`,
      },
      {
        heading: "The time it took",
        text: `From concept to launch, Dream Builder took about four and a half months of focused work. The first few weeks were spent on research — understanding how to properly build a back-end (didn't have much experience at the time), mapping out compatibility rules, and designing the user flow. Development took the bulk of the time, roughly ten weeks, with the configurator logic being the most time-intensive piece. The final stretch was all about polish, responsive design, and figuring out how to actually get it deployed.`,
      },
      {
        heading: "Technologies I learned and practices I applied",
        text: `Dream Builder was built with React and pushed me to think more deeply about component architecture and state management at scale. The configurator required complex interdependent state — changing one component had to cascade validation checks across the entire build. I learned a lot about structuring data for performance, debouncing user input, and building UIs that stay responsive even when the underlying logic is heavy. On the non-technical side, I got my first real taste of deployment and hosting — learning how to package and serve a React app and a Node backend production.`,
      },
    ],
  },
  {
    id: "mind-map",
    name: "Mind Map App",
    fileName: "mind-map.md",
    tags: ["Java", "Desktop App", "Personal Project"],
    image: null,
    description: `A Java-based Mind Map desktop app, designed to help you manage ideas and projects effortlessly. This node-based tool provides a dynamic platform for organizing your thoughts and guiding your ideas towards successful fruition.`,
    sections: [
      {
        heading: "Challenges",
        text: `Building a mind map tool meant dealing with graph-based data structures in a visual, interactive context. Each node had to be draggable, connectable, and editable — and the relationships between nodes had to update in real time as the user restructured their map. Implementing the rendering logic for dynamic node positioning, connection lines, and zoom/pan interactions in a Java desktop environment was significantly more complex than anything I'd tackled before. Memory management also became a real concern once maps grew beyond a handful of nodes.`,
      },
      {
        heading: "Motivation",
        text: `I built the Mind Map App during a period where I was heavily focused on learning Java and wanted a project that would push me beyond basic console applications. I'd been using mind maps on paper to organize my own study plans and project ideas, and I figured — why not build my own digital version? It was a chance to combine something I genuinely used in my daily life with a technical challenge that would force me to learn about GUI programming, event handling, and data persistence in Java.`,
      },
      {
        heading: "The time it took",
        text: `The core application took about five weeks to build. The first week was dedicated to learning Java Swing and understanding how desktop GUI frameworks differ from web development. Weeks two and three were spent building the node system — creation, deletion, drag-and-drop, and connection logic. The fourth week focused on file persistence so users could save and reload their maps. The final week was polish: keyboard shortcuts, visual improvements, and squashing the edge-case bugs that come with any interactive canvas-based application.`,
      },
      {
        heading: "Technologies I learned and practices I applied",
        text: `This project was my deep dive into Java beyond the basics. I worked extensively with Java Swing for the GUI, learned about custom painting with Graphics2D for rendering nodes and connections, and implemented event listeners for complex mouse interactions like drag-and-drop and multi-select. On the data side, I used Java's serialization API for saving and loading mind maps. The project also taught me the importance of separating concerns in a desktop application — keeping the data model independent from the view layer — which is a pattern that's served me well in every project since.`,
      },
    ],
  },
];
