/**
 * SMART COACH - V8.5 (Bespoke Minimalist Athletic Engine)
 * Pure Architectural Logic, Tactile Tiles, Weight Tracker, Haptics & Service Worker
 */

// --- PROGRAMS REGISTRY ---
const PROGRAMS_CATALOG = [
    {
        id: "arnold_hybrid",
        name: "Arnold Hybrid Pro - Shoulder & Back Specialization",
        name_fa: "آرنولد هایبرید پرو — تمرکز تخصصی سرشانه، زیربغل و ساعد",
        version: "5.1 (Option 3)",
        author: "Master Coach",
        tagline: "اولویت بالا روی عضلات لت، سرشانه ۳ بعدی و ساعد، بدون اسکات و سازگار با شانه چپ",
        description: "طراحی شده به صورت اختصاصی با اولویت حداکثری بر پهنای زیربغل (Lats)، گردی ۳D سرشانه و ضخامت ساعدها. کاملاً بدون اسکات آزاد و با زوایای بیومکانیکی امن برای مفصل شانه چپ.",
        target: "وزن ۸۳ کیلوگرم، ۳۸ کیلو عضلات اسکلتی، بدون اسکات، ایمن برای شانه چپ",
        daysCount: 5,
        tags: ["بدون اسکات", "ایمن برای شانه چپ", "تمرکز روی لت و سرشانه", "سوپرست ساعد", "۵ روز در هفته"],
        icon: "⚡",
        file: "arnold_hybrid.json",
        daysSummary: [
            { day: "day1", title: "روز ۱: سینه و زیربغل (حجم آنتاگونیست)" },
            { day: "day2", title: "روز ۲: سرشانه، بازو و ساعد سنگین (کوبیدن نقاط ضعف)" },
            { day: "day3", title: "روز ۳: پاها (بدون اسکات) و عضلات شکم" },
            { day: "day4", title: "روز ۴: بالاتنه (تمرکز ویژه لت و سرشانه)" },
            { day: "day5", title: "روز ۵: پا (سبک)، ساعدها و بازو" }
        ]
    },
    {
        id: "pro_bodypart_split",
        name: "Pro 5-Day Body Part Split (Weak-Point Boosted)",
        name_fa: "اسپلیت تفکیکی ۵ روزه حرفه‌ای — تقویت مضاعف نقاط ضعف",
        version: "5.2 (Option 4)",
        author: "Master Coach",
        tagline: "اسپلیت کلاسیک یک عضله در روز با فرکانس مضاعف برای دلتوئید، لت و ساعد",
        description: "تمرکز خالص روی هر گروه عضلانی در روزهای مجزا (Chest, Back, Legs, Shoulders, Arms) به همراه لمس دوباره و فرکانس مضاعف در طول هفته برای سرشانه جانبی، زیربغل و ساعد. کاملاً ایمن برای شانه و بدون اسکات.",
        target: "تفکیک کامل عضلانی، حجم حداکثری موضعی، بدون اسکات، ایمن برای شانه",
        daysCount: 5,
        tags: ["اسپلیت کلاسیک", "فرکانس مضاعف نقاط ضعف", "بدون اسکات", "ایمن برای شانه", "۵ روز در هفته"],
        icon: "🦅",
        file: "pro_bodypart_split.json",
        daysSummary: [
            { day: "day1", title: "روز ۱: سینه + لمس سرشانه جانبی و شکم" },
            { day: "day2", title: "روز ۲: زیربغل (پهنا و ضخامت) + ساعد" },
            { day: "day3", title: "روز ۳: پاها (حجم کامل و بدون اسکات)" },
            { day: "day4", title: "روز ۴: سرشانه ۳ بعدی، کول و شکم" },
            { day: "day5", title: "روز ۵: بازو، ساعد + پمپاژ مجدد زیربغل" }
        ]
    },
    {
        id: "workouts",
        name: "Pro Biomechanical Hypertrophy (UL/PPL)",
        name_fa: "هایپرتروفی بیومکانیکال ۵ روزه (ترکیب Upper/Lower و Push/Pull/Legs)",
        version: "5.0",
        author: "Master Coach",
        tagline: "برنامه علمی بر پایه بیومکانیک، هایپرتروفی در حالت کشش و کنترل RIR",
        description: "برنامه علمی ۵ روزه بر اساس توالی بهینه حرکات، هایپرتروفی با میانجی کشش عضلانی (Stretch-mediated hypertrophy) و کنترل دقیق فشار با سیستم RIR.",
        target: "حجم عضلانی متوازن، هایپرتروفی مبتنی بر شواهد علمی",
        daysCount: 5,
        tags: ["بیومکانیکال", "علمی", "Upper/Lower + PPL", "کنترل RIR", "۵ روز در هفته"],
        icon: "🔬",
        file: "workouts.json",
        daysSummary: [
            { day: "day1", title: "روز ۱: بالاتنه (حجم و تراکم)" },
            { day: "day2", title: "روز ۲: پایین‌تنه (چهارسر و میان‌تنه)" },
            { day: "day3", title: "روز ۳: هل دادنی (سینه، دلتوئید و پشت‌بازو)" },
            { day: "day4", title: "روز ۴: کشیدنی (پشت، دلتوئید خلفی و جلوبازو)" },
            { day: "day5", title: "روز ۵: پایین‌تنه و میان‌تنه (همسترینگ و سرینی)" }
        ]
    },
    {
        id: "sabaei_academy",
        name: "Alireza Sabaei Academy - Handwrtten Program (Corrected)",
        name_fa: "برنامه آکادمی علیرضا سباعی (دست‌نویس مربی)",
        version: "1.1",
        author: "Alireza Sabaei",
        tagline: "برنامه دست‌نویس باشگاهی با تمرکز سه‌روزه تفکیکی، شکم، سینه، پا، پشت بازو و جلوبازو",
        description: "استخراج و تصحیح‌شده از برگه برنامه دست‌نویس مربی علیرضا سباعی. تقسیم‌بندی ۳ روزه با حجم بالا و سوپرست‌های کاربردی برای بالاتنه، پایین‌تنه و میان‌تنه.",
        target: "تمرین سنتی ۳ جلسه در هفته، تفکیک کامل با سوپرست‌های دستگاه و دمبل",
        daysCount: 3,
        tags: ["برنامه دست‌نویس مربی", "۳ روز در هفته", "سوپرست‌های کاربردی", "شکم و پهلو", "آکادمی سباعی"],
        icon: "📝",
        file: "sabaei_academy.json",
        daysSummary: [
            { day: "day1", title: "جلسه اول: شکم، سینه و سرشانه (۱۴ حرکت)" },
            { day: "day2", title: "جلسه دوم: پا، پشت بازو و ساق (۱۱ حرکت)" },
            { day: "day3", title: "جلسه سوم: پهلو، زیربغل و جلوبازو (۱۳ حرکت)" }
        ]
    }
];

