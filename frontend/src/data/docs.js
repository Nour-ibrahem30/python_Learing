// =============================================
// التوثيق بالمصري - من Python Docs الرسمي
// كل جزء مترجم ومشروح بالعربي المصري
// =============================================

export const lessonDocs = {
  'whetting-appetite': {
    intro: `Python لغة سهلة تتعلمها وقوية في نفس الوقت. فيها هياكل بيانات عالية المستوى، 
    وطريقة بسيطة للبرمجة الكائنية. الـ syntax بتاعها واضح والـ typing ديناميكي، 
    وده بيخليها مثالية للـ scripting والتطوير السريع.`,
    
    sections: [
      {
        title: 'ليه Python؟',
        content: `Python مش بس لغة برمجة، دي أداة بتخليك تركز على حل المشكلة 
        بدل ما تقعد تحارب في syntax معقد. تقدر تكتب كود يشتغل في دقايق مش ساعات.`,
        code: `# أول كود ليك
print("مرحبا بالعالم!")

# بسيطة كده؟ أيوه بسيطة كده!`
      }
    ],
    
    keyPoints: [
      'سهلة التعلم للمبتدئين',
      'قوية للمحترفين',
      'مجتمع ضخم ودعم كبير',
      'مكتبات لكل حاجة تتخيلها'
    ]
  },

  'using-interpreter': {
    intro: `الـ Python Interpreter هو البرنامج اللي بيشغل كود Python بتاعك. 
    تقدر تستخدمه بطريقتين: تكتب كود في ملف وتشغله، أو تكتب أوامر مباشرة في الـ Interactive Mode.`,
    
    sections: [
      {
        title: 'تشغيل الـ Interpreter',
        content: `لما تكتب python أو python3 في الـ terminal، بتدخل الـ Interactive Mode. 
        هتشوف >>> وده معناه إن Python مستنياك تكتب كود.`,
        code: `$ python3
Python 3.12.0 (main, Oct  2 2024)
>>> print("أهلا!")
أهلا!
>>> 2 + 2
4
>>> exit()  # للخروج`
      },
      {
        title: 'تشغيل ملف Python',
        content: `لو عندك ملف اسمه script.py، تقدر تشغله كده:`,
        code: `$ python3 script.py`
      }
    ],
    
    keyPoints: [
      'python3 لتشغيل الـ Interpreter',
      '>>> معناها Python مستنياك',
      'exit() أو Ctrl+D للخروج',
      'الملفات امتدادها .py'
    ]
  },

  'informal-intro': {
    intro: `في الجزء ده هنتعرف على أساسيات Python: الأرقام، النصوص، والـ Lists. 
    دي الحاجات اللي هتستخدمها في أي برنامج تكتبه.`,
    
    sections: [
      {
        title: 'الأرقام (Numbers)',
        content: `Python بتتعامل مع الأرقام زي الآلة الحاسبة. تقدر تجمع وتطرح وتضرب وتقسم.`,
        code: `>>> 2 + 2
4
>>> 50 - 5*6
20
>>> 8 / 5    # القسمة بترجع float
1.6
>>> 17 // 5  # القسمة الصحيحة
3
>>> 2 ** 10  # الأس (2 أس 10)
1024`
      },
      {
        title: 'النصوص (Strings)',
        content: `النصوص في Python بتتحط بين علامات تنصيص. تقدر تستخدم ' أو ".`,
        code: `>>> 'مرحبا'
'مرحبا'
>>> "Hello" + " " + "World"
'Hello World'
>>> name = "أحمد"
>>> f"أهلا يا {name}"
'أهلا يا أحمد'`
      },
      {
        title: 'القوائم (Lists)',
        content: `الـ List هي مجموعة من العناصر مرتبة. تقدر تضيف وتشيل وتغير فيها.`,
        code: `>>> fruits = ["تفاح", "موز", "برتقال"]
>>> fruits[0]      # أول عنصر
'تفاح'
>>> fruits.append("عنب")
>>> fruits
['تفاح', 'موز', 'برتقال', 'عنب']`
      }
    ],
    
    keyPoints: [
      'الأرقام: int, float',
      'النصوص: str',
      'القوائم: list',
      'f-strings للتنسيق'
    ]
  },

  'if-statements': {
    intro: `جملة if هي أشهر جملة شرطية في البرمجة. بتخلي الكود ياخد قرارات: 
    لو الشرط صح، اعمل كذا. لو مش صح، اعمل حاجة تانية.`,
    
    sections: [
      {
        title: 'الصيغة الأساسية',
        content: `بتبدأ بـ if وبعدها الشرط وبعدها نقطتين. الكود اللي جوه الـ if لازم يكون indented (مسافة).`,
        code: `>>> x = int(input("اكتب رقم: "))
اكتب رقم: 42
>>> if x < 0:
...     print("الرقم سالب")
... elif x == 0:
...     print("الرقم صفر")
... elif x == 1:
...     print("الرقم واحد")
... else:
...     print("الرقم أكبر من واحد")
...
الرقم أكبر من واحد`
      },
      {
        title: 'elif و else',
        content: `elif اختصار لـ "else if"، بتستخدمها لما يكون عندك أكتر من شرط. 
        else بتتنفذ لو كل الشروط اللي قبلها مش متحققة. الـ else اختيارية مش إجبارية.`,
        code: `age = 20

if age < 13:
    print("طفل")
elif age < 20:
    print("مراهق")
elif age < 30:
    print("شاب")
else:
    print("كبير")`
      }
    ],
    
    keyPoints: [
      'if للشرط الأول',
      'elif للشروط الإضافية (اختصار else if)',
      'else للحالة الافتراضية (اختياري)',
      'لازم تستخدم indentation (مسافة)'
    ],
    
    commonMistakes: [
      {
        wrong: 'if x = 5:  # غلط! = للتخصيص',
        correct: 'if x == 5:  # صح! == للمقارنة'
      },
      {
        wrong: 'if x > 5\n    print("كبير")  # غلط! نسيت النقطتين',
        correct: 'if x > 5:\n    print("كبير")  # صح!'
      }
    ]
  },

  'for-statements': {
    intro: `جملة for في Python مختلفة شوية عن اللغات التانية. 
    بدل ما تكرر على أرقام بس، بتكرر على أي sequence (زي list أو string).`,
    
    sections: [
      {
        title: 'التكرار على List',
        content: `أبسط استخدام لـ for هو التكرار على عناصر list.`,
        code: `>>> words = ['cat', 'window', 'door']
>>> for w in words:
...     print(w, len(w))
...
cat 3
window 6
door 4`
      },
      {
        title: 'التكرار على String',
        content: `تقدر تكرر على حروف string واحد واحد.`,
        code: `>>> for char in "Python":
...     print(char)
...
P
y
t
h
o
n`
      },
      {
        title: 'التكرار مع range()',
        content: `لو محتاج تكرر عدد معين من المرات، استخدم range().`,
        code: `>>> for i in range(5):
...     print(f"المرة رقم {i}")
...
المرة رقم 0
المرة رقم 1
المرة رقم 2
المرة رقم 3
المرة رقم 4`
      }
    ],
    
    keyPoints: [
      'for بتكرر على عناصر أي sequence',
      'المتغير بياخد قيمة كل عنصر',
      'تقدر تستخدم range() للأرقام',
      'لازم indentation للكود جوه الـ loop'
    ]
  },

  'range-function': {
    intro: `دالة range() بتعمل تسلسل من الأرقام. مفيدة جدًا مع for loops 
    لما تحتاج تكرر عدد معين من المرات أو تعمل تسلسل أرقام.`,
    
    sections: [
      {
        title: 'الاستخدام الأساسي',
        content: `range(n) بتعمل أرقام من 0 لحد n-1 (يعني n مش داخلة).`,
        code: `>>> for i in range(5):
...     print(i)
...
0
1
2
3
4`
      },
      {
        title: 'تحديد البداية والنهاية',
        content: `range(start, stop) بتبدأ من start وتوقف قبل stop.`,
        code: `>>> list(range(5, 10))
[5, 6, 7, 8, 9]

>>> list(range(0, 10, 2))  # بخطوة 2
[0, 2, 4, 6, 8]

>>> list(range(10, 0, -1))  # العد العكسي
[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]`
      }
    ],
    
    keyPoints: [
      'range(n) من 0 لـ n-1',
      'range(start, stop) من start لـ stop-1',
      'range(start, stop, step) مع خطوة',
      'الخطوة ممكن تكون سالبة للعد العكسي'
    ]
  },

  'break-continue': {
    intro: `break و continue بيتحكموا في سير الـ loop. 
    break بتوقف الـ loop خالص، و continue بتخطي الـ iteration الحالية وتكمل.`,
    
    sections: [
      {
        title: 'استخدام break',
        content: `break بتخرجك من الـ loop فورًا لما تلاقي اللي بتدور عليه.`,
        code: `>>> for n in range(2, 10):
...     for x in range(2, n):
...         if n % x == 0:
...             print(f"{n} = {x} × {n//x}")
...             break
...
4 = 2 × 2
6 = 2 × 3
8 = 2 × 4
9 = 3 × 3`
      },
      {
        title: 'استخدام continue',
        content: `continue بتخطي باقي الكود في الـ iteration الحالية وتروح للي بعدها.`,
        code: `>>> for num in range(10):
...     if num % 2 == 0:  # لو زوجي
...         continue       # خطيه
...     print(num)         # اطبع الفردي بس
...
1
3
5
7
9`
      }
    ],
    
    keyPoints: [
      'break بتوقف الـ loop خالص',
      'continue بتخطي للـ iteration الجاية',
      'بيشتغلوا مع for و while',
      'استخدمهم بحكمة عشان الكود يفضل واضح'
    ]
  },

  'defining-functions': {
    intro: `الـ Functions بتخليك تكتب كود مرة واحدة وتستخدمه كتير. 
    بدل ما تكرر نفس الكود، تحطه في function وتناديها لما تحتاجها.`,
    
    sections: [
      {
        title: 'تعريف Function',
        content: `بتستخدم كلمة def وبعدها اسم الـ function والـ parameters بين أقواس.`,
        code: `>>> def greet(name):
...     """بتطبع رسالة ترحيب"""
...     print(f"أهلا يا {name}!")
...
>>> greet("أحمد")
أهلا يا أحمد!
>>> greet("سارة")
أهلا يا سارة!`
      },
      {
        title: 'الـ return',
        content: `الـ function ممكن ترجع قيمة باستخدام return.`,
        code: `>>> def add(a, b):
...     """بترجع مجموع رقمين"""
...     return a + b
...
>>> result = add(5, 3)
>>> print(result)
8

>>> def square(n):
...     return n ** 2
...
>>> square(4)
16`
      },
      {
        title: 'Docstrings',
        content: `أول سطر في الـ function ممكن يكون string بيوصف الـ function. 
        ده اسمه docstring وبيساعد اللي بيقرأ الكود يفهم الـ function بتعمل إيه.`,
        code: `def calculate_area(length, width):
    """
    بتحسب مساحة المستطيل.
    
    Parameters:
        length: الطول
        width: العرض
    
    Returns:
        المساحة
    """
    return length * width`
      }
    ],
    
    keyPoints: [
      'def لتعريف الـ function',
      'الـ parameters بين الأقواس',
      'return لإرجاع قيمة',
      'Docstrings لتوثيق الـ function'
    ]
  },

  'default-arguments': {
    intro: `تقدر تحط قيم افتراضية للـ parameters. كده الـ function تشتغل حتى لو منادتهاش بكل الـ arguments.`,
    
    sections: [
      {
        title: 'القيم الافتراضية',
        content: `بتحط = وبعدها القيمة الافتراضية في تعريف الـ function.`,
        code: `>>> def greet(name, greeting="أهلا"):
...     print(f"{greeting} يا {name}!")
...
>>> greet("أحمد")
أهلا يا أحمد!
>>> greet("سارة", "صباح الخير")
صباح الخير يا سارة!`
      },
      {
        title: 'Keyword Arguments',
        content: `تقدر تحدد الـ argument بالاسم عشان الترتيب ميفرقش.`,
        code: `>>> def describe_pet(animal, name):
...     print(f"عندي {animal} اسمه {name}")
...
>>> describe_pet(name="فيفي", animal="قطة")
عندي قطة اسمه فيفي`
      }
    ],
    
    keyPoints: [
      'القيم الافتراضية بتخلي الـ argument اختياري',
      'الـ arguments اللي ليها default لازم تيجي في الآخر',
      'Keyword arguments بتحدد الـ argument بالاسم',
      'بتخلي الـ functions أكتر مرونة'
    ]
  },

  'lambda-expressions': {
    intro: `Lambda هي function صغيرة مكتوبة في سطر واحد. 
    مفيدة لما تحتاج function بسيطة تستخدمها مرة واحدة.`,
    
    sections: [
      {
        title: 'الصيغة الأساسية',
        content: `بدل def، بتستخدم lambda وبعدها الـ parameters ونقطتين والـ expression.`,
        code: `>>> square = lambda x: x ** 2
>>> square(5)
25

>>> add = lambda a, b: a + b
>>> add(3, 4)
7`
      },
      {
        title: 'استخدام Lambda مع Functions تانية',
        content: `Lambda مفيدة جدًا مع functions زي map و filter و sorted.`,
        code: `>>> numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# ترتيب الأرقام
>>> sorted(numbers)
[1, 1, 2, 3, 4, 5, 6, 9]

# ترتيب lists حسب العنصر التاني
>>> pairs = [(1, 'one'), (2, 'two'), (3, 'three')]
>>> sorted(pairs, key=lambda x: x[1])
[(1, 'one'), (3, 'three'), (2, 'two')]`
      }
    ],
    
    keyPoints: [
      'lambda بتعمل function في سطر واحد',
      'مفيدة للـ functions البسيطة',
      'بتستخدم كتير مع map, filter, sorted',
      'مينفعش تحط فيها أكتر من expression واحد'
    ]
  },

  'more-on-lists': {
    intro: `الـ Lists في Python ليها methods كتير بتخليك تتحكم فيها بسهولة. 
    تقدر تضيف وتشيل وترتب وتدور على عناصر.`,
    
    sections: [
      {
        title: 'إضافة عناصر',
        content: `append بتضيف في الآخر، insert بتضيف في مكان معين.`,
        code: `>>> fruits = ["تفاح", "موز"]
>>> fruits.append("برتقال")
>>> fruits
['تفاح', 'موز', 'برتقال']

>>> fruits.insert(1, "عنب")  # في المكان رقم 1
>>> fruits
['تفاح', 'عنب', 'موز', 'برتقال']`
      },
      {
        title: 'حذف عناصر',
        content: `remove بتشيل بالقيمة، pop بتشيل بالـ index وترجع العنصر.`,
        code: `>>> fruits.remove("عنب")
>>> fruits
['تفاح', 'موز', 'برتقال']

>>> last = fruits.pop()  # بتشيل الأخير
>>> last
'برتقال'`
      },
      {
        title: 'ترتيب وعكس',
        content: `sort بترتب، reverse بتعكس الترتيب.`,
        code: `>>> numbers = [3, 1, 4, 1, 5, 9, 2, 6]
>>> numbers.sort()
>>> numbers
[1, 1, 2, 3, 4, 5, 6, 9]

>>> numbers.reverse()
>>> numbers
[9, 6, 5, 4, 3, 2, 1, 1]`
      }
    ],
    
    keyPoints: [
      'append() للإضافة في الآخر',
      'insert(i, x) للإضافة في مكان معين',
      'remove(x) للحذف بالقيمة',
      'pop() للحذف بالـ index',
      'sort() للترتيب'
    ]
  },

  'list-comprehensions': {
    intro: `List Comprehension طريقة ذكية ومختصرة لعمل list جديدة من list موجودة. 
    بدل ما تكتب loop كامل، بتكتب سطر واحد.`,
    
    sections: [
      {
        title: 'الصيغة الأساسية',
        content: `[expression for item in list] بتعمل list جديدة.`,
        code: `>>> squares = [x**2 for x in range(10)]
>>> squares
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# نفس النتيجة بطريقة الـ loop العادية:
>>> squares = []
>>> for x in range(10):
...     squares.append(x**2)`
      },
      {
        title: 'مع شرط (Filtering)',
        content: `تقدر تضيف if عشان تفلتر العناصر.`,
        code: `>>> # الأرقام الزوجية بس
>>> evens = [x for x in range(10) if x % 2 == 0]
>>> evens
[0, 2, 4, 6, 8]

>>> # الأرقام الأكبر من 5
>>> big = [x for x in range(10) if x > 5]
>>> big
[6, 7, 8, 9]`
      }
    ],
    
    keyPoints: [
      '[expression for item in list]',
      'تقدر تضيف if للفلترة',
      'أقصر وأوضح من الـ loop العادي',
      'بتنفع مع أي iterable'
    ]
  },

  'tuples-sequences': {
    intro: `الـ Tuple زي الـ List بس مينفعش تغيرها بعد ما تعملها (immutable). 
    بتستخدمها لما عايز تحافظ على البيانات من التعديل.`,
    
    sections: [
      {
        title: 'إنشاء Tuple',
        content: `بتحط العناصر بين أقواس عادية () أو من غير أقواس خالص.`,
        code: `>>> point = (3, 5)
>>> point
(3, 5)

>>> colors = "أحمر", "أخضر", "أزرق"  # من غير أقواس
>>> colors
('أحمر', 'أخضر', 'أزرق')`
      },
      {
        title: 'Tuple Unpacking',
        content: `تقدر تفك الـ Tuple لمتغيرات منفصلة.`,
        code: `>>> x, y = point
>>> print(f"x = {x}, y = {y}")
x = 3, y = 5

>>> a, b, c = colors
>>> print(a)
أحمر`
      }
    ],
    
    keyPoints: [
      'Tuple immutable (مينفعش تتغير)',
      'بتستخدم () أو من غيرها',
      'Unpacking بيفك القيم لمتغيرات',
      'أسرع من List في بعض العمليات'
    ]
  },

  'sets': {
    intro: `الـ Set مجموعة من العناصر الفريدة (مفيش تكرار). 
    مفيدة لما تحتاج تشيل التكرارات أو تعمل عمليات زي الـ union و intersection.`,
    
    sections: [
      {
        title: 'إنشاء Set',
        content: `بتستخدم {} أو set().`,
        code: `>>> colors = {"أحمر", "أخضر", "أزرق"}
>>> colors
{'أخضر', 'أحمر', 'أزرق'}  # الترتيب مش مضمون

>>> # إزالة التكرارات
>>> numbers = [1, 2, 2, 3, 3, 3]
>>> set(numbers)
{1, 2, 3}`
      },
      {
        title: 'عمليات Sets',
        content: `تقدر تعمل union و intersection و difference.`,
        code: `>>> a = {1, 2, 3, 4}
>>> b = {3, 4, 5, 6}

>>> a | b    # Union (الكل)
{1, 2, 3, 4, 5, 6}

>>> a & b    # Intersection (المشترك)
{3, 4}

>>> a - b    # Difference (في a بس)
{1, 2}`
      }
    ],
    
    keyPoints: [
      'مفيش عناصر مكررة',
      'الترتيب مش مضمون',
      '| للـ union',
      '& للـ intersection',
      '- للـ difference'
    ]
  },

  'dictionaries': {
    intro: `الـ Dictionary بتخزن البيانات في صورة key-value pairs. 
    كل key مرتبط بـ value، وبتوصل للـ value عن طريق الـ key.`,
    
    sections: [
      {
        title: 'إنشاء Dictionary',
        content: `بتستخدم {} مع key: value.`,
        code: `>>> student = {
...     "name": "أحمد",
...     "age": 20,
...     "grade": "A"
... }
>>> student["name"]
'أحمد'
>>> student["age"]
20`
      },
      {
        title: 'إضافة وتعديل',
        content: `تقدر تضيف keys جديدة أو تعدل الموجودة.`,
        code: `>>> student["city"] = "القاهرة"  # إضافة
>>> student["age"] = 21            # تعديل

>>> student
{'name': 'أحمد', 'age': 21, 'grade': 'A', 'city': 'القاهرة'}`
      },
      {
        title: 'التكرار على Dictionary',
        content: `تقدر تكرر على الـ keys أو الـ values أو الاتنين.`,
        code: `>>> for key in student:
...     print(key, ":", student[key])
...
name : أحمد
age : 21
grade : A
city : القاهرة

>>> for key, value in student.items():
...     print(f"{key} = {value}")`
      }
    ],
    
    keyPoints: [
      'key: value pairs',
      'الـ keys لازم تكون unique',
      'الوصول بالـ key: dict["key"]',
      '.keys(), .values(), .items() للتكرار'
    ]
  },

  'fancier-output': {
    intro: `في Python طرق كتير لتنسيق النص والمخرجات. 
    أشهرها f-strings وهي الأسهل والأوضح.`,
    
    sections: [
      {
        title: 'f-strings',
        content: `بتحط f قبل النص وتكتب المتغيرات جوه {}.`,
        code: `>>> name = "أحمد"
>>> age = 25
>>> print(f"اسمي {name} وعمري {age} سنة")
اسمي أحمد وعمري 25 سنة

>>> price = 19.99
>>> print(f"السعر: {price:.2f} جنيه")
السعر: 19.99 جنيه`
      },
      {
        title: 'تنسيق الأرقام',
        content: `تقدر تتحكم في شكل الأرقام جوه {}.`,
        code: `>>> x = 1234567
>>> print(f"{x:,}")      # بفاصل آلاف
1,234,567

>>> pi = 3.14159265
>>> print(f"{pi:.2f}")   # خانتين عشرية
3.14

>>> print(f"{42:05d}")   # 5 خانات مع أصفار
00042`
      }
    ],
    
    keyPoints: [
      'f"..." للـ f-strings',
      '{variable} لإدراج متغير',
      ':.2f لخانتين عشرية',
      ':, للفاصل',
      ':05d للأصفار البادئة'
    ]
  },

  'reading-writing-files': {
    intro: `Python بتخليك تقرأ من ملفات وتكتب فيها بسهولة. 
    الطريقة الآمنة هي استخدام with عشان الملف يتقفل تلقائي.`,
    
    sections: [
      {
        title: 'قراءة ملف',
        content: `open() مع 'r' للقراءة (read).`,
        code: `>>> with open("file.txt", "r", encoding="utf-8") as f:
...     content = f.read()
...     print(content)

# أو سطر سطر
>>> with open("file.txt", "r") as f:
...     for line in f:
...         print(line.strip())`
      },
      {
        title: 'كتابة ملف',
        content: `'w' للكتابة (overwrite)، 'a' للإضافة (append).`,
        code: `>>> with open("output.txt", "w", encoding="utf-8") as f:
...     f.write("السطر الأول\\n")
...     f.write("السطر التاني\\n")

# الإضافة لملف موجود
>>> with open("output.txt", "a") as f:
...     f.write("سطر جديد\\n")`
      }
    ],
    
    keyPoints: [
      'with بتقفل الملف تلقائي',
      '"r" للقراءة',
      '"w" للكتابة (بيمسح القديم)',
      '"a" للإضافة',
      'encoding="utf-8" للعربي'
    ]
  },

  'errors-exceptions': {
    intro: `الأخطاء في Python نوعين: Syntax Errors (أخطاء في كتابة الكود) 
    و Exceptions (أخطاء وقت التشغيل). تقدر تتعامل مع الـ Exceptions باستخدام try/except.`,
    
    sections: [
      {
        title: 'try / except',
        content: `بتحط الكود اللي ممكن يعمل مشكلة في try، والتعامل مع المشكلة في except.`,
        code: `>>> try:
...     x = int(input("اكتب رقم: "))
...     result = 10 / x
...     print(f"النتيجة: {result}")
... except ValueError:
...     print("ده مش رقم!")
... except ZeroDivisionError:
...     print("مينفعش تقسم على صفر!")`
      },
      {
        title: 'finally',
        content: `الكود في finally بيتنفذ دايمًا، سواء حصل error أو لأ.`,
        code: `>>> try:
...     f = open("file.txt")
...     data = f.read()
... except FileNotFoundError:
...     print("الملف مش موجود!")
... finally:
...     print("خلصنا!")  # دي بتتنفذ دايمًا`
      },
      {
        title: 'raise',
        content: `تقدر ترمي exception بنفسك باستخدام raise.`,
        code: `>>> def check_age(age):
...     if age < 0:
...         raise ValueError("العمر لازم يكون موجب!")
...     return age
...
>>> check_age(-5)
ValueError: العمر لازم يكون موجب!`
      }
    ],
    
    keyPoints: [
      'try للكود اللي ممكن يفشل',
      'except للتعامل مع الـ error',
      'finally بيتنفذ دايمًا',
      'raise لرمي exception'
    ]
  },

  'project-calculator': {
    intro: `في المشروع ده هنعمل آلة حاسبة بسيطة باستخدام كل اللي اتعلمناه: 
    functions, conditionals, user input, و error handling.`,
    
    sections: [
      {
        title: 'الكود الكامل',
        content: `آلة حاسبة بتعمل الأربع عمليات الأساسية.`,
        code: `def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "مينفعش تقسم على صفر!"
    return a / b

def calculator():
    print("=== الآلة الحاسبة ===")
    print("1. جمع")
    print("2. طرح")
    print("3. ضرب")
    print("4. قسمة")
    
    choice = input("اختار العملية (1-4): ")
    
    try:
        num1 = float(input("الرقم الأول: "))
        num2 = float(input("الرقم التاني: "))
    except ValueError:
        print("لازم تكتب أرقام!")
        return
    
    if choice == '1':
        print(f"النتيجة: {add(num1, num2)}")
    elif choice == '2':
        print(f"النتيجة: {subtract(num1, num2)}")
    elif choice == '3':
        print(f"النتيجة: {multiply(num1, num2)}")
    elif choice == '4':
        print(f"النتيجة: {divide(num1, num2)}")
    else:
        print("اختيار غلط!")

calculator()`
      }
    ],
    
    keyPoints: [
      'Functions لكل عملية',
      'if/elif/else للاختيار',
      'try/except للـ error handling',
      'f-strings لعرض النتيجة'
    ]
  },

  'project-guessing-game': {
    intro: `لعبة تخمين الرقم! الكمبيوتر بيختار رقم عشوائي وإنت بتحاول تخمنه. 
    هنستخدم loops, conditionals, و random module.`,
    
    sections: [
      {
        title: 'الكود الكامل',
        content: `لعبة تخمين مع عداد المحاولات.`,
        code: `import random

def guessing_game():
    secret = random.randint(1, 100)
    attempts = 0
    max_attempts = 10
    
    print("=== لعبة تخمين الرقم ===")
    print(f"خمن رقم من 1 لـ 100")
    print(f"عندك {max_attempts} محاولات")
    
    while attempts < max_attempts:
        try:
            guess = int(input("\\nتخمينك: "))
        except ValueError:
            print("لازم تكتب رقم!")
            continue
        
        attempts += 1
        remaining = max_attempts - attempts
        
        if guess == secret:
            print(f"🎉 برافو! خمنته في {attempts} محاولة!")
            return
        elif guess < secret:
            print(f"أكبر من كده! (باقي {remaining} محاولات)")
        else:
            print(f"أصغر من كده! (باقي {remaining} محاولات)")
    
    print(f"\\n😢 خسرت! الرقم كان {secret}")

guessing_game()`
      }
    ],
    
    keyPoints: [
      'random.randint() لرقم عشوائي',
      'while loop للمحاولات',
      'عداد المحاولات',
      'Feedback للاعب بعد كل محاولة'
    ]
  }
};

// Helper function to get docs for a lesson
export const getDocsForLesson = (slug) => {
  return lessonDocs[slug] || null;
};
