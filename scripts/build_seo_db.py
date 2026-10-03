import csv
import re
import os

# Output file paths
WORKSPACE_DIR = "/Users/alok/gorakhpur got letent "
BANK_CSV = os.path.join(WORKSPACE_DIR, "GGL_10000_plus_Keyword_Research_Bank.csv")
CLUSTERS_CSV = os.path.join(WORKSPACE_DIR, "GGL_SEO_Topical_Clusters.csv")
ROADMAP_CSV = os.path.join(WORKSPACE_DIR, "GGL_SEO_Content_Roadmap.csv")
PLAN_CSV = os.path.join(WORKSPACE_DIR, "GGL_SEO_Implementation_Plan.csv")

print("Starting SEO Dataset Generation for Gorakhpur's Got Latent (GGL)...")
