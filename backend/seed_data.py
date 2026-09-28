"""Prototype catalog data. Mirrors future WordPress sources:
CITIES -> city taxonomy, SPORTS -> sport taxonomy, GYMS -> `gym` custom post type (ACF fields)."""


def _img(photo_id: str, w: int = 1200) -> str:
    return f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w={w}&q=80"


CITIES = [
    {"slug": "tehran", "name": "تهران", "province": "تهران"},
    {"slug": "hamedan", "name": "همدان", "province": "همدان"},
    {"slug": "isfahan", "name": "اصفهان", "province": "اصفهان"},
    {"slug": "shiraz", "name": "شیراز", "province": "فارس"},
    {"slug": "tabriz", "name": "تبریز", "province": "آذربایجان شرقی"},
    {"slug": "mashhad", "name": "مشهد", "province": "خراسان رضوی"},
    {"slug": "karaj", "name": "کرج", "province": "البرز"},
    {"slug": "rasht", "name": "رشت", "province": "گیلان"},
    {"slug": "qom", "name": "قم", "province": "قم"},
    {"slug": "ahvaz", "name": "اهواز", "province": "خوزستان"},
    {"slug": "kermanshah", "name": "کرمانشاه", "province": "کرمانشاه"},
    {"slug": "urmia", "name": "ارومیه", "province": "آذربایجان غربی"},
    {"slug": "kerman", "name": "کرمان", "province": "کرمان"},
    {"slug": "yazd", "name": "یزد", "province": "یزد"},
    {"slug": "ardabil", "name": "اردبیل", "province": "اردبیل"},
    {"slug": "bandar-abbas", "name": "بندرعباس", "province": "هرمزگان"},
    {"slug": "arak", "name": "اراک", "province": "مرکزی"},
    {"slug": "zanjan", "name": "زنجان", "province": "زنجان"},
    {"slug": "qazvin", "name": "قزوین", "province": "قزوین"},
    {"slug": "sanandaj", "name": "سنندج", "province": "کردستان"},
    {"slug": "gorgan", "name": "گرگان", "province": "گلستان"},
    {"slug": "sari", "name": "ساری", "province": "مازندران"},
    {"slug": "zahedan", "name": "زاهدان", "province": "سیستان و بلوچستان"},
    {"slug": "bushehr", "name": "بوشهر", "province": "بوشهر"},
]

SPORTS = [
    {"slug": "bodybuilding", "name": "بدنسازی", "featured": True, "image": _img("photo-1581009146145-b5ef050c2e1e", 400)},
    {"slug": "fitness", "name": "فیتنس", "featured": True, "image": _img("photo-1526506118085-60ce8714f8c5", 400)},
    {"slug": "yoga", "name": "یوگا", "featured": True, "image": _img("photo-1676496962536-d8ef110ff6f0", 400)},
    {"slug": "swimming", "name": "شنا", "featured": True, "image": _img("photo-1530549387789-4c1017266635", 400)},
    {"slug": "football", "name": "فوتبال", "featured": True, "image": _img("photo-1574629810360-7efbbe195018", 400)},
    {"slug": "boxing", "name": "بوکس", "featured": True, "image": _img("photo-1549719386-74dfcbf7dbed", 400)},
    {"slug": "martial-arts", "name": "ورزش‌های رزمی", "featured": True, "image": _img("photo-1656653121475-e33829581294", 400)},
    {"slug": "crossfit", "name": "کراس‌فیت", "featured": True, "image": _img("photo-1601422407692-ec4eeec1d9b3", 400)},
    {"slug": "functional", "name": "تمرین عملکردی", "featured": False, "image": _img("photo-1632077804406-188472f1a810", 400)},
]