// --- SMART SWAP CATALOG (دستگاه اشغاله / جایگزین فوری بیومکانیکال) ---
const SWAP_CATALOG = {
    "bench_press": {
        category: "سینه و پرس سینه",
        matchRegex: /bench press|پرس سینه|chest press|flat/i,
        alternatives: [
            {
                name_fa: "پرس سینه دمبل موازی (خنثی)",
                name_en: "Neutral-Grip Dumbbell Bench Press",
                type: "دمبل",
                note: "بدون چرخش داخلی شانه؛ بالاترین فعال‌سازی بخش میانی سینه و ایمن‌ترین زاویه برای مفصل",
                sets: 4,
                reps: "8-10",
                rest: 90
            },
            {
                name_fa: "پرس سینه دستگاه ماتریکس/نشسته",
                name_en: "Seated Machine Chest Press",
                type: "دستگاه",
                note: "مسیر حرکتی ثابت و کنترل‌شده؛ امکان تمرکز صددرصدی روی انقباض بدون نیاز به تعادل وزنه",
                sets: 4,
                reps: "10-12",
                rest: 90
            },
            {
                name_fa: "شنا سوئدی روی استپ / آجر یوگا (Deficit)",
                name_en: "Deficit Push-ups (Hands Elevated)",
                type: "وزن بدن",
                note: "دامنه حرکتی عمیق‌تر از زمین؛ هایپرتروفی عالی با کشش عضلانی در انتهای فاز منفی",
                sets: 4,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "پرس سینه دمبل روی زمین (Floor Press)",
                name_en: "Dumbbell Floor Press",
                type: "دمبل",
                note: "محدود کردن دامنه اضافه به موازات زمین؛ ایده‌آل برای جلوگیری از فشار به کپسول قدامی شانه",
                sets: 4,
                reps: "8-10",
                rest: 90
            }
        ]
    },
    "incline_press": {
        category: "بالاسینه",
        matchRegex: /incline|بالاسینه|بالا سینه/i,
        alternatives: [
            {
                name_fa: "پرس بالاسینه دمبل زاویه ۳۰ درجه",
                name_en: "Low-Incline Dumbbell Press (30°)",
                type: "دمبل",
                note: "زاویه بهینه ۳۰ درجه که بیشترین درگیری بخش بالایی سینه و کمترین فشار دلتوئید قدامی را دارد",
                sets: 4,
                reps: "8-10",
                rest: 90
            },
            {
                name_fa: "پرس بالا سینه اسمیت با مکث",
                name_en: "Incline Smith Machine Press",
                type: "دستگاه",
                note: "امکان فریز و مکث در نقطه کشش عضلانی برای تحریک فیبرهای تند انقباض سینه",
                sets: 4,
                reps: "8-10",
                rest: 90
            },
            {
                name_fa: "کراس‌اور سیمکش از پایین به بالا",
                name_en: "Low-to-High Cable Fly",
                type: "سیمکش",
                note: "تنش دائمی روی فیبرهای بالایی سینه در راستای جهت الیاف عضله (Clavicular Head)",
                sets: 3,
                reps: "12-15",
                rest: 60
            }
        ]
    },
    "flyes": {
        category: "قفسه و کراس‌اور",
        matchRegex: /fly|فلای|قفسه|pec deck|crossover/i,
        alternatives: [
            {
                name_fa: "فلای سینه دمبل روی میز شیب‌دار ملایم",
                name_en: "Incline Dumbbell Fly",
                type: "دمبل",
                note: "آرنج‌ها با زاویه کمی خم برای محافظت از مفصل؛ کشش عمیق و کنترل‌شده بدون پرتاب",
                sets: 3,
                reps: "10-12",
                rest: 60
            },
            {
                name_fa: "کراس‌اور سیمکش ایستاده از وسط",
                name_en: "Mid-Cable Chest Fly",
                type: "سیمکش",
                note: "پیک کانترکشن فوق‌العاده در نقطه رسیدن دست‌ها به هم؛ بدون نقطه کور فشار وزنه",
                sets: 3,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "فلای دستگاه پروانه‌ای (Pec Deck)",
                name_en: "Pec Deck Machine Fly",
                type: "دستگاه",
                note: "پشتیبانی کامل از تنه و حذف نیروی گشتاور روی مهره‌های کمری",
                sets: 3,
                reps: "12-15",
                rest: 60
            }
        ]
    },
    "lat_pulldown": {
        category: "زیربغل کشیدنی (Lats)",
        matchRegex: /lat pulldown|لت|زیربغل سیمکش|pullup|بارفیکس|pulldown/i,
        alternatives: [
            {
                name_fa: "زیربغل سیمکش دستگیره دوبل موازی (V-Bar)",
                name_en: "Neutral-Grip Lat Pulldown (V-Bar)",
                type: "سیمکش",
                note: "راستای دقیق فیبرهای زیربغل و انتقال نیروی بهینه به آرنج بدون چرخش دردناک مچ",
                sets: 4,
                reps: "8-10",
                rest: 90
            },
            {
                name_fa: "بارفیکس دست مچ موازی / کمکی",
                name_en: "Neutral-Grip / Assisted Pull-ups",
                type: "وزن بدن",
                note: "درگیرسازی زنجیره حرکتی بسته؛ افزایش انفجاری کنترل عصبی-عضلانی پشت",
                sets: 4,
                reps: "8-10",
                rest: 90
            },
            {
                name_fa: "پول‌اور سیمکش طنابی ایستاده",
                name_en: "Standing Rope Cable Pullover",
                type: "سیمکش",
                note: "ایزوله خالص زیربغل بدون کوچکترین درگیری و خستگی جلوبازو",
                sets: 3,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "لت سیمکش تک دست زانو زده",
                name_en: "Half-Kneeling Single-Arm Lat Pulldown",
                type: "سیمکش",
                note: "دامنه حرکتی عمیق‌تر و رفع عدم تقارن عضلانی بین پهنای راست و چپ زیربغل",
                sets: 3,
                reps: "10-12",
                rest: 60
            }
        ]
    },
    "rows": {
        category: "زیربغل پارویی و ضخامت (Rows)",
        matchRegex: /row|قایقی|پارویی|t-bar|تی‌بار/i,
        alternatives: [
            {
                name_fa: "زیربغل دمبل تک خم روی میز",
                name_en: "Single-Arm Dumbbell Row",
                type: "دمبل",
                note: "تکیه کامل زانو و دست روی میز برای حذف فشار از مهره‌های کمری و دیسک",
                sets: 4,
                reps: "8-10",
                rest: 75
            },
            {
                name_fa: "زیربغل دمبل جفت سینه روی میز شیب‌دار",
                name_en: "Chest-Supported Incline DB Row",
                type: "دمبل",
                note: "بهترین حرکت برای حذف تقلب و ضربه زدن کمر؛ انقباض خالص عضلات لوزی و میانی پشت",
                sets: 4,
                reps: "10-12",
                rest: 75
            },
            {
                name_fa: "زیربغل قایقی سیمکش با دسته طنابی",
                name_en: "Seated Cable Row with Rope",
                type: "سیمکش",
                note: "امکان باز کردن دست‌ها در انتهای حرکت برای فشردن کامل دلتوئید خلفی و بالای پشت",
                sets: 3,
                reps: "10-12",
                rest: 60
            }
        ]
    },
    "lateral_raise": {
        category: "سرشانه جانبی (Side Delts)",
        matchRegex: /lateral raise|نشر جانب|نشر سرشانه|نشر از جانب/i,
        alternatives: [
            {
                name_fa: "نشر جانب دمبل خوابیده روی میز شیب‌دار",
                name_en: "Incline Bench DB Lateral Raise",
                type: "دمبل",
                note: "ایجاد حداکثر تنش در ابتدای دامنه حرکتی (در حالت کشش عضله) برخلاف نشر سرپا",
                sets: 4,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "نشر جانب سیمکش تک‌دست با پابند/دستبند",
                name_en: "Cable Cuff Lateral Raise",
                type: "سیمکش",
                note: "کشش یکدست و ممتد در تمام مسیر حرکت بدون افت فشار وزنه در انتها",
                sets: 4,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "نشر جانب با دستگاه نشسته پین‌دار",
                name_en: "Machine Lateral Raise",
                type: "دستگاه",
                note: "حذف کامل کمک‌گرفتن از عضلات کول با تکیه‌گاه محکم سینه",
                sets: 4,
                reps: "12-15",
                rest: 60
            }
        ]
    },
    "overhead_press": {
        category: "پرس سرشانه",
        matchRegex: /overhead press|shoulder press|پرس سرشانه/i,
        alternatives: [
            {
                name_fa: "پرس سرشانه دمبل نشسته زاویه ۷۵ درجه",
                name_en: "Seated Dumbbell Shoulder Press (75°)",
                type: "دمبل",
                note: "شیب ملایم پشتی صندلی فضای آکرومیون شانه را باز نگه داشته و از گیر افتادن تاندون جلوگیری می‌کند",
                sets: 4,
                reps: "8-10",
                rest: 90
            },
            {
                name_fa: "پرس لندماین تک‌دست ایستاده (Landmine Press)",
                name_en: "Single-Arm Standing Landmine Press",
                type: "هالتر لندماین",
                note: "ارگونومیک‌ترین مسیر فشردن بار؛ هماهنگ با ریتم حرکتی کتف و مفصل شانه بدون درد",
                sets: 3,
                reps: "10-12",
                rest: 75
            },
            {
                name_fa: "پرس سرشانه دستگاه ماتریکس نشسته",
                name_en: "Machine Overhead Press",
                type: "دستگاه",
                note: "پایداری کامل بدن با صندلی محکم و بدون فشار به مهره‌های کمری",
                sets: 3,
                reps: "10-12",
                rest: 75
            }
        ]
    },
    "rear_delt": {
        category: "دلتوئید خلفی و فیس‌پول",
        matchRegex: /rear delt|face pull|فیس پول|نشر خم/i,
        alternatives: [
            {
                name_fa: "فیس‌پول سیمکش با دو طناب به سمت پیشانی",
                name_en: "Dual-Rope Cable Face Pull",
                type: "سیمکش",
                note: "چرخش خارجی همزمان شانه برای تقویت روتاتور کاف و سلامت بلندمدت مفصل",
                sets: 4,
                reps: "15",
                rest: 60
            },
            {
                name_fa: "فلای معکوس با دستگاه پک‌دک (Reverse Fly)",
                name_en: "Reverse Pec Deck Machine",
                type: "دستگاه",
                note: "ایزوله دقیق پشت شانه بدون تکان دادن تنه و کمر",
                sets: 4,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "نشر خم دمبل سینه روی میز شیب‌دار",
                name_en: "Chest-Supported DB Rear Delt Fly",
                type: "دمبل",
                note: "ایزولاسیون کامل پشت شانه بدون انقباض فیله کمر",
                sets: 3,
                reps: "12-15",
                rest: 60
            }
        ]
    },
    "quads": {
        category: "چهارسر ران و پا",
        matchRegex: /leg press|squat|اسکات|پرس پا|hack|چهارسر|هک اسکات|ران/i,
        alternatives: [
            {
                name_fa: "هک اسکات دستگاه ماتریکس پا پایین",
                name_en: "Machine Hack Squat",
                type: "دستگاه",
                note: "خمیدگی حداکثری زانو بدون بار محوری یا فشار روی مهره‌های کمری",
                sets: 4,
                reps: "10-12",
                rest: 120
            },
            {
                name_fa: "پرس پا ۴۵ درجه (پا به عرض شانه پایین)",
                name_en: "45-Degree Leg Press (Low Stance)",
                type: "دستگاه",
                note: "فشار انفجاری روی چهارسر ران با مهار کامل بالاتنه روی پد صندلی",
                sets: 4,
                reps: "10-12",
                rest: 120
            },
            {
                name_fa: "اسکات بلغاری با دمبل تک پا (Split Squat)",
                name_en: "Dumbbell Bulgarian Split Squat",
                type: "دمبل",
                note: "حجم عالی بدون نیاز به وزنه‌های سنگین؛ عالی برای رفع ناهماهنگی قدرت پاها",
                sets: 3,
                reps: "10-12",
                rest: 90
            },
            {
                name_fa: "جلو ران دستگاه تک‌پا با مکث در اوج",
                name_en: "Single-Leg Extension (Peak Pause)",
                type: "دستگاه",
                note: "ایزولاسیون مستقیم عضله راست رانی (Rectus Femoris) با کشش و انقباض کنترل‌شده",
                sets: 3,
                reps: "12-15",
                rest: 60
            }
        ]
    },
    "hamstrings": {
        category: "پشت پا و همسترینگ",
        matchRegex: /leg curl|hamstring|همسترینگ|پشت پا|ددلیفت رومانیایی|rdl/i,
        alternatives: [
            {
                name_fa: "پشت پا دستگاه نشسته با شیب تنه رو به جلو",
                name_en: "Seated Leg Curl (Forward Torso Lean)",
                type: "دستگاه",
                note: "کشش اولیه همسترینگ در لگن، تحریک هایپرتروفی بیشتری نسبت به مدل خوابیده ایجاد می‌کند",
                sets: 4,
                reps: "10-12",
                rest: 75
            },
            {
                name_fa: "ددلیفت رومانیایی با دمبل (DB RDL)",
                name_en: "Dumbbell Romanian Deadlift",
                type: "دمبل",
                note: "نگه‌داشتن دمبل‌ها نزدیک به ساق پا برای هدایت حداکثر بار به همسترینگ و باسن",
                sets: 3,
                reps: "10-12",
                rest: 90
            },
            {
                name_fa: "پشت پا دستگاه خوابیده با پنجه پا رو به داخل",
                name_en: "Lying Leg Curl",
                type: "دستگاه",
                note: "تمرکز عالی روی سر کوتاه عضله دو سر رانی در انتهای انقباض",
                sets: 3,
                reps: "12-15",
                rest: 60
            }
        ]
    },
    "triceps": {
        category: "پشت بازو (Triceps)",
        matchRegex: /tricep|پشت بازو|pushdown|skullcrusher|دیپ|dip/i,
        alternatives: [
            {
                name_fa: "پشت بازو سیمکش طنابی از پشت سر (Overhead Rope)",
                name_en: "Overhead Cable Rope Extension",
                type: "سیمکش",
                note: "قرارگیری دست بالای سر، سر بلند پشت‌بازو را در کشش کامل قرار می‌دهد که کلید ضخامت بازو است",
                sets: 4,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "پشت بازو سیمکش میله صاف/V با آرنج ثابت",
                name_en: "Straight-Bar Cable Pushdown",
                type: "سیمکش",
                note: "بهترین انتخاب برای بارگذاری وزنه سنگین‌تر و تحریک سر خارجی پشت‌بازو",
                sets: 4,
                reps: "10-12",
                rest: 60
            },
            {
                name_fa: "پشت بازو دیپ دستگاه نشسته",
                name_en: "Seated Machine Dip",
                type: "دستگاه",
                note: "ایمن‌ترین شکل اجرای دیپ بدون فشار غیرعادی به کپسول شانه",
                sets: 3,
                reps: "12",
                rest: 60
            }
        ]
    },
    "biceps": {
        category: "جلوبازو و براکیالیس (Biceps)",
        matchRegex: /bicep|جلو بازو|جلوبازو|curl|لاری/i,
        alternatives: [
            {
                name_fa: "جلو بازو دمبل روی میز شیب‌دار (Incline DB Curl)",
                name_en: "Incline Dumbbell Biceps Curl",
                type: "دمبل",
                note: "دست‌ها در پشت تنه قرار گرفته و سر بلند جلوبازو را به شدت تحت کشش قرار می‌دهند (قله بازو)",
                sets: 3,
                reps: "10-12",
                rest: 60
            },
            {
                name_fa: "جلو بازو لاری دستگاه پین‌دار یا میز لاری",
                name_en: "Preacher Curl (Machine or Bench)",
                type: "دستگاه",
                note: "تکیه کامل بازو روی پد مانع از ضربه زدن با شانه شده و سر کوتاه را ایزوله می‌کند",
                sets: 3,
                reps: "10-12",
                rest: 60
            },
            {
                name_fa: "جلو بازو چکشی سیمکش با طناب (Hammer)",
                name_en: "Cable Rope Hammer Curl",
                type: "سیمکش",
                note: "ضخامت‌دهنده عضله براکیالیس و افزایش قطر بازو و ساعد از نمای روبرو",
                sets: 3,
                reps: "12",
                rest: 60
            }
        ]
    },
    "forearms": {
        category: "ساعد و مچ دست",
        matchRegex: /forearm|ساعد|مچ|wrist/i,
        alternatives: [
            {
                name_fa: "ساعد هالتر از پشت سرپا (Behind Back Curl)",
                name_en: "Behind-the-Back Barbell Wrist Curl",
                type: "هالتر",
                note: "مچ دست در موقعیت استراحت قرار می‌گیرد و ضخامت بخش داخلی ساعد را به شدت بالا می‌برد",
                sets: 3,
                reps: "15",
                rest: 45
            },
            {
                name_fa: "جلو بازو مچ برعکس با هالتر EZ (Reverse Curl)",
                name_en: "Reverse EZ-Bar Curl",
                type: "هالتر EZ",
                note: "ضخامت بخش بالایی ساعد و عضله براکیورادیالیس با مچ ارگونومیک میله EZ",
                sets: 3,
                reps: "12-15",
                rest: 60
            },
            {
                name_fa: "ساعد با دمبل لبه میز (Wrist Extension)",
                name_en: "Dumbbell Seated Wrist Extension",
                type: "دمبل",
                note: "تقویت تاندون‌های بازکننده مچ و جلوگیری از آسیب مفصل آرنج",
                sets: 3,
                reps: "15",
                rest: 45
            }
        ]
    },
    "core": {
        category: "میان‌تنه و شکم",
        matchRegex: /plank|پلانک|ab|شکم|کرانچ|crunch|core/i,
        alternatives: [
            {
                name_fa: "زیرشکم خلبانی / بارفیکس با زانوی خم",
                name_en: "Hanging Knee Raise",
                type: "وزن بدن",
                note: "چرخش لگن به سمت بالا برای حداکثر انقباض بخش تحتانی شکم بدون درگیری عضله پسواس کمر",
                sets: 3,
                reps: "15",
                rest: 60
            },
            {
                name_fa: "کرانچ سیمکش زانو زده با طناب",
                name_en: "Kneeling Cable Crunch",
                type: "سیمکش",
                note: "امکان اعمال اضافه بار پیشرونده با تغییر پین سنگین‌تر در سیمکش",
                sets: 3,
                reps: "15",
                rest: 60
            },
            {
                name_fa: "پلانک روی آرنج با لمس متناوب شانه",
                name_en: "Plank with Shoulder Taps",
                type: "وزن بدن",
                note: "افزایش پایداری ضد چرخش هسته بدن و استقامت ایزومتریک",
                sets: 3,
                reps: "45s",
                rest: 45
            }
        ]
    }
};

