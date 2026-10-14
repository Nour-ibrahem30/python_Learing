// =============================================
// بيانات الفيديوهات - من توثيق Python الرسمي
// =============================================
// كل فيديو مبني على قسم من Python Tutorial
// https://docs.python.org/3/tutorial/
// =============================================

export const lessons = [
  // === الأساسيات (Getting Started) ===
  {
    id: 'whetting-appetite',
    slug: 'whetting-appetite',
    title: 'Whetting Your Appetite',
    titleAr: 'ليه Python؟ وليه تتعلمها؟',
    desc: 'مقدمة عن Python وليه هي لغة مميزة للمبتدئين والمحترفين.',
    category: 'basics',
    label: 'الأساسيات',
    code: 'print("Hello, Python!")',
    theme: 'blue',
    number: '01',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/appetite.html',
    docsSection: '1. Whetting Your Appetite',
    topics: ['لماذا Python؟', 'مميزات اللغة', 'استخداماتها']
  },
  {
    id: 'using-interpreter',
    slug: 'using-interpreter',
    title: 'Using the Python Interpreter',
    titleAr: 'إزاي تشغّل Python على جهازك',
    desc: 'تثبيت Python واستخدام الـ Interpreter والـ Interactive Mode.',
    category: 'basics',
    label: 'الأساسيات',
    code: '$ python3\n>>> print("مرحبا")',
    theme: 'yellow',
    number: '02',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/interpreter.html',
    docsSection: '2. Using the Python Interpreter',
    topics: ['تثبيت Python', 'تشغيل الـ Interpreter', 'Interactive Mode']
  },
  {
    id: 'informal-intro',
    slug: 'informal-intro',
    title: 'An Informal Introduction to Python',
    titleAr: 'أول خطواتك في Python',
    desc: 'الأرقام والنصوص والـ Lists - أساسيات التعامل مع البيانات.',
    category: 'basics',
    label: 'الأساسيات',
    code: 'name = "أحمد"\nage = 25\nprint(f"أنا {name}")',
    theme: 'purple',
    number: '03',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/introduction.html',
    docsSection: '3. An Informal Introduction to Python',
    topics: ['Numbers', 'Strings', 'Lists', 'المتغيرات']
  },

  // === التحكم في التدفق (Control Flow) ===
  {
    id: 'if-statements',
    slug: 'if-statements',
    title: 'if Statements',
    titleAr: 'الشروط باستخدام if',
    desc: 'إزاي تخلي الكود ياخد قرارات باستخدام if و elif و else.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'if age >= 18:\n    print("كبير")\nelse:\n    print("صغير")',
    theme: 'green',
    number: '04',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#if-statements',
    docsSection: '4.1. if Statements',
    topics: ['if', 'elif', 'else', 'المقارنات']
  },
  {
    id: 'for-statements',
    slug: 'for-statements',
    title: 'for Statements',
    titleAr: 'التكرار باستخدام for',
    desc: 'إزاي تكرر كود على عناصر list أو string أو أي sequence.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'for name in names:\n    print(f"مرحبا {name}")',
    theme: 'pink',
    number: '05',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements',
    docsSection: '4.2. for Statements',
    topics: ['for loop', 'iteration', 'sequences']
  },
  {
    id: 'range-function',
    slug: 'range-function',
    title: 'The range() Function',
    titleAr: 'دالة range() للأرقام',
    desc: 'إزاي تعمل تسلسل أرقام باستخدام range().',
    category: 'practice',
    label: 'تطبيقات',
    code: 'for i in range(5):\n    print(i)  # 0,1,2,3,4',
    theme: 'orange',
    number: '06',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#the-range-function',
    docsSection: '4.3. The range() Function',
    topics: ['range()', 'تسلسل الأرقام', 'start, stop, step']
  },
  {
    id: 'break-continue',
    slug: 'break-continue',
    title: 'break and continue Statements',
    titleAr: 'التحكم في الـ Loop بـ break و continue',
    desc: 'إزاي توقف الـ loop أو تتخطى iteration معينة.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'for n in range(10):\n    if n == 5:\n        break\n    print(n)',
    theme: 'blue',
    number: '07',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops',
    docsSection: '4.4. break and continue Statements',
    topics: ['break', 'continue', 'else في loops']
  },
  {
    id: 'defining-functions',
    slug: 'defining-functions',
    title: 'Defining Functions',
    titleAr: 'إزاي تكتب Function',
    desc: 'إنشاء functions خاصة بيك باستخدام def.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'def greet(name):\n    return f"أهلا {name}"\n\nprint(greet("أحمد"))',
    theme: 'yellow',
    number: '08',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
    docsSection: '4.8. Defining Functions',
    topics: ['def', 'parameters', 'return', 'arguments']
  },
  {
    id: 'default-arguments',
    slug: 'default-arguments',
    title: 'Default Argument Values',
    titleAr: 'القيم الافتراضية للـ Arguments',
    desc: 'إزاي تحط قيم افتراضية للـ parameters.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'def greet(name, msg="أهلا"):\n    print(f"{msg} {name}")',
    theme: 'purple',
    number: '09',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values',
    docsSection: '4.9.1. Default Argument Values',
    topics: ['default values', 'optional parameters']
  },
  {
    id: 'lambda-expressions',
    slug: 'lambda-expressions',
    title: 'Lambda Expressions',
    titleAr: 'الدوال المختصرة Lambda',
    desc: 'إزاي تكتب function في سطر واحد.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'square = lambda x: x ** 2\nprint(square(5))  # 25',
    theme: 'green',
    number: '10',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions',
    docsSection: '4.9.6. Lambda Expressions',
    topics: ['lambda', 'anonymous functions']
  },

  // === هياكل البيانات (Data Structures) ===
  {
    id: 'more-on-lists',
    slug: 'more-on-lists',
    title: 'More on Lists',
    titleAr: 'كل حاجة عن Lists',
    desc: 'الـ methods بتاعة الـ Lists: append, extend, insert, remove, وغيرهم.',
    category: 'basics',
    label: 'الأساسيات',
    code: 'fruits = ["تفاح", "موز"]\nfruits.append("برتقال")\nprint(fruits)',
    theme: 'pink',
    number: '11',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    docsSection: '5.1. More on Lists',
    topics: ['list methods', 'append', 'extend', 'pop', 'sort']
  },
  {
    id: 'list-comprehensions',
    slug: 'list-comprehensions',
    title: 'List Comprehensions',
    titleAr: 'الطريقة الذكية لعمل Lists',
    desc: 'إزاي تعمل list جديدة في سطر واحد.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'squares = [x**2 for x in range(10)]\nprint(squares)',
    theme: 'orange',
    number: '12',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions',
    docsSection: '5.1.3. List Comprehensions',
    topics: ['list comprehension', 'filtering', 'mapping']
  },
  {
    id: 'tuples-sequences',
    slug: 'tuples-sequences',
    title: 'Tuples and Sequences',
    titleAr: 'الـ Tuples والـ Sequences',
    desc: 'الفرق بين Tuple و List ومتى تستخدم كل واحدة.',
    category: 'basics',
    label: 'الأساسيات',
    code: 'point = (3, 5)\nx, y = point\nprint(f"x={x}, y={y}")',
    theme: 'blue',
    number: '13',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences',
    docsSection: '5.3. Tuples and Sequences',
    topics: ['tuples', 'unpacking', 'immutable']
  },
  {
    id: 'sets',
    slug: 'sets',
    title: 'Sets',
    titleAr: 'الـ Sets - المجموعات',
    desc: 'مجموعة عناصر فريدة بدون تكرار.',
    category: 'basics',
    label: 'الأساسيات',
    code: 'colors = {"أحمر", "أخضر", "أزرق"}\ncolors.add("أصفر")',
    theme: 'yellow',
    number: '14',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/datastructures.html#sets',
    docsSection: '5.4. Sets',
    topics: ['sets', 'unique values', 'set operations']
  },
  {
    id: 'dictionaries',
    slug: 'dictionaries',
    title: 'Dictionaries',
    titleAr: 'الـ Dictionaries - القواميس',
    desc: 'تخزين البيانات بـ key-value pairs.',
    category: 'basics',
    label: 'الأساسيات',
    code: 'student = {\n    "name": "أحمد",\n    "age": 20\n}\nprint(student["name"])',
    theme: 'purple',
    number: '15',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
    docsSection: '5.5. Dictionaries',
    topics: ['dict', 'key-value', 'methods']
  },

  // === المدخلات والمخرجات (Input and Output) ===
  {
    id: 'fancier-output',
    slug: 'fancier-output',
    title: 'Fancier Output Formatting',
    titleAr: 'تنسيق المخرجات',
    desc: 'f-strings والـ format() وطرق تنسيق النص.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'name = "أحمد"\nage = 25\nprint(f"{name} عمره {age} سنة")',
    theme: 'green',
    number: '16',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/inputoutput.html#fancier-output-formatting',
    docsSection: '7.1. Fancier Output Formatting',
    topics: ['f-strings', 'format()', 'string formatting']
  },
  {
    id: 'reading-writing-files',
    slug: 'reading-writing-files',
    title: 'Reading and Writing Files',
    titleAr: 'قراءة وكتابة الملفات',
    desc: 'إزاي تفتح ملف وتقرأ منه أو تكتب فيه.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'with open("file.txt", "r") as f:\n    content = f.read()\n    print(content)',
    theme: 'pink',
    number: '17',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files',
    docsSection: '7.2. Reading and Writing Files',
    topics: ['open()', 'read()', 'write()', 'with statement']
  },

  // === الأخطاء والاستثناءات (Errors and Exceptions) ===
  {
    id: 'errors-exceptions',
    slug: 'errors-exceptions',
    title: 'Errors and Exceptions',
    titleAr: 'التعامل مع الأخطاء',
    desc: 'الفرق بين Syntax Errors و Exceptions وإزاي تتعامل معاهم.',
    category: 'practice',
    label: 'تطبيقات',
    code: 'try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("مينفعش تقسم على صفر!")',
    theme: 'orange',
    number: '18',
    videoUrl: '',
    docsUrl: 'https://docs.python.org/3/tutorial/errors.html',
    docsSection: '8. Errors and Exceptions',
    topics: ['try', 'except', 'finally', 'raise']
  },

  // === المشاريع ===
  {
    id: 'project-calculator',
    slug: 'project-calculator',
    title: 'Project: Simple Calculator',
    titleAr: 'مشروع: آلة حاسبة بسيطة',
    desc: 'نطبق اللي اتعلمناه في مشروع آلة حاسبة.',
    category: 'projects',
    label: 'مشاريع',
    code: 'def calculate(a, op, b):\n    if op == "+":\n        return a + b\n    # ...',
    theme: 'blue',
    number: '19',
    videoUrl: '',
    docsUrl: '',
    docsSection: '',
    topics: ['functions', 'conditionals', 'user input']
  },
  {
    id: 'project-guessing-game',
    slug: 'project-guessing-game',
    title: 'Project: Guessing Game',
    titleAr: 'مشروع: لعبة تخمين الرقم',
    desc: 'نعمل لعبة تخمين باستخدام loops و conditionals.',
    category: 'projects',
    label: 'مشاريع',
    code: 'import random\nsecret = random.randint(1, 100)\n# خمن الرقم!',
    theme: 'yellow',
    number: '20',
    videoUrl: '',
    docsUrl: '',
    docsSection: '',
    topics: ['loops', 'random', 'user input', 'conditionals']
  }
];