GYMS = [
    {
        "slug": "energy", "name": "باشگاه انرژی", "city": "همدان",
        "address": "همدان، خیابان بوعلی، نبش کوچه نسترن، پلاک ۲۴",
        "neighborhood": "بوعلی", "street": "خیابان بوعلی", "phone": "081-3825-1240",
        "image": _img("photo-1623874514711-0f321325f318"), "sports": ["bodybuilding", "fitness"], "rating": 4.8,
        "description": "مجموعه‌ای مدرن با تجهیزات کامل بدنسازی، سالن فیتنس بانوان و آقایان و مربیان مجرب برای برنامه‌های اختصاصی.",
        "featured": True, "badge": "پیشنهاد ویژه",
    },
    {
        "slug": "arya", "name": "باشگاه آریا", "city": "همدان",
        "address": "همدان، شهرک مدنی، بلوار اصلی، مجتمع ورزشی آریا",
        "neighborhood": "شهرک مدنی", "street": "بلوار شهرک مدنی", "phone": "081-3844-5512",
        "image": _img("photo-1601422407692-ec4eeec1d9b3"), "sports": ["bodybuilding", "crossfit"], "rating": 4.6,
        "description": "فضای باز کراس‌فیت، سالن وزنه آزاد و کلاس‌های گروهی پرانرژی برای تمام سطوح.",
        "featured": False,
    },
    {
        "slug": "parsian", "name": "باشگاه پارسیان", "city": "تهران",
        "address": "تهران، میدان فردوسی، ابتدای خیابان فردوسی، پلاک ۱۱۸",
        "neighborhood": "فردوسی", "street": "میدان فردوسی", "phone": "021-6671-2200",
        "image": _img("photo-1685633224860-7655234d9cd5"), "sports": ["bodybuilding", "functional"], "rating": 4.7,
        "description": "باشگاهی حرفه‌ای در قلب تهران با زون تمرین عملکردی، ارزیابی بدنی و برنامه‌ریزی تغذیه.",
        "featured": True, "badge": "پیشنهاد ویژه",
    },
    {
        "slug": "aseman", "name": "باشگاه آسمان", "city": "اصفهان",
        "address": "اصفهان، خیابان چهارباغ عباسی، کوچه گلستان، پلاک ۷",
        "neighborhood": "چهارباغ", "street": "خیابان چهارباغ", "phone": "031-3222-8190",
        "image": _img("photo-1651077837628-52b3247550ae"), "sports": ["fitness", "yoga"], "rating": 4.5,
        "description": "استودیوی آرام و روشن برای یوگا، پیلاتس و فیتنس با کلاس‌های صبحگاهی و عصرگاهی.",
        "featured": False,
    },
    {
        "slug": "naroon", "name": "مجموعه ورزشی نارون", "city": "شیراز",
        "address": "شیراز، بلوار معالی‌آباد، روبروی پارک آزادی",
        "neighborhood": "معالی‌آباد", "street": "بلوار معالی‌آباد", "phone": "071-3633-4471",
        "image": _img("photo-1519315901367-f34ff9154487"), "sports": ["swimming", "fitness"], "rating": 4.7,
        "description": "استخر نیمه‌المپیک، آموزش شنا برای کودکان و بزرگسالان و سالن فیتنس مجهز.",
        "featured": False,
    },
    {
        "slug": "oj", "name": "باشگاه اوج", "city": "تهران",
        "address": "تهران، سعادت‌آباد، بلوار دریا، خیابان مروارید",
        "neighborhood": "سعادت‌آباد", "street": "بلوار دریا", "phone": "021-2207-3355",
        "image": _img("photo-1685633225009-9a612a71b945"), "sports": ["bodybuilding", "fitness"], "rating": 4.9,
        "description": "باشگاه لوکس با سالن‌های مجزا، مربی شخصی و فضای ریکاوری برای ورزشکاران حرفه‌ای.",
        "featured": True, "badge": "پیشنهاد ویژه",
    },
    {
        "slug": "ark", "name": "باشگاه ارک", "city": "تبریز",
        "address": "تبریز، خیابان ولیعصر، فلکه بارنج",
        "neighborhood": "ولیعصر", "street": "خیابان ولیعصر", "phone": "041-3330-9812",
        "image": _img("photo-1583473848882-f9a5bc7fd2ee"), "sports": ["boxing", "martial-arts"], "rating": 4.4,
        "description": "رینگ استاندارد بوکس، کلاس‌های کیک‌بوکسینگ و دفاع شخصی زیر نظر مربیان ملی‌پوش.",
        "featured": False,
    },
    {
        "slug": "paj", "name": "باشگاه پاژ", "city": "مشهد",
        "address": "مشهد، بلوار سجاد، خیابان بهارستان",
        "neighborhood": "سجاد", "street": "بلوار سجاد", "phone": "051-3760-2244",
        "image": _img("photo-1632077804406-188472f1a810"), "sports": ["crossfit", "functional"], "rating": 4.6,
        "description": "باکس کراس‌فیت با برنامه‌های WOD روزانه، تمرین عملکردی و جامعه‌ای پرانگیزه.",
        "featured": False,
    },
    {
        "slug": "alborz", "name": "باشگاه البرز", "city": "کرج",
        "address": "کرج، گوهردشت، بلوار موذن، مجموعه البرز",
        "neighborhood": "گوهردشت", "street": "بلوار موذن", "phone": "026-3450-1188",
        "image": _img("photo-1674834727206-4bc272bfd8da"), "sports": ["football", "fitness"], "rating": 4.3,
        "description": "زمین چمن مصنوعی فوتسال و فوتبال، سالن بدنسازی و کلاس‌های آمادگی جسمانی.",
        "featured": False,
    },
    {
        "slug": "sepidrood", "name": "باشگاه سپیدرود", "city": "رشت",
        "address": "رشت، گلسار، بلوار سمیه، نبش خیابان ۹۵",
        "neighborhood": "گلسار", "street": "بلوار سمیه", "phone": "013-3371-6620",
        "image": _img("photo-1514050566906-8d077bae7046"), "sports": ["martial-arts", "boxing"], "rating": 4.5,
        "description": "دوجوی تخصصی کاراته و تکواندو با کلاس‌های کودکان، نوجوانان و بزرگسالان.",
        "featured": False,
    },
]