// --- 1. GLOBAL STATE ---
const state = {
    workouts: null,
    programInfo: null,
    currentProgramId: localStorage.getItem('selected_program') || 'arnold_hybrid',
    currentView: 'workout',
    currentParam: 'day1',
    apiKey: localStorage.getItem('gemini_api_key') || "",
    audioCtx: null,
    timer: null,
    isTimerRunning: false,
    restTimer: null,
    restTimeRemaining: 0,
    loggedWeights: JSON.parse(localStorage.getItem('workout_weights') || '{}'),
    swappedExercises: JSON.parse(localStorage.getItem('swapped_exercises') || '{}'),
    workoutHistory: JSON.parse(localStorage.getItem('workout_history') || '[]'),
    activeChartMetric: 'bench',
    
    // Cloud API & Auth System
    gasUrl: "https://script.google.com/macros/s/AKfycbwsBVIb8nIiGvVEp4pRh1_HWDwSNOd5ae-fYzmkWqi64X7iaEVjzuRi3o1G_0lT3jZFSg/exec",
    currentUser: JSON.parse(localStorage.getItem('user_auth')) || null
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    app.initTheme(); 
    createRestWidgetDOM();
    registerServiceWorker();
    app.updateHeaderStreak();

    // Enable Web Audio on first user interaction
    const unlockAudio = () => {
        initAudio();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Load workout database if user is logged in
    if (state.currentUser) {
        await loadDatabase();
    }

    // Hash routing listener for Back/Forward buttons and deep links
    window.addEventListener('hashchange', () => {
        app.handleRoute();
    });

    // Initial Route Handling
    if (!state.currentUser) {
        window.location.hash = '#login';
        app.loadView('login');
    } else {
        if (!window.location.hash || window.location.hash === '#login') {
            const firstDay = (state.workouts && Object.keys(state.workouts)[0]) || 'day1';
            window.location.hash = `#workout/${firstDay}`;
        }
        app.handleRoute();
    }
});

// PWA Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((reg) => console.log('✅ ServiceWorker Active:', reg.scope))
                .catch((err) => console.warn('⚠️ ServiceWorker note:', err));
        });
    }
}

// Create Swiss Stopwatch Rest Widget
function createRestWidgetDOM() {
    if (document.getElementById('restWidget')) return;
    const widget = document.createElement('div');
    widget.id = 'restWidget';
    widget.className = 'rest-widget';
    widget.innerHTML = `
        <div class="rest-time-display" id="restTimeDisplay">00:00</div>
        <div class="rest-btn-group">
            <button type="button" class="rest-adj-btn" onclick="app.adjustRestTime(-15)" title="کاهش ۱۵ ثانیه">-15s</button>
            <button type="button" class="rest-adj-btn" onclick="app.adjustRestTime(30)" title="افزایش ۳۰ ثانیه">+30s</button>
        </div>
        <button type="button" class="rest-skip-btn" onclick="app.skipRest()">رد کردن ⏭</button>
    `;
    document.body.appendChild(widget);
}

// Dynamically load workouts based on Selected Program, User Assigned Program, or Fallback
async function loadDatabase(targetProgramId = null) {
    try {
        const programName = targetProgramId || 
                            state.currentProgramId || 
                            localStorage.getItem('selected_program') || 
                            state.currentUser?.assignedProgram || 
                            'arnold_hybrid';
        
        let res = await fetch(`./data/${programName}.json`);
        if (!res.ok && programName !== 'arnold_hybrid') {
            res = await fetch('./data/arnold_hybrid.json');
        }
        if (!res.ok) {
            res = await fetch('./data/workouts.json');
        }
        
        if (res.ok) {
            const data = await res.json();
            state.workouts = data.days;
            state.programInfo = data.program_info || {};
            state.currentProgramId = programName;
            localStorage.setItem('selected_program', programName);
            if (state.currentUser) {
                state.currentUser.assignedProgram = programName;
                localStorage.setItem('user_auth', JSON.stringify(state.currentUser));
            }
            if (app.applyAllSavedSwaps) app.applyAllSavedSwaps();
            console.log(`✅ Loaded Program: ${programName}.json (${data.program_info?.name || ''})`);
            app.renderWorkoutNav();
            return true;
        } else {
            console.error("برنامه تمرینی یافت نشد.");
        }
    } catch (error) {
        console.error("Database load error, trying fallback:", error);
        try {
            const fallbackRes = await fetch('./data/workouts.json');
            if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                state.workouts = data.days;
                state.programInfo = data.program_info || {};
                state.currentProgramId = 'workouts';
                if (app.applyAllSavedSwaps) app.applyAllSavedSwaps();
                app.renderWorkoutNav();
                return true;
            }
        } catch(e) {}
    }
    return false;
}

