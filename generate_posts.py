"""
Run this from the ROOT of your blog project:
  python generate_posts.py

Creates 30 new posts in content/posts/, one per day from tomorrow.
"""

import os
from datetime import date, timedelta

START_DATE = date(2026, 6, 17)
POSTS_DIR = os.path.join("content", "posts")

IMAGES = {
    "Scandinavian Style": [
        "/images/scandinavianLivingroom.jpg", "/images/scandinavianLivingroom2.jpg",
        "/images/scandinavianLivingroom3.jpg", "/images/scandinavianLivingroom4.jpg",
        "/images/cosyLivingroom.jpg", "/images/cosyLivingroom2.jpg", "/images/cosyLivingroom3.jpg",
    ],
    "Small Apartments": [
        "/images/smallApartment.jpg",  "/images/smallApartment2.jpg", "/images/smallApartment3.jpg",
        "/images/smallApartment4.jpg", "/images/smallApartment5.jpg", "/images/smallApartment6.jpg",
        "/images/smallApartment7.jpg", "/images/smallApartment8.jpg", "/images/smallApartment9.jpg",
        "/images/smallApartment10.jpg", "/images/smallApartment11.jpg", "/images/smallApartment12.jpg",
        "/images/smallApartment13.jpg",
    ],
    "Furniture Solutions": [
        "/images/furnitureSolutions7.jpg", "/images/furnitureSolutions8.jpg",
        "/images/furnitureSolutions9.jpg", "/images/furnitureSolutions10.jpg",
        "/images/furnitureSolutions11.jpg", "/images/scandinavianLivingroom.jpg",
        "/images/cosyLivingroom.jpg",
    ],
    "Inspiration": [
        "/images/inspiration10.jpg", "/images/inspiration11.jpg", "/images/inspiration12.jpg",
        "/images/cosyLivingroom3.jpg", "/images/scandinavianLivingroom.jpg",
        "/images/smallApartment8.jpg", "/images/cosyLivingroom.jpg",
    ],
}

