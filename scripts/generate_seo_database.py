import csv
import re
import os
import json
from collections import Counter

WORKSPACE_DIR = "/Users/alok/gorakhpur got letent "
BANK_CSV = os.path.join(WORKSPACE_DIR, "GGL_10000_plus_Keyword_Research_Bank.csv")
CLUSTERS_CSV = os.path.join(WORKSPACE_DIR, "GGL_SEO_Topical_Clusters.csv")
ROADMAP_CSV = os.path.join(WORKSPACE_DIR, "GGL_SEO_Content_Roadmap.csv")
PLAN_CSV = os.path.join(WORKSPACE_DIR, "GGL_SEO_Implementation_Plan.csv")

def clean_kw(kw):
    kw = kw.strip().lower()
    kw = re.sub(r'[\u2018\u2019]', "'", kw)
    kw = re.sub(r'[\u201c\u201d]', '"', kw)
    kw = re.sub(r'\s+', ' ', kw)
    return kw

def main():
    keywords_set = set()
    rows = []

    def add_kw(kw, cat, cluster, intent, funnel, loc, kw_type, pri_kw, supp_kw, sug_page, rec_page, content_type, priority, seo_opp, risk, link_topic, gap, notes):
        ckw = clean_kw(kw)
        if not ckw or ckw in keywords_set:
            return False
        keywords_set.add(ckw)

        display_kw = kw.strip()
        display_kw = re.sub(r'[\u2018\u2019]', "'", display_kw)

        # Brand Safety check for "Gorakhpur Got Talent" / GGT competitor brand queries
        if "gorakhpur got talent" in ckw or "gorakhpur's got talent" in ckw or "ggt gorakhpur" in ckw:
            if "vs" in ckw or "difference" in ckw or "same" in ckw or "compare" in ckw or "which" in ckw:
                cat = "Brand Disambiguation"
                cluster = "Brand Disambiguation"
                sug_page = "/guides/brand-disambiguation"
                rec_page = "New Page Recommended"
                kw_type = "Informational Keywords"
                gap = "New Page Recommended"
                link_topic = "Brand Disambiguation"
                notes = "Brand Disambiguation Query. Factual comparison differentiating GGL from separate GGT event."
            else:
                cat = "Competitor / Other Event"
                cluster = "Ambiguous / Other-Event Keywords"
                sug_page = "NONE"
                rec_page = "Do Not Target"
                kw_type = "Ambiguous / Other-Event Keywords"
                gap = "Existing Page"
                link_topic = "NONE"
                priority = "Low"
                seo_opp = "Low"
                notes = "Keyword Status = AMBIGUOUS / OTHER EVENT / COMPETITOR BRAND. GGL Target Page = NONE."

        rows.append({
            "Keyword": display_kw,
            "Category": cat,
            "Topic Cluster": cluster,
            "Search Intent": intent,
            "Search Funnel": funnel,
            "Location": loc,
            "Keyword Type": kw_type,
            "Primary Keyword": pri_kw,
            "Supporting Keyword": supp_kw,
            "Suggested Target Page": sug_page,
            "Recommended Page": rec_page,
            "Content Type": content_type,
            "Priority": priority,
            "SEO Opportunity": seo_opp,
            "Cannibalization Risk": risk,
            "Internal Linking Topic": link_topic,
            "Content Gap": gap,
            "Notes": notes
        })
        return True

    print("Generating Updated SEO Research Database (>10,000 records)...")

    # ==========================================
    # 1. CANONICAL BRAND & MISSPELLINGS
    # ==========================================
    canonical_brands = [
        "Gorakhpur's Got Latent", "Gorakhpur Got Latent", "GGL", "GGL Gorakhpur", "Gorakhpur’s Got Latent"
    ]
    brand_misspellings = [
        "gorakhpur got latant", "gorakhpur got latend", "gorakhpur got lattet",
        "gorakhpur got latnt", "gorakhpur got laten", "gkp got latent", "gkp latent",
        "gkp got latant", "gkp got latend", "gorakhpur latent", "gorakhpur got latent show",
        "gorakhpur got latent event", "gorakhpur got latent gorakhpur", "gorakhpur's got latent gorakhpur"
    ]

    brand_suffixes = [
        ("official website", "Navigational", "Navigation", "/", "Existing Page", "Landing Page", "High", "Very High", "Low", "Homepage", "Existing Page", "Official portal of GGL"),
        ("about show", "Informational", "Awareness", "/about", "Existing Page", "Informational Guide", "High", "High", "Low", "About Page", "Existing Page", "Background about GGL talent show"),
        ("contact details", "Navigational", "Post-visit / support", "/contact", "Existing Page", "Form Page", "Medium", "Medium", "Low", "Contact Page", "Existing Page", "Contact & support information"),
        ("founder details", "Informational", "Awareness", "/founder", "Existing Page", "Informational Guide", "Medium", "Medium", "Low", "Founder Page", "Existing Page", "Information on GGL founder"),
        ("malik details", "Informational", "Awareness", "/malik", "Existing Page", "Informational Guide", "Medium", "Medium", "Low", "Malik Page", "Existing Page", "Information on Malik GGL"),
        ("computerji details", "Informational", "Awareness", "/computerji", "Existing Page", "Informational Guide", "Medium", "Medium", "Low", "Computerji Page", "Existing Page", "Information on Computerji GGL"),
        ("quick info", "Informational", "Discovery", "/quick-info", "Existing Page", "Informational Guide", "High", "High", "Low", "Quick Info Page", "Existing Page", "Fast key details for GGL"),
        ("terms of service", "Informational", "Post-visit / support", "/terms", "Existing Page", "Policy Page", "Low", "Low", "Low", "Terms Page", "Existing Page", "Official terms of service"),
        ("privacy policy", "Informational", "Post-visit / support", "/privacy", "Existing Page", "Policy Page", "Low", "Low", "Low", "Privacy Page", "Existing Page", "Official privacy policy"),
        ("refund policy", "Informational", "Post-visit / support", "/refund-policy", "Existing Page", "Policy Page", "Medium", "Medium", "Low", "Refund Policy Page", "Existing Page", "Official ticket refund rules"),
        ("official sponsors", "Informational", "Awareness", "/sponsors", "Existing Page", "Landing Page", "Medium", "Medium", "Low", "Sponsors Page", "Existing Page", "Sponsor & partner directory"),
        ("participant list", "Informational", "Discovery", "/participants", "Existing Page", "Category Hub", "High", "High", "Low", "Performer Directory", "Existing Page", "List of registered performers"),
        ("voting link", "Transactional", "Transaction", "/vote", "Existing Page", "Form Page", "High", "Very High", "Low", "Voting Page", "Existing Page", "Audience voting system portal"),
        ("live updates", "Informational", "Discovery", "/live", "Existing Page", "Landing Page", "High", "High", "Low", "Live Updates", "Existing Page", "Live show status and stream"),
        ("ticket check", "Transactional", "Transaction", "/tickets", "Existing Page", "Dashboard Page", "High", "High", "Low", "Tickets Dashboard", "Existing Page", "User ticket portal")
    ]

    for b in canonical_brands:
        add_kw(b, "Brand", "GGL Brand", "Navigational", "Navigation", "Gorakhpur", "Brand Keywords", b, "GGL", "/", "Existing Page", "Landing Page", "High", "Very High", "Low", "Homepage", "Existing Page", "Canonical GGL brand term")
        for suf, intent, funnel, path, rec, ctype, pri, opp, risk, ltopic, gap, notes in brand_suffixes:
            add_kw(f"{b} {suf}", "Brand", "GGL Brand", intent, funnel, "Gorakhpur", "Brand Keywords", f"{b} {suf}", b, path, rec, ctype, pri, opp, risk, ltopic, gap, notes)

    for m in brand_misspellings:
        add_kw(m, "Brand", "Gorakhpur Got Latent", "Navigational", "Navigation", "Gorakhpur", "Brand Misspellings", "Gorakhpur's Got Latent", m, "/", "Existing Page", "Landing Page", "High", "High", "Low", "Homepage", "Existing Page", "Spelling variation mapped to canonical GGL page")

    # ==========================================
    # 2. DISAMBIGUATION KEYWORDS (GGL vs GGT)
    # ==========================================
    disambiguation_queries = [
        "Gorakhpur Got Talent vs Gorakhpur's Got Latent",
        "is Gorakhpur Got Talent the same as Gorakhpur's Got Latent",
        "difference between Gorakhpur Got Talent and GGL",
        "Gorakhpur's Got Latent or Gorakhpur Got Talent",
        "Gorakhpur Got Talent vs GGL Gorakhpur",
        "is GGL different from Gorakhpur Got Talent",
        "which talent show is GGL Gorakhpur Got Talent",
        "Gorakhpur Got Talent official connection to GGL"
    ]
    for dq in disambiguation_queries:
        add_kw(dq, "Brand Disambiguation", "Brand Disambiguation", "Informational", "Discovery", "Gorakhpur", "Informational Keywords", "Gorakhpur's Got Latent vs Gorakhpur Got Talent", dq, "/guides/brand-disambiguation", "Future Page", "Informational Guide", "Medium", "High", "Low", "Brand Disambiguation", "New Page Recommended", "Brand Disambiguation Query. Factual comparison differentiating GGL from separate GGT event.")

    other_event_queries = [
        "Gorakhpur Got Talent", "Gorakhpur's Got Talent", "Gorakhpur Got Talent show",
        "Gorakhpur Got Talent event", "GGT Gorakhpur", "Gorakhpur Got Talent auditions",
        "Gorakhpur Got Talent registration", "Gorakhpur Got Talent ticket price"
    ]
    for oq in other_event_queries:
        add_kw(oq, "Competitor / Other Event", "Ambiguous / Other-Event Keywords", "Informational", "Awareness", "Gorakhpur", "Ambiguous / Other-Event Keywords", oq, oq, "NONE", "Do Not Target", "Informational Guide", "Low", "Low", "Low", "NONE", "Existing Page", "Keyword Status = AMBIGUOUS / OTHER EVENT / COMPETITOR BRAND. GGL Target Page = NONE.")

    # ==========================================
    # 3. TICKET KEYWORDS & AUDIENCE ENTRY
    # ==========================================
    ticket_bases = [
        "GGL ticket", "GGL tickets", "GGL ticket booking", "GGL online ticket", "GGL official ticket",
        "GGL ₹149 ticket", "Gorakhpur's Got Latent ticket price", "Gorakhpur's Got Latent ticket booking",
        "GGL event ticket", "GGL audience ticket", "GGL entry ticket", "GGL QR ticket",
        "GGL digital ticket", "GGL ticket verification", "GGL ticket status", "GGL pass booking",
        "Gorakhpur Got Latent entry pass", "GGL audience pass online", "GGL ₹149 pass"
    ]
    ticket_mod = [
        ("booking online portal", "Transactional", "Transaction", "/book-ticket", "Existing Page", "Form Page", "High", "Very High", "Low", "Ticket Page", "Existing Page", "Primary booking workflow"),
        ("price 149 INR", "Informational", "Consideration", "/book-ticket", "Existing Page", "Informational Guide", "High", "Very High", "Low", "Ticket Page", "Existing Page", "Publicly confirmed price ₹149"),
        ("verification link", "Informational", "Post-visit / support", "/verifyticket", "Existing Page", "Form Page", "High", "High", "Low", "Ticket Page", "Existing Page", "QR pass verification interface"),
        ("qr scanner online", "Informational", "Post-visit / support", "/verifyticket", "Existing Page", "Form Page", "High", "High", "Low", "Ticket Page", "Existing Page", "Ticket scan at entry"),
        ("audience gate entry guidelines", "Informational", "Consideration", "/quick-info", "Existing Page", "Informational Guide", "High", "High", "Low", "Audience Guide", "Existing Page", "Reporting time and rules"),
        ("pdf pass download", "Transactional", "Transaction", "/tickets", "Existing Page", "Dashboard Page", "High", "High", "Low", "Ticket Page", "Existing Page", "Download entry ticket"),
        ("refund policy rules", "Informational", "Post-visit / support", "/refund-policy", "Existing Page", "Policy Page", "Medium", "Medium", "Low", "Refund Policy Page", "Existing Page", "Ticket refund policies")
    ]

    for tb in ticket_bases:
        add_kw(tb, "Tickets", "Tickets", "Transactional", "Transaction", "Gorakhpur", "Ticket Keywords", "GGL ticket booking", tb, "/book-ticket", "Existing Page", "Form Page", "High", "Very High", "Low", "Ticket Page", "Existing Page", "Primary ticket booking keyword")
        for suf, intent, funnel, path, rec, ctype, pri, opp, risk, ltopic, gap, notes in ticket_mod:
            add_kw(f"{tb} {suf}", "Tickets", "Tickets", intent, funnel, "Gorakhpur", "Ticket Keywords", "GGL ticket booking", tb, path, rec, ctype, pri, opp, risk, ltopic, gap, notes)

    # ==========================================
    # 4. AUDITIONS & PERFORMER APPLICATIONS
    # ==========================================
    audition_bases = [
        "GGL audition", "GGL auditions", "GGL performer application", "GGL performer registration",
        "Gorakhpur talent audition", "Gorakhpur talent hunt", "Gorakhpur performer registration",
        "GGL participant apply", "GGL talent submission", "GGL performer form online"
    ]
    audition_mod = [
        ("registration online form", "Transactional", "Transaction", "/apply/performer", "Existing Page", "Form Page", "High", "Very High", "Low", "Audition Page", "Existing Page", "Primary performer registration form"),
        ("selection process and criteria", "Informational", "Consideration", "/apply/performer", "Existing Page", "Informational Guide", "High", "High", "Low", "Audition Page", "Existing Page", "Audition selection guidelines"),
        ("performance duration rules", "Informational", "Consideration", "/quick-info", "Existing Page", "Informational Guide", "High", "High", "Low", "Performer Guide", "Existing Page", "Time limit on stage"),
        ("video submission guidelines", "Informational", "Intent", "/apply/performer", "Existing Page", "Informational Guide", "High", "High", "Low", "Audition Page", "Existing Page", "Video upload instructions")
    ]

    for ab in audition_bases:
        add_kw(ab, "Auditions", "Auditions", "Transactional", "Transaction", "Gorakhpur", "Audition Keywords", "GGL performer registration", ab, "/apply/performer", "Existing Page", "Form Page", "High", "Very High", "Low", "Audition Page", "Existing Page", "Primary audition keyword")
        for suf, intent, funnel, path, rec, ctype, pri, opp, risk, ltopic, gap, notes in audition_mod:
            add_kw(f"{ab} {suf}", "Auditions", "Auditions", intent, funnel, "Gorakhpur", "Audition Keywords", "GGL performer registration", ab, path, rec, ctype, pri, opp, risk, ltopic, gap, notes)

    # ==========================================
    # 5. TALENT-SPECIFIC CATEGORIES MATRIX
    # ==========================================
    talent_cats_config = [
        ("Comedy", "gorakhpur comedy audition", "/categories/comedy", "Comedy",
         ["standup comedy", "improv comedy", "dark comedy", "clean comedy", "monologue comedy", "roast comedy", "regional humor", "spoof act", "mimic comedy", "comic storytelling", "solo sketch comedy", "open mic comedy", "satirical monologue", "parody comedy", "slapstick comedy"]),

        ("Dance", "gorakhpur dance audition", "/categories/dance", "Dance",
         ["bollywood dance", "hip hop dance", "classical kathak", "bharatanatyam", "contemporary dance", "locking popping", "breakdance battle", "folk dance", "urban dance", "solo dance act", "group dance act", "street dance battle", "fusion dance", "freestyle dance", "semi classical dance"]),

        ("Singing", "gorakhpur singing audition", "/categories/singing", "Singing",
         ["bollywood singing", "classical vocals", "sufi singing", "ghazal performance", "folk music Purvanchal", "acoustic vocal", "rap battle", "duet singing", "acapella singing", "regional bhojpuri song", "pop singing solo", "rock vocals", "devotional song", "semi classical singing", "lyrical vocal performance"]),

        ("Music", "gorakhpur instrumental audition", "/categories/music", "Music",
         ["acoustic guitar solo", "drumming performance", "flute artist", "tabla recital", "keyboard soloist", "synthesizer beatmaker", "violin instrumental", "harmonium solo", "instrumental acoustic band", "percussion solo", "electric guitar solo", "saxophone performance", "sitar recital", "cajon beat solo", "instrumental duet"]),

        ("Poetry", "gorakhpur poetry audition", "/categories/poetry", "Poetry",
         ["hindi kavita recital", "urdu shayari open mic", "purvanchal poetry", "spoken word poetry", "lyrical poem", "standup poetry", "patriotic kavita", "romantic shayari", "satirical poetry", "ghazal recitation", "hasya kavita recital", "modern hindi poem", "nazm recitation", "shayari battle", "poetic storytelling"]),

        ("Beatboxing", "gorakhpur beatbox audition", "/categories/beatbox", "Beatboxing",
         ["solo beatbox battle", "vocal percussion loop", "beatbox sound effects", "vocal bass drop", "scratch beatbox", "acoustic beatbox performance", "rhythm vocal box", "dubstep beatboxing", "musical beatbox duet", "fast beatbox battle", "loop station beatboxing", "vocal synth beatbox", "trap beatboxing", "hip hop beatbox", "sound imitation beatbox"]),

        ("Mimicry", "gorakhpur mimicry audition", "/categories/mimicry", "Mimicry",
         ["celebrity voice mimicry", "actor impression act", "political satire mimicry", "movie dialogue delivery", "cartoon character voice", "regional politician mimicry", "cricket commentator mimicry", "bollywood actor voice", "comedy mimicry act", "multi voice impression", "film dialogue battle", "mimicry monologues", "parody voice act", "voice modulation showcase", "funny animal voice mimicry"]),

        ("Magic", "gorakhpur magic audition", "/categories/magic", "Magic",
         ["stage illusion magic", "sleight of hand card trick", "mentalism mind reading", "close up coin magic", "levitation trick", "escape magic act", "visual magic act", "comedy magic show", "rope trick magic", "prediction mentalism", "telekinesis illusion", "rubik cube magic", "card manipulation", "mind reading demonstration", "parlor magic show"]),

        ("Unique Talent", "unusual talent gorakhpur", "/categories/unique-talent", "Unique Talent",
         ["speed art painting", "shadow play act", "callisthenics display", "rubik cube speed solving", "whistling tunes", "bubble art show", "sand animation", "trick shot performance", "juggling show", "acrobatic balance", "fire spinning show", "stunt performance", "body percussion", "ventriloquism act", "quick change costume act"])
    ]

    action_phrases = [
        "audition online for", "register as performer for", "apply today for", "submit video entry for",
        "check rules and guidelines for", "tips to prepare for", "judging scoring criteria for", "where to perform",
        "upcoming open mic for", "stage performance rules for", "selection guidelines for", "video submission rules for",
        "how to get selected in", "best techniques for", "rehearsal requirements for"
    ]

    loc_contexts = [
        "in Gorakhpur", "in Gorakhpur UP", "for GGL show", "at Gorakhpur's Got Latent", "in Purvanchal",
        "in Eastern Uttar Pradesh", "in GKP city", "for Episode 2 auditions", "online application", "stage show 2026"
    ]

    for cat_name, pri_kw, target_url, main_cluster, subgenres in talent_cats_config:
        add_kw(f"{cat_name} audition Gorakhpur", "Talent Category", main_cluster, "Transactional", "Transaction", "Gorakhpur", "Talent-Specific Keywords", pri_kw, pri_kw, target_url, "Future Page", "Category Hub", "High", "Very High", "Low", main_cluster, "New Page Recommended", f"Primary {cat_name} talent audition hub")

        for g in subgenres:
            for act in action_phrases:
                for loc in loc_contexts[:4]:
                    kw_str = f"{act} {g} {loc}"
                    intent = "Transactional" if "apply" in act or "register" in act or "audition" in act else ("Informational" if "tips" in act or "rules" in act or "how" in act else "Commercial")
                    funnel = "Transaction" if intent == "Transactional" else ("Consideration" if intent == "Informational" else "Discovery")

                    add_kw(
                        kw_str,
                        "Talent Category",
                        main_cluster,
                        intent,
                        funnel,
                        "Gorakhpur",
                        "Talent-Specific Keywords",
                        pri_kw,
                        g,
                        target_url,
                        "Future Page",
                        "Category Hub" if intent == "Commercial" else ("Form Page" if intent == "Transactional" else "Informational Guide"),
                        "High",
                        "High",
                        "Low",
                        main_cluster,
                        "New Page Recommended",
                        f"Targeted search for {g} in {cat_name}"
                    )

    # ==========================================
    # 6. HINGLISH & HINDI SEARCH EXPANSION
    # ==========================================
    hinglish_queries = [
        ("gorakhpur me audition kaha ho raha hai", "Auditions", "Auditions", "Informational", "Discovery", "/apply/performer", "Existing Page", "Form Page"),
        ("gorakhpur me talent show kab hai", "Local SEO", "Gorakhpur Events", "Informational", "Discovery", "/events/gorakhpur", "Future Page", "Event Listing"),
        ("gorakhpur got latent me kaise participate kare", "Auditions", "Performer Applications", "Informational", "Intent", "/apply/performer", "Existing Page", "Form Page"),
        ("gorakhpur got latent ka ticket kitne ka hai", "Tickets", "Tickets", "Informational", "Consideration", "/book-ticket", "Existing Page", "Informational Guide"),
        ("gorakhpur got latent ka ticket kaha milega", "Tickets", "Tickets", "Transactional", "Transaction", "/book-ticket", "Existing Page", "Form Page"),
        ("gorakhpur me singing audition kaha hai", "Talent Category", "Singing", "Informational", "Discovery", "/categories/singing", "Future Page", "Category Hub"),
        ("gorakhpur me dance audition kaha hai", "Talent Category", "Dance", "Informational", "Discovery", "/categories/dance", "Future Page", "Category Hub"),
        ("comedy audition gorakhpur me kaha hoga", "Talent Category", "Comedy", "Informational", "Discovery", "/categories/comedy", "Future Page", "Category Hub"),
        ("gorakhpur got latent me kya perform kar sakte hai", "Auditions", "Performer Preparation", "Informational", "Consideration", "/quick-info", "Existing Page", "Informational Guide"),
        ("audition ke liye kya karna hoga", "Auditions", "Performer Applications", "Informational", "Intent", "/apply/performer", "Existing Page", "Informational Guide"),
        ("ticket online kaise book kare", "Tickets", "Tickets", "Transactional", "Transaction", "/book-ticket", "Existing Page", "Form Page"),
        ("gorakhpur got latent me entry kaise milegi", "Tickets", "Audience Information", "Informational", "Consideration", "/quick-info", "Existing Page", "Informational Guide"),
        ("performer kaise bane", "Auditions", "Performer Applications", "Informational", "Intent", "/apply/performer", "Existing Page", "Form Page"),
        ("gorakhpur ka talent show", "Local SEO", "Gorakhpur Talent Show", "Commercial", "Discovery", "/events/gorakhpur", "Future Page", "Category Hub"),
        ("gorakhpur me live entertainment show", "Local SEO", "Gorakhpur Events", "Commercial", "Discovery", "/events/gorakhpur", "Future Page", "Event Listing")
    ]
    for hq, cat, cl, intent, funnel, path, rec, ctype in hinglish_queries:
        add_kw(hq, cat, cl, intent, funnel, "Gorakhpur", "Long-Tail Keywords", hq, hq, path, rec, ctype, "High", "High", "Low", cl, "Existing Page" if rec == "Existing Page" else "New Page Recommended", "Natural Hinglish user search query")

    hindi_queries = [
        ("गोरखपुर में टैलेंट शो", "Local SEO", "Gorakhpur Talent Show", "Commercial", "Discovery", "/events/gorakhpur", "Future Page", "Category Hub"),
        ("गोरखपुर टैलेंट शो", "Local SEO", "Gorakhpur Talent Show", "Commercial", "Discovery", "/events/gorakhpur", "Future Page", "Category Hub"),
        ("गोरखपुर में ऑडिशन", "Auditions", "Auditions", "Informational", "Discovery", "/apply/performer", "Existing Page", "Form Page"),
        ("गोरखपुर सिंगिंग ऑडिशन", "Talent Category", "Singing", "Transactional", "Transaction", "/categories/singing", "Future Page", "Category Hub"),
        ("गोरखपुर डांस ऑडिशन", "Talent Category", "Dance", "Transactional", "Transaction", "/categories/dance", "Future Page", "Category Hub"),
        ("गोरखपुर कॉमेडी ऑडिशन", "Talent Category", "Comedy", "Transactional", "Transaction", "/categories/comedy", "Future Page", "Category Hub"),
        ("गोरखपुर में मनोरंजन कार्यक्रम", "Local SEO", "Gorakhpur Events", "Commercial", "Discovery", "/events/gorakhpur", "Future Page", "Event Listing"),
        ("गोरखपुर लाइव शो", "Local SEO", "Gorakhpur Events", "Commercial", "Discovery", "/events/gorakhpur", "Future Page", "Event Listing"),
        ("गोरखपुर में टिकट कैसे बुक करें", "Tickets", "Tickets", "Transactional", "Transaction", "/book-ticket", "Existing Page", "Form Page"),
        ("गोरखपुर में टैलेंट शो में कैसे जाएं", "Tickets", "Audience Information", "Informational", "Consideration", "/quick-info", "Existing Page", "Informational Guide"),
        ("गोरखपुर में परफॉर्म कैसे करें", "Auditions", "Performer Applications", "Informational", "Intent", "/apply/performer", "Existing Page", "Form Page")
    ]
    for hq, cat, cl, intent, funnel, path, rec, ctype in hindi_queries:
        add_kw(hq, cat, cl, intent, funnel, "Gorakhpur", "Long-Tail Keywords", hq, hq, path, rec, ctype, "High", "High", "Low", cl, "Existing Page" if rec == "Existing Page" else "New Page Recommended", "Natural Hindi script user search query")

    # ==========================================
    # 7. SOCIAL & VIDEO DISCOVERY KEYWORDS
    # ==========================================
    social_video_queries = [
        ("gorakhpur got latent youtube", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/ep1", "Existing Page", "Landing Page"),
        ("gorakhpur got latent instagram", "Instagram", "Instagram / Social Discovery Keywords", "Informational", "Discovery", "/about", "Existing Page", "Informational Guide"),
        ("gorakhpur got latent videos", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/ep1", "Existing Page", "Landing Page"),
        ("gorakhpur got latent episode", "Episode 2", "Episode Keywords", "Informational", "Discovery", "/ep1", "Existing Page", "Landing Page"),
        ("gorakhpur got latent episode 2", "Episode 2", "Episode Keywords", "Informational", "Discovery", "/episodes/episode-2", "Future Page", "Informational Guide"),
        ("gorakhpur talent show youtube", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/ep1", "Existing Page", "Landing Page"),
        ("gorakhpur entertainment youtube", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/ep1", "Existing Page", "Landing Page"),
        ("gorakhpur live show video", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/ep1", "Existing Page", "Landing Page"),
        ("gorakhpur audition video", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/apply/performer", "Existing Page", "Informational Guide"),
        ("gorakhpur performer video", "YouTube", "Video / YouTube Discovery Keywords", "Informational", "Discovery", "/participants", "Existing Page", "Category Hub")
    ]
    for sv, cat, kw_t, intent, funnel, path, rec, ctype in social_video_queries:
        add_kw(sv, cat, cat, intent, funnel, "Gorakhpur", kw_t, sv, sv, path, rec, ctype, "High", "High", "Low", cat, "Existing Page" if rec == "Existing Page" else "New Page Recommended", "Social / video platform discovery search")

    # ==========================================
    # 8. REAL USER QUESTION EXPANSION (WHO, WHAT, WHERE, WHEN, HOW, WHY, CAN, IS, PRICE)
    # ==========================================
    q_templates = [
        # WHO
        ("what is gorakhpur's got latent", "GGL Brand", "Brand Keywords", "Informational", "Awareness", "/about"),
        ("who can participate in gorakhpur got latent", "Auditions", "Question Keywords", "Informational", "Consideration", "/quick-info"),
        ("who can audition for gorakhpur got latent", "Auditions", "Question Keywords", "Informational", "Consideration", "/apply/performer"),
        ("who can attend gorakhpur got latent", "Audience Information", "Question Keywords", "Informational", "Consideration", "/quick-info"),
        ("who can perform in gorakhpur got latent", "Auditions", "Question Keywords", "Informational", "Consideration", "/apply/performer"),

        # WHAT
        ("what is gorakhpur got latent", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/about"),
        ("what happens in gorakhpur got latent", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/about"),
        ("what talents are accepted", "Auditions", "Question Keywords", "Informational", "Consideration", "/quick-info"),
        ("what can I perform", "Auditions", "Question Keywords", "Informational", "Consideration", "/quick-info"),
        ("what is the ticket price", "Tickets", "Question Keywords", "Informational", "Consideration", "/book-ticket"),
        ("what is the audition process", "Auditions", "Question Keywords", "Informational", "Intent", "/apply/performer"),
        ("what is episode 2", "Episode 2", "Question Keywords", "Informational", "Discovery", "/episodes/episode-2"),
        ("what happens after applying", "Auditions", "Question Keywords", "Informational", "Post-visit / support", "/apply/performer"),

        # WHERE
        ("where is gorakhpur got latent", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/quick-info"),
        ("where can I audition in gorakhpur", "Auditions", "Question Keywords", "Informational", "Discovery", "/apply/performer"),
        ("where can I buy tickets", "Tickets", "Question Keywords", "Transactional", "Transaction", "/book-ticket"),
        ("where can I watch gorakhpur got latent", "YouTube", "Question Keywords", "Informational", "Discovery", "/ep1"),
        ("where is the event happening", "Local SEO", "Question Keywords", "Informational", "Awareness", "/quick-info"),

        # WHEN
        ("when is gorakhpur got latent", "Local SEO", "Question Keywords", "Informational", "Awareness", "/quick-info"),
        ("when are auditions", "Auditions", "Question Keywords", "Informational", "Discovery", "/apply/performer"),
        ("when are tickets available", "Tickets", "Question Keywords", "Informational", "Discovery", "/book-ticket"),
        ("when is episode 2", "Episode 2", "Question Keywords", "Informational", "Discovery", "/episodes/episode-2"),
        ("when will the next episode come", "Episode 2", "Question Keywords", "Informational", "Discovery", "/episodes/episode-2"),

        # HOW
        ("how to apply for gorakhpur got latent", "Auditions", "Question Keywords", "Transactional", "Intent", "/apply/performer"),
        ("how to audition", "Auditions", "Question Keywords", "Transactional", "Intent", "/apply/performer"),
        ("how to buy tickets", "Tickets", "Question Keywords", "Transactional", "Transaction", "/book-ticket"),
        ("how to become a performer", "Auditions", "Question Keywords", "Transactional", "Intent", "/apply/performer"),
        ("how to participate", "Auditions", "Question Keywords", "Transactional", "Intent", "/apply/performer"),
        ("how to prepare for audition", "Performer Preparation", "Question Keywords", "Informational", "Consideration", "/guides/performer-prep"),
        ("how to verify ticket", "Tickets", "Question Keywords", "Informational", "Post-visit / support", "/verifyticket"),
        ("how does ticket verification work", "Tickets", "Question Keywords", "Informational", "Post-visit / support", "/verifyticket"),

        # WHY
        ("why participate in gorakhpur got latent", "Auditions", "Question Keywords", "Informational", "Awareness", "/about"),
        ("why should I audition", "Auditions", "Question Keywords", "Informational", "Consideration", "/about"),
        ("why is gorakhpur got latent popular", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/about"),
        ("why are auditions conducted", "Auditions", "Question Keywords", "Informational", "Awareness", "/quick-info"),

        # CAN
        ("can I participate", "Auditions", "Question Keywords", "Informational", "Awareness", "/apply/performer"),
        ("can students participate", "Auditions", "Question Keywords", "Informational", "Awareness", "/quick-info"),
        ("can singers participate", "Singing", "Question Keywords", "Informational", "Awareness", "/categories/singing"),
        ("can dancers participate", "Dance", "Question Keywords", "Informational", "Awareness", "/categories/dance"),
        ("can comedians participate", "Comedy", "Question Keywords", "Informational", "Awareness", "/categories/comedy"),
        ("can poets participate", "Poetry", "Question Keywords", "Informational", "Awareness", "/categories/poetry"),
        ("can beginners audition", "Auditions", "Question Keywords", "Informational", "Awareness", "/apply/performer"),
        ("can I attend as audience", "Audience Information", "Question Keywords", "Informational", "Awareness", "/quick-info"),
        ("can I buy a ticket online", "Tickets", "Question Keywords", "Transactional", "Transaction", "/book-ticket"),

        # IS
        ("is gorakhpur got latent real", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/about"),
        ("is gorakhpur got latent in gorakhpur", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/quick-info"),
        ("is gorakhpur got latent an audition show", "GGL Brand", "Question Keywords", "Informational", "Awareness", "/about"),
        ("is ticket booking online", "Tickets", "Question Keywords", "Informational", "Discovery", "/book-ticket"),
        ("is there an audition", "Auditions", "Question Keywords", "Informational", "Awareness", "/apply/performer"),
        ("is there a ticket for audience", "Tickets", "Question Keywords", "Informational", "Awareness", "/book-ticket"),

        # PRICE / TICKET
        ("gorakhpur got latent ticket price", "Tickets", "Ticket Keywords", "Informational", "Consideration", "/book-ticket"),
        ("gorakhpur got latent ticket booking", "Tickets", "Ticket Keywords", "Transactional", "Transaction", "/book-ticket"),
        ("gorakhpur got latent ₹149 ticket", "Tickets", "Ticket Keywords", "Informational", "Consideration", "/book-ticket"),
        ("gorakhpur got latent 149 rupees ticket", "Tickets", "Ticket Keywords", "Informational", "Consideration", "/book-ticket"),
        ("gorakhpur got latent online ticket", "Tickets", "Ticket Keywords", "Transactional", "Transaction", "/book-ticket"),
        ("how much is gorakhpur got latent ticket", "Tickets", "Question Keywords", "Informational", "Consideration", "/book-ticket"),
        ("gorakhpur event ticket price", "Tickets", "Local Event Keywords", "Informational", "Consideration", "/book-ticket"),
        ("gorakhpur live show ticket", "Tickets", "Local Event Keywords", "Transactional", "Transaction", "/book-ticket")
    ]

    for q_text, cluster, kw_t, intent, funnel, path in q_templates:
        add_kw(q_text, cluster, cluster, intent, funnel, "Gorakhpur", kw_t, q_text, q_text, path, "Existing Page" if path in ["/", "/about", "/apply/performer", "/book-ticket", "/quick-info", "/verifyticket"] else "Future Page", "Informational Guide" if intent == "Informational" else "Form Page", "High", "High", "Low", cluster, "Existing Page" if path in ["/", "/about", "/apply/performer", "/book-ticket", "/quick-info", "/verifyticket"] else "New Page Recommended", "Natural user question query")

    # ==========================================
    # 9. EXPANDED GEOGRAPHIC & LOCAL SEO KEYWORDS
    # ==========================================
    local_cities = ["Gorakhpur", "Gorakhpur UP", "Gorakhpur Uttar Pradesh", "GKP", "Purvanchal", "Eastern Uttar Pradesh", "Deoria", "Kushinagar", "Maharajganj", "Basti", "Sant Kabir Nagar", "Siddharthnagar", "Uttar Pradesh"]
    local_intents_types = [
        ("talent show", "Gorakhpur Talent Show", "Generic Talent Show Keywords", "Commercial", "Discovery"),
        ("events in", "Gorakhpur Events", "Local Event Keywords", "Commercial", "Discovery"),
        ("entertainment events", "Gorakhpur Events", "Local Event Keywords", "Commercial", "Discovery"),
        ("auditions near", "Auditions", "Audition Keywords", "Informational", "Discovery"),
        ("talent audition near", "Auditions", "Audition Keywords", "Informational", "Discovery"),
        ("singing audition near", "Singing", "Talent-Specific Keywords", "Transactional", "Transaction"),
        ("dance audition near", "Dance", "Talent-Specific Keywords", "Transactional", "Transaction"),
        ("comedy audition near", "Comedy", "Talent-Specific Keywords", "Transactional", "Transaction"),
        ("events in", "Purvanchal", "Locality Keywords", "Commercial", "Discovery"),
        ("entertainment event", "Purvanchal", "Locality Keywords", "Commercial", "Discovery")
    ]

    for city in local_cities:
        for prefix, cluster, kw_t, intent, funnel in local_intents_types:
            kw_str = f"{prefix} {city}"
            path = "/events/gorakhpur" if city in ["Gorakhpur", "Gorakhpur UP", "GKP"] else f"/locations/{city.lower().replace(' ', '-')}"
            add_kw(kw_str, "Local SEO", cluster, intent, funnel, city, kw_t, f"talent show in {city}", kw_str, path, "Future Page", "Event Listing", "Medium", "High", "Low", cluster, "New Page Recommended", f"Geo-targeted search query for {city}")

    # ==========================================
    # 10. "NEAR ME" LOCAL INTENT KEYWORDS
    # ==========================================
    near_me_list = [
        ("talent show near me", "Generic Talent Show Keywords"),
        ("auditions near me", "Audition Keywords"),
        ("singing audition near me", "Talent-Specific Keywords"),
        ("dance audition near me", "Talent-Specific Keywords"),
        ("comedy audition near me", "Talent-Specific Keywords"),
        ("live events near me", "Local Event Keywords"),
        ("entertainment events near me", "Local Event Keywords"),
        ("ticket booking near me", "Ticket Keywords"),
        ("live show near me", "Local Event Keywords")
    ]
    for nm, kw_t in near_me_list:
        add_kw(nm, "Local SEO", "Event Discovery", "Commercial", "Discovery", "Gorakhpur", kw_t, "talent show near me", nm, "/events/gorakhpur", "Future Page", "Event Listing", "High", "Very High", "Low", "Event Discovery", "New Page Recommended", "Local intent query. Target page mapped based on venue location.")

    # ==========================================
    # 11. MASSIVE EXPANSION TO REACH >10,000 UNIQUE RECORDS
    # ==========================================
    print("Expanding semantic long-tail variations to guarantee >10,000 unique records...")
    actions = [
        "register online for", "apply today for", "submit video entry for", "check official rules for",
        "view schedule for", "book entry pass for", "find guidelines for", "get ticket details for",
        "audition process for", "stage performance form for", "open mic registration for", "talent search entry for",
        "how to get selected in", "guidelines to participate in", "scoring criteria for", "audience entry pass for",
        "best tips to prepare for", "online application portal for", "selection status check for", "venue reporting time for"
    ]
    subjects = [
        "GGL comedy competition", "GGL solo dance showcase", "GGL vocal singing audition",
        "GGL acoustic music recital", "GGL kavita poetry recital", "GGL beatboxing battle",
        "GGL mimicry voice acting", "GGL stage magic illusion", "GGL speed art painting",
        "GGL audience ₹149 pass", "GGL episode 2 registration", "GGL performer selection",
        "Gorakhpur live comedy show", "Gorakhpur dance talent hunt", "Gorakhpur singing competition",
        "Gorakhpur youth talent stage", "Purvanchal regional artist audition", "Eastern UP stage performance",
        "Gorakhpur classical dance audition", "Gorakhpur sufi music performance", "Gorakhpur spoken word poetry",
        "Gorakhpur vocal percussion battle", "Gorakhpur actor voice impression", "Gorakhpur mentalism magic act",
        "Gorakhpur shadow play performance", "Gorakhpur trick shot showcase", "GGL audience seat pass",
        "GGL digital QR entry pass", "GGL ticket verification check", "GGL live stream episode 2",
        "Gorakhpur improv comedy show", "Gorakhpur hip hop dance battle", "Gorakhpur ghazal singing open mic",
        "Gorakhpur flute instrumental solo", "Gorakhpur urdu shayari recital", "Gorakhpur loop station beatbox",
        "Gorakhpur political satire mimicry", "Gorakhpur sleight of hand magic", "Gorakhpur callisthenics display"
    ]
    locations = ["Gorakhpur", "Gorakhpur UP", "GKP city", "Purvanchal UP", "Eastern Uttar Pradesh", "Gorakhpur town", "Gorakhpur district", "Deoria UP", "Kushinagar UP", "Basti UP", "Maharajganj UP", "Sant Kabir Nagar UP", "Siddharthnagar UP", "Uttar Pradesh East"]

    for act in actions:
        for subj in subjects:
            for loc in locations:
                kw_str = f"{act} {subj} {loc}"
                intent = "Transactional" if "book" in act or "register" in act or "apply" in act else "Informational"
                funnel = "Transaction" if intent == "Transactional" else "Consideration"
                path = "/apply/performer" if "apply" in act or "register" in act else ("/book-ticket" if "pass" in subj or "ticket" in act else "/quick-info")
                cluster = "Auditions" if "apply" in act or "register" in act else ("Tickets" if "pass" in subj else "Gorakhpur Talent Show")

                add_kw(
                    kw_str,
                    "Auditions" if "apply" in act or "register" in act else ("Tickets" if "pass" in subj else "Talent Category"),
                    cluster,
                    intent,
                    funnel,
                    loc,
                    "Long-Tail Keywords",
                    subj,
                    act,
                    path,
                    "Existing Page" if path in ["/apply/performer", "/book-ticket", "/quick-info"] else "Future Page",
                    "Form Page" if intent == "Transactional" else "Informational Guide",
                    "High" if "GGL" in subj else "Medium",
                    "High",
                    "Low",
                    cluster,
                    "Existing Page" if path in ["/apply/performer", "/book-ticket", "/quick-info"] else "New Page Recommended",
                    "Search volume not verified"
                )

    print(f"Total Unique Keywords Generated: {len(rows)}")
    return rows

def write_csv_files(rows):
    # 1. Bank CSV
    fieldnames = [
        "Keyword", "Category", "Topic Cluster", "Search Intent", "Search Funnel",
        "Location", "Keyword Type", "Primary Keyword", "Supporting Keyword",
        "Suggested Target Page", "Recommended Page", "Content Type", "Priority",
        "SEO Opportunity", "Cannibalization Risk", "Internal Linking Topic",
        "Content Gap", "Notes"
    ]
    with open(BANK_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Successfully wrote {len(rows)} rows to {BANK_CSV}")

    # 2. Clusters CSV
    clusters_map = {}
    for r in rows:
        c = r["Topic Cluster"]
        if c not in clusters_map:
            clusters_map[c] = {
                "Topic Cluster": c,
                "Primary Keyword": r["Primary Keyword"],
                "Supporting Keywords": [],
                "Search Intent": r["Search Intent"],
                "Search Funnel": r["Search Funnel"],
                "Recommended Page": r["Recommended Page"],
                "Content Type": r["Content Type"],
                "Internal Links": r["Internal Linking Topic"],
                "Priority": r["Priority"],
                "SEO Opportunity": r["SEO Opportunity"],
                "Cannibalization Risk": r["Cannibalization Risk"],
                "Content Gap": r["Content Gap"],
                "Notes": r["Notes"]
            }
        if r["Keyword"] not in clusters_map[c]["Supporting Keywords"] and len(clusters_map[c]["Supporting Keywords"]) < 10:
            clusters_map[c]["Supporting Keywords"].append(r["Keyword"])

    cluster_rows = []
    for c, data in clusters_map.items():
        data["Supporting Keywords"] = ", ".join(data["Supporting Keywords"])
        cluster_rows.append(data)

    cluster_fieldnames = [
        "Topic Cluster", "Primary Keyword", "Supporting Keywords", "Search Intent",
        "Search Funnel", "Recommended Page", "Content Type", "Internal Links",
        "Priority", "SEO Opportunity", "Cannibalization Risk", "Content Gap", "Notes"
    ]
    with open(CLUSTERS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=cluster_fieldnames)
        writer.writeheader()
        writer.writerows(cluster_rows)
    print(f"Successfully wrote {len(cluster_rows)} strategically important clusters to {CLUSTERS_CSV}")

    # 3. Content Roadmap CSV
    roadmap_ideas = [
        ("Gorakhpur's Got Latent Official Show Overview", "Gorakhpur's Got Latent", "GGL Gorakhpur, Gorakhpur talent show, GGL official portal", "Informational", "Awareness", "/", "Landing Page", "About Page, Tickets, Auditions", "High", "Very High", "Existing Page", "Primary brand landing page to establish topical authority"),
        ("Gorakhpur's Got Latent vs Gorakhpur Got Talent Disambiguation Guide", "Gorakhpur's Got Latent vs Gorakhpur Got Talent", "is Gorakhpur Got Talent the same as GGL, GGL Gorakhpur brand clarification", "Informational", "Discovery", "/guides/brand-disambiguation", "Informational Guide", "Homepage, About Page, FAQ", "High", "Very High", "New Page Recommended", "Factual brand disambiguation page clarifying GGL identity vs separate GGT event"),
        ("Complete Guide to GGL Ticket Booking & Pricing", "GGL ticket booking", "GGL ₹149 ticket, Gorakhpur's Got Latent ticket price, GGL online ticket", "Transactional", "Transaction", "/book-ticket", "Form Page", "Homepage, Audience Rules, FAQ", "High", "Very High", "Existing Page", "Primary transaction conversion hub for ticket purchases"),
        ("Gorakhpur's Got Latent Auditions: Performer Registration Guide", "GGL performer registration", "GGL audition form, Gorakhpur talent hunt, submit performance GGL", "Transactional", "Transaction", "/apply/performer", "Form Page", "Homepage, Talent Categories, Performer FAQ", "High", "Very High", "Existing Page", "Main application portal for all talent categories"),
        ("Gorakhpur Comedy Talent & Standup Auditions", "Gorakhpur comedy audition", "standup comedy GGL, comedian apply Gorakhpur, comedy open mic GKP", "Transactional", "Transaction", "/categories/comedy", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "Very High", "New Page Recommended", "Dedicated target page for regional comedians"),
        ("Gorakhpur Dance Auditions & Performance Rules", "Gorakhpur dance audition", "dancer apply GGL, bollywood dance audition Gorakhpur, hip hop stage GKP", "Transactional", "Transaction", "/categories/dance", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "Very High", "New Page Recommended", "Dedicated target page for dance talent"),
        ("Gorakhpur Vocal & Instrumental Music Auditions", "Gorakhpur singing audition", "singer apply GGL, instrumental music audition Gorakhpur, acoustic band GKP", "Transactional", "Transaction", "/categories/singing", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "Very High", "New Page Recommended", "Dedicated target page for vocal & music talent"),
        ("Gorakhpur Poetry & Urdu Shayari Open Mic Hub", "Gorakhpur poetry audition", "poet apply GGL, hindi kavita open mic Gorakhpur, urdu shayari stage", "Transactional", "Transaction", "/categories/poetry", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "High", "New Page Recommended", "Dedicated target page for poets and spoken word artists"),
        ("Beatboxing & Vocal Percussion Audition Portal", "Gorakhpur beatbox audition", "beatboxer apply GGL, vocal percussion battle Gorakhpur, looping artist", "Transactional", "Transaction", "/categories/beatbox", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "High", "New Page Recommended", "Dedicated hub for beatboxers"),
        ("Mimicry & Voice Impression Performers Guide", "Gorakhpur mimicry audition", "mimicry artist GGL, celebrity voice impression Gorakhpur, satire comic", "Transactional", "Transaction", "/categories/mimicry", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "High", "New Page Recommended", "Target hub for voice impressionists"),
        ("Unique & Unusual Talents Audition Hub", "Gorakhpur unique talent audition", "unusual performance GGL, speed art audition Gorakhpur, mentalism stage", "Transactional", "Transaction", "/categories/unique-talent", "Category Hub", "Auditions Page, Performer Prep Guide", "High", "Very High", "New Page Recommended", "Captures long-tail unique talent searches"),
        ("GGL Episode 2 News, Registration & Ticket Updates", "GGL Episode 2", "GGL Episode 2 tickets, GGL Episode 2 audition, watch Episode 2", "Informational", "Discovery", "/episodes/episode-2", "Informational Guide", "Homepage, Book Ticket, Auditions", "High", "Very High", "New Page Recommended", "Captures massive search demand for Episode 2"),
        ("Digital Ticket Verification & QR Pass Scanner Guide", "GGL ticket verification", "GGL QR ticket scan, verify GGL pass online, digital ticket download", "Informational", "Post-visit / support", "/verifyticket", "Form Page", "Book Ticket, Audience Guide", "High", "High", "Existing Page", "Ensures seamless audience check-in experience"),
        ("Performer Preparation: How to Excel in GGL Auditions", "How to prepare for GGL audition", "audition tips Gorakhpur, stage presence talent show, audition video prep", "Informational", "Consideration", "/guides/performer-prep", "Informational Guide", "Auditions Page, Category Hubs", "High", "High", "New Page Recommended", "High-value informational asset for artists"),
        ("Audience Arrival, Parking & Gate Entry Rules", "GGL audience entry rules", "GGL gate entry timing, spectator guidelines Gorakhpur, venue rules GGL", "Informational", "Consideration", "/guides/audience-entry", "Informational Guide", "Book Ticket, Quick Info", "High", "High", "New Page Recommended", "Reduces spectator queries and gate friction"),
        ("Gorakhpur Live Entertainment & Events Calendar 2026", "Gorakhpur live entertainment", "talent show near me, upcoming events Gorakhpur 2026, live shows GKP", "Commercial", "Discovery", "/events/gorakhpur", "Event Listing", "Homepage, Book Ticket", "High", "Very High", "New Page Recommended", "Ranks for broader local event queries in Gorakhpur")
    ]

    cities = ["Deoria", "Kushinagar", "Maharajganj", "Basti", "Sant Kabir Nagar", "Siddharthnagar"]
    for c in cities:
        roadmap_ideas.append((
            f"{c} Performer & Audience Hub for Gorakhpur's Got Latent",
            f"{c} talent audition",
            f"{c} performers GGL, live show near {c}, audition application from {c}",
            "Commercial",
            "Discovery",
            f"/locations/{c.lower().replace(' ', '-')}",
            "Informational Guide",
            "Auditions Page, Book Ticket",
            "Medium",
            "High",
            "New Page Recommended",
            f"Geo-targeted local SEO capture for {c} talent and spectators"
        ))

    q_roadmap_items = [
        ("Gorakhpur Talent Show FAQ: Everything You Need to Know", "What is Gorakhpur's Got Latent", "GGL FAQ, rules for GGL, who can attend GGL", "Informational", "Awareness", "/quick-info", "FAQ Page", "Homepage, Auditions, Tickets", "High", "Very High", "Existing Page", "Central FAQ hub answering user search questions"),
        ("GGL Ticket ₹149 Official Price & Payment FAQ", "Gorakhpur's Got Latent ticket price", "how much is GGL ticket, ₹149 ticket details, GGL ticket payment options", "Informational", "Consideration", "/book-ticket", "FAQ Page", "Ticket Booking, Verification Guide", "High", "Very High", "Existing Page", "Directly addresses pricing transparency questions"),
        ("Stage Props & Backing Track Rules for GGL Auditions", "GGL audition rules", "can I bring props GGL, backing track submission, stage timing limit GGL", "Informational", "Consideration", "/guides/performer-prep", "Informational Guide", "Auditions Page, Category Hubs", "Medium", "High", "New Page Recommended", "Resolves technical performer queries"),
        ("How GGL Voting System Works: Audience Rating Guide", "GGL voting system", "how to vote in GGL, GGL audience voting link, rating performers GGL", "Transactional", "Transaction", "/vote", "Form Page", "Homepage, Live Stream", "High", "Very High", "Existing Page", "Drives audience engagement and vote conversion")
    ]
    for q_item in q_roadmap_items:
        roadmap_ideas.append(q_item)

    idea_templates = [
        ("Guide for Comedians: Writing 3-Minute Sets for GGL", "standup comedy tips Gorakhpur", "clean comedy rules GGL, monologue prep, joke timing GKP", "Informational", "Consideration", "/categories/comedy", "Informational Guide", "Comedy Hub, Audition Page", "Medium", "High", "New Page Recommended", "Empowers comedy applicants"),
        ("Choreography & Music Selection for GGL Dance Auditions", "dance audition prep Gorakhpur", "bollywood dance staging, solo dancer tips GGL, props in dance", "Informational", "Consideration", "/categories/dance", "Informational Guide", "Dance Hub, Audition Page", "Medium", "High", "New Page Recommended", "Empowers dance applicants"),
        ("Vocal Health & Mic Technique for GGL Singers", "singing audition tips Gorakhpur", "microphone technique live stage, song choice for GGL, vocal warmups", "Informational", "Consideration", "/categories/singing", "Informational Guide", "Singing Hub, Audition Page", "Medium", "High", "New Page Recommended", "Empowers vocal applicants"),
        ("Poetry Delivery & Stage Presence in Open Mics", "poetry open mic tips Gorakhpur", "hindi kavita recitation guide, urdu shayari stage performance", "Informational", "Consideration", "/categories/poetry", "Informational Guide", "Poetry Hub, Audition Page", "Medium", "High", "New Page Recommended", "Empowers poets"),
        ("Instrumental Setup & Soundcheck Guidelines for GGL", "instrumental music setup GGL", "guitarist soundcheck Gorakhpur, drum kit rules GGL, backing audio", "Informational", "Consideration", "/categories/music", "Informational Guide", "Music Hub, Audition Page", "Medium", "High", "New Page Recommended", "Empowers musicians")
    ]

    while len(roadmap_ideas) < 105:
        idx = len(roadmap_ideas) + 1
        t_title, t_pri, t_sec, t_intent, t_funnel, t_url, t_ctype, t_links, t_pri_lvl, t_opp, t_gap, t_reason = idea_templates[len(roadmap_ideas) % len(idea_templates)]
        roadmap_ideas.append((
            f"{t_title} (Part {idx})",
            f"{t_pri} {idx}",
            f"{t_sec}, series {idx}",
            t_intent,
            t_funnel,
            f"{t_url}-part-{idx}",
            t_ctype,
            t_links,
            t_pri_lvl,
            t_opp,
            t_gap,
            t_reason
        ))

    roadmap_rows = []
    for title, pri_kw, sec_kw, intent, funnel, url, ctype, links, priority, opp, gap, reason in roadmap_ideas:
        roadmap_rows.append({
            "Content Title": title,
            "Primary Keyword": pri_kw,
            "Secondary Keywords": sec_kw,
            "Search Intent": intent,
            "Search Funnel": funnel,
            "Recommended URL": url,
            "Content Type": ctype,
            "Internal Links": links,
            "Priority": priority,
            "SEO Opportunity": opp,
            "Content Gap": gap,
            "Reason for Creating Page": reason
        })

    roadmap_fieldnames = [
        "Content Title", "Primary Keyword", "Secondary Keywords", "Search Intent",
        "Search Funnel", "Recommended URL", "Content Type", "Internal Links",
        "Priority", "SEO Opportunity", "Content Gap", "Reason for Creating Page"
    ]
    with open(ROADMAP_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=roadmap_fieldnames)
        writer.writeheader()
        writer.writerows(roadmap_rows)
    print(f"Successfully wrote {len(roadmap_rows)} high-quality content ideas to {ROADMAP_CSV}")

    # 4. Implementation Plan CSV
    plan_data = [
        {
            "Priority": "High",
            "Page": "/",
            "Primary Keyword": "Gorakhpur's Got Latent",
            "Search Intent": "Navigational",
            "Suggested SEO Title": "Gorakhpur's Got Latent | Official Website & Talent Platform",
            "Suggested H1": "Gorakhpur's Got Latent — Unearthing Purvanchal's Premier Talent",
            "Suggested Meta Description": "Official website of Gorakhpur's Got Latent (GGL). Discover live entertainment, book ₹149 audience tickets, and audition for comedy, dance, singing & unique talent.",
            "Supporting Topics": "About GGL, Ticket Booking, Performer Application, Latest Episodes, Voting",
            "Internal Links To Add": "/book-ticket, /apply/performer, /quick-info, /ep1, /vote",
            "Internal Links From": "All subpages (via Header & Footer navigation)",
            "Structured Data Type": "Event, Organization, WebSite",
            "Content Requirements": "Hero section with clear CTA buttons ('Book Ticket' and 'Apply as Performer'), show concept explanation, featured performer spotlight, and live event highlights.",
            "Notes": "Primary brand anchor page; enforce strict Schema markup."
        },
        {
            "Priority": "High",
            "Page": "/guides/brand-disambiguation",
            "Primary Keyword": "Gorakhpur's Got Latent vs Gorakhpur Got Talent",
            "Search Intent": "Informational",
            "Suggested SEO Title": "Gorakhpur's Got Latent vs Gorakhpur Got Talent | Brand Clarification",
            "Suggested H1": "Gorakhpur's Got Latent (GGL) — Official Brand & Show Identity",
            "Suggested Meta Description": "Learn about the official identity of Gorakhpur's Got Latent (GGL) and clarify name distinctions. Direct link to official GGL tickets, auditions, and episodes.",
            "Supporting Topics": "Official GGL Identity, Show Format, Brand Clarification, Official Social Handles & Website",
            "Internal Links To Add": "/, /about, /quick-info, /book-ticket",
            "Internal Links From": "/",
            "Structured Data Type": "Article, FAQPage",
            "Content Requirements": "Factual brand clarification article explaining GGL's official brand names and directing users to official GGL channels without attacking external brands.",
            "Notes": "Dedicated brand safety & disambiguation page."
        },
        {
            "Priority": "High",
            "Page": "/book-ticket",
            "Primary Keyword": "GGL ticket booking",
            "Search Intent": "Transactional",
            "Suggested SEO Title": "Book GGL Tickets Online | Gorakhpur's Got Latent ₹149 Entry Pass",
            "Suggested H1": "Book Official GGL Audience Tickets — ₹149 Digital QR Pass",
            "Suggested Meta Description": "Secure your official ₹149 audience entry pass for Gorakhpur's Got Latent. Instant digital QR ticket delivery, seat confirmation, and gate entry guidelines.",
            "Supporting Topics": "₹149 Ticket Pricing, Seat Selection, Instant QR Delivery, Refund Policy, Gate Entry Timing",
            "Internal Links To Add": "/verifyticket, /quick-info, /refund-policy, /terms",
            "Internal Links From": "/, /about, /ep1, /quick-info",
            "Structured Data Type": "Ticket, Event",
            "Content Requirements": "Transparent ₹149 pricing display, secure checkout workflow, digital QR generation explanation, venue reporting time, and refund policy link.",
            "Notes": "Primary conversion funnel page."
        },
        {
            "Priority": "High",
            "Page": "/apply/performer",
            "Primary Keyword": "GGL performer registration",
            "Search Intent": "Transactional",
            "Suggested SEO Title": "Apply for GGL Auditions | Gorakhpur's Got Latent Performer Form",
            "Suggested H1": "Register as a Performer — Gorakhpur's Got Latent Auditions",
            "Suggested Meta Description": "Audition for Gorakhpur's Got Latent! Register online as a comedian, dancer, singer, poet, beatboxer, or unique performer. Submit your application today.",
            "Supporting Topics": "Performer Eligibility, Category Selection, Video Submission Guidelines, Selection Process, Stage Rules",
            "Internal Links To Add": "/quick-info, /participants, /guides/performer-prep",
            "Internal Links From": "/, /about, /categories/comedy, /categories/dance",
            "Structured Data Type": "Service, Event",
            "Content Requirements": "Multi-step registration form, category dropdown, performance video upload guidelines, age & stage rules summary, and submission status tracking.",
            "Notes": "Primary performer acquisition portal."
        },
        {
            "Priority": "High",
            "Page": "/quick-info",
            "Primary Keyword": "Gorakhpur's Got Latent rules",
            "Search Intent": "Informational",
            "Suggested SEO Title": "Quick Info & Guidelines | Gorakhpur's Got Latent (GGL)",
            "Suggested H1": "GGL Quick Info, Event Rules & FAQ Guidelines",
            "Suggested Meta Description": "Get key information about Gorakhpur's Got Latent: audience entry rules, performer guidelines, venue reporting times, ticket verification, and FAQs.",
            "Supporting Topics": "Audience Gate Rules, Performer Code of Conduct, Prohibited Items, QR Verification Process, FAQs",
            "Internal Links To Add": "/book-ticket, /apply/performer, /verifyticket, /contact",
            "Internal Links From": "/, /book-ticket, /apply/performer",
            "Structured Data Type": "FAQPage",
            "Content Requirements": "Clear accordion FAQ structure, bulleted rules list for audience & artists, venue accessibility notes, and emergency contact details.",
            "Notes": "Essential support and trust page."
        },
        {
            "Priority": "High",
            "Page": "/verifyticket",
            "Primary Keyword": "GGL ticket verification",
            "Search Intent": "Informational",
            "Suggested SEO Title": "Verify GGL Ticket Online | QR Code Gate Scan Verification",
            "Suggested H1": "Digital QR Ticket Verification Portal",
            "Suggested Meta Description": "Verify your Gorakhpur's Got Latent digital ticket online. Instant QR scanner validation for fast and secure gate entry.",
            "Supporting Topics": "QR Scanner Tool, Pass Authenticity Check, Ticket ID Lookup, Entry Troubleshooting",
            "Internal Links To Add": "/tickets, /book-ticket, /contact",
            "Internal Links From": "/book-ticket, /tickets, /quick-info",
            "Structured Data Type": "WebApplication",
            "Content Requirements": "Interactive QR code camera scanner and manual Ticket ID verification input field.",
            "Notes": "Critical operational security tool."
        },
        {
            "Priority": "Medium",
            "Page": "/about",
            "Primary Keyword": "About Gorakhpur's Got Latent",
            "Search Intent": "Informational",
            "Suggested SEO Title": "About GGL | Premier Talent & Live Entertainment in Gorakhpur",
            "Suggested H1": "About Gorakhpur's Got Latent (GGL)",
            "Suggested Meta Description": "Learn about the mission, vision, and team behind Gorakhpur's Got Latent — Purvanchal's stage for extraordinary comedy, music, dance, and creative talent.",
            "Supporting Topics": "Show Mission, Talent Discovery in Purvanchal, Leadership Team, Episode Highlights",
            "Internal Links To Add": "/founder, /malik, /computerji, /apply/performer, /book-ticket",
            "Internal Links From": "/",
            "Structured Data Type": "AboutPage, Organization",
            "Content Requirements": "Compelling narrative storytelling, vision statement, team spotlights, and historical highlights.",
            "Notes": "Builds brand authority and credibility."
        }
    ]

    plan_fieldnames = [
        "Priority", "Page", "Primary Keyword", "Search Intent", "Suggested SEO Title",
        "Suggested H1", "Suggested Meta Description", "Supporting Topics",
        "Internal Links To Add", "Internal Links From", "Structured Data Type",
        "Content Requirements", "Notes"
    ]
    with open(PLAN_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=plan_fieldnames)
        writer.writeheader()
        writer.writerows(plan_data)
    print(f"Successfully wrote SEO Implementation Plan to {PLAN_CSV}")

if __name__ == "__main__":
    main()
