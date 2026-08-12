import React, { useState, useEffect } from 'react';
import { 
  Clock,
  Coffee,
  Cpu,
  Terminal,
  Database,
  Server,
  Network,
  BrainCircuit,
  LineChart,
  MessageSquare,
  Lightbulb,
  Scale,
  Utensils,
  BookOpenText,
  ArrowLeft,
  ChevronRight,
  FileText,
  ExternalLink
} from 'lucide-react';

interface ScheduleSlot {
  name: string;
  time?: string;
  startTime: string; // 24hr format HH:mm e.g. "09:10"
  endTime: string;   // 24hr format HH:mm e.g. "10:00"
  room?: string;
  isLab?: boolean;
  isFree?: boolean;
  isLunch?: boolean;
  colSpan?: number;
}

interface DaySchedule {
  dayCode: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  dayName: string;
  preLunch: ScheduleSlot[];
  postLunch: ScheduleSlot[];
  mobilePreLunch: ScheduleSlot[];
  mobilePostLunch: ScheduleSlot[];
}

interface UnitDetail {
  unitNumber: number;
  title: string;
  hours?: string;
  paragraphs: Array<{
    boldPrefix?: string;
    text: string;
    boldInline?: string;
    textSuffix?: string;
  }>;
}

interface SyllabusSubject {
  id: string;
  name: string;
  code: string;
  icon: React.ElementType;
  units?: UnitDetail[];
}