POSTS = [
    # ── SCANDINAVIAN STYLE ────────────────────────────────────────────────────
    {
        "slug": "scandinavian-entryway-ideas",
        "title": "How to Style a Scandinavian Entryway",
        "description": "Your entryway sets the tone for your entire home. Discover how to create a calm, functional Scandinavian hallway with smart storage and minimal decor.",
        "category": "Scandinavian Style",
        "tags": ["entryway", "hallway", "scandinavian", "storage", "minimalist"],
        "content": """Your entryway is the first thing you — and your guests — see every day. In Scandinavian design, it's treated as a functional space that should feel calm and organised, never cluttered.

## Start with a coat hook system

The foundation of a Scandinavian entryway is a simple, well-designed hook system. Choose a row of minimal hooks in matte black, brushed brass or natural wood. Keep only what you actually use daily — two or three coats maximum. Everything else goes in the wardrobe.

## Add a bench with hidden storage

A low bench with a lift-up lid or open cubbies underneath solves two problems at once: somewhere to sit when putting on shoes, and a place to store them. Look for benches in light oak or painted in a soft white or grey.

## Keep the colour palette simple

Walls in white, off-white or pale grey immediately make a small hallway feel larger. Add warmth with a runner rug in a muted pattern — herringbone, grid or subtle stripe — and a single plant on a slim shelf.

## Lighting makes all the difference

Most hallways have poor natural light. A wall-mounted light at eye level (not just an overhead bulb) adds warmth and makes the space feel considered and designed rather than like an afterthought.

## The one rule to follow

Resist the urge to display too much. One piece of art, one plant, one mirror. In Scandinavian design, the empty space around objects is just as important as the objects themselves.""",
    },
    {
        "slug": "lagom-scandinavian-balance",
        "title": "Lagom: The Swedish Secret to a Balanced Home",
        "description": "Lagom means 'just the right amount' — and it's the key to a home that feels effortlessly calm. Here's how to apply this Swedish philosophy to every room.",
        "category": "Scandinavian Style",
        "tags": ["lagom", "swedish design", "minimalism", "balance", "lifestyle"],
        "content": """Hygge gets all the attention, but there's another Scandinavian concept that might be even more useful when it comes to designing your home: lagom.

## What does lagom mean?

Lagom is a Swedish word that roughly translates to "just the right amount" — not too much, not too little, but exactly enough. It's a philosophy of moderation that shows up in everything from how Swedes eat to how they decorate.

## Lagom in the living room

A lagom living room has one sofa, not two. One coffee table, not three side tables. One large piece of art, not a wall covered in frames. The goal isn't emptiness — it's balance. Every object earns its place.

## Lagom in the kitchen

In a lagom kitchen, the counters are mostly clear. Appliances that aren't used daily live in cupboards. The things on display — a wooden chopping board, a few ceramic mugs — are both beautiful and useful.

## Lagom in the bedroom

Bedrooms benefit most from lagom thinking. Strip back the cushions, the throws, the decorative objects. What's left? A bed you actually want to sleep in, a lamp that gives good light, and enough calm to let your mind rest.

## How to start

Pick one room and ask yourself: what would I keep if I could only keep half? Start there. Lagom isn't about having less — it's about being more intentional about what you choose to have.""",
    },
    {
        "slug": "scandinavian-bathroom-spa",
        "title": "Scandinavian Bathroom Ideas for a Spa-Like Feel",
        "description": "Transform your bathroom into a calm retreat with natural materials, minimal clutter and the warm, clean aesthetic of Scandinavian design.",
        "category": "Scandinavian Style",
        "tags": ["bathroom", "spa", "natural materials", "tiles", "minimalist"],
        "content": """The bathroom might be the easiest room to transform into a Scandinavian space — because the principles of good bathroom design and Scandinavian design are almost identical: clean lines, natural materials, and nothing that doesn't need to be there.

## Choose the right tiles

Large-format tiles in white, pale grey or warm cream make a bathroom feel bigger and calmer. Add texture with a matte finish rather than gloss, and consider a simple pattern — thin grout lines in a grid, or a subtle herringbone in the shower.

## Bring in natural materials

Wood accents are the signature move in Scandinavian bathrooms. A teak bath mat, a wooden shelf, a bamboo toothbrush holder — these small details add warmth to what could otherwise feel clinical. Just make sure you're using materials rated for humid environments.

## Clear the counters

A Scandinavian bathroom counter has almost nothing on it. Soap dispenser, maybe a plant, that's it. Everything else — skincare, haircare, makeup — lives in a drawer or cabinet. The clear surface isn't just aesthetic: it's genuinely easier to clean.

## Light it properly

Good bathroom lighting requires layers: overhead light for general use, mirror lighting for your face. In Scandinavian homes, backlit mirrors or simple LED strips around the mirror frame are a popular solution that looks clean and works well.

## Add one plant

A single plant does more for a bathroom than almost any other decorative choice. Snake plants and pothos thrive in humidity and low light. Put it on a shelf at eye level and let it do the work.""",
    },
    {
        "slug": "mix-old-new-scandinavian",
        "title": "How to Mix Old and New in Scandinavian Interiors",
        "description": "The best Scandinavian homes aren't showrooms — they mix vintage finds with modern pieces to create spaces that feel lived-in, personal and warm.",
        "category": "Scandinavian Style",
        "tags": ["vintage", "mix and match", "scandinavian", "secondhand", "interior styling"],
        "content": """One of the biggest misconceptions about Scandinavian design is that it requires everything to be new, matching and perfectly curated. The reality is more interesting — and more accessible.

## Why vintage works in Scandinavian spaces

Scandinavian design has always had strong roots in craft and quality. A solid wood chair from the 1960s, a ceramic bowl from a local market, a worn linen throw — these items carry history and texture that new objects simply can't replicate.

## The rule of thirds

A useful starting point: aim for roughly one third old, two thirds new (or vice versa). One vintage piece per room is usually enough to anchor the space and stop it from feeling like a catalogue page.

## Where to find vintage Scandinavian pieces

Flea markets, second-hand shops and online marketplaces like eBay, Finn.no or Facebook Marketplace are full of mid-century Scandinavian furniture at reasonable prices. Look for clean lines, quality wood (oak, beech, teak) and simple forms.

## How to make them work together

The key is a consistent colour palette. If your walls are white and your new furniture is in neutral tones, almost any vintage piece in a similar palette will fit. It's when you mix wildly different colours and finishes that things start to look mismatched.

## Don't be precious about perfection

A small scratch on a vintage side table, a slight variation in the grain of a wooden stool — these imperfections are part of the appeal. Scandinavian design values authenticity over perfection.""",
    },
    {
        "slug": "scandinavian-home-office",
        "title": "Scandinavian Home Office Design: Work in Calm and Style",
        "description": "A Scandinavian home office is designed for focus: clean surfaces, good light, and furniture that does exactly what it needs to. Here's how to build one.",
        "category": "Scandinavian Style",
        "tags": ["home office", "work from home", "desk setup", "scandinavian", "productivity"],
        "content": """The home office has become one of the most important rooms in the house — and also one of the easiest to get wrong. Too much clutter, bad lighting, a chair that hurts your back: all of these make it hard to do your best work.

## Start with the desk

A Scandinavian desk is usually simple: a clean surface in wood or white laminate, no unnecessary drawers, nothing decorative on top. The idea is that your work surface exists for work, not storage. Everything you're not actively using goes away.

## Get the chair right

This is the one area where Scandinavian minimalism yields to practicality. A good ergonomic chair is non-negotiable — and many of the best are designed in Scandinavia anyway. Don't compromise here.

## Control the light

Natural light from the side (not directly behind or in front of your monitor) is ideal. Add a dedicated desk lamp for cloudy days and evening work. Avoid harsh overhead lighting — it causes fatigue.

## Manage cables

Nothing undermines a calm workspace faster than visible cables. A simple cable management box, a few velcro ties, and routing cables behind or under the desk takes thirty minutes and makes a huge difference.

## Add one calming element

A single plant, a small framed print, or a beautiful mug for your coffee. One thing that makes you happy to sit down. That's enough — and in Scandinavian design, that's the point.""",
    },
    {
        "slug": "scandinavian-rugs-guide",
        "title": "The Complete Guide to Scandinavian Rugs",
        "description": "Rugs are one of the most powerful tools in interior design. Discover which styles, sizes and materials work best in a Scandinavian-inspired home.",
        "category": "Scandinavian Style",
        "tags": ["rugs", "textiles", "living room", "scandinavian", "flooring"],
        "content": """A rug can completely change the feeling of a room. Get it right and the space feels finished, warm and intentional. Get it wrong and even a beautifully decorated room feels off.

## Size matters more than style

The most common rug mistake is going too small. In a living room, your rug should be large enough for at least the front legs of the sofa to sit on it. A rug that floats in the middle of the floor with furniture all around it looks disconnected.

## Scandinavian patterns to look for

Traditional Scandinavian textiles feature geometric patterns, nature motifs (trees, stars, reindeer) and strong graphic contrasts. Modern interpretations keep the geometry but strip back the colour — think black and white, ivory and grey, or terracotta and cream.

## The best materials

Wool is the classic choice: durable, naturally stain-resistant and comfortable underfoot. For high-traffic areas, a flatweave cotton rug is easier to clean. Avoid synthetic rugs where possible — they wear poorly and don't have the same warmth underfoot.

## Layering rugs

A trend that works particularly well in Scandinavian interiors: layering a smaller, patterned rug on top of a larger, plain one. The plain rug (often jute or sisal) anchors the space; the patterned rug adds personality.

## Colour and the rest of the room

If your room is mostly neutral, a rug is a low-risk place to introduce a single colour. A dusty green, a warm terracotta or a deep navy can anchor a room without overpowering it.""",
    },
    {
        "slug": "scandinavian-dining-room",
        "title": "Scandinavian Dining Room Ideas for Every Budget",
        "description": "The Scandinavian dining room is built around one idea: gathering. Here's how to create a space that's beautiful, functional and welcoming — at any price point.",
        "category": "Scandinavian Style",
        "tags": ["dining room", "dining table", "chairs", "scandinavian", "budget"],
        "content": """In Scandinavian homes, the dining table is at the centre of daily life — not just for special occasions, but for everyday meals, homework, coffee and conversation. The design reflects that: it's built to be used.

## The table

A round table is the most sociable shape — everyone can see and talk to everyone else. For small spaces, an extendable round table is ideal: compact for daily use, expandable when guests come. In Scandinavian design, solid wood (oak, walnut, beech) is the preferred material.

## The chairs

You don't need matching chairs. A mix of two or three different chair styles in a consistent colour palette (all white, all wood, or all black) looks more interesting and is easier to source on a budget. Look at secondhand options first.

## Lighting over the table

A pendant light hung low over the dining table is one of the most impactful things you can do in a dining room. It creates an immediate sense of intimacy. In Scandinavian design, simple shapes work best: a drum shade, a globe, a cone.

## The table setting

Scandinavian table styling is unfussy: simple ceramic plates, linen napkins, candles. Candles are non-negotiable — they appear on Danish and Swedish tables year-round, not just in winter.

## Budget options that work

IKEA's dining range, Jysk, and Norwegian secondhand markets all offer solid options at accessible prices. Invest in the table and go budget on the chairs, or vice versa — but don't try to cheap out on both.""",
    },
    {
        "slug": "hygge-corner-any-room",
        "title": "How to Create a Hygge Corner in Any Room",
        "description": "A hygge corner is a dedicated spot for comfort — a chair, soft light, warmth and calm. Here's how to build one no matter how small your space.",
        "category": "Scandinavian Style",
        "tags": ["hygge", "cosy corner", "reading nook", "comfort", "danish design"],
        "content": """Hygge (pronounced hoo-gah) is the Danish concept of cosiness, comfort and the pleasure of simple things. And one of the easiest ways to bring it into your home is to create a dedicated hygge corner — a spot that exists purely to be comfortable in.

## What you need

The minimum: one comfortable chair, one lamp, one throw. That's really all it takes. The chair should be soft and enveloping — an armchair, a club chair, or even a large floor cushion. The lamp should give warm, low light. The throw should be something you actually want to wrap around yourself.

## Location

Corners are ideal because they feel naturally enclosed. A spot next to a window is perfect in the daytime; away from the main traffic flow of the room works best in the evening. You want to feel slightly apart from the rest of the room, not in the middle of it.

## Add small layers of comfort

A small side table for your coffee or tea. A basket of books or magazines. A candle (always a candle). A plant at eye level. Each addition should be something that makes you want to sit down and stay.

## What to avoid

Don't overdo it. A hygge corner that's crammed with cushions, throws, plants and decorative objects stops being restful and starts feeling chaotic. Choose one or two of each thing and leave it at that.

## Why it works

Having a dedicated spot for rest changes how you use your home. It gives you somewhere to go when you need to decompress — and that's worth more than almost any other interior design decision you can make.""",
    },

    # ── SMALL APARTMENTS ─────────────────────────────────────────────────────
    {
        "slug": "dark-apartment-brighter",
        "title": "How to Make a Dark Apartment Feel Brighter",
        "description": "No natural light? No problem. These proven techniques will make even the darkest apartment feel airier, warmer and more open.",
        "category": "Small Apartments",
        "tags": ["lighting", "dark apartment", "small space", "mirrors", "interior tips"],
        "content": """Not every apartment comes with floor-to-ceiling windows and south-facing rooms. But a lack of natural light doesn't mean you have to live in a cave. With the right choices, even a genuinely dark apartment can feel warm, bright and inviting.

## Start with paint

The instinct is to go white — and it's mostly right. But pure bright white in a dark room can look grey and cold. Instead, try warm whites (with yellow or pink undertones) or soft creams. These reflect light without the clinical coldness.

## Mirrors are not optional

A large mirror placed opposite or beside a window reflects whatever natural light there is and doubles it. In a room with no window, mirrors still help by bouncing artificial light around. Go large — a full-length mirror leaning against a wall does more than a small decorative one.

## Layer your lighting

One overhead light is never enough in a dark apartment. You need at least three light sources per room: ambient (overhead), task (desk or reading lamp) and accent (small lamps, LED strips behind furniture, candles). Together they make a room feel warm rather than dim.

## Choose furniture wisely

Dark furniture in a dark room compounds the problem. Light-coloured furniture — white, cream, pale wood — keeps things from feeling heavy. Glass and acrylic furniture pieces are almost invisible and don't absorb light.

## Use light-coloured textiles

Rugs, cushions, curtains and throws in white, cream or pale grey all help bounce light around the room. Swap dark curtains for sheer linen ones that let in whatever light is available while still providing privacy.""",
    },
    {
        "slug": "studio-room-dividers",
        "title": "The Best Room Dividers for Open-Plan Studios",
        "description": "Living and sleeping in one room doesn't mean you can't have separation. These room divider ideas create zones without walls — and without sacrificing light.",
        "category": "Small Apartments",
        "tags": ["studio apartment", "room divider", "open plan", "zones", "small space"],
        "content": """One of the biggest challenges of studio apartment living is creating a sense of separation between different areas — sleeping, working, living — without the benefit of walls or doors. The good news is that there are excellent solutions that don't require any construction.

## Bookshelf dividers

A tall, open-backed bookshelf is one of the most practical room dividers available. It creates a visual separation, provides storage on both sides, and doesn't block light the way a solid wall would. Position it perpendicular to a wall to divide sleeping and living areas.

## Curtains on a ceiling track

A ceiling-mounted curtain track lets you close off a sleeping area when you need privacy and open it up again when you want the full space. Choose a sheer or lightweight fabric to keep things airy, or a heavier fabric for better sleep darkness.

## Area rugs to define zones

Different rugs in different areas signal that these are different spaces, even without any physical separation. A large rug under your sofa and coffee table defines the living area; a smaller rug under the bed defines the sleeping zone.

## Plants as soft dividers

A row of tall plants — fiddle leaf figs, bamboo palms, large monstera — creates a natural, soft boundary between areas. It's not a solid barrier, but it gives the impression of separation while adding life and texture to the room.

## Furniture positioning

The back of a sofa facing the bedroom area creates a natural psychological divide. Pair this with a console table behind the sofa (used as a room divider surface) and you have two functional zones defined entirely by furniture placement.""",
    },
    {
        "slug": "small-kitchen-solutions",
        "title": "Small Kitchen Solutions That Actually Work",
        "description": "Small kitchens require smart thinking. These space-saving ideas will help you cook, store and function properly — even in the tiniest apartment kitchen.",
        "category": "Small Apartments",
        "tags": ["kitchen", "small kitchen", "storage", "cooking", "apartment"],
        "content": """A small kitchen isn't a problem to be solved — it's a design challenge to be met. And some of the most functional, beautiful kitchens in the world are genuinely tiny. Here's what actually makes a difference.

## Use vertical space

Most small kitchens waste the space between the top of the cabinets and the ceiling. Add a shelf up there for things you use infrequently. Install hooks on the inside of cabinet doors for lids, wraps and small tools. Mount a magnetic knife strip on the wall instead of taking up drawer space.

## Invest in good containers

A uniform set of clear containers for dry goods does two things: it makes your pantry look calm and organised, and it makes it much easier to see what you have. Mismatched packaging stacked in a cupboard is both visually chaotic and functionally inefficient.

## A pull-out cutting board

If your counter space is limited, a cutting board that slides out over a drawer or sits across the sink gives you an extra prep surface when you need it and disappears when you don't.

## The right small appliances

Only keep appliances you use at least once a week. Everything else takes up space without earning it. If your toaster, food processor and stand mixer are all competing for counter space, decide which one you actually use and put the others in storage.

## Light and colour

A small kitchen with dark cabinets feels like a cave. Light-coloured cabinets (white, cream, light grey) and under-cabinet lighting make a huge practical and visual difference. You don't need to renovate — peel-and-stick LED strips under cabinets cost very little and immediately improve both light and atmosphere.""",
    },
    {
        "slug": "home-office-small-apartment",
        "title": "How to Fit a Home Office in a Small Apartment",
        "description": "Working from home in a small space requires creative solutions. Here's how to carve out a proper workspace without giving up your living room.",
        "category": "Small Apartments",
        "tags": ["home office", "work from home", "small space", "desk", "apartment"],
        "content": """Working from home has become the norm for millions of people — but having a proper workspace in a small apartment is genuinely difficult. Here are the most practical solutions, from dedicated desks to clever fold-away options.

## The fold-down wall desk

A fold-down desk mounted to the wall is the most space-efficient option available. When folded up, it takes almost no space and can look like a decorative shelf. When folded down, it provides a proper work surface. Look for models with interior storage so your work materials stay organised.

## The wardrobe office

A large wardrobe (IKEA's PAX system works particularly well) can be converted into a home office that closes completely when you're done for the day. Install a shelf at desk height, add a power strip, hang some shelves above — and close the doors at 5pm. Work disappears completely.

## The corner desk

Corners are often underused in small apartments. A corner desk uses the space most efficiently and keeps your desk from dominating the room. Keep it minimal — a monitor, a laptop, a lamp — and resist the urge to pile things on it.

## The dining table office

If space is truly limited, your dining table may need to double as a desk. The key is having a dedicated storage solution — a rolling cart, a drawer unit, a bag — where all your work materials live. At the start of the day, work comes out. At the end, it all goes back in.

## Ergonomics in a small space

Don't sacrifice ergonomics just because you're space-constrained. A laptop stand, an external keyboard, and a chair at the right height are non-negotiable for anyone spending hours at a desk. These take up very little space and protect your body.""",
    },
    {
        "slug": "small-bathroom-storage",
        "title": "Smart Bathroom Storage for Tiny Spaces",
        "description": "A small bathroom can hold more than you think — if you use the right storage solutions. These ideas maximise every centimetre without cluttering the space.",
        "category": "Small Apartments",
        "tags": ["bathroom storage", "small bathroom", "organisation", "shelving", "apartment"],
        "content": """Small bathrooms are a reality for most apartment dwellers — and they come with a specific storage challenge: lots of products, very little space, and a need to keep things accessible without making the room feel cluttered.

## Go vertical

The walls above the toilet and beside the mirror are prime real estate in a small bathroom. A slim shelf above the toilet can hold towels, toilet paper and decorative items. A mirrored cabinet replaces a mirror and adds a surprising amount of storage.

## Use the back of the door

An over-door organiser or a few hooks on the back of the bathroom door can hold towels, robes and bags without using any floor or wall space. It's one of the most overlooked storage locations in the bathroom.

## Edit your products

The most effective bathroom storage strategy isn't buying more organisers — it's having fewer things to store. Go through everything in your bathroom and throw out anything expired, unused or duplicated. What's left is usually manageable.

## Use matching containers

Decanting products into uniform bottles and jars does more than look good (though it does look good). It also makes it easier to track what you have and reduces the visual noise of different sized and coloured packaging.

## Think about under the sink

The space under the sink is often wasted. Pull-out drawers, small shelf units or a simple set of baskets can transform it into organised, accessible storage. Group things by category — cleaning products together, spare toiletries together.""",
    },
    {
        "slug": "maximize-vertical-storage",
        "title": "Maximizing Vertical Space: Wall Storage Ideas That Work",
        "description": "In a small apartment, the walls are your best friend. These vertical storage ideas help you use every centimetre from floor to ceiling.",
        "category": "Small Apartments",
        "tags": ["vertical storage", "shelving", "wall storage", "small space", "organisation"],
        "content": """When floor space is limited, the answer is almost always to go up. Vertical storage — shelves, wall-mounted units, hooks and hanging systems — uses the one resource most small apartments have in abundance: wall space.

## Floor-to-ceiling shelving

A bookshelf that runs from floor to ceiling holds significantly more than a standard-height unit and makes the room feel taller. IKEA's Billy bookcase with height extensions is the classic choice — but any system that reaches the ceiling works. Use the highest shelves for things you access rarely.

## Wall-mounted shelves in unexpected places

The space above doors is almost always empty. A shelf above a doorway can hold books, baskets or decorative items that don't need daily access. The same applies to the space above windows and in the corners of rooms.

## Pegboards for functional display

A pegboard wall — popularised in craft rooms and kitchens but useful anywhere — lets you hang anything with a hook. In a home office, tools and accessories. In a kitchen, utensils and small plants. In a bedroom, jewellery, bags and accessories. The key is keeping it edited.

## Hanging storage in the kitchen

A ceiling-mounted pot rack, a magnetic knife strip, hooks under upper cabinets for mugs — these all free up cabinet and counter space for the things that can't hang. In a small kitchen, wall and ceiling storage can make the difference between a functional space and a frustrating one.

## The wall behind the sofa

The wall behind a sofa is one of the most useful walls in a living room — and one of the most underused. A long shelf at about picture-rail height gives you a display surface that doesn't intrude on the room while adding significant storage and visual interest.""",
    },
    {
        "slug": "best-sofa-small-living-room",
        "title": "How to Choose the Best Sofa for a Small Living Room",
        "description": "The sofa is the biggest piece of furniture in your living room — getting it wrong is an expensive mistake. Here's how to choose the right one for a small space.",
        "category": "Small Apartments",
        "tags": ["sofa", "living room", "small space", "furniture", "buying guide"],
        "content": """Choosing a sofa for a small living room is one of the most important — and potentially most expensive — interior decisions you'll make. The wrong sofa can make a small room feel cramped and unusable. The right one can make it feel surprisingly generous.

## Get the measurements right first

Before you look at a single sofa, measure your room. Measure the wall where the sofa will go. Measure the doorways and hallways the sofa will need to travel through to get there. Write these numbers down and take them with you (or have them ready when shopping online).

## Consider a two-seater over a three

In a small room, a two-seater sofa often works better than a three-seater. The difference in seat count is smaller than you'd think — most three-seater sofas comfortably seat two people anyway — but the size difference in the room is significant.

## Legs matter

A sofa with visible legs (rather than one that sits on the floor) makes a room feel larger because you can see the floor underneath it. This creates the visual impression of more space even when the footprint of the sofa is exactly the same.

## Light colours open the room

A sofa in a light colour — off-white, cream, light grey, warm beige — reflects light and feels less visually heavy than a dark sofa. If you're worried about practicality, choose a removable and washable cover.

## Modular sofas offer flexibility

A modular sofa — made up of individual sections you can rearrange — adapts to your space in a way a fixed sofa can't. You can start with a two-seater and add a chaise later, or reconfigure when you move.""",
    },
    {
        "slug": "renter-friendly-apartment-upgrades",
        "title": "Renter-Friendly Apartment Upgrades That Make a Real Difference",
        "description": "You don't need to own your apartment to make it feel like home. These temporary upgrades are completely reversible — and some of them are transformative.",
        "category": "Small Apartments",
        "tags": ["renting", "temporary", "no-drill", "apartment", "upgrades"],
        "content": """Renting comes with restrictions — no painting, no drilling, no permanent changes. But that doesn't mean you're stuck with white walls and builder-grade everything. These reversible upgrades make a real difference and leave no trace when you move out.

## Removable wallpaper

Peel-and-stick wallpaper has improved dramatically in quality and design over the last few years. A feature wall in a bedroom or a small bathroom completely transformed with removable wallpaper can be a genuine showstopper — and it peels off cleanly when you leave.

## Command hooks and strips

The versatility of adhesive hooks is genuinely underrated. Gallery walls, floating shelves (designed for command strips), curtain rods, kitchen storage — all achievable without a single drill hole. Check the weight limits and don't exceed them.

## Lighting upgrades

The standard lighting that comes in a rental is usually bad. Replace it without touching the wiring by adding floor lamps, table lamps, string lights and plug-in pendant lights. A plug-in pendant hung in a corner where you'd normally put a floor lamp is a surprisingly elegant solution.

## Window treatments

Tension rods in window frames let you hang curtains without drilling. The right curtains — hung high and wide to frame the window generously — can transform a room. When you leave, take the curtains with you.

## Contact paper for surfaces

Kitchen cabinets, bathroom surfaces, even floors can be temporarily transformed with contact paper. The key is using high-quality contact paper and applying it carefully — budget versions tend to leave residue.""",
    },

    # ── FURNITURE SOLUTIONS ───────────────────────────────────────────────────
    {
        "slug": "convertible-furniture-small-homes",
        "title": "The Best Convertible Furniture for Small Homes",
        "description": "Furniture that transforms is the secret weapon of small-space living. Here are the best convertible pieces — and how to use them without your home feeling like a puzzle.",
        "category": "Furniture Solutions",
        "tags": ["convertible furniture", "sofa bed", "transforming furniture", "small space", "multifunctional"],
        "content": """The idea of furniture that transforms sounds gimmicky — until you actually need it. In a small apartment, a sofa that becomes a bed, a table that expands to seat eight, or a desk that folds into a shelf can be the difference between a functional home and a frustrating one.

## Sofa beds: better than you remember

The sofa beds of ten years ago had a reputation for being uncomfortable and awkward. The current generation is genuinely different. Look for models with pocket spring or memory foam mattresses rather than foam slabs, and test them before you buy if possible.

## Extendable dining tables

An extendable table that seats four daily but expands to seat eight for guests is one of the most practical furniture investments for a small apartment. The best versions extend smoothly and look like a regular table when closed — not like they're hiding a mechanism.

## Ottoman beds

An ottoman bed lifts up to reveal storage underneath — and the storage capacity is significant. A standard double ottoman bed can hold two full sets of bedding, extra pillows, out-of-season clothing and more. If you're buying a new bed for a small bedroom, it's hard to argue against this option.

## Nesting tables

Three tables that stack inside each other and separate when you need surface space: simple, elegant and genuinely useful. Use as a coffee table, side tables, or extra surface when entertaining.

## Desk-to-dining solutions

Some tables are designed to work as both a dining table and a desk. The key is a surface height that works for both (standard dining height, around 75cm, works for most people as a desk), and enough storage nearby for work materials to disappear at mealtimes.""",
    },
    {
        "slug": "right-coffee-table-small-space",
        "title": "How to Choose the Right Coffee Table for a Small Space",
        "description": "The coffee table is the centrepiece of the living room — but in a small space, the wrong one can ruin the whole room. Here's how to get it right.",
        "category": "Furniture Solutions",
        "tags": ["coffee table", "living room", "small space", "furniture", "styling"],
        "content": """The coffee table might be the most important piece of furniture in the living room after the sofa. It anchors the seating area, provides surface space, and visually defines the centre of the room. In a small living room, these factors are magnified.

## Size: smaller than you think

The general rule is that a coffee table should be about two-thirds the length of your sofa. In a small room, you can go even shorter. A table that's too large fills the room and makes moving around it frustrating.

## Glass and acrylic: the transparency advantage

A glass or acrylic coffee table is almost invisible — you can see through it to the floor, which makes the room feel larger. They work particularly well in small rooms where every visual trick counts. The downside is that fingerprints show, and they need regular cleaning.

## Nesting tables instead of a single table

Two or three nesting tables give you flexibility: use all of them when you have guests, push them together normally, or separate them to either side of the sofa when you want floor space. They take up less visual space than a single solid table.

## Storage ottomans as coffee tables

An upholstered ottoman with a tray on top works as a coffee table while providing hidden storage and a softer, more comfortable surface. It's one of the most practical multifunctional furniture choices for a small living room.

## Height matters

A coffee table that's roughly the same height as your sofa cushions (or slightly lower) is the most comfortable for reaching drinks and books. Too low and it looks small and feels awkward; too high and it feels like a dining table that wandered into the wrong room.""",
    },
    {
        "slug": "murphy-beds-worth-it",
        "title": "Murphy Beds: Are They Actually Worth It in 2026?",
        "description": "Murphy beds promise to reclaim your bedroom floor space — but are they practical, comfortable and worth the investment? An honest assessment.",
        "category": "Furniture Solutions",
        "tags": ["murphy bed", "wall bed", "studio apartment", "bedroom", "space saving"],
        "content": """The Murphy bed — a bed that folds up into a wall cabinet when not in use — has been a small-space solution since the early 1900s. But are the modern versions actually good? And is the disruption of buying and installing one worth it?

## The case for a Murphy bed

In a studio apartment, a Murphy bed reclaims the single largest piece of floor space in the home. When folded up, a double bed disappears completely, turning a bedroom into a living space or home office. For anyone working from home in a studio, this is genuinely transformative.

## The case against

Murphy beds require installation — most need to be anchored to a wall and assembled by professionals or very competent DIYers. They're more expensive than a standard bed frame. And the bedding routine changes: you need to fold the duvet each morning rather than simply leaving it.

## Comfort in modern versions

Modern Murphy beds use proper mattresses — often the same pocket spring or memory foam mattresses used in standard beds. The days of uncomfortable fold-out beds are largely over at the quality end of the market.

## The hybrid solution

The most practical Murphy bed designs combine the bed with integrated shelving, a desk, or a sofa. When the bed is folded up, you have a functioning living room with shelves and seating. When it's down, you have a bedroom. The two modes are clearly defined and the transition is smooth.

## Our verdict

If you live in a studio apartment and work from home, a quality Murphy bed is genuinely worth the investment. If you have a separate bedroom, the case is less clear — your money may be better spent on an ottoman bed or better built-in storage.""",
    },
    {
        "slug": "best-shelving-systems",
        "title": "The Best Shelving Systems for Small Apartments",
        "description": "Shelving is storage and decor combined. Here are the best systems for small homes — from budget-friendly options to modular investments built to last.",
        "category": "Furniture Solutions",
        "tags": ["shelving", "storage", "wall shelves", "modular", "organisation"],
        "content": """Good shelving is the backbone of a well-organised small apartment. It provides storage, display space and visual structure — and in a Scandinavian-inspired home, a well-styled shelf is a genuine design statement.

## Fixed shelves vs. freestanding systems

Fixed shelves (mounted directly to the wall) look cleaner and are more flexible in terms of placement. Freestanding shelving units are easier to move and don't require drilling. In a rental, freestanding is usually the better choice unless you're confident in your ability to patch holes when you leave.

## The IKEA KALLAX

For modular, flexible storage, the KALLAX system remains one of the best value options available. It works as a room divider, a media unit, a bookshelf or a sideboard. The square modules allow almost infinite configuration, and the range of inserts (doors, drawers, baskets) adds to its versatility.

## String Furniture: the original modular system

The Swedish String shelving system, designed in 1949, is still in production and still one of the most elegant wall-mounted systems available. It's more expensive than flat-pack alternatives but significantly more beautiful and built to last decades.

## What to put on shelves

The Scandinavian approach to shelf styling: books (spines outward), a few objects (one plant, one candle, one ceramic piece), and empty space. The empty space is as important as what's there — it gives the eye somewhere to rest and stops the shelf from feeling cluttered.

## Weight limits

Every wall and every shelf has a weight limit. Don't exceed it. Heavy books on a shelf rated for decorative items is how shelves (and walls) get damaged. Check the specifications before loading up.""",
    },
    {
        "slug": "mirrors-make-room-bigger",
        "title": "How to Use Mirrors to Make Any Room Look Bigger",
        "description": "Mirrors are one of the most powerful tools in interior design. Used correctly, they can double the perceived size of a room and make dark spaces feel bright.",
        "category": "Furniture Solutions",
        "tags": ["mirrors", "small space", "lighting", "visual tricks", "interior design"],
        "content": """No piece of furniture or decor creates the illusion of more space as effectively as a well-placed mirror. Used thoughtfully, mirrors can make a small room feel significantly larger, a dark room feel brighter, and any room feel more considered and designed.

## The basics: size and placement

The larger the mirror, the greater the effect. A small decorative mirror on a wall does relatively little; a large mirror — full-length or wider than your arm span — makes a dramatic difference. Placement matters too: a mirror that reflects a window or a light source amplifies the light in the room.

## The full-length lean

A full-length mirror leaning against a wall (rather than hung on it) has become a staple of Scandinavian interior styling for good reason. It's flexible (you can move it), it reflects the whole room, and it has an effortlessly casual look that feels very current.

## Opposite windows

If you have a window, placing a mirror on the wall directly opposite it reflects the natural light and makes the room feel as though it has a second window. This is one of the most effective tricks for brightening a dark apartment.

## Mirrors in small hallways

A hallway is often the darkest, smallest space in an apartment. A large mirror — either hung on the wall or placed at the end of a hallway — immediately makes it feel longer and more open. It also serves a practical purpose: checking your appearance before leaving.

## What to avoid

Mirrors facing a cluttered or messy area double the visual chaos. Position mirrors to reflect the best parts of your room — a window, a well-styled shelf, a plant — not the pile of shoes by the door.""",
    },
    {
        "slug": "modular-sofas-small-apartments",
        "title": "Modular Sofas: Why They're Perfect for Small Apartments",
        "description": "A modular sofa adapts to your space, your needs and your future moves. Here's why they're one of the smartest furniture investments for small-space living.",
        "category": "Furniture Solutions",
        "tags": ["modular sofa", "sectional", "living room", "flexible furniture", "small space"],
        "content": """A modular sofa is made up of individual sections that can be configured in different ways — and for small apartment living, this flexibility is genuinely valuable. Here's why, and how to choose well.

## The flexibility argument

When you move — and most apartment dwellers move more than homeowners — your new place will almost certainly be a different shape than your current one. A modular sofa reconfigures to fit. A fixed sofa may not.

## Starting small and growing

Many modular systems let you buy fewer sections now and add more later. Start with a two-seater and an armchair; add a chaise or extra seat section when your budget allows. This is a much better approach than buying a sofa that's too small now and replacing it in three years.

## Configuration options

The most useful configurations for small apartments: a classic two or three-seater with no chaise (keeps the floor plan flexible), or an L-shape with a short chaise that fits into a corner and maximises seating without extending into the middle of the room.

## What to look for

Quality modular sofas have connectors that keep the sections together and prevent them shifting. Test these before buying — sections that slide apart or feel unstable will drive you mad within a week. Also check that the modules are a manageable size for moving through doorways.

## Cover options

Removable, washable covers are particularly valuable in a modular sofa because the large surface area means spills are inevitable. Boucle, linen and cotton blends are popular in Scandinavian-styled homes; avoid velvet in high-traffic homes.""",
    },
    {
        "slug": "dining-solutions-studio",
        "title": "The Best Dining Solutions for Studio Apartments",
        "description": "Eating well doesn't require a dining room. These dining solutions work in even the smallest studio apartment — from fold-down tables to bar-height counters.",
        "category": "Furniture Solutions",
        "tags": ["dining", "studio apartment", "fold-down table", "small space", "bar stool"],
        "content": """Where do you eat in a studio apartment? It's one of the most practical questions in small-space living, and the answer depends on your space, your habits and how much you value having a proper dining setup.

## The wall-mounted fold-down table

A fold-down table mounted to the wall takes up almost no space when folded and provides a proper dining surface for one or two people when open. The best versions fold completely flat against the wall and look like a decorative element when closed. Pair with folding or stackable chairs that hang on wall hooks.

## The kitchen counter with bar stools

If your kitchen has an overhang or a breakfast bar, two bar stools solve the dining problem entirely. Eating at the counter is practical, saves significant floor space, and has a casual, lived-in feel that suits apartment living. Look for stools that tuck fully under the counter when not in use.

## The extendable dining table

A small round table that extends for guests is the most versatile option if you have the floor space for it. In its smallest configuration, a two-person round table takes up very little room; extended, it can seat four to six. Look for drop-leaf designs where the leaves fold down rather than pull out.

## The coffee table hack

Raising the height of a coffee table (with risers or legs) creates a low dining table that works for casual meals. This is not an elegant long-term solution, but it's a practical temporary one for very small spaces.

## The honest answer

If you eat alone or with one other person most of the time, a fold-down table or counter stools is genuinely all you need. Save the floor space for living.""",
    },

    # ── INSPIRATION ──────────────────────────────────────────────────────────
    {
        "slug": "interior-design-rules-to-break",
        "title": "10 Interior Design Rules You Are Allowed to Break",
        "description": "Interior design is full of rules — but the best homes break at least a few of them. Here are the so-called rules that are actually just starting points.",
        "category": "Inspiration",
        "tags": ["interior design", "rules", "creativity", "styling tips", "inspiration"],
        "content": """Every design blog and interior magazine is full of rules: don't mix metals, match your woods, always use odd numbers, never paint a small room dark. Some of these rules exist for good reasons. Others are just conventions that got repeated until they felt like facts.

## Rule 1: Match your metals

Mixed metals — brass and black, chrome and bronze — look better in most rooms than a single metal repeated throughout. The trick is to have one dominant metal and use others as accents.

## Rule 2: Small rooms need light colours

A small room painted in a deep, rich colour can feel moody, intimate and intentional rather than small. Dark green, navy or deep terracotta can work beautifully in a small space if the lighting is right.

## Rule 3: Don't mix wood tones

Multiple wood tones in the same room can look warm and layered rather than mismatched, as long as the underlying colour temperature is consistent (all warm, or all cool, not mixed).

## Rule 4: Keep it minimal

Maximalism — thoughtful, curated, intentional abundance — is as valid as minimalism. The goal is always intention, not quantity.

## Rule 5: Furniture must face the TV

Rooms without a TV as the focal point feel more sociable and conversation-friendly. Orient seating toward a fireplace, a window, or each other.

## The real rule

The only rule that actually matters: does this make you happy to be in the room? If yes, you're doing it right.""",
    },
    {
        "slug": "capsule-wardrobe-for-home",
        "title": "How to Create a Capsule Wardrobe for Your Home",
        "description": "The capsule wardrobe concept — a small collection of versatile, quality pieces — applies just as well to interior design as it does to fashion.",
        "category": "Inspiration",
        "tags": ["capsule", "minimalist", "quality", "furniture", "interior philosophy"],
        "content": """The capsule wardrobe idea is simple: own fewer, better things that work together. Applied to your home, it produces spaces that feel calm, cohesive and considered — without requiring a big budget or constant shopping.

## Start with a colour palette

A capsule home has a limited colour palette — usually three to five colours that appear throughout the whole space. This creates flow and coherence between rooms. In Scandinavian homes, it's typically white or cream, one warm neutral (oak, sand, linen), one dark accent (black, charcoal or navy) and occasionally one colour (sage green, dusty pink, terracotta).

## Invest in the pieces you use most

The capsule approach means spending more on the things you interact with daily: your sofa, your bed, your dining chair. These pieces get hundreds of hours of use per year and are worth the investment. The things you see but don't touch — decorative objects, artwork — can come from anywhere.

## One of each, not three

A capsule home has one good lamp, not four mediocre ones. One large piece of art, not twelve small ones. One carefully chosen plant, not a collection of pots. This isn't deprivation — it's editing.

## Shop slowly

The antithesis of capsule living is impulse buying — filling a home with things that seemed good in the shop but don't fit together. Take your time. Live in a space for a few weeks before deciding what it needs. Let gaps exist rather than filling them immediately.

## Maintenance is part of it

A capsule home is easier to keep clean and tidy — there's simply less to maintain. This isn't a coincidence; it's one of the main arguments for the approach.""",
    },
    {
        "slug": "vintage-in-scandinavian-interiors",
        "title": "The Return of Vintage in Scandinavian Interiors",
        "description": "Vintage pieces are having a moment in Scandinavian design — and for good reason. Here's how the best decorators mix old and new to create spaces with real character.",
        "category": "Inspiration",
        "tags": ["vintage", "secondhand", "sustainability", "scandinavian", "character"],
        "content": """Something interesting has happened in Scandinavian interior design over the last few years. After decades of everything-new, everything-matching minimalism, the most interesting homes are those that deliberately mix eras, origins and stories.

## Why vintage fits Scandinavian design

Scandinavian design has always valued quality and craft over novelty. A well-made Danish chair from 1965 embodies exactly those values — and looks better with age, not worse. The sustainability argument reinforces this: buying secondhand is simply better for the environment than buying new.

## What to look for at markets and online

The golden era of Scandinavian furniture design — roughly 1950 to 1975 — produced pieces that are still widely available and reasonably priced: teak sideboards, beech dining chairs, ceramic vases, wool textiles. These items are recognisably Scandinavian in character and work beautifully with modern pieces.

## Mixing with new

The formula that consistently works: one or two vintage anchor pieces (a sofa, a sideboard, a dining table) paired with simpler, more neutral new pieces. The vintage items provide character; the new pieces provide calm.

## Textiles as an easy entry point

If furniture feels like too big a commitment, vintage textiles — blankets, cushion covers, small rugs — are an easy and affordable way to add vintage character. They're low-risk, easy to store and widely available.

## Provenance adds something money can't buy

There's something genuinely different about a piece that has history. A sideboard that belonged to someone's grandmother, a chair that came from a demolition sale, a lamp from a flea market in Oslo — these objects carry meaning in a way that a flat-pack alternative never will.""",
    },
    {
        "slug": "color-psychology-home",
        "title": "How Colour Psychology Can Transform Your Home",
        "description": "The colours in your home affect how you feel in it — more than almost any other design decision. Here's what the research says and how to use it.",
        "category": "Inspiration",
        "tags": ["colour", "psychology", "paint", "mood", "interior design"],
        "content": """Colour is one of the most powerful tools in interior design — and one of the most misunderstood. The colours you live with every day affect your mood, your energy levels and your ability to rest. Here's how to use that knowledge deliberately.

## Blue: calm, focus, lowered heart rate

Blue is the most universally liked colour and one of the most effective for creating calm. In a bedroom or bathroom, muted blues — dusty blue, grey-blue, slate — promote relaxation and slow the nervous system. Avoid bright, saturated blues in rooms meant for rest.

## Green: balance and connection to nature

Green has become the dominant colour in Scandinavian interiors over the last five years, and the psychology explains why: it references nature, promotes balance, and works in almost any light condition. Sage, olive and forest green all translate well to interior spaces.

## Warm neutrals: comfort and belonging

Warm whites, creams, taupes and beiges create spaces that feel welcoming and safe. They're the backbone of most Scandinavian interiors for good reason — they work with everything and never feel aggressive or demanding.

## Dark colours: intimacy and drama

A dark room — deep green, navy, charcoal — feels intimate and dramatic rather than oppressive, if the lighting is right. These colours are best in rooms where you want to feel enclosed and cosy: a bedroom, a dining room, a study.

## The room you feel worst in

The best starting point for colour psychology in your home: identify the room you feel worst in. Is it anxious? Restless? Cold? The colour (or lack of colour) is often part of the problem — and changing it is often the most affordable and effective solution.""",
    },
    {
        "slug": "indoor-plants-low-light-apartments",
        "title": "The Best Indoor Plants for Low-Light Apartments",
        "description": "No sunny windowsill? No problem. These plants thrive in low-light conditions and bring life and texture to even the darkest apartment.",
        "category": "Inspiration",
        "tags": ["plants", "indoor plants", "low light", "apartment", "green living"],
        "content": """Plants make every home feel more alive — but not every apartment has the bright, sunny windows that most plant care guides assume. The good news is that some of the most beautiful houseplants actually prefer lower light conditions.

## Pothos (Epipremnum aureum)

The most forgiving houseplant that exists. Pothos thrives in low light, tolerates irregular watering, and grows quickly — long trailing vines that look beautiful hanging from a shelf or trailing down a bookcase. Available in plain green, variegated and neon varieties.

## Snake plant (Sansevieria)

Architectural, striking and almost impossible to kill. Snake plants tolerate low light and infrequent watering and are one of the best air-purifying plants available. They work particularly well in Scandinavian interiors because of their graphic, upright form.

## ZZ plant (Zamioculcas zamiifolia)

A glossy, sculptural plant that thrives on neglect. Water it once every two to three weeks, give it any amount of indirect light, and it will grow slowly and steadily for years. One of the best choices for genuinely dark corners.

## Peace lily (Spathiphyllum)

One of the few flowering plants that tolerates low light. Peace lilies produce white flowers, have large, dramatic leaves, and are good air purifiers. They droop noticeably when they need water — a useful signal for forgetful plant owners.

## Positioning tips

Even low-light plants need some light — no plant survives in a windowless room without grow lights. Place them within a few metres of a window, even a north-facing one. Rotate them occasionally so all sides get even light.""",
    },
    {
        "slug": "gallery-wall-guide",
        "title": "How to Create a Gallery Wall That Actually Looks Good",
        "description": "Gallery walls are one of the most popular interior trends — and one of the easiest to get wrong. Here's how to plan and execute one that looks intentional.",
        "category": "Inspiration",
        "tags": ["gallery wall", "art", "frames", "wall decor", "styling"],
        "content": """A gallery wall done well is one of the most impactful things you can do in a room. A gallery wall done badly looks chaotic and random. The difference almost always comes down to planning.

## Start on paper, not the wall

Trace your frames onto paper, cut out the shapes, and arrange them on the floor first. Take a photo. Move things around until you're happy. Only then pick up the hammer. This step alone prevents 90% of gallery wall regrets.

## Choose a unifying element

The most cohesive gallery walls have one thing in common throughout: the same frame colour, the same mat, the same colour palette in the artwork, or the same subject matter. Pick one unifying element and let everything else vary.

## Odd numbers and varying sizes

Groups of three, five or seven feel more natural than even numbers. Mixing sizes — a large anchor piece, medium pieces, and a few small ones — creates more visual interest than a grid of identical frames.

## The Scandinavian approach

In Scandinavian homes, gallery walls tend to be more restrained than the maximalist floor-to-ceiling versions popular elsewhere. A grouping of five to seven frames, mostly in the same neutral colour, with a mix of photography, simple prints and one or two botanical illustrations is a classic approach.

## Leave breathing room

The space between frames matters as much as the frames themselves. Too close and the wall feels crowded; too far apart and it looks like random pictures rather than a considered arrangement. Around 5-8cm between frames is generally the right range.""",
    },
    {
        "slug": "seasonal-decor-without-clutter",
        "title": "How to Decorate Seasonally Without Creating Clutter",
        "description": "Seasonal decorating can make your home feel alive and connected to the year — but it can also mean boxes of stuff you only use twice. Here's how to do it with intention.",
        "category": "Inspiration",
        "tags": ["seasonal decor", "minimalism", "christmas", "autumn", "simplicity"],
        "content": """Seasonal decorating is one of life's genuinely pleasurable rituals — the first candle of autumn, the pine branches in December, the tulips of spring. But it can easily tip into accumulation: boxes of decorations that only come out once a year, filling cupboards and costing money.

## The capsule approach to seasonal decor

Apply the same thinking to seasonal decor as to everything else: own fewer, better things. Five beautiful pieces that you love bringing out each season are worth more than thirty mediocre ones.

## Natural, perishable decor

The most beautiful seasonal decor is often the most temporary: branches, foliage, flowers, pine cones, fruit. These cost almost nothing, look genuinely beautiful, and require no storage because they go back to nature when the season ends.

## Candles as a year-round foundation

In Scandinavian homes, candles are not seasonal — they're permanent. The fragrance and the style might change with the season, but candles on the table, on the windowsill, on the mantelpiece are always present. This is a practice worth adopting.

## A small dedicated box

If you do keep seasonal decorations, commit to one small box per season. When the box is full, something has to come out before something new comes in. This rule prevents the slow accumulation of seasonal clutter over years.

## Texture as seasonal signal

You can signal a season through texture rather than decoration: heavy wool throws in winter, linen in summer, dried flowers in autumn, fresh greenery in spring. These transitions feel natural and require almost no storage because most of them are things you use anyway.""",
    },
]

