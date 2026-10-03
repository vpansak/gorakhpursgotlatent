import csv
import os
from collections import Counter

WORKSPACE_DIR = "/Users/alok/gorakhpur got letent "
BANK_CSV = os.path.join(WORKSPACE_DIR, "GGL_10000_plus_Keyword_Research_Bank.csv")

def analyze():
    with open(BANK_CSV, 'r', encoding='utf-8') as f:
        reader = list(csv.DictReader(f))

    total_count = len(reader)
    keywords = [r["Keyword"].strip().lower() for r in reader]
    unique_count = len(set(keywords))
    dup_count = total_count - unique_count

    clusters = Counter(r["Topic Cluster"] for r in reader)
    categories = Counter(r["Category"] for r in reader)
    intents = Counter(r["Search Intent"] for r in reader)
    funnels = Counter(r["Search Funnel"] for r in reader)
    kw_types = Counter(r["Keyword Type"] for r in reader)
    priorities = Counter(r["Priority"] for r in reader)
    opportunities = Counter(r["SEO Opportunity"] for r in reader)
    rec_pages = Counter(r["Recommended Page"] for r in reader)
    gaps = Counter(r["Content Gap"] for r in reader)

    print("=== UPDATED SEO METRICS VERIFICATION REPORT ===")
    print(f"Total Keyword Count: {total_count}")
    print(f"Total Unique Keyword Count: {unique_count}")
    print(f"Duplicate Count: {dup_count}")
    print(f"Total Topic Clusters: {len(clusters)}")
    print(f"Total Categories: {len(categories)}")
    print("\n--- Search Intent Breakdown ---")
    for k, v in intents.items():
        print(f"  {k}: {v}")

    print("\n--- Search Funnel Breakdown ---")
    for k, v in funnels.items():
        print(f"  {k}: {v}")

    print("\n--- Keyword Type Breakdown ---")
    for k, v in kw_types.items():
        print(f"  {k}: {v}")

    print("\n--- Priority Breakdown ---")
    for k, v in priorities.items():
        print(f"  {k}: {v}")

    print("\n--- SEO Opportunity Breakdown ---")
    for k, v in opportunities.items():
        print(f"  {k}: {v}")

    print("\n--- Page Recommendation Breakdown ---")
    for k, v in rec_pages.items():
        print(f"  {k}: {v}")

    print("\n--- Content Gap Breakdown ---")
    for k, v in gaps.items():
        print(f"  {k}: {v}")

    print("\n--- Top 20 Clusters ---")
    for cl, c in clusters.most_common(20):
        print(f"  {cl}: {c}")

if __name__ == "__main__":
    analyze()