export function App() {
  const [view, setView] = useState<'timetable' | 'syllabus' | 'subject-detail'>('timetable');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());

  // Ensure dark mode is strictly active
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Set active day to current day if Mon-Fri, and update clock every 10s
  useEffect(() => {
    const d = new Date();
    setNow(d);
    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      setActiveDayIdx(day - 1);
    }

    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Helper to check if a specific day and time slot is currently ongoing
  const isSlotActive = (dayCode: string, startTime: string, endTime: string): boolean => {
    const dayIndexMap: Record<number, string> = {
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
    };

    const currentDayCode = dayIndexMap[now.getDay()];
    if (currentDayCode !== dayCode) return false;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const currentMins = now.getHours() * 60 + now.getMinutes();

    return currentMins >= startMins && currentMins < endMins;
  };

  // Helper to match timetable slot name to syllabus subject ID
  const getSubjectIdFromName = (name: string): string | null => {
    if (name.includes('Advance Data Structure')) return 'ads';
    if (name.includes('AI & Application') || name.includes('Artificial Intelligence')) return 'ai';
    if (name.includes('OOP Java')) return 'java';
    if (name.includes('Operating System')) return 'os';
    if (name.includes('Database System')) return 'dbms';
    if (name.includes('Probability')) return 'prob';
    if (name.includes('Aptitude')) return 'aptitude';
    return null;
  };

  // Touch Swipe state for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const periodHeaders = [
    { period: 'I Period', time: '09:10 – 10:00' },
    { period: 'II Period', time: '10:00 – 10:50' },
    { period: 'III Period', time: '10:50 – 11:40' },
    { period: 'IV Period', time: '11:40 – 12:30' },
    { period: 'V Period', time: '12:30 – 01:20' },
    { period: 'Lunch', time: '01:20 – 02:20', isLunch: true },
    { period: 'VI Period', time: '02:20 – 03:10' },
    { period: 'VII Period', time: '03:10 – 04:00' },
    { period: 'VIII Period', time: '04:00 – 04:50' },
  ];

  const scheduleData: DaySchedule[] = [
    {
      dayCode: 'MON',
      dayName: 'Monday',
      preLunch: [
        { name: 'OOP Java', startTime: '09:10', endTime: '10:00' },
        { name: 'Probability & Statistics', startTime: '10:00', endTime: '10:50' },
        { name: 'AI & Application', startTime: '10:50', endTime: '11:40' },
        { name: 'Advance Data Structure', startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Operating System', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'OOP Java', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Probability & Statistics', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'AI & Application', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'Advance Data Structure', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'Advance Data Structure', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Operating System', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'TUE',
      dayName: 'Tuesday',
      preLunch: [
        { name: 'Soft Skills Essentials-1', startTime: '09:10', endTime: '10:00' },
        { name: 'OOP Java', startTime: '10:00', endTime: '10:50' },
        { name: 'Advance Data Structure', startTime: '10:50', endTime: '11:40' },
        { name: 'Operating System Lab', room: 'E211', isLab: true, startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Database System', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'Soft Skills Essentials-1', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'OOP Java', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'Advance Data Structure', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'Operating System Lab', room: 'E211', isLab: true, time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'Operating System Lab', room: 'E211', isLab: true, time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Database System', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'WED',
      dayName: 'Wednesday',
      preLunch: [
        { name: 'Operating System', startTime: '09:10', endTime: '10:00' },
        { name: 'Database System', startTime: '10:00', endTime: '10:50' },
        { name: 'OOP Java', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Aptitude-1', startTime: '14:20', endTime: '15:10' },
        { name: 'Constitution of India', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'Operating System', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Database System', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'OOP Java', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'AI & Application', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Aptitude-1', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'Constitution of India', time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'THU',
      dayName: 'Thursday',
      preLunch: [
        { name: 'Database System Lab', room: 'E206', isLab: true, startTime: '09:10', endTime: '10:50', colSpan: 2 },
        { name: 'Advance Data Structure', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', startTime: '11:40', endTime: '12:30' },
        { name: 'Database System', startTime: '12:30', endTime: '13:20' },
      ],
      postLunch: [
        { name: 'Probability & Statistics', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'Database System Lab', room: 'E206', isLab: true, time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Database System Lab', room: 'E206', isLab: true, time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'Advance Data Structure', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'Database System', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Probability & Statistics', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'FRI',
      dayName: 'Friday',
      preLunch: [
        { name: 'AI & Application', startTime: '09:10', endTime: '10:00' },
        { name: 'Operating System', startTime: '10:00', endTime: '10:50' },
        { name: 'Probability & Statistics', startTime: '10:50', endTime: '11:40' },
        { name: 'OOP Java', startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Advance Data Structure', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'AI & Application', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Operating System', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'Probability & Statistics', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'OOP Java', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'OOP Java', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Advance Data Structure', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
  ];

  // Syllabus Subjects ordered strictly as requested:
  // 1. Advance Data Structure, 2. Artificial Intelligence, 3. OOP Java, 4. Operating System, 5. Database System, 6. Probability & Statistics, 7. Aptitude-1
  const syllabusSubjects: SyllabusSubject[] = [
    {
      id: 'ads',
      name: 'Advance Data Structure',
      code: 'CS302B',
      icon: Network,
      units: [
        {
          unitNumber: 1,
          title: 'Introduction & Divide and Conquer Technique',
          paragraphs: [
            {
              boldPrefix: 'Introduction:',
              text: ' Algorithms, Analyzing algorithms - Orders of Magnitude (Asymptotic notations), Growth of functions (constant, logarithmic, linear, polynomial, exponential).'
            },
            {
              boldPrefix: 'Divide & Conquer Technique:',
              text: ' Binary search, Merge sort, Quick sort, Randomized quick sort, Efficiency analysis of sorting.'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Hashing',
          paragraphs: [
            {
              boldPrefix: 'Hashing & Searching Techniques:',
              text: ' Introduction, Hash table, Hash function, Collision resolution technique: Open hashing (Separate Chaining), Closed Hashing - Linear Probing, Quadratic probing, Double Hashing.'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Trees',
          paragraphs: [
            {
              boldPrefix: 'Tree:',
              text: ' Binary Trees, Binary Search Trees (BST), Threaded Binary Trees, Huffman coding,'
            },
            {
              boldPrefix: 'Balanced Trees:',
              text: ' AVL Tree & its operation (insertion, deletion).'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Graph',
          paragraphs: [
            {
              boldPrefix: 'Graphs:',
              text: ' Terminology, Sequential and linked Representations of Graphs: Adjacency Matrices, Adjacency List, Adjacency Multi list,'
            },
            {
              boldPrefix: 'Graph Traversal:',
              text: ' Depth First Search and Breadth First Search, Connected Component, Topological sort.'
            }
          ]
        },
        {
          unitNumber: 5,
          title: 'Advanced Data Structure',
          paragraphs: [
            {
              boldPrefix: 'Advanced Data Structure:',
              text: ' Binomial Heap, Operations on Binomial Heap, Trie data structures, Priority Queue, Disjoint data structure.'
            }
          ]
        }
      ]
    },
    {
      id: 'ai',
      name: 'Artificial Intelligence and its Applications',
      code: 'CS205B',
      icon: BrainCircuit,
      units: [
        {
          unitNumber: 1,
          title: 'Practical Foundations of Artificial Intelligence',
          paragraphs: [
            {
              boldPrefix: 'Introduction to AI and its Tools & Libraries-',
              text: ' Definition, History, and Evolution of AI, Key Domains: Machine Learning, Deep Learning, NLP, Computer Vision, AI Applications in Healthcare, Finance, and Robotics Python for AI: NumPy, Pandas, and Scikit-learn Introduction to TensorFlow/PyTorch Using Jupyter Notebooks for Experiments.'
            },
            {
              boldPrefix: 'Search Algorithms with Implementation-',
              text: ' Uninformed Search Strategies: BFS, DFS, Informed Search Strategies: A*, Greedy Best-First Search Constraint Satisfaction Problems (CSPs) BFS & DFS Implementation in Python Developing a Maze Solver using Search Algorithms Implementing A* Algorithm for Path Planning.'
            },
            {
              boldPrefix: 'Knowledge Representation & Ethics-',
              text: ' Propositional Logic and First-Order Logic, Knowledge Graphs and Ontologies Responsible AI Practices, Challenges of Fairness, Transparency, and Explainability Implementing Logic-Based Systems with Python Libraries Building a Rule-Based Expert System.'
            },
            {
              boldPrefix: 'Mini Projects:',
              text: ' Implement a Tic-Tac-Toe AI using Minimax Algorithm Create a Pathfinding Visualizer for BFS/DFS/A*'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Foundations of Agentic AI and Intelligent Agents',
          paragraphs: [
            {
              boldPrefix: 'Introduction to Agents and Agent Environments-',
              text: ' Definition and Characteristics of Agents Types of Agents: Reflex, Goal-Based, Utility-Based Agent Environments: Fully vs. Partially Observable.'
            },
            {
              boldPrefix: 'Designing and Implementing Simple Agents in Python-',
              text: ' Build Reflex and Goal-Based Agents Smart Vacuum Cleaner Simulation Self-Navigating Agent in a Virtual Grid.'
            },
            {
              boldPrefix: 'Multi-Agent Systems and Distributed AI-',
              text: ' Overview of Multi-Agent Systems (MAS) Coordination and Communication in MAS Real-World Applications: Smart Grids, Collaborative Robot.'
            },
            {
              boldPrefix: 'Decision-Making and Agent Intelligence-',
              text: ' Introduction to Markov Decision Processes (MDPs) Basics of Game Theory and Nash Equilibrium Designing Rule-Based Decision Logic.'
            },
            {
              boldPrefix: 'Mini Project:',
              text: ' Build a Reflex Agent for Maze Navigation'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Learning Agents and Practical Agentic AI Systems',
          paragraphs: [
            {
              boldPrefix: 'Learning Agents and Reinforcement Learning-',
              text: ' Learning Agents: Characteristics and Architectures Reinforcement Learning Fundamentals Introduction to OpenAI Gym.'
            },
            {
              boldPrefix: 'Implementing RL Algorithms-',
              text: ' Q-Learning: Concepts and Python Implementation Deep Q-Networks (DQN): Architecture and Training Visualizing Agent Learning Progress.'
            },
            {
              boldPrefix: 'Agentic AI for Games and Simulation-',
              text: ' Develop AI Agent for Snake or Flappy Bird Case Study: Self-Learning Bot in a Custom Game Reward Shaping and Environment Design.'
            },
            {
              boldPrefix: 'Advanced Multi-Agent Learning and Simulations-',
              text: ' Cooperative and Competitive Agents Traffic Control Simulation using Multi-Agent Systems, Reinforcement Learning in Multi-Agent Scenarios.'
            },
            {
              boldPrefix: 'Mini Projects -',
              text: ' Solve Frozen Lake Environment using Q-Learning'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Genetic Algorithms & Applications',
          paragraphs: [
            {
              boldPrefix: 'Fundamentals of Evolutionary Computation-',
              text: ' Introduction to Evolutionary Algorithms, Darwinian Principles: Selection, Mutation, Crossover. Genetic Algorithm Workflow and Structure.'
            },
            {
              boldPrefix: 'Core Components of Genetic Algorithms-',
              text: ' Chromosome Representation Techniques, Fitness Functions and Selection Strategies, Crossover Techniques (One-point, Two-point, Uniform), Mutation Methods.'
            },
            {
              boldPrefix: 'Implementing Genetic Algorithms in Python-',
              text: ' Writing a Basic GA from Scratch, Custom Fitness Function Design, Visualizing GA Evolution with Matplotlib.'
            },
            {
              boldPrefix: 'Advanced Techniques and Hybridization-',
              text: ' Elitism and Diversity Preservation, Parameter Tuning for Performance Optimization, Hybrid GAs: Integration with Local Search and Simulated Annealing, Introduction to Memetic Algorithms.'
            },
            {
              boldPrefix: 'Practical Applications-',
              text: ' Solving the Traveling Salesman Problem (TSP), Feature Selection in Machine Learning, Scheduling and Resource Allocation Problems, Autonomous Route Planning (e.g., for vehicles or drones)'
            },
            {
              boldPrefix: 'Mini Project -',
              text: ' Solve Optimal Timetable Scheduling for a University'
            }
          ]
        }
      ]
    },
    {
      id: 'java',
      name: 'Object-Oriented Programming Using Java',
      code: 'CS336B',
      icon: Coffee,
      units: [
        {
          unitNumber: 1,
          title: 'Java Basics',
          paragraphs: [
            {
              text: 'Class, Object, Constructors, Methods, Access Specifies, Static Members, Final Members, Abstraction, Inheritance, Encapsulation, Polymorphism, Interface, Exceptions: Use of try, catch, finally, throw, throws, In built and User Defined Exceptions, Checked and Un-Checked Exceptions. Thread, Thread Life Cycle, Creating Threads, Thread Priorities, Synchronization.'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Java Collections',
          paragraphs: [
            {
              text: 'Collection in Java, Collection Framework in Java, Hierarchy of Collection Framework, Iterator Interface, Collection Interface, List Interface, ArrayList, LinkedList, Vector, Stack, Queue Interface, Set Interface, HashSet, LinkedHashSet, Sorted Set Interface, TreeSet, Map Interface, HashMap Class, Linked HashMap Class, TreeMap Class, Hashtable Class, Sorting, Comparable Interface, Comparator Interface, Properties Class in Java.'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Advance Java Features',
          paragraphs: [
            {
              text: 'Functional Interfaces, Lambda Expression, Method References, Stream API, Default Methods, Static Method, For Each Method, Try-with-resources, Java Module System, Diamond Syntax with Inner Anonymous Class, Local Variable Type Inference, Switch Expressions, Yield Keyword, Text Blocks, Records, Sealed Classes.'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Advance Java: Spring',
          paragraphs: [
            {
              text: 'Java Database Connectivity (JDBC): JDBC Drivers, JDBC with CRUD operations using MySQL; MVC, Spring Core Basics, Spring Dependency Injection concepts, Spring Inversion of Control, AOP, Bean Scopes- Singleton, Prototype, Request, Session, Application, Web Socket, Auto wiring, Annotations, Life Cycle Call backs, Bean Configuration styles.'
            }
          ]
        },
        {
          unitNumber: 5,
          title: 'Advance Java: Spring boot',
          paragraphs: [
            {
              text: 'Spring Boot Build Systems, Spring Boot Code Structure, Spring Boot Runners, Logger, Building Restful Web Services, Rest Controller, Request Mapping, Request Body, Path, Variable, Request Parameter, GET, POST, PUT, DELETE APIs, Build Web Applications.'
            }
          ]
        }
      ]
    },
    {
      id: 'os',
      name: 'Operating System',
      code: 'CS206L',
      icon: Cpu,
      units: [
        {
          unitNumber: 1,
          title: 'Introduction of Operating System',
          paragraphs: [
            {
              boldPrefix: 'Introduction:',
              text: ' Operating system Components and its services, Classification of Operating systems- Batch system, Time sharing, Real Time System, Multiprocessor Systems, Multiuser Systems, Multiprocess Systems, Multithreaded Systems, Operating System Structure- Layered structure, Reentrant Kernels, Monolithic and Microkernel Systems. System Calls, Elementary Linux commands and Shell Scripting.'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Process Scheduling and Resource Management',
          paragraphs: [
            {
              boldPrefix: 'Introduction to Process:',
              text: ' Process States, State Transition Diagram, Schedulers, Process Control Block (PCB), Threads and their management,'
            },
            {
              boldPrefix: 'CPU Scheduling:',
              text: ' Concepts, Performance Criteria, Scheduling Algorithms.'
            },
            {
              boldPrefix: 'Deadlock:',
              text: ' System model, Deadlock characterization, Prevention, Avoidance and detection, Recovery from deadlock.'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Concurrent Processes',
          paragraphs: [
            {
              boldPrefix: 'Concurrent Processes:',
              text: ' Principle of Concurrency, Critical Section Problem, Mutual Exclusion, Dekker’s solution, Peterson’s solution, Semaphores, Monitors, Test and Set operation; Classical Problem in Concurrency- Producer / Consumer Problem, Reader Writer Problem, Dining Philosopher Problem, Sleeping Barber Problem; Inter Process Communication models (IPC).'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Memory Management',
          paragraphs: [
            {
              boldPrefix: 'Memory Management:',
              text: ' Basic bare machine, Resident monitor, Multiprogramming with fixed partitions and variable partitions, Protection schemes, Paging, Segmentation, Paged segmentation, Virtual memory concepts, Demand paging, Performance of demand paging, Page replacement algorithms, Thrashing.'
            }
          ]
        },
        {
          unitNumber: 5,
          title: 'I/O Management and Disk Scheduling:',
          paragraphs: [
            {
              text: 'File Systems and I/O Management of Windows and Linux.'
            },
            {
              boldPrefix: 'Disk Scheduling:',
              text: ' Disk storage structure and disk scheduling algorithms, RAID.'
            },
            {
              boldPrefix: 'Case Study:',
              text: ' Introduction to Android and Mac Operating System, The Evolution of Mobile Operating Systems: iOS vs. Android'
            }
          ]
        }
      ]
    },
    {
      id: 'dbms',
      name: 'Database System',
      code: 'IT301L',
      icon: Database,
      units: [
        {
          unitNumber: 1,
          title: 'Introduction to Database System',
          paragraphs: [
            {
              text: 'Database System vs File System, Database System Concept and Architecture, Data Model Schema and Instances, Data Independence and its Types, Overall Database Structure.'
            },
            {
              boldPrefix: 'Entity Relationship Model:',
              text: ' ER Model Concepts, Notation for ER Diagram, Mapping Constraints, Key attribute, Generalization, Aggregation, Reduction of an ER Diagrams to Tables.'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Relational data Model',
          paragraphs: [
            {
              text: 'Relational Data Model Concepts, type of keys, Integrity Constraints- Entity integrity and referential integrity, Keys Constraints, Domain Constraints, Relational Algebra-Unary Relational Operations- SELECT and PROJECT, Binary Relational Operations-CROSS, JOIN and DIVISION, Queries in Relational Algebra.'
            },
            {
              boldPrefix: 'Database Implementation using SQL:',
              text: ' Introduction to SQL, Characteristics of SQL, SQL Data Types, Basic Queries in SQL- create, select Insert, Delete and Update Statements, concepts of group by and having, order by, Sub Queries, Aggregate Functions, Joins, Unions, Intersection, Minus, Views.'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Database Design and Normalization',
          paragraphs: [
            {
              text: 'Functional Dependencies, Inference rules, Closure of attributes, FD equivalence and Minimal cover.'
            },
            {
              boldPrefix: 'Normalization:',
              text: ' Normal forms, first, second, third normal forms, and BCNF. Lossless join decompositions, Dependency Preservation, Multi-valued Dependencies and Fourth Normal Form, Join Dependencies and Fifth Normal Form.'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Transaction Processing',
          paragraphs: [
            {
              text: 'Transaction and its States, ACID property, Transaction Scheduling, Serializability of scheduling, Conflict, and View Serializability'
            },
            {
              boldPrefix: 'Concurrency Control Techniques:',
              text: ' Concurrency Control, Locking Techniques for Concurrency Control, Two-phase locking techniques for concurrency control, Time Stamping Protocols for Concurrency Control'
            }
          ]
        },
        {
          unitNumber: 5,
          title: 'Database Recovery Techniques',
          paragraphs: [
            {
              text: 'Recovery Concepts, Recoverability, Log Based Recovery, Checkpoints, Shadow Paging, The ARIES recovery, Deadlock Handling'
            },
            {
              boldPrefix: 'PL/SQL:',
              text: ' Introduction, features, syntax, DDL within Pl/SQL, DML in PL/SQL, Cursors, stored procedures, stored function, database triggers, indexing, ',
              boldInline: 'Case Study-Microsoft Azure SQL.',
              textSuffix: ''
            }
          ]
        }
      ]
    },
    {
      id: 'prob',
      name: 'Probability and Statistics',
      code: 'MA105L',
      icon: LineChart,
      units: [
        {
          unitNumber: 1,
          title: 'Basic Statistics',
          paragraphs: [
            {
              text: 'Introduction to Descriptive Statistics, Measure of Central Tendency, Histogram in sampling, Method of least square (basic concept), Fitting of Straight line and exponential curve, Correlation, Rank correlation and Regression Analysis.'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Probability I',
          paragraphs: [
            {
              text: 'Probability, Law of total Probability, Conditional Probability, Baye’s Theorem, Discrete Random Variable, Probability Mass function. Binomial Distribution, Poisson Distribution., Introduction to confusion matrix.'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Probability II',
          paragraphs: [
            {
              text: 'Continuous Random Variable, Probability density function, Properties of Probability density function, Expectation and variance, Normal Distribution and its applications.'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Bivariate Random Variable and Time Series',
          paragraphs: [
            {
              text: 'Introduction to two-dimensional random variable, Joint probability density function and its properties, Marginal probability distribution. Introduction to Time series, component of time series, Measure of trend (Graphic method, method of Averages).'
            }
          ]
        },
        {
          unitNumber: 5,
          title: 'Sampling Theory',
          paragraphs: [
            {
              text: 'Introduction to Inferential Statistics, ',
              boldInline: 'Testing of Hypothesis:',
              textSuffix: ' Introduction, Sampling Theory (Small and Large), Hypothesis, Null hypothesis, Alternative hypothesis, Testing a Hypothesis, Level of significance, Confidence limits, t-test, Chi-square test, one way analysis of variance (ANOVA).'
            }
          ]
        }
      ]
    },
    {
      id: 'aptitude',
      name: 'Aptitude-1',
      code: 'HS110L',
      icon: Lightbulb,
      units: [
        {
          unitNumber: 1,
          title: 'Series, Coding and Encoding',
          paragraphs: [
            {
              text: 'Importance and overview of Quantitative Aptitude and Logical Reasoning, Number Series, Letter Series, Analogies, Coding and decoding.'
            }
          ]
        },
        {
          unitNumber: 2,
          title: 'Data Arrangement',
          paragraphs: [
            {
              text: 'Ranking and Order, Direction Sense, Linear and Circular sitting arrangement.'
            }
          ]
        },
        {
          unitNumber: 3,
          title: 'Blood Relation and Puzzles',
          paragraphs: [
            {
              text: 'Basic concepts, definition and terminology related to blood relationships, Conversation-based blood relationships, Family Tree-based problems, Coded relationships and related puzzles.'
            }
          ]
        },
        {
          unitNumber: 4,
          title: 'Critical and Non-Verbal Reasoning',
          paragraphs: [
            {
              text: 'Statement arguments, course of action, classification and grouping of images, Figure series, Mirror image, Water image, Paper cutting, Paper folding, Embedded figures.'
            }
          ]
        }
      ]
    },
  ];

  // Helper to render SVG inside a rounded black box for mobile view
  const renderSubjectIconBox = (name: string) => {
    const iconClass = "w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2]";

    let Icon = Coffee;
    if (name.includes('OOP Java')) Icon = Coffee;
    else if (name.includes('Operating System Lab')) Icon = Terminal;
    else if (name.includes('Operating System')) Icon = Cpu;
    else if (name.includes('Database System Lab')) Icon = Server;
    else if (name.includes('Database System')) Icon = Database;
    else if (name.includes('Advance Data Structure')) Icon = Network;
    else if (name.includes('AI & Application')) Icon = BrainCircuit;
    else if (name.includes('Probability')) Icon = LineChart;
    else if (name.includes('Soft Skills')) Icon = MessageSquare;
    else if (name.includes('Aptitude')) Icon = Lightbulb;
    else if (name.includes('Constitution')) Icon = Scale;
    else if (name.includes('LUNCH')) Icon = Utensils;

    return (
      <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-900 border border-neutral-800 shadow-md shadow-black/60 shrink-0 flex items-center justify-center">
        <Icon className={iconClass} />
      </div>
    );
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveDayIdx((prev) => (prev < scheduleData.length - 1 ? prev + 1 : 0));
    } else if (isRightSwipe) {
      setActiveDayIdx((prev) => (prev > 0 ? prev - 1 : scheduleData.length - 1));
    }
  };

  const currentDaySchedule = scheduleData[activeDayIdx];

  // Mobile list excludes FREE slots completely as requested
  const mobileVerticalList: ScheduleSlot[] = [
    ...currentDaySchedule.mobilePreLunch.filter((slot) => !slot.isFree),
    { name: 'LUNCH BREAK', isLunch: true, time: '01:20 PM – 02:20 PM', startTime: '13:20', endTime: '14:20' },
    ...currentDaySchedule.mobilePostLunch.filter((slot) => !slot.isFree),
  ];

  const selectedSubject = syllabusSubjects.find((sub) => sub.id === selectedSubjectId);

  return (
    <div className="bg-black text-white font-sans select-none min-h-screen w-full relative">

      {view === 'subject-detail' && selectedSubject ? (
        /* ========================================================================= */
        /* SUBJECT DETAIL PAGE (Active when view === 'subject-detail')              */
        /* ========================================================================= */
        <div className="min-h-screen w-full max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white flex flex-col space-y-6">
          
          {/* Subject Detail Navbar */}
          <header className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
            <button
              onClick={() => setView('syllabus')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.96] active:bg-neutral-800 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Syllabus List</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-300">
                {selectedSubject.code}
              </span>
            </div>
          </header>

          {/* Subject Header */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-800 bg-neutral-950/80">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 shadow-md shrink-0 flex items-center justify-center">
              {React.createElement(selectedSubject.icon, { className: "w-6 h-6 text-white stroke-[2]" })}
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-neutral-400 block">
                Course Syllabus • {selectedSubject.code}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedSubject.name}
              </h1>
            </div>
          </div>

          {/* Units Syllabus List */}
          <div className="space-y-4 flex-1">
            {selectedSubject.units && selectedSubject.units.length > 0 ? (
              selectedSubject.units.map((unit) => (
                <div
                  key={unit.unitNumber}
                  className="p-4 sm:p-6 rounded-2xl border border-neutral-800 bg-black space-y-3 transition-all"
                >
                  {/* Unit Title Header Row (Increased font size accordingly) */}
                  <div className="pb-2.5 border-b border-neutral-800/80">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      Unit {unit.unitNumber} &nbsp;—&nbsp; {unit.title}
                    </h2>
                  </div>

                  {/* Unit Paragraph Content */}
                  <div className="space-y-3 pt-1.5 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                    {unit.paragraphs.map((para, pIdx) => (
                      <p key={pIdx}>
                        {para.boldPrefix && (
                          <strong className="font-extrabold text-white">
                            {para.boldPrefix}
                          </strong>
                        )}
                        <span>{para.text}</span>
                        {para.boldInline && (
                          <strong className="font-extrabold text-white">
                            {para.boldInline}
                          </strong>
                        )}
                        {para.textSuffix && <span>{para.textSuffix}</span>}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-950/60 text-center text-neutral-500 font-medium">
                Syllabus content for {selectedSubject.name} will be added soon...
              </div>
            )}
          </div>

        </div>
      ) : view === 'syllabus' ? (
        /* ========================================================================= */
        /* SYLLABUS LIST PAGE (Active when view === 'syllabus')                      */
        /* ========================================================================= */
        <div className="min-h-screen w-full max-w-4xl mx-auto p-4 sm:p-6 bg-black text-white flex flex-col space-y-6">
          
          {/* Syllabus Navbar Header */}
          <header className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
            <button
              onClick={() => setView('timetable')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.96] active:bg-neutral-800 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Timetable</span>
            </button>
          </header>

          {/* Centered Main Heading directly under Navbar with Double-Scratch Hand-drawn Underline */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center">
            <div className="flex items-center gap-2.5">
              <BookOpenText className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Course Syllabus
              </h1>
            </div>
            
            {/* Real Double Scratch Hand-Drawn SVG Underline (Left-to-Right + Right-to-Left loop back) */}
            <svg 
              className="w-48 sm:w-56 h-5 mt-1 text-white opacity-95 overflow-visible" 
              viewBox="0 0 200 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* First scratch stroke: Left to Right */}
              <path 
                d="M 6 8 C 50 3, 110 13, 194 7" 
                stroke="currentColor" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Second scratch stroke: Right to Left loop back */}
              <path 
                d="M 188 14 C 140 20, 60 11, 14 18" 
                stroke="currentColor" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.85"
              />
            </svg>
          </div>

          {/* Subjects Syllabus List */}
          <div className="space-y-3 flex-1">
            {syllabusSubjects.map((sub) => {
              const Icon = sub.icon;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setView('subject-detail');
                  }}
                  className="p-4 sm:p-5 rounded-2xl border border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 active:border-neutral-600 active:scale-[0.98] active:bg-neutral-900 transition-all duration-150 shadow-sm flex items-center justify-between gap-3 cursor-pointer group"
                >
                  {/* Subject Icon Box & Name + Code Only */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-900 border border-neutral-800 shadow-md shrink-0 flex items-center justify-center group-hover:border-neutral-700 transition">
                      <Icon className="w-5 h-5 text-white stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate group-hover:text-neutral-200 transition">
                        {sub.name}
                      </h2>
                      <span className="text-xs font-mono font-bold text-neutral-400 block mt-0.5">
                        {sub.code}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition shrink-0" />
                </div>
              );
            })}
          </div>

          {/* Ultra-Clean Responsive Course Booklet PDF Card with Minimalistic Touch Feedback */}
          <div className="pt-3 pb-4">
            <a
              href="/csok.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 sm:p-5 rounded-2xl border border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800/90 hover:border-neutral-500 active:scale-[0.98] active:border-neutral-400 active:bg-neutral-800/90 transition-all duration-150 shadow-lg shadow-black/80 flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white text-black shadow-md shrink-0 flex items-center justify-center group-hover:scale-105 transition transform">
                  <FileText className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                      Open Course Booklet
                    </h2>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 shrink-0 uppercase tracking-wider">
                      PDF
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs font-medium text-neutral-400 mt-1 leading-snug">
                    View official course booklet document
                  </p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-black border border-neutral-800 text-white group-hover:border-neutral-600 transition shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-xs">
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* TIMETABLE VIEW (Active when view === 'timetable')                       */
        /* ========================================================================= */
        <>
          {/* ================= DESKTOP & LANDSCAPE MOBILE VIEW (md and up) ================= */}
          <div className="hidden md:flex flex-col min-h-screen w-full bg-black">
            
            <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 flex-1 flex flex-col">
              {/* Desktop / Landscape Header with Syllabus Button */}
              <header className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 shrink-0">
                <div>
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase text-white">
                    Btech CS3B
                  </h1>
                  <p className="text-[11px] sm:text-sm font-semibold text-neutral-400">
                    Classroom: <span className="font-extrabold text-white">E112</span> • Timetable
                  </p>
                </div>

                {/* Syllabus Button on Desktop Header */}
                <button
                  onClick={() => setView('syllabus')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-700 active:scale-[0.96] text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-xs"
                >
                  <BookOpenText className="w-4 h-4 text-white" />
                  <span>Syllabus</span>
                </button>
              </header>

              {/* Desktop / Landscape Scrollable Grid Container */}
              <main className="flex-1 w-full border border-neutral-800 rounded overflow-x-auto overflow-y-auto flex flex-col min-h-[460px] bg-black">
                <table className="w-full h-full min-h-[440px] border-collapse text-center table-fixed">
                  <thead>
                    <tr className="bg-black text-white border-b border-neutral-800 font-bold text-xs sm:text-sm">
                      <th className="w-[7%] border-r border-neutral-800 py-2 bg-black uppercase tracking-wider text-neutral-300">
                        DAY
                      </th>
                      
                      {periodHeaders.map((header, idx) => (
                        <th
                          key={idx}
                          className={`border-r border-neutral-800 py-1 px-1 bg-black ${
                            header.isLunch ? 'w-[6%] font-extrabold text-white' : ''
                          }`}
                        >
                          <div className="font-extrabold truncate text-white text-xs sm:text-sm">{header.period}</div>
                          <div className="text-[9.5px] sm:text-xs font-normal font-mono text-neutral-400">
                            {header.time}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-800 font-medium text-xs sm:text-sm bg-black">
                    {scheduleData.map((dayRow, dayIdx) => (
                      <tr key={dayRow.dayCode} className="h-[19%] min-h-[70px] border-b border-neutral-800 bg-black">
                        
                        {/* Day Header Column */}
                        <td className="font-black text-xs sm:text-base border-r border-neutral-800 bg-black text-white uppercase tracking-wider">
                          {dayRow.dayCode}
                        </td>

                        {/* Pre-Lunch Slots (P1 to P5) */}
                        {dayRow.preLunch.map((slot, slotIdx) => {
                          const active = isSlotActive(dayRow.dayCode, slot.startTime, slot.endTime);
                          const subjectId = !slot.isFree ? getSubjectIdFromName(slot.name) : null;

                          return (
                            <td
                              key={`pre-${slotIdx}`}
                              colSpan={slot.colSpan || 1}
                              onClick={() => {
                                if (subjectId) {
                                  setSelectedSubjectId(subjectId);
                                  setView('subject-detail');
                                }
                              }}
                              className={`p-1 align-middle bg-black text-white font-bold transition-all ${
                                subjectId ? 'cursor-pointer hover:bg-neutral-900/80 active:scale-[0.98]' : ''
                              } ${
                                active
                                  ? 'border-2 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20'
                                  : 'border-r border-neutral-800'
                              }`}
                            >
                              {!slot.isFree && (
                                <div className="flex flex-col items-center justify-center h-full space-y-0.5">
                                  <span className="leading-tight text-center font-extrabold text-[11px] sm:text-xs md:text-sm text-white">
                                    {slot.name}
                                  </span>
                                  {slot.room && (
                                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 shadow-xs">
                                      {slot.room}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Lunch Column (Merged Vertically across all 5 rows) */}
                        {dayIdx === 0 && (
                          <td
                            rowSpan={5}
                            className="border-r border-neutral-800 bg-black text-neutral-300 font-black text-sm sm:text-lg align-middle"
                          >
                            <div className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-4 font-black tracking-widest text-neutral-300">
                              <span>L</span>
                              <span>U</span>
                              <span>N</span>
                              <span>C</span>
                              <span>H</span>
                            </div>
                          </td>
                        )}

                        {/* Post-Lunch Slots (P6 to P8) */}
                        {dayRow.postLunch.map((slot, slotIdx) => {
                          const active = isSlotActive(dayRow.dayCode, slot.startTime, slot.endTime);
                          const subjectId = !slot.isFree ? getSubjectIdFromName(slot.name) : null;

                          return (
                            <td
                              key={`post-${slotIdx}`}
                              colSpan={slot.colSpan || 1}
                              onClick={() => {
                                if (subjectId) {
                                  setSelectedSubjectId(subjectId);
                                  setView('subject-detail');
                                }
                              }}
                              className={`p-1 align-middle bg-black text-white font-bold transition-all ${
                                subjectId ? 'cursor-pointer hover:bg-neutral-900/80 active:scale-[0.98]' : ''
                              } ${
                                active
                                  ? 'border-2 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20'
                                  : 'border-r border-neutral-800'
                              }`}
                            >
                              {!slot.isFree && (
                                <div className="flex flex-col items-center justify-center h-full space-y-0.5">
                                  <span className="leading-tight text-center font-extrabold text-[11px] sm:text-xs md:text-sm text-white">
                                    {slot.name}
                                  </span>
                                  {slot.room && (
                                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 shadow-xs">
                                      {slot.room}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </main>
            </div>

          </div>


          {/* ================= PORTRAIT MOBILE VIEW (screen width < md) ================= */}
          <div 
            className="flex md:hidden flex-col min-h-screen w-full bg-black text-white p-4 space-y-4"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Mobile Heading with Syllabus Button */}
            <div className="border-b border-neutral-800 pb-2.5 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-white">
                  Btech CS3B
                </h1>
                <p className="text-xs font-semibold text-neutral-400">
                  Classroom: <span className="text-white font-extrabold">E112</span>
                </p>
              </div>

              {/* Syllabus Button on Mobile Header */}
              <button
                onClick={() => setView('syllabus')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 active:scale-[0.95] active:bg-neutral-800 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
              >
                <BookOpenText className="w-4 h-4 text-white" />
                <span>Syllabus</span>
              </button>
            </div>

            {/* Clean Borderless Day Selector Tabs with Smooth Gliding Underline */}
            <div className="pb-2 pt-1">
              <div className="grid grid-cols-5 relative">
                {scheduleData.map((d, idx) => {
                  const isSelected = idx === activeDayIdx;

                  return (
                    <button
                      key={d.dayCode}
                      onClick={() => setActiveDayIdx(idx)}
                      className={`relative py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer text-center active:scale-[0.94] ${
                        isSelected ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <span>{d.dayCode}</span>
                    </button>
                  );
                })}

                {/* Smooth Gliding Active Underline Indicator */}
                <span 
                  className="absolute bottom-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm shadow-white/60"
                  style={{
                    left: `calc(${activeDayIdx * 20}% + 10%)`,
                    transform: 'translateX(-50%)',
                    width: '32px'
                  }}
                />
              </div>
            </div>

            {/* Vertically Aligned Subjects List */}
            <div key={activeDayIdx} className="flex-1 space-y-2.5 pt-0.5 animate-seamless-mist">
              {mobileVerticalList.map((item, idx) => {
                const active = isSlotActive(currentDaySchedule.dayCode, item.startTime, item.endTime);
                const subjectId = !item.isFree && !item.isLunch ? getSubjectIdFromName(item.name) : null;

                if (item.isLunch) {
                  return (
                    <div
                      key={`mobile-lunch-${idx}`}
                      className={`p-3.5 rounded-xl text-center font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        active
                          ? 'border-2 border-emerald-400 bg-neutral-950 text-emerald-300'
                          : 'border border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      {renderSubjectIconBox('LUNCH')}
                      <div className="flex flex-col items-center">
                        <span>L U N C H &nbsp; B R E A K</span>
                        {item.time && (
                          <div className="flex items-center gap-1 text-[9.5px] font-semibold text-neutral-400 tracking-tight mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                            <span>{item.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`mobile-item-${idx}`}
                    onClick={() => {
                      if (subjectId) {
                        setSelectedSubjectId(subjectId);
                        setView('subject-detail');
                      }
                    }}
                    className={`p-3.5 rounded-xl bg-black text-white transition-all ${
                      subjectId ? 'cursor-pointer active:scale-[0.98] active:bg-neutral-900' : ''
                    } ${
                      active
                        ? 'border-2 border-emerald-400 shadow-sm shadow-emerald-500/10'
                        : 'border border-neutral-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      
                      {/* Rounded Black Box SVG Icon + Subject Name & Minimal Time */}
                      <div className="flex items-center gap-3 min-w-0">
                        {renderSubjectIconBox(item.name)}
                        <div className="min-w-0">
                          <span className="font-extrabold text-base leading-tight text-white block truncate">
                            {item.name}
                          </span>
                          {item.time && (
                            <div className="flex items-center gap-1 text-[9.5px] font-semibold text-neutral-400 tracking-tight mt-0.5">
                              <Clock className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                              <span>{item.time}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.room && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white shrink-0">
                          {item.room}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default App;