# ─── Generate files ───────────────────────────────────────────────────────────

os.makedirs(POSTS_DIR, exist_ok=True)

cat_counters = {}

for i, post in enumerate(POSTS):
    pub_date = START_DATE + timedelta(days=i)
    category = post["category"]

    # Pick image round-robin
    pool = IMAGES[category]
    idx = cat_counters.get(category, 0)
    image = pool[idx % len(pool)]
    cat_counters[category] = idx + 1

    tags_str = ", ".join(f'"{t}"' for t in post["tags"])

    title_safe = post["title"].replace('"', '\\"')
    desc_safe = post["description"].replace('"', '\\"')

    frontmatter = f"""---
title: "{title_safe}"
description: "{desc_safe}"
category: "{category}"
tags: [{tags_str}]
date: "{pub_date.isoformat()}"
coverImage: "{image}"
affiliate: false
featured: false
---

"""

    full_content = frontmatter + post["content"].strip() + "\n"
    filepath = os.path.join(POSTS_DIR, f"{post['slug']}.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_content)

    print(f"  OK [{pub_date}] {post['slug']}.md")

print(f"\nDone. {len(POSTS)} posts created in {POSTS_DIR}/")
print("Dates run from", START_DATE, "to", START_DATE + timedelta(days=len(POSTS)-1))
print("\nNow run:")
print("  git add . && git commit -m 'Add 30 scheduled posts' && git push")
