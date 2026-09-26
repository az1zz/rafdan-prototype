const demoData = {
  project: {
    prerequisiteCourse: {
      code: "CS 310",
      name: "Data Structure"
    },

    upcomingCourse: {
      code: "CS 412",
      name: "Algorithm Analysis and Design"
    },

    estimatedQuizMinutes: 8,
    overallReadiness: 66,

    scoring: {
      method: "Weighted average of concept scores. CRITICAL = 3, IMPORTANT = 2, HELPFUL = 1. Round the final value to the nearest whole percent.",
      readyThreshold: 80,
      needsReviewThreshold: 50
    }
  },

  bridgeConcepts: [
    {
      id: "BC1",
      name: "Arrays & Basic Sorting Manipulation",
      description: "Work confidently with indexed elements, ordering, insertion, and element movement in arrays.",
      importance: "IMPORTANT",
      prerequisiteSource: "CS 310 — Array Review and Sorting",
      upcomingTopics: [
        "Insertion Sort",
        "Heap Sort",
        "Quicksort"
      ],
      whyItMatters: "Sorting algorithms repeatedly compare, move, and reorganize elements in a sequence."
    },
    {
      id: "BC2",
      name: "Recursion",
      description: "Understand base cases, recursive calls, and how a problem can be reduced to smaller instances.",
      importance: "CRITICAL",
      prerequisiteSource: "CS 310 — Foundations of Recursion and Simple Recursive Function",
      upcomingTopics: [
        "Divide-and-Conquer",
        "Quicksort"
      ],
      whyItMatters: "Divide-and-conquer algorithms repeatedly solve smaller versions of the same problem."
    },
    {
      id: "BC3",
      name: "Stack & Queue Operations",
      description: "Correctly trace LIFO stack operations and FIFO queue operations.",
      importance: "IMPORTANT",
      prerequisiteSource: "CS 310 — Stack and Queue",
      upcomingTopics: [
        "Elementary Graph Algorithms"
      ],
      whyItMatters: "Traversal-oriented algorithms rely on disciplined management of which item is processed next."
    },
    {
      id: "BC4",
      name: "Trees & Binary Search Tree Foundations",
      description: "Understand tree structure, ordered search, insertion, and parent-child relationships.",
      importance: "CRITICAL",
      prerequisiteSource: "CS 310 — Trees, Binary Tree, Traversal, Insert, Delete and Binary Search",
      upcomingTopics: [
        "Red-Black Tree"
      ],
      whyItMatters: "Red-black trees extend ordered tree structures with additional balancing rules."
    },
    {
      id: "BC5",
      name: "Heap Fundamentals",
      description: "Understand heap ordering and the relationship between parent and child values.",
      importance: "CRITICAL",
      prerequisiteSource: "CS 310 — Heap",
      upcomingTopics: [
        "Heap Sort"
      ],
      whyItMatters: "Heap sort directly depends on understanding and maintaining the heap property."
    },
    {
      id: "BC6",
      name: "Graph Fundamentals",
      description: "Understand vertices, edges, adjacency, and basic graph representation.",
      importance: "CRITICAL",
      prerequisiteSource: "CS 310 — Graph Definition, Operations and Implementation",
      upcomingTopics: [
        "Elementary Graph Algorithms"
      ],
      whyItMatters: "Graph algorithms operate directly on relationships between vertices and their neighbors."
    }
  ],

  questions: [
    {
      id: "Q1",
      conceptId: "BC1",
      difficulty: "EASY",

      question: "The array [4, 7, 9] is kept in ascending order. If 6 is inserted while preserving that order, what should the array become?",

      options: [
        {
          id: "A",
          text: "[6, 4, 7, 9]"
        },
        {
          id: "B",
          text: "[4, 7, 6, 9]"
        },
        {
          id: "C",
          text: "[4, 6, 7, 9]"
        },
        {
          id: "D",
          text: "[4, 7, 9, 6]"
        }
      ],

      correctAnswer: "C",
      demoStudentAnswer: "C",
      correctExplanation: "6 belongs between 4 and 7, so the later elements must shift to preserve ascending order.",
      whyItMatters: "Sorting algorithms require accurate reasoning about element position and movement."
    },
    {
      id: "Q2",
      conceptId: "BC1",
      difficulty: "MEDIUM",

      question: "A = [8, 3, 5]. After executing temp = A[0]; A[0] = A[2]; A[2] = temp;, what is A?",

      options: [
        {
          id: "A",
          text: "[8, 3, 5]"
        },
        {
          id: "B",
          text: "[5, 3, 8]"
        },
        {
          id: "C",
          text: "[5, 8, 3]"
        },
        {
          id: "D",
          text: "[3, 8, 5]"
        }
      ],

      correctAnswer: "B",
      demoStudentAnswer: "B",
      correctExplanation: "The first and last elements are exchanged while the middle element remains unchanged.",
      whyItMatters: "Element swapping is a basic operation used throughout sorting algorithms."
    },
    {
      id: "Q3",
      conceptId: "BC2",
      difficulty: "EASY",

      question: "What is the main purpose of a base case in a recursive function?",

      options: [
        {
          id: "A",
          text: "To make every recursive call execute faster"
        },
        {
          id: "B",
          text: "To stop the recursive process when a terminating condition is reached"
        },
        {
          id: "C",
          text: "To automatically create a stack data structure"
        },
        {
          id: "D",
          text: "To sort the function's input"
        }
      ],

      correctAnswer: "B",
      demoStudentAnswer: "B",
      correctExplanation: "The base case provides the condition under which recursion stops.",
      whyItMatters: "Divide-and-conquer algorithms require recursive subproblems to eventually reach a terminating case."
    },
    {
      id: "Q4",
      conceptId: "BC2",
      difficulty: "MEDIUM",

      question: "Consider f(n): if n == 0 return 0; otherwise return n + f(n - 1). What is f(3)?",

      options: [
        {
          id: "A",
          text: "3"
        },
        {
          id: "B",
          text: "5"
        },
        {
          id: "C",
          text: "6"
        },
        {
          id: "D",
          text: "7"
        }
      ],

      correctAnswer: "C",
      demoStudentAnswer: "C",
      correctExplanation: "f(3) = 3 + 2 + 1 + 0 = 6.",
      whyItMatters: "Correctly tracing recursive calls is important before studying recursive algorithm-design techniques."
    },
    {
      id: "Q5",
      conceptId: "BC3",
      difficulty: "EASY",

      question: "A queue receives A, then B, then C. Which element is returned by the first dequeue operation?",

      options: [
        {
          id: "A",
          text: "A"
        },
        {
          id: "B",
          text: "B"
        },
        {
          id: "C",
          text: "C"
        },
        {
          id: "D",
          text: "It cannot be determined"
        }
      ],

      correctAnswer: "A",
      demoStudentAnswer: "A",
      correctExplanation: "A queue uses FIFO order, so the first inserted element is removed first.",
      whyItMatters: "Queue behavior is an important foundation for traversal-oriented algorithms."
    },
    {
      id: "Q6",
      conceptId: "BC3",
      difficulty: "MEDIUM",

      question: "A stack receives push(2), push(4), push(6), followed by one pop(). What value is now at the top?",

      options: [
        {
          id: "A",
          text: "2"
        },
        {
          id: "B",
          text: "4"
        },
        {
          id: "C",
          text: "6"
        },
        {
          id: "D",
          text: "The stack is empty"
        }
      ],

      correctAnswer: "B",
      demoStudentAnswer: "C",
      correctExplanation: "The pop removes 6, leaving 4 as the new top because a stack is LIFO.",
      whyItMatters: "Correct stack tracing supports understanding algorithms that maintain a last-added-first-processed frontier."
    },
    {
      id: "Q7",
      conceptId: "BC4",
      difficulty: "EASY",

      question: "In a standard binary search tree with root 10, which direction should a search for 14 take first?",

      options: [
        {
          id: "A",
          text: "Left"
        },
        {
          id: "B",
          text: "Right"
        },
        {
          id: "C",
          text: "Stay at the root"
        },
        {
          id: "D",
          text: "The direction cannot be determined"
        }
      ],

      correctAnswer: "B",
      demoStudentAnswer: "B",
      correctExplanation: "Values greater than the current node are searched in the right subtree.",
      whyItMatters: "Red-black trees preserve binary-search-tree ordering while adding balancing rules."
    },
    {
      id: "Q8",
      conceptId: "BC4",
      difficulty: "MEDIUM",

      question: "A binary search tree has root 8, left child 3, and right child 12. Where would 10 be inserted?",

      options: [
        {
          id: "A",
          text: "As the right child of 3"
        },
        {
          id: "B",
          text: "As the left child of 12"
        },
        {
          id: "C",
          text: "As the right child of 12"
        },
        {
          id: "D",
          text: "As the new root"
        }
      ],

      correctAnswer: "B",
      demoStudentAnswer: "B",
      correctExplanation: "10 is greater than 8 but less than 12, so it becomes part of 12's left subtree.",
      whyItMatters: "Ordered insertion is prerequisite knowledge for understanding more advanced search-tree structures."
    },
    {
      id: "Q9",
      conceptId: "BC5",
      difficulty: "EASY",

      question: "Which statement describes the ordering property of a max-heap?",

      options: [
        {
          id: "A",
          text: "Every parent is less than or equal to its children"
        },
        {
          id: "B",
          text: "Every parent is greater than or equal to its children"
        },
        {
          id: "C",
          text: "The left child must always be smaller than the right child"
        },
        {
          id: "D",
          text: "All leaf nodes must be stored in sorted order"
        }
      ],

      correctAnswer: "B",
      demoStudentAnswer: "A",
      correctExplanation: "In a max-heap, each parent has a value greater than or equal to the values of its children.",
      whyItMatters: "Heap sort depends directly on maintaining this ordering property."
    },
    {
      id: "Q10",
      conceptId: "BC5",
      difficulty: "MEDIUM",

      question: "A max-heap root has children 15 and 18. Without changing the children, which value could replace the root while still satisfying the parent-child heap property?",

      options: [
        {
          id: "A",
          text: "19"
        },
        {
          id: "B",
          text: "17"
        },
        {
          id: "C",
          text: "14"
        },
        {
          id: "D",
          text: "10"
        }
      ],

      correctAnswer: "A",
      demoStudentAnswer: "B",
      correctExplanation: "The root must be at least as large as both children. Only 19 is greater than or equal to 15 and 18.",
      whyItMatters: "Recognizing heap-order violations is necessary before understanding heap maintenance in Heap Sort."
    },
    {
      id: "Q11",
      conceptId: "BC6",
      difficulty: "EASY",

      question: "An undirected graph contains edges A-B, B-C, and C-D. Which vertices are directly adjacent to B?",

      options: [
        {
          id: "A",
          text: "A only"
        },
        {
          id: "B",
          text: "C only"
        },
        {
          id: "C",
          text: "A and C"
        },
        {
          id: "D",
          text: "A, C and D"
        }
      ],

      correctAnswer: "C",
      demoStudentAnswer: "C",
      correctExplanation: "B shares one edge with A and one edge with C.",
      whyItMatters: "Graph algorithms repeatedly inspect the neighbors adjacent to a vertex."
    },
    {
      id: "Q12",
      conceptId: "BC6",
      difficulty: "MEDIUM",

      question: "In an adjacency-list representation of an undirected edge X-Y, what should be stored?",

      options: [
        {
          id: "A",
          text: "Y appears in X's list only"
        },
        {
          id: "B",
          text: "X appears in Y's list only"
        },
        {
          id: "C",
          text: "Y appears in X's list and X appears in Y's list"
        },
        {
          id: "D",
          text: "Neither list stores the other vertex"
        }
      ],

      correctAnswer: "C",
      demoStudentAnswer: "A",
      correctExplanation: "An undirected edge connects both vertices in both directions, so each is recorded as a neighbor of the other.",
      whyItMatters: "Correct graph representation is foundational for later graph algorithms."
    }
  ],

  conceptResults: [
    {
      conceptId: "BC1",
      score: 100,
      status: "READY",
      explanation: "You accurately handled indexed element movement and swapping.",
      upcomingTopicsAffected: [
        "Insertion Sort",
        "Heap Sort",
        "Quicksort"
      ],
      whatCouldBecomeDifficult: "No immediate prerequisite issue detected."
    },
    {
      conceptId: "BC2",
      score: 100,
      status: "READY",
      explanation: "You correctly understand base cases and can trace recursive calls.",
      upcomingTopicsAffected: [
        "Divide-and-Conquer",
        "Quicksort"
      ],
      whatCouldBecomeDifficult: "No immediate prerequisite issue detected."
    },
    {
      conceptId: "BC3",
      score: 50,
      status: "NEEDS REVIEW",
      explanation: "You retained FIFO queue behavior but made an error when tracing a stack after pop().",
      upcomingTopicsAffected: [
        "Elementary Graph Algorithms"
      ],
      whatCouldBecomeDifficult: "Keeping track of which item should be processed next during traversal-oriented algorithms."
    },
    {
      conceptId: "BC4",
      score: 100,
      status: "READY",
      explanation: "You correctly reasoned about binary-search-tree search direction and insertion.",
      upcomingTopicsAffected: [
        "Red-Black Tree"
      ],
      whatCouldBecomeDifficult: "No immediate prerequisite issue detected."
    },
    {
      conceptId: "BC5",
      score: 0,
      status: "CRITICAL GAP",
      explanation: "You showed weakness in both the max-heap ordering rule and applying it to a parent-child relationship.",
      upcomingTopicsAffected: [
        "Heap Sort"
      ],
      whatCouldBecomeDifficult: "Understanding heap construction, identifying heap violations, and following the logic of Heap Sort."
    },
    {
      conceptId: "BC6",
      score: 50,
      status: "NEEDS REVIEW",
      explanation: "You can identify adjacent vertices but need to review how an undirected graph is represented.",
      upcomingTopicsAffected: [
        "Elementary Graph Algorithms"
      ],
      whatCouldBecomeDifficult: "Building and tracing the graph representation used by graph algorithms."
    }
  ],

  reviewPlan: [
    {
      priority: 1,
      conceptId: "BC5",
      conceptName: "Heap Fundamentals",
      reviewTopics: [
        "Max-heap ordering",
        "Parent-child relationships",
        "Identifying heap violations",
        "Restoring a valid heap relationship"
      ],
      estimatedTime: "35–45 minutes",
      suggestedExercise: "Check five small heaps for validity, explain every violation, then repair one invalid example.",
      reason: "Heap Sort is explicitly taught in CS 412 and directly depends on this structure.",
      expectedOutcome: "You should be able to inspect a heap and determine whether every parent-child relationship satisfies the heap property.",
      retestRecommended: true
    },
    {
      priority: 2,
      conceptId: "BC6",
      conceptName: "Graph Fundamentals",
      reviewTopics: [
        "Vertices and edges",
        "Adjacency",
        "Directed vs undirected edges",
        "Adjacency-list representation"
      ],
      estimatedTime: "30–40 minutes",
      suggestedExercise: "Convert three small graph diagrams into adjacency lists and list the neighbors of selected vertices.",
      reason: "CS 412 contains an Elementary Graph Algorithms unit.",
      expectedOutcome: "You should be able to read and construct a basic graph representation without confusing edge direction.",
      retestRecommended: true
    },
    {
      priority: 3,
      conceptId: "BC3",
      conceptName: "Stack & Queue Operations",
      reviewTopics: [
        "LIFO",
        "FIFO",
        "Push, pop and top",
        "Enqueue and dequeue"
      ],
      estimatedTime: "20–30 minutes",
      suggestedExercise: "Manually trace two stack operation sequences and two queue operation sequences.",
      reason: "Correct state management supports traversal-oriented algorithm reasoning.",
      expectedOutcome: "You should be able to predict the next element removed from a stack or queue without error.",
      retestRecommended: true
    }
  ],

  uiCopy: {
    landing: {
      headline: "Know what to review before Algorithms starts.",
      subtitle: "Rafdan checks only the Data Structure concepts that your upcoming Algorithm Analysis and Design course actually depends on.",
      cta: "Check my readiness"
    },

    courseConnection: {
      headline: "Your next course builds on selected Data Structure foundations.",
      explanation: "Rafdan mapped concepts from CS 310 to the parts of CS 412 that reuse them.",
      prerequisiteLabel: "Previous Course · CS 310 Data Structure",
      upcomingCourseLabel: "Upcoming Course · CS 412 Algorithm Analysis and Design",
      cta: "See the knowledge bridge"
    },

    knowledgeBridge: {
      headline: "6 prerequisite concepts matter most",
      explanation: "Instead of retesting the entire course, Rafdan focuses on the Data Structure concepts connected to sorting, divide-and-conquer, trees, heaps, and graph algorithms."
    },

    diagnosticIntro: {
      headline: "A focused 12-question readiness check",
      explanation: "Two questions per bridge concept. The goal is to find prerequisite gaps that could slow you down in CS 412.",
      numberOfQuestions: "12 questions",
      estimatedTime: "About 8 minutes",
      numberOfConcepts: "6 bridge concepts",
      cta: "Start diagnostic"
    },

    quiz: {
      progressLabel: "Question {current} of 12",
      previous: "Previous",
      next: "Next",
      submit: "View readiness",
      conceptLabel: "Testing prerequisite foundation"
    },

    analyzing: {
      messages: [
        "Mapping your prerequisite knowledge to CS 412...",
        "Checking readiness across the six bridge concepts...",
        "Prioritizing the gaps that matter for your upcoming course..."
      ]
    },

    results: {
      headline: "You are 66% ready for CS 412",
      overallReadinessStatement: "Overall prerequisite readiness: 66%",
      interpretation: "Your recursion, tree, and array foundations are strong, but heaps are a critical gap and graph and stack/queue foundations need review."
    },

    conceptBreakdown: {
      headline: "Your readiness by concept",
      explanation: "Each score reflects only the prerequisite knowledge connected to your upcoming course."
    },

    gaps: {
      headline: "Focus here before CS 412",
      explanation: "These gaps matter because they connect directly to topics you will meet in Algorithm Analysis and Design."
    },

    reviewPlan: {
      headline: "Your focused preparation plan",
      subtitle: "Review three targeted areas instead of repeating the entire Data Structure course.",
      cta: "Start with Heap Fundamentals"
    },

    reassessment: {
      headline: "Review. Reassess. Start stronger.",
      explanation: "Strengthen the weak concepts, then take the focused diagnostic again to confirm your readiness.",
      cta: "Reassess readiness",
      loop: "Assess → Review → Reassess"
    }
  }
};