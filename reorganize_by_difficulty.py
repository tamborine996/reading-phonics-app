"""
Reorganize all packs by difficulty and group into sub-packs
Progressive difficulty: easiest to hardest
"""

import json

# Load all packs
with open(r'C:\Users\mqc20\Downloads\Projects\Reading app\all_packs_extracted.json', 'r', encoding='utf-8') as f:
    all_packs = json.load(f)

print(f"Loaded {len(all_packs)} packs with {sum(len(p['words']) for p in all_packs)} total words")

# Define sub-packs in difficulty order
sub_pack_order = [
    {
        'name': 'Year 1 High Frequency Words',
        'description': 'Most common words - great starting point!',
        'categories': ['0A. YEAR 1 HIGH FREQUENCY']
    },
    {
        'name': 'Short Vowels',
        'description': 'Basic phonics - short a, e, i, o, u sounds',
        'categories': ['1. SHORT VOWEL A', '1. SHORT VOWEL E', '1. SHORT VOWEL I', '1. SHORT VOWEL O', '1. SHORT VOWEL U']
    },
    {
        'name': 'Consonant Blends',
        'description': 'Two or more consonants together',
        'categories': ['2. L-BLENDS', '2. R-BLENDS', '2. S-BLENDS', '2. 3-LETTER BLENDS']
    },
    {
        'name': 'Digraphs',
        'description': 'Two letters making one sound',
        'categories': ['3. DIGRAPH CH', '3. DIGRAPH SH', '3. DIGRAPH TH (unvoiced)', '3. DIGRAPH WH', '3. DIGRAPH PH']
    },
    {
        'name': 'Special Endings',
        'description': 'NG, NK, CK, TCH, DGE endings',
        'categories': ['6A. NG/NK ENDINGS', '7. CK/TCH/DGE']
    },
    {
        'name': 'Magic E & Long Vowels',
        'description': 'Long vowel sounds with magic e',
        'categories': ['7. MAGIC E / SPLIT DIGRAPHS']
    },
    {
        'name': 'Long Vowel Teams',
        'description': 'Two vowels making long sounds',
        'categories': ['4. AI/AY (long A)', '4. EE/EA (long E)', '4. IGH/IE/Y (long I)', '4. OA/OW (long O)', '4. UE/EW (long U)']
    },
    {
        'name': 'R-Controlled Vowels',
        'description': 'Vowels changed by the letter R',
        'categories': ['6. AR', '6. OR', '6. ER/IR/UR']
    },
    {
        'name': 'Special Vowel Patterns',
        'description': 'Unique vowel combinations',
        'categories': ['5. AU/AW', '5. OI/OY', '5. OU/OW (cow sound)', '8. OO (two sounds)', '8. OUGH/AUGH']
    },
    {
        'name': 'Word Endings',
        'description': 'Common suffixes and endings',
        'categories': ['9. -S/-ES ENDINGS', '9. -ING ENDINGS', '9. -ED ENDINGS', '9. -LE ENDINGS', '6B. Y as /ee/ ENDING']
    },
    {
        'name': 'Advanced Patterns',
        'description': 'Soft C/G, silent letters, AL pattern',
        'categories': ['8. SOFT C/G', '7. SILENT LETTERS', '6D. AL PATTERN']
    },
    {
        'name': 'Multi-Syllable Words',
        'description': 'Building longer words',
        'categories': ['10. TWO SYLLABLES', '11. THREE SYLLABLES', '12. FOUR+ SYLLABLES']
    },
    {
        'name': 'Year 2 Exception Words',
        'description': 'Tricky words for Year 2',
        'categories': ['0B. YEAR 2 COMMON EXCEPTION']
    },
    {
        'name': 'Year 3/4 Exception Words',
        'description': 'Challenging words for Years 3-4',
        'categories': ['0C. YEAR 3/4 COMMON EXCEPTION']
    },
    {
        'name': 'Advanced Vocabulary',
        'description': 'Complex and academic words',
        'categories': ['13. ADVANCED WORDS']
    },
    {
        'name': 'Year 5/6 Spelling Words',
        'description': 'Most challenging statutory spellings',
        'categories': ['0D. YEAR 5/6 STATUTORY SPELLING']
    }
]

# Reorganize packs
reorganized = []
pack_id = 1

for sub_pack in sub_pack_order:
    sub_pack_packs = []

    for pack in all_packs:
        # Extract base category (without " - Pack X")
        base_category = pack['category'].split(' - Pack')[0] if ' - Pack' in pack['category'] else pack['category']

        if base_category in sub_pack['categories']:
            # Renumber the pack
            new_pack = pack.copy()
            new_pack['id'] = pack_id
            new_pack['title'] = f"P{pack_id}: {pack['category']}"
            new_pack['subPack'] = sub_pack['name']
            new_pack['subPackDescription'] = sub_pack['description']

            sub_pack_packs.append(new_pack)
            pack_id += 1

    reorganized.extend(sub_pack_packs)
    print(f"{sub_pack['name']}: {len(sub_pack_packs)} packs")

print(f"\nTotal reorganized: {len(reorganized)} packs")
print(f"Total words: {sum(len(p['words']) for p in reorganized)} words")

# Verify no packs were lost
if len(reorganized) != len(all_packs):
    print(f"WARNING: Pack count mismatch! Original: {len(all_packs)}, Reorganized: {len(reorganized)}")
else:
    print("SUCCESS: All packs accounted for!")

# Save reorganized packs
with open(r'C:\Users\mqc20\Downloads\Projects\Reading app\packs_reorganized.json', 'w', encoding='utf-8') as f:
    json.dump(reorganized, f, indent=2, ensure_ascii=False)

print("\nSaved to packs_reorganized.json")