// Helper: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- 3. APP ROUTER & CORE LOGIC ---
const app = {
    navigateTo: (viewName, param = null) => {
        if (state.isTimerRunning) {
            alert('لطفاً ابتدا تایمر فعال حرکت را متوقف کنید!');
            return;
        }
        const targetHash = param ? `#${viewName}/${param}` : `#${viewName}`;
        if (window.location.hash === targetHash) {
            app.loadView(viewName, param);
        } else {
            window.location.hash = targetHash;
        }
    },

    handleRoute: async () => {
        const rawHash = window.location.hash.replace(/^#/, '').trim();
        if (!rawHash) {
            if (!state.currentUser) {
                window.location.hash = '#login';
                return;
            }
            const firstDay = (state.workouts && Object.keys(state.workouts)[0]) || 'day1';
            window.location.hash = `#workout/${firstDay}`;
            return;
        }

        const parts = rawHash.split('/');
        const view = parts[0];
        let param = parts[1] || null;

        if (!state.currentUser && view !== 'login') {
            window.location.hash = '#login';
            return;
        }
        if (state.currentUser && view === 'login') {
            window.location.hash = '#profile';
            return;
        }

        if (view === 'workout' && !param && state.workouts) {
            param = Object.keys(state.workouts)[0] || 'day1';
        }

        await app.loadView(view, param);
    },

    renderWorkoutNav: () => {
        const container = document.getElementById('dynamic-workout-days');
        if (!container || !state.workouts) return;

        let html = '';
        const dayKeys = Object.keys(state.workouts);
        dayKeys.forEach((key, index) => {
            const day = state.workouts[key];
            const label = `روز ${index + 1}`;
            html += `<button type="button" class="nav-tab" id="nav-btn-${key}" onclick="app.navigateTo('workout', '${key}')" title="${escapeHtml(day.title || label)}">${label}</button>`;
        });
        container.innerHTML = html;
        app.updateActiveNav();
    },

    updateActiveNav: () => {
        document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
        if (state.currentView === 'workout' && state.currentParam) {
            const activeDayBtn = document.getElementById(`nav-btn-${state.currentParam}`);
            if (activeDayBtn) activeDayBtn.classList.add('active');
        } else if (state.currentView) {
            const activeBtn = document.getElementById(`nav-btn-${state.currentView}`);
            if (activeBtn) activeBtn.classList.add('active');
        }
    },

    loadView: async (viewName, param = null) => {
        if (state.isTimerRunning) return alert('لطفاً ابتدا تایمر فعال حرکت را متوقف کنید!');
        app.skipRest();
        app.closeAllModals();
        
        if (!state.currentUser && viewName !== 'login') {
            return app.navigateTo('login');
        }
        if (state.currentUser && viewName === 'login') {
            return app.navigateTo('profile');
        }

        state.currentView = viewName;
        state.currentParam = param;
        
        const nav = document.getElementById('main-nav');
        if (nav) nav.style.display = (viewName === 'login') ? 'none' : 'block';

        const container = document.getElementById('app-container');
        container.innerHTML = `<div style="text-align:center; margin-top:50px; color:var(--text-secondary); font-size:0.88rem;">
            در حال بارگذاری...
        </div>`;

        try {
            const response = await fetch(`./views/${viewName}.html`);
            if (!response.ok) throw new Error(`View file ${viewName}.html not found`);
            const html = await response.text();
            
            container.innerHTML = html;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (viewName === 'workout') {
                if (!state.workouts) await loadDatabase();
                app.setupWorkoutView(param);
            } else if (viewName === 'programs') {
                if (!state.workouts) await loadDatabase();
                app.setupProgramsView();
            } else if (viewName === 'profile') {
                app.setupProfileView();
            } else if (viewName === 'assessment') {
                app.setupAssessmentView();
            }

            app.updateActiveNav();

        } catch (error) {
            console.error(error);
            container.innerHTML = `<h3 style="color:#ef4444; text-align:center; margin-top:50px; font-size:0.95rem;">
                خطا در بارگذاری صفحه. لطفاً اتصال اینترنت را بررسی کنید.
            </h3>`;
        }
    },

    // --- 4. AUTHENTICATION & API ---
    signup: async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerText;
        btn.innerText = "در حال ثبت‌نام...";
        btn.disabled = true;

        const formData = new FormData(e.target);
        const fullName = (formData.get('fullName') || '').trim();
        const phone = (formData.get('phone') || '').trim();
        const password = (formData.get('password') || '').trim();

        try {
            const res = await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: "register", phone, fullName, password })
            });
            const result = await res.json();
            
            if (result.status === "success") {
                alert("ثبت‌نام موفق! حالا می‌توانید وارد حساب خود شوید.");
                app.toggleAuth('login');
            } else {
                alert("خطا: " + result.message);
            }
        } catch(err) {
            alert("خطا در ارتباط با سرور ابری!");
        }
        btn.innerText = origText;
        btn.disabled = false;
    },

    login: async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerText;
        btn.innerText = "در حال ورود...";
        btn.disabled = true;

        const formData = new FormData(e.target);
        const phone = (formData.get('phone') || '').trim();
        const password = (formData.get('password') || '').trim();

        try {
            const res = await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: "login", phone, password })
            });
            const result = await res.json();
            
            if (result.status === "success") {
                state.currentUser = result.user;
                localStorage.setItem('user_auth', JSON.stringify(result.user));
                await loadDatabase();
                app.navigateTo('workout');
            } else {
                alert("خطا: " + result.message);
            }
        } catch(err) {
            alert("خطا در ارتباط با سرور ابری! در صورت عدم دسترسی به اینترنت، اتصال را بررسی کنید.");
        }
        btn.innerText = origText;
        btn.disabled = false;
    },

    logout: () => {
        localStorage.removeItem('user_auth');
        state.currentUser = null;
        state.workouts = null;
        app.navigateTo('login');
    },

    submitAssessment: async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const answers = Object.fromEntries(formData.entries());
        localStorage.setItem('user_assessment', JSON.stringify(answers));
        
        const btn = document.getElementById('assessment-submit-btn');
        const origText = btn ? btn.innerText : '';
        if (btn) {
            btn.innerText = "در حال ذخیره...";
            btn.disabled = true;
        }

        try {
            await fetch(state.gasUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ 
                    action: "saveAssessment", 
                    phone: state.currentUser ? state.currentUser.phone : '', 
                    data: answers 
                })
            });
            if (btn) {
                btn.innerText = "✓ در سرور ثبت شد";
                btn.style.background = "var(--success)";
            }
            setTimeout(() => app.navigateTo('profile'), 1000);
        } catch(err) {
            alert("اطلاعات در دستگاه ذخیره شد اما به دلیل اینترنت به سرور ابری ارسال نشد.");
            if (btn) {
                btn.innerText = origText;
                btn.disabled = false;
            }
            app.navigateTo('profile');
        }
    },

    // --- 5. PROGRESSIVE OVERLOAD ADVISOR & WEIGHT TRACKING ---
    saveWeight: (exerciseCode, value) => {
        const prog = state.currentProgramId || 'arnold_hybrid';
        const day = state.currentParam || 'day1';
        const fullKey = `${prog}_${day}_${exerciseCode}`;
        state.loggedWeights[fullKey] = value;
        state.loggedWeights[exerciseCode] = value; // fallback
        localStorage.setItem('workout_weights', JSON.stringify(state.loggedWeights));
        
        // Dynamically update the overload chip for this exercise if weight changes
        const currentEx = app.findExerciseByCode(exerciseCode);
        if (currentEx) {
            const chip = document.getElementById(`overload-chip-${exerciseCode}`);
            if (chip) {
                const ov = app.calculateOverload(currentEx, value);
                if (ov) {
                    chip.className = 'overload-chip';
                    chip.title = `هدف اضافه بار بعدی: ${ov.target}kg`;
                    chip.onclick = () => app.applyOverload(exerciseCode, ov.target);
                    chip.innerHTML = `
                        <span class="overload-spark">⚡</span>
                        <span class="overload-val">${ov.target}kg</span>
                        <span class="overload-diff">+${ov.diff}</span>`;
                }
            }
        }
    },

    getSavedWeight: (exerciseCode) => {
        const prog = state.currentProgramId || 'arnold_hybrid';
        const day = state.currentParam || 'day1';
        const fullKey = `${prog}_${day}_${exerciseCode}`;
        if (state.loggedWeights[fullKey] !== undefined) {
            return state.loggedWeights[fullKey];
        }
        return state.loggedWeights[exerciseCode] || '';
    },

    calculateOverload: (ex, currentWeightStr) => {
        const val = parseFloat(currentWeightStr);
        if (isNaN(val) || val <= 0) return null;
        
        const nameCombo = ((ex.name_en || '') + ' ' + (ex.name_fa || '')).toLowerCase();
        // Heavy compound movements use +2.5kg step; isolation uses +1.0kg
        const isCompound = val >= 35 || /bench|press|squat|deadlift|row|hack|اسکات|پرس|ددلیفت|زیربغل|هک/i.test(nameCombo);
        const diff = isCompound ? 2.5 : 1.0;
        const target = parseFloat((val + diff).toFixed(1));
        return { target, diff };
    },

    applyOverload: (exerciseCode, targetWeight) => {
        app.saveWeight(exerciseCode, targetWeight);
        const input = document.getElementById(`weight-input-${exerciseCode}`);
        if (input) {
            input.value = targetWeight;
            input.classList.add('overload-glow-highlight');
            setTimeout(() => input.classList.remove('overload-glow-highlight'), 1200);
        }
        playAudioCue('tick');
        if (navigator.vibrate) navigator.vibrate(60);
    },

    // --- 6. SMART SWAP ENGINE (دستگاه اشغاله / جایگزین فوری) ---
    findExerciseByCode: (exerciseCode) => {
        if (!state.workouts || !state.currentParam) return null;
        const day = state.workouts[state.currentParam];
        if (!day) return null;

        const parts = day.parts || [{ exercises: day.exercises || [] }];
        for (const p of parts) {
            for (const ex of (p.exercises || [])) {
                if (String(ex.code) === String(exerciseCode)) return ex;
            }
        }
        return null;
    },

    findSwapCategory: (nameFa = '', nameEn = '') => {
        const query = `${nameFa} ${nameEn}`.toLowerCase();
        for (const [catKey, catData] of Object.entries(SWAP_CATALOG)) {
            if (catData.matchRegex && catData.matchRegex.test(query)) {
                return catData;
            }
        }
        return SWAP_CATALOG["bench_press"]; // intelligent fallback
    },

    openSmartSwap: (exerciseCode) => {
        const ex = app.findExerciseByCode(exerciseCode);
        if (!ex) return;

        const modal = document.getElementById('smartSwapModal');
        const backdrop = document.getElementById('modalBackdrop');
        const currentNameEl = document.getElementById('swapCurrentName');
        const currentEnEl = document.getElementById('swapCurrentEn');
        const optionsContainer = document.getElementById('swapOptionsContainer');
        const revertWrapper = document.getElementById('swapRevertWrapper');
        const revertBtn = document.getElementById('swapRevertBtn');
        const aiCustomBtn = document.getElementById('swapAiCustomBtn');

        if (!modal || !optionsContainer) return;

        currentNameEl.innerText = ex.name_fa || ex.name_en;
        currentEnEl.innerText = ex.name_en || '';

        const prog = state.currentProgramId || 'arnold_hybrid';
        const day = state.currentParam || 'day1';
        const swapKey = `${prog}_${day}_${exerciseCode}`;
        const hasActiveSwap = !!(state.swappedExercises && state.swappedExercises[swapKey]);

        if (revertWrapper && revertBtn) {
            if (hasActiveSwap) {
                revertWrapper.style.display = 'block';
                revertBtn.onclick = () => app.revertSwap(exerciseCode);
            } else {
                revertWrapper.style.display = 'none';
            }
        }

        const catData = app.findSwapCategory(ex.name_fa, ex.name_en);
        const alts = (catData && catData.alternatives) ? catData.alternatives : [];

        let html = '';
        alts.forEach((alt, idx) => {
            html += `
            <div class="swap-option-card" onclick="app.applySwap('${escapeHtml(exerciseCode)}', ${idx})">
                <div class="swap-opt-top">
                    <div class="swap-opt-titles">
                        <strong class="swap-opt-fa">${escapeHtml(alt.name_fa)}</strong>
                        <span class="swap-opt-en">${escapeHtml(alt.name_en)}</span>
                    </div>
                    <span class="swap-type-pill type-${escapeHtml(alt.type)}">${escapeHtml(alt.type)}</span>
                </div>
                <p class="swap-opt-note">${escapeHtml(alt.note)}</p>
                <div class="swap-opt-footer">
                    <span class="swap-opt-reps">تارگت: ${alt.sets} ست × ${alt.reps}</span>
                    <button type="button" class="btn-choose-swap">انتخاب این حرکت ⚡</button>
                </div>
            </div>`;
        });

        optionsContainer.innerHTML = html;

        if (aiCustomBtn) {
            aiCustomBtn.onclick = () => {
                app.closeAllModals();
                const q = `دستگاه یا تجهیزات حرکت «${ex.name_fa} (${ex.name_en})» در باشگاه پر و اشغال است یا می‌خواهم جایگزین کنم. با توجه به شرایط بدنی من (شانه چپ حساس، بدون اسکات آزاد)، ۲ الی ۳ حرکت جایگزین عالی با دمبل یا سیمکش پیشنهاد بده همراه با دلیل بیومکانیکی کوتاه.`;
                app.askAI(null, q);
            };
        }

        modal.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
    },

    applySwap: (exerciseCode, altIdx) => {
        const ex = app.findExerciseByCode(exerciseCode);
        if (!ex) return;

        const catData = app.findSwapCategory(ex.name_fa, ex.name_en);
        if (!catData || !catData.alternatives || !catData.alternatives[altIdx]) return;
        const selectedAlt = catData.alternatives[altIdx];

        const prog = state.currentProgramId || 'arnold_hybrid';
        const day = state.currentParam || 'day1';
        const swapKey = `${prog}_${day}_${exerciseCode}`;

        if (!state.swappedExercises) state.swappedExercises = {};

        const originalInfo = ex.original_data || {
            name_fa: ex.name_fa,
            name_en: ex.name_en,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest,
            note: ex.note
        };

        const swapRecord = {
            code: exerciseCode,
            prog,
            day,
            original: originalInfo,
            swappedTo: {
                name_fa: selectedAlt.name_fa,
                name_en: selectedAlt.name_en,
                type: selectedAlt.type,
                sets: selectedAlt.sets || ex.sets,
                reps: selectedAlt.reps || ex.reps,
                rest: selectedAlt.rest || ex.rest,
                note: `[جایگزین شده با ${selectedAlt.type}]: ${selectedAlt.note}`
            }
        };

        state.swappedExercises[swapKey] = swapRecord;
        localStorage.setItem('swapped_exercises', JSON.stringify(state.swappedExercises));

        ex.name_fa = selectedAlt.name_fa;
        ex.name_en = selectedAlt.name_en;
        ex.sets = selectedAlt.sets || ex.sets;
        ex.reps = selectedAlt.reps || ex.reps;
        ex.rest = selectedAlt.rest || ex.rest;
        ex.note = `[جایگزین ${selectedAlt.type}]: ${selectedAlt.note}`;
        ex.is_swapped = true;
        ex.original_data = originalInfo;

        app.closeAllModals();
        playAudioCue('go');
        if (navigator.vibrate) navigator.vibrate([80, 40, 80]);

        app.setupWorkoutView(state.currentParam);
    },

    revertSwap: (exerciseCode) => {
        const prog = state.currentProgramId || 'arnold_hybrid';
        const day = state.currentParam || 'day1';
        const swapKey = `${prog}_${day}_${exerciseCode}`;

        if (state.swappedExercises && state.swappedExercises[swapKey]) {
            const swapRecord = state.swappedExercises[swapKey];
            const ex = app.findExerciseByCode(exerciseCode);
            if (ex && swapRecord.original) {
                ex.name_fa = swapRecord.original.name_fa;
                ex.name_en = swapRecord.original.name_en;
                ex.sets = swapRecord.original.sets;
                ex.reps = swapRecord.original.reps;
                ex.rest = swapRecord.original.rest;
                ex.note = swapRecord.original.note;
                ex.is_swapped = false;
                delete ex.original_data;
            }
            delete state.swappedExercises[swapKey];
            localStorage.setItem('swapped_exercises', JSON.stringify(state.swappedExercises));
        }

        app.closeAllModals();
        playAudioCue('tick');
        app.setupWorkoutView(state.currentParam);
    },

    applyAllSavedSwaps: () => {
        if (!state.workouts || !state.swappedExercises) return;
        const prog = state.currentProgramId || 'arnold_hybrid';

        Object.keys(state.swappedExercises).forEach(key => {
            if (!key.startsWith(`${prog}_`)) return;
            const swapRecord = state.swappedExercises[key];
            if (!swapRecord || !swapRecord.day || !swapRecord.code) return;

            const dayData = state.workouts[swapRecord.day];
            if (!dayData) return;

            const parts = dayData.parts || [{ exercises: dayData.exercises || [] }];
            for (const p of parts) {
                for (const ex of (p.exercises || [])) {
                    if (String(ex.code) === String(swapRecord.code)) {
                        ex.original_data = swapRecord.original;
                        ex.name_fa = swapRecord.swappedTo.name_fa;
                        ex.name_en = swapRecord.swappedTo.name_en;
                        ex.sets = swapRecord.swappedTo.sets;
                        ex.reps = swapRecord.swappedTo.reps;
                        ex.rest = swapRecord.swappedTo.rest;
                        ex.note = swapRecord.swappedTo.note;
                        ex.is_swapped = true;
                    }
                }
            }
        });
    },

    // --- 7. WORKOUT STREAK & ACTIVITY HEATMAP ---
    getWorkoutHistory: () => {
        let hist = JSON.parse(localStorage.getItem('workout_history') || 'null');
        if (!hist || hist.length === 0) {
            hist = app.seedInitialHistory();
            localStorage.setItem('workout_history', JSON.stringify(hist));
        }
        return hist;
    },

    seedInitialHistory: () => {
        const sessions = [];
        const now = new Date();
        const daysAgo = [22, 20, 18, 17, 15, 13, 11, 10, 8, 6, 4, 3, 1];
        daysAgo.forEach((ago, idx) => {
            const d = new Date(now.getTime() - ago * 24 * 60 * 60 * 1000);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            sessions.push({
                date: `${y}-${m}-${day}`,
                programId: state.currentProgramId || 'arnold_hybrid',
                dayId: `day${(idx % 5) + 1}`,
                volume: 5200 + ((idx * 400) % 3200),
                timestamp: d.getTime()
            });
        });
        return sessions;
    },

    recordWorkoutCompletion: (dayId, volume = 6500) => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const history = app.getWorkoutHistory();
        const existingIdx = history.findIndex(h => h.date === dateStr);
        
        if (existingIdx >= 0) {
            history[existingIdx].volume = Math.max(history[existingIdx].volume || 0, volume);
            history[existingIdx].dayId = dayId || history[existingIdx].dayId;
        } else {
            history.push({
                date: dateStr,
                programId: state.currentProgramId || 'arnold_hybrid',
                dayId: dayId || state.currentParam || 'day1',
                volume: volume,
                timestamp: Date.now()
            });
        }
        localStorage.setItem('workout_history', JSON.stringify(history));
        app.updateHeaderStreak();
        if (state.currentView === 'profile') {
            app.renderHeatmap();
        }
    },

    toggleTodayWorkout: () => {
        const todayStr = new Date().toISOString().split('T')[0];
        let history = app.getWorkoutHistory();
        const idx = history.findIndex(h => h.date === todayStr);
        if (idx >= 0) {
            history.splice(idx, 1);
        } else {
            history.push({
                date: todayStr,
                programId: state.currentProgramId || 'arnold_hybrid',
                dayId: state.currentParam || 'day1',
                volume: 6800,
                timestamp: Date.now()
            });
        }
        localStorage.setItem('workout_history', JSON.stringify(history));
        playAudioCue('go');
        app.updateHeaderStreak();
        app.setupProfileView();
    },

    getStreakStats: () => {
        const history = app.getWorkoutHistory();
        const dateSet = new Set(history.map(h => h.date));
        
        let currentStreak = 0;
        const now = new Date();
        let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayStr = checkDate.toISOString().split('T')[0];
        
        if (!dateSet.has(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        while (true) {
            const dStr = checkDate.toISOString().split('T')[0];
            if (dateSet.has(dStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        const sortedDates = Array.from(dateSet).sort();
        let maxStreak = 0;
        let tempStreak = 0;
        let prevTime = null;
        
        sortedDates.forEach(ds => {
            const dt = new Date(ds).getTime();
            if (prevTime === null) {
                tempStreak = 1;
            } else {
                const diffDays = Math.round((dt - prevTime) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    tempStreak++;
                } else if (diffDays > 1) {
                    tempStreak = 1;
                }
            }
            if (tempStreak > maxStreak) maxStreak = tempStreak;
            prevTime = dt;
        });
        
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        if (maxStreak === 0 && history.length > 0) maxStreak = 1;

        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const workoutsLast30Days = history.filter(h => (new Date(h.date).getTime()) >= thirtyDaysAgo).length;
        const consistencyRate = Math.min(100, Math.round((workoutsLast30Days / 20) * 100));

        return {
            currentStreak,
            maxStreak,
            totalWorkouts: history.length,
            consistencyRate
        };
    },

    updateHeaderStreak: () => {
        const stats = app.getStreakStats();
        const countEl = document.getElementById('headerStreakCount');
        if (countEl) countEl.innerText = stats.currentStreak;
        const btnEl = document.getElementById('headerStreakBtn');
        if (btnEl) {
            if (stats.currentStreak > 0) {
                btnEl.classList.add('has-streak');
            } else {
                btnEl.classList.remove('has-streak');
            }
        }
    },

    renderHeatmap: () => {
        const grid = document.getElementById('streakHeatmapGrid');
        if (!grid) return;
        
        const history = app.getWorkoutHistory();
        const historyMap = {};
        history.forEach(h => { historyMap[h.date] = h; });

        const stats = app.getStreakStats();
        
        const curEl = document.getElementById('streakCurrentCount');
        const maxEl = document.getElementById('streakMaxCount');
        const totEl = document.getElementById('streakTotalCount');
        const rateEl = document.getElementById('streakRatePercent');
        const footEl = document.getElementById('streakRateFoot');
        
        if (curEl) curEl.innerText = stats.currentStreak;
        if (maxEl) maxEl.innerText = stats.maxStreak;
        if (totEl) totEl.innerText = stats.totalWorkouts;
        if (rateEl) rateEl.innerText = `${stats.consistencyRate}%`;
        if (footEl) {
            footEl.innerText = stats.consistencyRate >= 80 ? 'عالی و متعهد ⚡' : 'در حال رشد 🌱';
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const isTodayDone = !!historyMap[todayStr];
        const btnText = document.getElementById('logTodayText');
        const btnIcon = document.getElementById('logTodayIcon');
        const btnToday = document.getElementById('btnLogTodayToggle');
        if (btnToday) {
            if (isTodayDone) {
                btnToday.classList.add('is-done');
                if (btnText) btnText.innerText = 'تمرین امروز ثبت شد ✓';
                if (btnIcon) btnIcon.innerText = '✓';
            } else {
                btnToday.classList.remove('is-done');
                if (btnText) btnText.innerText = 'ثبت تمرین امروز';
                if (btnIcon) btnIcon.innerText = '+';
            }
        }

        const totalDays = 84; // 12 weeks
        const now = new Date();
        const currentDayOfWeek = (now.getDay() + 1) % 7; 
        const daysOffset = 6 - currentDayOfWeek;
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysOffset);

        const cells = [];
        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
            const dStr = d.toISOString().split('T')[0];
            const record = historyMap[dStr];
            let lvl = 0;
            if (record) {
                const v = record.volume || 4000;
                if (v > 7500) lvl = 3;
                else if (v > 3500) lvl = 2;
                else lvl = 1;
            }
            cells.push({ date: d, dateStr: dStr, record, level: lvl });
        }

        let html = '';
        cells.forEach(c => {
            const isToday = c.dateStr === todayStr;
            html += `
            <div class="heatmap-cell lvl-${c.level} ${isToday ? 'is-today' : ''}" 
                 data-date="${c.dateStr}" 
                 data-level="${c.level}"
                 onclick="app.onHeatmapCellClick('${c.dateStr}', ${c.level})" 
                 title="${c.dateStr}"></div>`;
        });
        grid.innerHTML = html;
    },

    onHeatmapCellClick: (dateStr, level) => {
        const info = document.getElementById('heatmapSelectedInfo');
        if (!info) return;
        const history = app.getWorkoutHistory();
        const item = history.find(h => h.date === dateStr);
        if (item) {
            info.innerHTML = `🗓️ <strong>${dateStr}</strong>: جلسه تمرینی ثبت شده | تناژ تخمینی: <strong>${(item.volume || 0).toLocaleString('fa-IR')} kg</strong>`;
        } else {
            info.innerHTML = `🗓️ <strong>${dateStr}</strong>: روز استراحت و ریکاوری عضلانی (Rest Day)`;
        }
    },

    // --- 8. PROGRESSION & 1RM CANVAS CHART ---
    setChartMetric: (metric) => {
        state.activeChartMetric = metric;
        document.querySelectorAll('.chart-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.metric === metric);
        });
        app.renderProgressChart();
    },

    getChartDataForMetric: (metric, assessment) => {
        const baseBench = parseFloat(assessment.record_bench) || 75;
        const baseSquat = parseFloat(assessment.record_squat) || 95;
        const baseDeadlift = parseFloat(assessment.record_deadlift) || 115;
        
        const labels = ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴", "هفته ۵", "هفته ۶", "جلسه اخیر"];
        
        if (metric === 'volume') {
            return [
                { label: "هفته ۱", value: 5200 },
                { label: "هفته ۲", value: 5650 },
                { label: "هفته ۳", value: 5900 },
                { label: "هفته ۴", value: 6400 },
                { label: "هفته ۵", value: 6750 },
                { label: "هفته ۶", value: 7200 },
                { label: "جلسه اخیر", value: 7600 }
            ];
        }

        let base = baseBench;
        if (metric === 'squat') base = baseSquat;
        else if (metric === 'deadlift') base = baseDeadlift;

        const data = [];
        const increments = [-6, -4, -2.5, -1, +1, +2.5, +4];
        labels.forEach((lbl, i) => {
            const val = parseFloat((base + increments[i]).toFixed(1));
            data.push({ label: lbl, value: Math.max(20, val) });
        });
        return data;
    },

    renderProgressChart: () => {
        const canvas = document.getElementById('progressChart');
        if (!canvas) return;
        
        const metric = state.activeChartMetric || 'bench';
        const assessment = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const data = app.getChartDataForMetric(metric, assessment);
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = rect.width || 720;
        const height = 230;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        if (data.length < 2) return;

        const padLeft = 46;
        const padRight = 24;
        const padTop = 24;
        const padBottom = 34;

        const chartW = width - padLeft - padRight;
        const chartH = height - padTop - padBottom;

        const vals = data.map(d => d.value);
        const minVal = Math.floor(Math.min(...vals) * 0.9);
        const maxVal = Math.ceil(Math.max(...vals) * 1.08);
        const range = (maxVal - minVal) || 1;

        const gridLines = 4;
        ctx.font = '11px "SF Mono", monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
        const textColor = isDark ? '#71717a' : '#a1a1aa';
        const accentColor = isDark ? '#f97316' : '#ea580c';

        for (let i = 0; i <= gridLines; i++) {
            const yVal = minVal + (range * i) / gridLines;
            const y = padTop + chartH - (chartH * i) / gridLines;

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(width - padRight, y);
            ctx.stroke();

            ctx.fillStyle = textColor;
            const displayVal = metric === 'volume' ? `${Math.round(yVal / 1000)}k` : `${Math.round(yVal)}`;
            ctx.fillText(displayVal, padLeft - 8, y);
        }

        const points = data.map((d, idx) => {
            const x = padLeft + (chartW * idx) / (data.length - 1);
            const y = padTop + chartH - ((d.value - minVal) / range) * chartH;
            return { x, y, data: d };
        });

        // Gradient below curve
        const areaGradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
        areaGradient.addColorStop(0, isDark ? 'rgba(249, 115, 22, 0.28)' : 'rgba(234, 88, 12, 0.18)');
        areaGradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

        ctx.fillStyle = areaGradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, padTop + chartH);
        points.forEach((pt, i) => {
            if (i === 0) {
                ctx.lineTo(pt.x, pt.y);
            } else {
                const prev = points[i - 1];
                const cx = (prev.x + pt.x) / 2;
                ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
            }
        });
        ctx.lineTo(points[points.length - 1].x, padTop + chartH);
        ctx.closePath();
        ctx.fill();

        // Stroke line
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(249, 115, 22, 0.4)';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        points.forEach((pt, i) => {
            if (i === 0) {
                ctx.moveTo(pt.x, pt.y);
            } else {
                const prev = points[i - 1];
                const cx = (prev.x + pt.x) / 2;
                ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
            }
        });
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        points.forEach((pt, idx) => {
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (data.length <= 7 || idx % 2 === 0 || idx === data.length - 1) {
                ctx.fillStyle = textColor;
                ctx.fillText(pt.data.label, pt.x, padTop + chartH + 8);
            }
        });

        const lastVal = vals[vals.length - 1];
        const peakVal = Math.max(...vals);
        const unit = metric === 'volume' ? 'kg کل' : 'kg';
        const est1RM = metric === 'volume' ? `${Math.round(lastVal).toLocaleString('fa-IR')} kg` : `${Math.round(lastVal * 1.05)} kg`;
        const overloadNext = metric === 'volume' ? '+۵۰۰ kg تناژ' : '+۲.۵ kg';

        const peakEl = document.getElementById('chartPeakVal');
        const cur1rmEl = document.getElementById('chartCurrent1RM');
        const overNextEl = document.getElementById('chartOverloadNext');

        if (peakEl) peakEl.innerText = `${peakVal} ${unit}`;
        if (cur1rmEl) cur1rmEl.innerText = est1RM;
        if (overNextEl) overNextEl.innerText = overloadNext;

        canvas.onmousemove = (e) => app.handleChartHover(e, canvas, points, metric);
        canvas.ontouchstart = (e) => app.handleChartHover(e.touches[0], canvas, points, metric);
        canvas.ontouchmove = (e) => app.handleChartHover(e.touches[0], canvas, points, metric);
        canvas.onmouseleave = () => {
            const tip = document.getElementById('chartTooltip');
            if (tip) tip.style.display = 'none';
        };
    },

    handleChartHover: (e, canvas, points, metric) => {
        const tip = document.getElementById('chartTooltip');
        if (!tip) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let nearest = null;
        let minDist = 9999;
        points.forEach(pt => {
            const dist = Math.abs(pt.x - mouseX);
            if (dist < minDist) {
                minDist = dist;
                nearest = pt;
            }
        });

        if (nearest && minDist < 35) {
            tip.style.display = 'block';
            tip.style.left = `${nearest.x}px`;
            tip.style.top = `${nearest.y - 12}px`;
            const unit = metric === 'volume' ? 'kg تناژ کل' : 'kg';
            tip.innerHTML = `<strong>${nearest.data.label}</strong><br>${nearest.data.value} ${unit}`;
        } else {
            tip.style.display = 'none';
        }
    },

    // --- 9. VIEWS SETUP ---
    setupWorkoutView: (dayId) => {
        const container = document.getElementById('workout-dynamic-content');
        if (!container || !state.workouts) return; 
        
        const activeDayId = dayId || Object.keys(state.workouts)[0] || 'day1';
        const dayData = state.workouts[activeDayId];
        if (!dayData) return;

        const currentProgEl = document.getElementById('workout-current-program-name');
        if (currentProgEl) {
            const pInfo = state.programInfo;
            currentProgEl.innerText = pInfo ? `${pInfo.name} (${pInfo.version || ''})` : 'برنامه تمرینی';
        }

        const titleEl = document.getElementById('workout-day-title');
        if (titleEl) titleEl.innerText = dayData.title;

        const parts = dayData.parts || [
            {
                title: 'حرکات تمرینی جلسه',
                exercises: dayData.exercises || []
            }
        ];

        let html = '';
        parts.forEach(part => {
            html += `<div class="part-header">${escapeHtml(part.title)}</div><div class="exercise-list">`;
            part.exercises.forEach(ex => {
                const isTime = ex.time !== undefined;
                let targetVal = ex.reps || '';
                let timeSeconds = 0;
                if (isTime) {
                    const timeStr = String(ex.time).trim();
                    if (/min|دقیقه/i.test(timeStr)) {
                        timeSeconds = (parseInt(timeStr, 10) || 1) * 60;
                        targetVal = timeStr;
                    } else if (/s$|sec|ثانیه/i.test(timeStr)) {
                        timeSeconds = parseInt(timeStr, 10) || 30;
                        targetVal = timeStr;
                    } else {
                        timeSeconds = parseInt(timeStr, 10) || 30;
                        targetVal = `${timeSeconds}s`;
                    }
                }
                
                // Tactical tactile set tiles (1, 2, 3, 4)
                let tilesHtml = '<div class="set-tiles-row">';
                for (let i = 0; i < ex.sets; i++) {
                    tilesHtml += `<div class="set-tile" data-set="${i+1}">${i+1}</div>`;
                }
                tilesHtml += '</div>';

                const savedWeight = app.getSavedWeight(ex.code);
                const safeQuery = encodeURIComponent(ex.ai_query || ex.name_en || '');

                // Overload Advisor Target Computation
                const overload = app.calculateOverload(ex, savedWeight);
                let overloadHtml = '';
                if (overload) {
                    overloadHtml = `
                    <button type="button" class="overload-chip" id="overload-chip-${escapeHtml(ex.code)}" 
                        onclick="app.applyOverload('${escapeHtml(ex.code)}', ${overload.target})" 
                        title="هدف اضافه بار بعدی: ${overload.target}kg">
                        <span class="overload-spark">⚡</span>
                        <span class="overload-val">${overload.target}kg</span>
                        <span class="overload-diff">+${overload.diff}</span>
                    </button>`;
                } else {
                    overloadHtml = `
                    <span class="overload-chip hint" id="overload-chip-${escapeHtml(ex.code)}" title="ثبت وزنه اولیه برای دریافت پیشنهاد اضافه بار">
                        <span class="overload-spark">💡</span> اضافه بار
                    </span>`;
                }

                const isSwapped = !!ex.is_swapped;

                html += `
                <article class="exercise-module locked ${isSwapped ? 'is-swapped-exercise' : ''}" 
                    data-code="${escapeHtml(ex.code)}" 
                    data-sets="${ex.sets}" 
                    data-completed="0" 
                    data-rest="${ex.rest !== undefined ? ex.rest : 60}" 
                    ${isTime ? `data-time="${timeSeconds}"` : ''} 
                    onclick="app.handleClick(this)">
                    
                    <div class="module-header">
                        <div class="module-title-group">
                            <span class="module-code">${escapeHtml(ex.code)}</span>
                            <div class="module-names">
                                <h3 class="module-name-fa">
                                    ${escapeHtml(ex.name_fa)}
                                    ${isSwapped ? '<span class="swap-active-pill">جایگزین</span>' : ''}
                                </h3>
                                <span class="module-name-en">${escapeHtml(ex.name_en)}</span>
                            </div>
                        </div>
                        <div class="module-badges">
                            <span class="metric-badge">${ex.sets} ست</span>
                            <span class="metric-badge">${targetVal}</span>
                        </div>
                    </div>

                    ${tilesHtml}

                    <div class="module-controls" onclick="event.stopPropagation()">
                        <div class="controls-weight-block">
                            <div class="weight-stepper">
                                <span style="font-size:0.75rem;">وزنه:</span>
                                <input type="number" class="weight-input-field" id="weight-input-${escapeHtml(ex.code)}" placeholder="—" value="${savedWeight}" 
                                    oninput="app.saveWeight('${escapeHtml(ex.code)}', this.value)" 
                                    onkeydown="event.stopPropagation()">
                                <span class="weight-unit">kg</span>
                            </div>
                            ${overloadHtml}
                        </div>

                        <div class="controls-action-block">
                            <button type="button" class="btn-smart-swap" onclick="app.openSmartSwap('${escapeHtml(ex.code)}')" title="دستگاه پر است یا جایگزین می‌خواهید؟">
                                <span>🔄</span> جایگزین
                            </button>
                            <button type="button" class="btn-ai-consult" onclick="app.askAI(event, decodeURIComponent('${safeQuery}'))">
                                <span>✦</span> مشاوره
                            </button>
                        </div>
                    </div>

                    ${ex.note ? `<p class="module-note-text">${escapeHtml(ex.note)}</p>` : ''}
                    ${isTime ? `<div class="timer-overlay">${timeSeconds}<span>توقف</span></div>` : ''}
                </article>`;
            });
            html += `</div>`;
        });
        
        if (dayData.post_workout) {
            html += `
            <div class="post-workout-note" style="margin-top:20px; padding:14px 18px; border-radius:var(--radius-md); background:var(--bg-card); border:1px solid var(--border-hairline); display:flex; align-items:center; gap:10px;">
                <span style="font-size:1.2rem;">ℹ️</span>
                <div>
                    <strong style="color:var(--text-primary); font-size:0.88rem; display:block;">توضیحات پایان تمرین:</strong>
                    <span style="color:var(--text-secondary); font-size:0.84rem;">${escapeHtml(dayData.post_workout)}</span>
                </div>
            </div>`;
        }

        container.innerHTML = html;

        // Activate the first exercise module
        const allCards = container.querySelectorAll('.exercise-module');
        if (allCards.length > 0) {
            activateCard(allCards[0], false);
        }
    },

    setupProfileView: async () => {
        let savedData = JSON.parse(localStorage.getItem('user_assessment') || 'null');
        const emptyState = document.getElementById('profile-empty-state');
        const profileContainer = document.getElementById('profile-content');
        
        if (emptyState) emptyState.style.display = 'none';
        if (profileContainer) profileContainer.style.display = 'none';

        if (!savedData || Object.keys(savedData).length === 0) {
            if (emptyState) {
                emptyState.innerHTML = `<h3 style="color:var(--text-secondary); text-align:center; padding-top:30px; font-size:0.95rem;">در حال همگام‌سازی با سرور...</h3>`;
                emptyState.style.display = 'block';
            }

            try {
                const phone = state.currentUser ? state.currentUser.phone : '';
                const res = await fetch(`${state.gasUrl}?action=getAssessment&phone=${phone}`);
                const result = await res.json();
                
                if (result.status === "success" && result.data) {
                    savedData = result.data;
                    localStorage.setItem('user_assessment', JSON.stringify(savedData));
                    if (emptyState) emptyState.style.display = 'none';
                } else {
                    if (emptyState) {
                        emptyState.innerHTML = `
                            <h2 style="font-size:1.15rem; margin-bottom:8px;">پروفایل هنوز تکمیل نشده</h2>
                            <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:18px;">برای مشاهده اطلاعات بدنی و رکوردهای قدرت، ابتدا فرم ارزیابی را پر کنید.</p>
                            <button type="button" onclick="app.navigateTo('assessment')" class="btn-primary">رفتن به فرم ارزیابی</button>
                        `;
                    }
                    return;
                }
            } catch (err) {
                console.error("Cloud Sync Error:", err);
                if (emptyState) {
                    emptyState.innerHTML = `
                        <p style="color:#ef4444; font-size:0.85rem;">ارتباط با سرور برقرار نشد.</p>
                        <button type="button" onclick="app.navigateTo('assessment')" class="btn-primary">تکمیل فرم ارزیابی</button>
                    `;
                }
                return;
            }
        }

        if (profileContainer) profileContainer.style.display = 'block';

        const progNameEl = document.getElementById('profile-active-program-name');
        const progDescEl = document.getElementById('profile-active-program-desc');
        if (progNameEl) {
            progNameEl.innerText = state.programInfo ? `${state.programInfo.name} (${state.programInfo.version || ''})` : '—';
        }
        if (progDescEl) {
            progDescEl.innerText = state.programInfo ? (state.programInfo.description || '') : '—';
        }

        if (profileContainer && !document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.type = 'button';
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'btn-logout';
            logoutBtn.innerHTML = 'خروج از حساب کاربری';
            logoutBtn.onclick = app.logout;
            profileContainer.appendChild(logoutBtn);
        }

        const dict = {
            "surplus": "حجم (مازاد)", "maintenance": "تثبیت", "deficit": "کات (نقصان)",
            "chest": "سینه", "back": "پشت", "legs": "پاها", "arms": "دست‌ها", "shoulders": "سرشانه", "calves": "ساق", "none": "هیچکدام",
            "palm": "کف دست", "fingers": "انگشتان", "ankle": "مچ پا", "shin": "وسط ساق"
        };
        const t = (val) => dict[val] || val || '-';

        const elements = {
            'val-age': `${savedData.age || '-'} سال`,
            'val-weight': `${savedData.weight || '-'} kg`,
            'val-height': `${savedData.height || '-'} cm`,
            'val-diet': t(savedData.diet_status),
            'val-squat': `${savedData.record_squat || 0} kg`,
            'val-deadlift': `${savedData.record_deadlift || 0} kg`,
            'val-bench': `${savedData.record_bench || 0} kg`,
            'val-pullups': `${savedData.max_pullups || 0}`,
            'val-pushups': `${savedData.max_pushups || 0}`,
            'val-plank': `${savedData.max_plank_time || 0}s`,
            'val-sleep': `${savedData.avg_sleep || '-'} ساعت`,
            'val-stubborn': t(savedData.stubborn_muscle),
            'val-hamstring': t(savedData.hamstring_toe_touch),
            'val-injury': savedData.injury_history || 'ندارد'
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        }

        app.renderHeatmap();
        setTimeout(() => app.renderProgressChart(), 80);
    },

    setupAssessmentView: () => {
        const savedData = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const form = document.getElementById('assessmentForm');
        if (!form) return;
        
        Object.keys(savedData).forEach(key => {
            const input = form.elements[key];
            if (input) input.value = savedData[key];
        });
    },

    // --- 7. REST TIMER & AUDIO ---
    skipRest: () => {
        clearInterval(state.restTimer);
        state.restTimer = null;
        state.restTimeRemaining = 0;
        const w = document.getElementById('restWidget');
        if(w) w.classList.remove('show');
    },

    adjustRestTime: (seconds) => {
        state.restTimeRemaining = Math.max(5, state.restTimeRemaining + seconds);
        const display = document.getElementById('restTimeDisplay');
        if (display) display.innerText = formatTime(state.restTimeRemaining);
        const widget = document.getElementById('restWidget');
        if (widget) {
            widget.style.transform = 'translateX(-50%) scale(1.05)';
            setTimeout(() => widget.style.transform = 'translateX(-50%) scale(1)', 120);
        }
    },

    // --- 8. MODALS & BACKDROP ---
    closeAllModals: () => {
        const sm = document.getElementById('settingsModal');
        const cm = document.getElementById('celebrationModal');
        const swm = document.getElementById('smartSwapModal');
        const mb = document.getElementById('modalBackdrop');
        if (sm) sm.classList.remove('open');
        if (cm) cm.classList.remove('open');
        if (swm) swm.classList.remove('open');
        if (mb) mb.classList.remove('open');
    },

    toggleSettings: () => {
        const modal = document.getElementById('settingsModal');
        const backdrop = document.getElementById('modalBackdrop');
        const isOpen = modal.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('open', isOpen);
        if (isOpen) {
            const input = document.getElementById('apiKeyInput');
            if (input) input.value = state.apiKey || '';
            const statusEl = document.getElementById('aiModelStatus');
            if (statusEl) {
                const currentModel = localStorage.getItem('gemini_working_model');
                if (currentModel && state.apiKey) {
                    statusEl.innerText = `● Active Model: ${currentModel.replace(/^models\//, '')}`;
                    statusEl.style.display = 'block';
                } else {
                    statusEl.style.display = 'none';
                }
            }
        }
    },
    
    saveApiKey: async () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        const btn = document.getElementById('saveApiKeyBtn');
        const statusEl = document.getElementById('aiModelStatus');

        if (key) {
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'در حال بررسی اتصال به Google AI...';
            }
            if (statusEl) {
                statusEl.innerText = 'Testing connection...';
                statusEl.style.display = 'block';
            }

            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
            localStorage.removeItem('gemini_working_model');

            const detected = await app.detectBestGeminiModel(key);

            if (btn) {
                btn.disabled = false;
                btn.innerText = 'ذخیره و بررسی اتصال';
            }

            if (detected) {
                app.toggleSettings();
                alert(`اتصال هوش مصنوعی با موفقیت برقرار شد! ✨\nمدل فعال: ${detected.replace(/^models\//, '')}`);
            } else {
                app.toggleSettings();
                alert('کلید ذخیره شد.');
            }
        } else {
            localStorage.removeItem('gemini_api_key');
            localStorage.removeItem('gemini_working_model');
            state.apiKey = "";
            if (statusEl) statusEl.style.display = 'none';
            app.toggleSettings();
            alert('کلید هوش مصنوعی پاک شد.');
        }
    },

    detectBestGeminiModel: async (apiKey) => {
        if (!apiKey) return null;
        try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const res = await fetch(listUrl);
            if (res.ok) {
                const data = await res.json();
                if (data.models && Array.isArray(data.models)) {
                    const contentModels = data.models.filter(m => 
                        Array.isArray(m.supportedGenerationMethods) && 
                        m.supportedGenerationMethods.includes('generateContent')
                    );
                    
                    if (contentModels.length > 0) {
                        const preferred = [
                            /gemini-2\.5-flash/i,
                            /gemini-2\.0-flash/i,
                            /gemini-1\.5-flash-latest/i,
                            /gemini-flash-latest/i,
                            /gemini-1\.5-flash/i,
                            /flash/i,
                            /gemini-2\.5-pro/i,
                            /gemini-1\.5-pro/i,
                            /gemini-pro/i
                        ];
                        
                        for (const regex of preferred) {
                            const found = contentModels.find(m => regex.test(m.name));
                            if (found) {
                                localStorage.setItem('gemini_working_model', found.name);
                                console.log(`✅ Auto-detected working Gemini model: ${found.name}`);
                                return found.name;
                            }
                        }
                        
                        const chosen = contentModels[0].name;
                        localStorage.setItem('gemini_working_model', chosen);
                        return chosen;
                    }
                }
            }
        } catch (e) {
            console.warn('Could not query ListModels:', e);
        }

        const fallback = 'models/gemini-2.5-flash';
        localStorage.setItem('gemini_working_model', fallback);
        return fallback;
    },

    triggerCelebration: () => {
        playAudioCue('go');
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        app.recordWorkoutCompletion(state.currentParam);
        const cm = document.getElementById('celebrationModal');
        const mb = document.getElementById('modalBackdrop');
        if (cm) cm.classList.add('open');
        if (mb) mb.classList.add('open');
    },

    closeCelebration: () => {
        app.closeAllModals();
    },

    // --- 9. THEME CONTROLLER ---
    toggleTheme: () => {
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        app.updateMetaColor(next);
        app.updateThemeIcon(next);
    },

    updateMetaColor: (theme) => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if(meta) meta.setAttribute('content', theme === 'dark' ? '#09090b' : '#f8fafc');
    },

    updateThemeIcon: (theme) => {
        const icon = document.getElementById('themeIcon');
        if(icon) icon.innerText = theme === 'dark' ? '☀️' : '🌙';
    },

    initTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        app.updateMetaColor(savedTheme);
        app.updateThemeIcon(savedTheme);
    },

    // --- 10. AI ASSISTANT & QUICK CHIPS ---
    toggleChat: () => document.getElementById('chatWindow').classList.toggle('open'),
    
    sendQuickPrompt: (promptText) => {
        const input = document.getElementById('chatInput');
        if (input) input.value = promptText;
        app.sendMessage(promptText);
    },

    askAI: (e, query) => { 
        if (e) e.stopPropagation(); 
        const chatWin = document.getElementById('chatWindow');
        if (!chatWin.classList.contains('open')) app.toggleChat(); 
        app.sendMessage(query); 
    },

    sendMessage: async (txt) => {
        const input = document.getElementById('chatInput');
        const text = (txt || input.value || '').trim();
        if (!text) return;
        
        if (!state.apiKey) {
            app.toggleSettings();
            alert('لطفاً ابتدا کلید API جمینای خود را در تنظیمات (⚙️) وارد کنید.');
            return;
        }

        const body = document.getElementById('chatBody');
        
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'msg user';
        userMsgDiv.dir = 'auto';
        userMsgDiv.textContent = text;
        body.appendChild(userMsgDiv);
        
        if (input) input.value = '';
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const id = 'ai-msg-' + Date.now();
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.id = id;
        aiMsgDiv.dir = 'auto';
        aiMsgDiv.innerHTML = `<span style="color:var(--text-muted);font-size:0.8rem;">در حال نگارش پاسخ...</span>`;
        body.appendChild(aiMsgDiv);
        setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

        const p = JSON.parse(localStorage.getItem('user_assessment') || '{}');
        const profileContext = `
        کاربر: سن ${p.age||'?'} سال | وزن ${p.weight||'?'} کیلوگرم | سابقه آسیب: ${p.injury_history || 'ندارد'}
        رکوردها: اسکات ${p.record_squat||0} | ددلیفت ${p.record_deadlift||0} | پرس سینه ${p.record_bench||0}
        `;

        // Auto detect / get working model
        let currentModel = localStorage.getItem('gemini_working_model');
        if (!currentModel || currentModel.endsWith('gemini-1.5-flash')) {
            localStorage.removeItem('gemini_working_model');
            currentModel = await app.detectBestGeminiModel(state.apiKey);
        }

        const modelsToTry = [
            currentModel,
            'models/gemini-2.5-flash',
            'models/gemini-2.0-flash',
            'models/gemini-1.5-flash-latest',
            'models/gemini-flash-latest',
            'models/gemini-pro'
        ];
        const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];

        let success = false;
        let lastErrorMsg = '';

        for (const candidate of uniqueModels) {
            const cleanModel = candidate.startsWith('models/') ? candidate : `models/${candidate}`;
            const url = `https://generativelanguage.googleapis.com/v1beta/${cleanModel}:generateContent?key=${state.apiKey}`;

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        contents: [{ 
                            parts: [{ 
                                text: `نقش: مربی فوق‌حرفه‌ای و مشاور بیومکانیک. کوتاه، دقیق، فنی و به زبان فارسی پاسخ بده.\n${profileContext}\nسوال: ${text}` 
                            }] 
                        }] 
                    })
                });

                const d = await res.json();
                
                if (d.error) {
                    lastErrorMsg = d.error.message || 'Unknown error';
                    // If model is not found or unsupported on v1beta, try next model in cascade
                    if (d.error.code === 404 || /not found|not supported|is not supported/i.test(d.error.message)) {
                        console.warn(`Model ${cleanModel} not supported, trying next...`);
                        continue;
                    } else {
                        // Other error such as invalid API key
                        document.getElementById(id).innerHTML = `<strong style="color:#ef4444;">خطای API: ${escapeHtml(d.error.message)}</strong>`;
                        return;
                    }
                }

                let rawText = d.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی دریافت نشد.";
                let escaped = escapeHtml(rawText);
                let formattedText = escaped
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br>');

                document.getElementById(id).innerHTML = formattedText;
                setTimeout(() => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }), 50);

                localStorage.setItem('gemini_working_model', cleanModel);
                success = true;
                break;
            } catch(e) { 
                lastErrorMsg = e.message || 'خطای شبکه در ارتباط با هوش مصنوعی.'; 
            }
        }

        if (!success) {
            document.getElementById(id).innerHTML = `
                <div style="color:#ef4444; font-size:0.85rem; line-height:1.6;">
                    <strong>خطا در برقراری ارتباط با مدل هوش مصنوعی:</strong><br>
                    ${escapeHtml(lastErrorMsg)}<br>
                    <span style="color:var(--text-secondary); font-size:0.78rem;">
                        لطفاً در منوی تنظیمات (⚙️) دکمه «ذخیره و بررسی اتصال» را بزنید تا مدل‌های فعال کلید شما مجدداً بررسی شوند.
                    </span>
                </div>`;
        }
    },

    // --- 11. EXERCISE PROGRESSION ---
    handleClick: (card) => {
        if (state.restTimer) {
            const widget = document.getElementById('restWidget');
            if (widget) {
                widget.style.transform = 'translateX(-50%) scale(1.06)';
                setTimeout(() => widget.style.transform = 'translateX(-50%) scale(1)', 150);
            }
            return;
        }

        if (!card.classList.contains('active-move') && !card.classList.contains('superset-next')) return; 
        initAudio();

        if (card.dataset.time) {
            if (card.classList.contains('timer-active')) stopTimer(card, false);
            else if (!state.isTimerRunning) startTimer(card);
            return;
        }

        if (state.isTimerRunning) return;
        let sets = parseInt(card.dataset.sets, 10);
        let completed = parseInt(card.dataset.completed, 10);
        
        if (completed < sets) {
            card.dataset.completed = ++completed;
            const tiles = card.querySelectorAll('.set-tile');
            if (tiles[completed - 1]) {
                tiles[completed - 1].classList.remove('active-next');
                tiles[completed - 1].classList.add('done');
            }
            if (tiles[completed]) {
                tiles[completed].classList.add('active-next');
            }
            handleSetCompletion(card);
        }
    },

    toggleAuth: (type) => {
        const loginForm = document.getElementById('form-login');
        const signupForm = document.getElementById('form-signup');
        const loginTab = document.getElementById('tab-login');
        const signupTab = document.getElementById('tab-signup');

        if (!loginForm || !signupForm) return;

        if (type === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
        }
    },

    loginAsGuest: async () => {
        const guestUser = {
            fullName: "علی",
            phone: "مهمان",
            assignedProgram: localStorage.getItem('selected_program') || 'arnold_hybrid'
        };
        state.currentUser = guestUser;
        localStorage.setItem('user_auth', JSON.stringify(guestUser));
        await loadDatabase();
        app.navigateTo('programs');
    },

    setupProgramsView: async () => {
        const bannerTitle = document.getElementById('active-program-banner-name');
        const bannerDesc = document.getElementById('active-program-banner-desc');
        const listContainer = document.getElementById('programs-list-container');
        if (!listContainer) return;

        let catalog = PROGRAMS_CATALOG;
        try {
            const res = await fetch('./data/programs.json');
            if (res.ok) {
                catalog = await res.json();
            }
        } catch (e) {
            console.warn('Using embedded catalog');
        }

        const activeId = state.currentProgramId || localStorage.getItem('selected_program') || 'arnold_hybrid';
        const activeProg = catalog.find(p => p.id === activeId) || catalog[0];

        if (bannerTitle) {
            bannerTitle.innerText = activeProg ? `${activeProg.name_fa || activeProg.name} (${activeProg.version})` : (state.programInfo?.name || '—');
        }
        if (bannerDesc) {
            bannerDesc.innerText = activeProg ? (activeProg.tagline || activeProg.description) : (state.programInfo?.description || '—');
        }

        let html = '';
        catalog.forEach(prog => {
            const isActive = prog.id === activeId;
            const tagsHtml = (prog.tags || []).map(t => `<span class="program-tag">${escapeHtml(t)}</span>`).join('');
            
            let daysHtml = '';
            if (prog.daysSummary && prog.daysSummary.length > 0) {
                daysHtml = `
                <div class="program-days-accordion">
                    <button type="button" class="program-days-toggle" onclick="app.toggleDaysAccordion('${prog.id}')">
                        <span>🗓️ پیش‌نمایش روزهای تمرینی (${prog.daysSummary.length} روز)</span>
                        <span id="accordion-arrow-${prog.id}">▼</span>
                    </button>
                    <div class="program-days-list" id="accordion-days-${prog.id}">
                        ${prog.daysSummary.map(d => `
                            <div class="program-day-item">
                                <span class="program-day-item-dot"></span>
                                <span>${escapeHtml(d.title)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            html += `
            <article class="program-card ${isActive ? 'is-active' : ''}" id="prog-card-${prog.id}">
                <div class="program-card-header">
                    <div class="program-card-title-box">
                        <span class="program-card-icon">${prog.icon || '🏋️'}</span>
                        <div class="program-titles">
                            <h2 class="program-title-fa">${escapeHtml(prog.name_fa || prog.name)}</h2>
                            <span class="program-title-en">${escapeHtml(prog.name)}</span>
                        </div>
                    </div>
                    <span class="program-status-pill ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? '✓ برنامه در حال اجرا' : `نسخه ${escapeHtml(prog.version)}`}
                    </span>
                </div>

                <p class="program-card-desc">${escapeHtml(prog.description)}</p>

                <div class="program-tags-row">
                    ${tagsHtml}
                </div>

                ${daysHtml}

                <div class="program-card-actions">
                    <div>
                        <span style="font-size:0.75rem; color:var(--text-muted);">طراح: ${escapeHtml(prog.author || 'Master Coach')}</span>
                    </div>
                    <div>
                        ${isActive 
                            ? `<button type="button" class="btn-active-prog" onclick="app.navigateTo('workout')">✓ برنامه فعال شما (ورود به تمرین)</button>`
                            : `<button type="button" class="btn-select-prog" onclick="app.switchProgram('${prog.id}')">⚡ انتخاب و فعال‌سازی این برنامه</button>`
                        }
                    </div>
                </div>
            </article>`;
        });

        listContainer.innerHTML = html;
    },

    toggleDaysAccordion: (progId) => {
        const list = document.getElementById(`accordion-days-${progId}`);
        const arrow = document.getElementById(`accordion-arrow-${progId}`);
        if (list) {
            const isOpen = list.classList.toggle('open');
            if (arrow) arrow.innerText = isOpen ? '▲' : '▼';
        }
    },

    switchProgram: async (programId) => {
        const success = await loadDatabase(programId);
        if (success) {
            playAudioCue('go');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            
            const firstDay = (state.workouts && Object.keys(state.workouts)[0]) || 'day1';
            app.navigateTo('workout', firstDay);
        } else {
            alert('خطا در بارگذاری برنامه تمرینی.');
        }
    }
};

// --- CORE EXERCISE PROGRESSION ---
function getGroupId(code) {
    if (!code) return '';
    if (/^[a-zA-Z]/.test(code)) return code.charAt(0).toUpperCase();
    const match = String(code).match(/^\d+/);
    return match ? parseInt(match[0], 10) : code;
}

function findNextUnfinishedInGroup(groupCards, startIndex) {
    const len = groupCards.length;
    for (let i = 1; i <= len; i++) {
        const checkIndex = (startIndex + i) % len;
        const card = groupCards[checkIndex];
        const completed = parseInt(card.dataset.completed, 10);
        const total = parseInt(card.dataset.sets, 10);
        
        if (completed < total) return card;
    }
    return null; 
}

function handleSetCompletion(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.exercise-module'));
    const currentCode = currentCard.dataset.code;
    const currentGroupId = getGroupId(currentCode);
    
    const groupCards = allCards.filter(c => getGroupId(c.dataset.code) === currentGroupId);
    const currentIndexInGroup = groupCards.indexOf(currentCard);

    const completed = parseInt(currentCard.dataset.completed, 10);
    const total = parseInt(currentCard.dataset.sets, 10);
    const isCurrentTotallyDone = completed >= total;

    if (isCurrentTotallyDone) {
        markCardAsDone(currentCard);
    } else {
        deactivateCard(currentCard);
    }

    let nextCard = findNextUnfinishedInGroup(groupCards, currentIndexInGroup);
    let isSupersetTransition = false;

    if (nextCard) {
        const currGlobalIdx = allCards.indexOf(currentCard);
        const nextGlobalIdx = allCards.indexOf(nextCard);
        
        if (nextGlobalIdx > currGlobalIdx) {
            isSupersetTransition = true;
        }
        activateCard(nextCard, isSupersetTransition);
    } else {
        const globalIndex = allCards.indexOf(currentCard);
        for (let i = globalIndex + 1; i < allCards.length; i++) {
            const potentialNext = allCards[i];
            if (!potentialNext.classList.contains('completed')) {
                nextCard = potentialNext;
                activateCard(nextCard, false);
                break;
            }
        }
    }

    // Check if entire workout is completed
    const allCompleted = allCards.every(c => c.classList.contains('completed'));
    if (allCompleted && allCards.length > 0) {
        app.skipRest();
        setTimeout(() => app.triggerCelebration(), 500);
        return;
    }

    // Smart Rest Control
    if (isSupersetTransition) {
        app.skipRest(); 
    } else {
        const restTime = parseInt(currentCard.dataset.rest, 10) || 90;
        startRestTimer(restTime);
    }
}

function activateCard(card, isSuperset = false) {
    card.classList.remove('locked', 'superset-next', 'active-move');
    card.classList.add(isSuperset ? 'superset-next' : 'active-move');
    
    // Highlight next set tile
    const completed = parseInt(card.dataset.completed, 10) || 0;
    const tiles = card.querySelectorAll('.set-tile');
    tiles.forEach(t => t.classList.remove('active-next'));
    if (tiles[completed]) tiles[completed].classList.add('active-next');

    if (isSuperset) playAudioCue('superset');
    card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deactivateCard(card) { 
    card.classList.remove('active-move', 'superset-next'); 
    card.classList.add('locked'); 
    card.querySelectorAll('.set-tile').forEach(t => t.classList.remove('active-next'));
}

function markCardAsDone(card) { 
    card.classList.remove('active-move', 'superset-next', 'locked'); 
    card.classList.add('completed'); 
    card.querySelectorAll('.set-tile').forEach(t => {
        t.classList.remove('active-next');
        t.classList.add('done');
    }); 
}

// --- TIMERS & AUDIO ---
function startTimer(card) {
    state.isTimerRunning = true; 
    card.classList.add('timer-active');
    const ov = card.querySelector('.timer-overlay');
    let t = parseInt(card.dataset.time, 10);
    ov.innerHTML = `${t} <span>توقف</span>`;
    
    state.timer = setInterval(() => { 
        t--; 
        ov.innerHTML = `${t} <span>توقف</span>`; 
        if (t <= 0) stopTimer(card, true); 
    }, 1000);
}

function stopTimer(card, finished) {
    clearInterval(state.timer); 
    state.isTimerRunning = false; 
    card.classList.remove('timer-active');
    card.querySelector('.timer-overlay').innerHTML = `${card.dataset.time} <span>توقف</span>`;
    if (finished) {
        playAudioCue('go');
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        let c = parseInt(card.dataset.completed, 10);
        if (c < parseInt(card.dataset.sets, 10)) { 
            card.dataset.completed = ++c; 
            const tiles = card.querySelectorAll('.set-tile');
            if (tiles[c-1]) tiles[c-1].classList.add('done'); 
            handleSetCompletion(card); 
        }
    }
}

function startRestTimer(seconds) {
    app.skipRest(); 
    state.restTimeRemaining = seconds;
    const widget = document.getElementById('restWidget'); 
    const display = document.getElementById('restTimeDisplay');
    if (!widget || !display) return;
    
    display.innerText = formatTime(seconds);
    widget.classList.add('show');
    
    state.restTimer = setInterval(() => {
        state.restTimeRemaining--;
        display.innerText = formatTime(state.restTimeRemaining);
        
        if ([3, 2, 1].includes(state.restTimeRemaining)) {
            playAudioCue('tick');
        } else if (state.restTimeRemaining <= 0) { 
            playAudioCue('go'); 
            if (navigator.vibrate) navigator.vibrate([250, 150, 250]);
            app.skipRest(); 
        }
    }, 1000);
}

function formatTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function initAudio() { 
    if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    }
    if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume(); 
    }
}