export const categories = [
  { id: 'all', label: 'كل الفيديوهات' },
  { id: 'basics', label: 'الأساسيات' },
  { id: 'practice', label: 'تطبيقات' },
  { id: 'projects', label: 'مشاريع' }
];

export const roadmapSteps = [
  {
    number: '01',
    small: 'نجهّز ونبدأ',
    title: 'نثبت Python ونفهم أول سطر كود.',
    desc: 'التثبيت، الـ Interpreter، وأول برنامج.',
    route: 'basics',
    lessons: ['whetting-appetite', 'using-interpreter', 'informal-intro']
  },
  {
    number: '02',
    small: 'نفهم الأساسيات',
    title: 'الشروط والتكرار والدوال.',
    desc: 'if, for, while, functions - أساس أي برنامج.',
    route: 'practice',
    lessons: ['if-statements', 'for-statements', 'defining-functions']
  },
  {
    number: '03',
    small: 'نتعلم هياكل البيانات',
    title: 'Lists, Tuples, Sets, Dictionaries.',
    desc: 'إزاي تخزن وتنظم البيانات.',
    route: 'basics',
    lessons: ['more-on-lists', 'dictionaries', 'tuples-sequences']
  },
  {
    number: '04',
    small: 'نعمل مشروع',
    title: 'نستخدم اللي اتعلمناه في برنامج صغير.',
    desc: 'نجمع اللي اتعلّمناه في حاجة تشتغل فعلًا.',
    route: 'projects',
    lessons: ['project-calculator', 'project-guessing-game']
  }
];

// Helper function to get lesson by slug
export const getLessonBySlug = (slug) => {
  return lessons.find(lesson => lesson.slug === slug);
};

// Helper function to get related lessons
export const getRelatedLessons = (currentSlug, limit = 3) => {
  const current = getLessonBySlug(currentSlug);
  if (!current) return [];
  
  return lessons
    .filter(l => l.slug !== currentSlug && l.category === current.category)
    .slice(0, limit);
};

// Get next and previous lessons
export const getAdjacentLessons = (currentSlug) => {
  const currentIndex = lessons.findIndex(l => l.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  };
};
