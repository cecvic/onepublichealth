export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  upvotes?: number;
  comments?: number;
}

export const categories = [
  "All Categories",
  "Public Health",
  "Epidemiology", 
  "Policy",
  "Health Equity",
  "Environmental Health",
  "Global Health",
  "Nutrition"
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Best practices for outbreak investigation?",
    excerpt: "What are the key steps in managing a communicable disease outbreak? Learn the essential protocols and methodologies used by epidemiologists.",
    content: "The first step is to verify the diagnosis and confirm the outbreak. This involves establishing case definitions, conducting laboratory confirmations, and implementing immediate control measures...",
    author: "Dr. Sarah Chen",
    publishedAt: "2 hours ago",
    readTime: "8 min read",
    category: "Epidemiology",
    tags: ["Epidemiology", "Outbreak", "Surveillance"],
    upvotes: 11,
    comments: 8
  },
  {
    id: "2", 
    title: "How can we reduce health inequalities?",
    excerpt: "Exploring evidence-based strategies to address social determinants of health and promote health equity in diverse communities.",
    content: "Health inequalities are complex issues that require multi-faceted approaches. Social determinants play a crucial role in shaping health outcomes...",
    author: "Prof. Michael Johnson",
    publishedAt: "1 hour ago", 
    readTime: "12 min read",
    category: "Health Equity",
    tags: ["Health Equity", "Social Determinants"],
    upvotes: 24,
    comments: 15
  },
  {
    id: "3",
    title: "Climate Change and Public Health: A Growing Concern",
    excerpt: "Understanding the intersection between environmental changes and population health outcomes, including heat-related illnesses and vector-borne diseases.",
    content: "Climate change is one of the most pressing public health challenges of our time. Rising temperatures, changing precipitation patterns, and extreme weather events...",
    author: "Dr. Maria Rodriguez",
    publishedAt: "5 hours ago",
    readTime: "10 min read", 
    category: "Environmental Health",
    tags: ["Climate Change", "Environmental Health", "Vector-borne Disease"],
    upvotes: 32,
    comments: 21
  },
  {
    id: "4",
    title: "Global Health Policy: Lessons from COVID-19",
    excerpt: "Analyzing policy responses to the pandemic and their implications for future global health emergency preparedness.",
    content: "The COVID-19 pandemic has highlighted both strengths and weaknesses in global health systems. Policy makers have learned valuable lessons...",
    author: "Dr. James Thompson",
    publishedAt: "1 day ago",
    readTime: "15 min read",
    category: "Policy", 
    tags: ["Policy", "Global Health", "COVID-19"],
    upvotes: 45,
    comments: 28
  },
  {
    id: "5",
    title: "Nutrition Education in Community Health Programs",
    excerpt: "Effective strategies for implementing nutrition education initiatives in underserved communities and measuring their impact.",
    content: "Community-based nutrition programs have shown significant promise in improving health outcomes. Research demonstrates that culturally appropriate interventions...",
    author: "Dr. Lisa Wang",
    publishedAt: "2 days ago",
    readTime: "9 min read",
    category: "Nutrition",
    tags: ["Nutrition", "Community Health", "Education"],
    upvotes: 18,
    comments: 12
  },
  {
    id: "6", 
    title: "Mental Health in Public Health Practice",
    excerpt: "Integrating mental health considerations into public health programming and addressing the mental health needs of populations.",
    content: "Mental health is an integral component of overall health and well-being. Public health practitioners are uniquely positioned to address mental health...",
    author: "Dr. Ahmed Hassan",
    publishedAt: "3 days ago",
    readTime: "11 min read",
    category: "Public Health",
    tags: ["Mental Health", "Public Health", "Population Health"],
    upvotes: 29,
    comments: 16
  },
  {
    id: "7",
    title: "Digital Health Technologies in Epidemiological Surveillance",
    excerpt: "Exploring how digital tools and technologies are revolutionizing disease surveillance and outbreak detection systems.",
    content: "The integration of digital health technologies has transformed epidemiological surveillance. From mobile health applications to artificial intelligence...",
    author: "Dr. Rachel Kim",
    publishedAt: "4 days ago", 
    readTime: "13 min read",
    category: "Epidemiology",
    tags: ["Digital Health", "Surveillance", "Technology"],
    upvotes: 37,
    comments: 22
  },
  {
    id: "8",
    title: "Health System Strengthening in Low-Resource Settings",
    excerpt: "Strategies for building resilient health systems in resource-constrained environments, focusing on sustainability and community engagement.",
    content: "Health system strengthening requires a comprehensive approach that addresses infrastructure, human resources, and governance. In low-resource settings...",
    author: "Dr. Patricia Okafor",
    publishedAt: "5 days ago",
    readTime: "14 min read", 
    category: "Global Health",
    tags: ["Global Health", "Health Systems", "Resource-Limited Settings"],
    upvotes: 41,
    comments: 19
  },
  {
    id: "9",
    title: "Evidence-Based Policy Making in Public Health",
    excerpt: "How to effectively translate research findings into actionable public health policies that improve population health outcomes.",
    content: "Evidence-based policy making is crucial for effective public health practice. The process involves systematic review of research evidence...",
    author: "Prof. David Miller",
    publishedAt: "1 week ago",
    readTime: "16 min read",
    category: "Policy",
    tags: ["Evidence-Based", "Policy", "Research Translation"],
    upvotes: 33,
    comments: 25
  },
  {
    id: "10",
    title: "Water, Sanitation, and Hygiene (WASH) in Emergency Settings",
    excerpt: "Critical considerations for maintaining WASH standards during humanitarian crises and natural disasters to prevent disease outbreaks.",
    content: "In emergency settings, maintaining adequate water, sanitation, and hygiene standards is crucial for preventing disease outbreaks. Humanitarian responses must...",
    author: "Dr. Elena Popov",
    publishedAt: "1 week ago",
    readTime: "12 min read",
    category: "Environmental Health", 
    tags: ["WASH", "Emergency Response", "Humanitarian Health"],
    upvotes: 26,
    comments: 14
  }
];