function playAudioCue(type) {
    try {
        if (!state.audioCtx) initAudio();
        if (!state.audioCtx) return;
        
        const o = state.audioCtx.createOscillator(); 
        const g = state.audioCtx.createGain();
        o.connect(g); 
        g.connect(state.audioCtx.destination);
        const now = state.audioCtx.currentTime;
        
        if (type === 'tick') { 
            o.type = 'sine'; 
            o.frequency.setValueAtTime(600, now); 
            g.gain.setValueAtTime(0.1, now); 
            o.start(now); 
            o.stop(now + 0.08); 
        } else if (type === 'go') { 
            o.type = 'square'; 
            o.frequency.setValueAtTime(880, now); 
            g.gain.setValueAtTime(0.15, now); 
            o.start(now); 
            o.stop(now + 0.35); 
        } else if (type === 'superset') { 
            o.type = 'triangle'; 
            o.frequency.setValueAtTime(400, now); 
            o.frequency.setValueAtTime(650, now + 0.1); 
            g.gain.setValueAtTime(0.12, now); 
            o.start(now); 
            o.stop(now + 0.2); 
        }
    } catch (err) {
        console.warn('Audio cue play note:', err);
    }
}

window.addEventListener('resize', () => {
    if (state.currentView === 'profile') {
        app.renderProgressChart();
    }
});

window.app = app;