/**
 * Word packs data - 130 packs organized by phonics patterns
 * Complete UK National Curriculum phonics coverage (Year 1-6)
 * Total: ~3,380 words across all patterns
 */

import type { WordPack } from '@/types';

export const wordPacks: WordPack[] = [
  // ============================================================================
  // YEAR 1 HIGH FREQUENCY WORDS (Packs 1-4)
  // ============================================================================
  {
    id: 1,
    category: 'P1: Year 1 High Frequency - Pack 1',
    subPack: 'Year 1 High Frequency Words',
    words: [
      'the', 'and', 'a', 'to', 'said', 'in', 'he', 'I', 'of', 'it',
      'was', 'you', 'they', 'on', 'she', 'is', 'for', 'at', 'his', 'but',
      'that', 'with', 'all', 'we', 'can', 'are', 'up', 'had', 'my', 'her'
    ],
    patterns: ['high-frequency'],
    description: 'Essential sight words for beginning readers'
  },
  {
    id: 2,
    category: 'P2: Year 1 High Frequency - Pack 2',
    subPack: 'Year 1 High Frequency Words',
    words: [
      'what', 'there', 'out', 'this', 'have', 'went', 'be', 'like', 'some', 'so',
      'not', 'then', 'were', 'go', 'little', 'as', 'no', 'mum', 'one', 'them',
      'do', 'me', 'down', 'dad', 'big', 'when', 'it\'s', 'see', 'looked', 'very'
    ],
    patterns: ['high-frequency'],
    description: 'Common words children encounter frequently'
  },
  {
    id: 3,
    category: 'P3: Year 1 High Frequency - Pack 3',
    subPack: 'Year 1 High Frequency Words',
    words: [
      'look', 'don\'t', 'come', 'will', 'into', 'back', 'from', 'children', 'him', 'Mr',
      'get', 'just', 'now', 'came', 'oh', 'about', 'got', 'their', 'people', 'your',
      'put', 'could', 'house', 'old', 'too', 'by', 'day', 'made', 'time', 'I\'m'
    ],
    patterns: ['high-frequency'],
    description: 'Building reading fluency with common words'
  },
  {
    id: 4,
    category: 'P4: Year 1 High Frequency - Pack 4',
    subPack: 'Year 1 High Frequency Words',
    words: [
      'if', 'help', 'Mrs', 'called', 'here', 'off', 'asked', 'saw', 'make', 'an'
    ],
    patterns: ['high-frequency'],
    description: 'Final set of Year 1 common words'
  },

  // ============================================================================
  // YEAR 2-6 COMMON EXCEPTION WORDS (Packs 5-15)
  // ============================================================================
  {
    id: 5,
    category: 'P5: Year 2 Common Exception Words - Pack 1',
    subPack: 'Common Exception Words',
    words: [
      'door', 'floor', 'poor', 'because', 'find', 'kind', 'mind', 'behind', 'child', 'children',
      'wild', 'climb', 'most', 'only', 'both', 'old', 'cold', 'gold', 'hold', 'told',
      'every', 'everybody', 'even', 'great', 'break', 'steak', 'pretty', 'beautiful', 'after', 'fast'
    ],
    patterns: ['exception-words'],
    description: 'Year 2 words that don\'t follow regular patterns'
  },
  {
    id: 6,
    category: 'P6: Year 2 Common Exception Words - Pack 2',
    subPack: 'Common Exception Words',
    words: [
      'last', 'past', 'father', 'class', 'grass', 'pass', 'plant', 'path', 'bath', 'hour',
      'move', 'prove', 'improve', 'sure', 'sugar', 'eye', 'could', 'should', 'would', 'who',
      'whole', 'any', 'many', 'clothes', 'busy', 'people', 'water', 'again', 'half', 'money'
    ],
    patterns: ['exception-words'],
    description: 'Tricky spellings to memorize'
  },
  {
    id: 7,
    category: 'P7: Year 3-4 Common Exception Words - Pack 1',
    subPack: 'Common Exception Words',
    words: [
      'accident', 'accidentally', 'actual', 'actually', 'address', 'answer', 'appear', 'arrive', 'believe', 'bicycle',
      'breath', 'breathe', 'build', 'busy', 'business', 'calendar', 'caught', 'centre', 'century', 'certain',
      'circle', 'complete', 'consider', 'continue', 'decide', 'describe', 'different', 'difficult', 'disappear', 'early'
    ],
    patterns: ['exception-words'],
    description: 'Year 3-4 challenging spellings'
  },
  {
    id: 8,
    category: 'P8: Year 3-4 Common Exception Words - Pack 2',
    subPack: 'Common Exception Words',
    words: [
      'earth', 'eight', 'eighth', 'enough', 'exercise', 'experience', 'experiment', 'extreme', 'famous', 'favourite',
      'February', 'forward', 'forwards', 'fruit', 'grammar', 'group', 'guard', 'guide', 'heard', 'heart',
      'height', 'history', 'imagine', 'increase', 'important', 'interest', 'island', 'knowledge', 'learn', 'length'
    ],
    patterns: ['exception-words'],
    description: 'More complex exception words'
  },
  {
    id: 9,
    category: 'P9: Year 3-4 Common Exception Words - Pack 3',
    subPack: 'Common Exception Words',
    words: [
      'library', 'material', 'medicine', 'mention', 'minute', 'natural', 'naughty', 'notice', 'occasion', 'occasionally',
      'often', 'opposite', 'ordinary', 'particular', 'peculiar', 'perhaps', 'popular', 'position', 'possess', 'possession',
      'possible', 'potatoes', 'pressure', 'probably', 'promise', 'purpose', 'quarter', 'question', 'recent', 'regular'
    ],
    patterns: ['exception-words'],
    description: 'Advanced exception words for older children'
  },
  {
    id: 10,
    category: 'P10: Year 3-4 Common Exception Words - Pack 4',
    subPack: 'Common Exception Words',
    words: [
      'reign', 'remember', 'sentence', 'separate', 'special', 'straight', 'strange', 'strength', 'suppose', 'surprise',
      'therefore', 'though', 'although', 'thought', 'through', 'various', 'weight', 'woman', 'women'
    ],
    patterns: ['exception-words'],
    description: 'Final set of Year 3-4 exceptions'
  },
  {
    id: 11,
    category: 'P11: Year 5-6 Common Exception Words - Pack 1',
    subPack: 'Common Exception Words',
    words: [
      'accommodate', 'accompany', 'according', 'achieve', 'aggressive', 'amateur', 'ancient', 'apparent', 'appreciate', 'attached',
      'available', 'average', 'awkward', 'bargain', 'bruise', 'category', 'cemetery', 'committee', 'communicate', 'community',
      'competition', 'conscience', 'conscious', 'controversy', 'convenience', 'correspond', 'criticise', 'curiosity', 'definite', 'desperate'
    ],
    patterns: ['exception-words'],
    description: 'Year 5-6 advanced vocabulary'
  },
  {
    id: 12,
    category: 'P12: Year 5-6 Common Exception Words - Pack 2',
    subPack: 'Common Exception Words',
    words: [
      'determined', 'develop', 'dictionary', 'disastrous', 'embarrass', 'environment', 'equip', 'equipment', 'especially', 'exaggerate',
      'excellent', 'existence', 'explanation', 'familiar', 'foreign', 'forty', 'frequently', 'government', 'guarantee', 'harass',
      'hindrance', 'identity', 'immediate', 'immediately', 'individual', 'interfere', 'interrupt', 'language', 'leisure', 'lightning'
    ],
    patterns: ['exception-words'],
    description: 'Sophisticated spelling patterns'
  },
  {
    id: 13,
    category: 'P13: Year 5-6 Common Exception Words - Pack 3',
    subPack: 'Common Exception Words',
    words: [
      'marvellous', 'mischievous', 'muscle', 'necessary', 'neighbour', 'nuisance', 'occupy', 'occur', 'opportunity', 'parliament',
      'persuade', 'physical', 'prejudice', 'privilege', 'profession', 'programme', 'pronunciation', 'queue', 'recognise', 'recommend',
      'relevant', 'restaurant', 'rhyme', 'rhythm', 'sacrifice', 'secretary', 'shoulder', 'signature', 'sincere', 'sincerely'
    ],
    patterns: ['exception-words'],
    description: 'Challenging multi-syllable words'
  },
  {
    id: 14,
    category: 'P14: Year 5-6 Common Exception Words - Pack 4',
    subPack: 'Common Exception Words',
    words: [
      'soldier', 'stomach', 'sufficient', 'suggest', 'symbol', 'system', 'temperature', 'thorough', 'twelfth', 'variety',
      'vegetable', 'vehicle', 'yacht'
    ],
    patterns: ['exception-words'],
    description: 'Final advanced exception words'
  },
  {
    id: 15,
    category: 'P15: Commonly Misspelled Words',
    subPack: 'Common Exception Words',
    words: [
      'accommodation', 'cemetery', 'definitely', 'embarrass', 'harass', 'minuscule', 'millennium', 'occurrence', 'receive', 'separate',
      'supersede', 'weird', 'conscience', 'parliament', 'privilege', 'pronunciation', 'recommend', 'restaurant', 'rhythm', 'secretary'
    ],
    patterns: ['exception-words', 'commonly-misspelled'],
    description: 'Words frequently spelled incorrectly'
  },

  // ============================================================================
  // SHORT VOWELS (Packs 16-28)
  // ============================================================================
  {
    id: 16,
    category: 'P16: Short Vowel A - Pack 1',
    subPack: 'Short Vowels',
    words: [
      'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'fat', 'chat', 'flat',
      'cap', 'tap', 'map', 'gap', 'lap', 'nap', 'rap', 'sap', 'clap', 'trap',
      'can', 'man', 'pan', 'ran', 'tan', 'van', 'ban', 'fan', 'plan', 'scan'
    ],
    patterns: ['short-a', 'cvc'],
    description: 'Short \'a\' sound in CVC words'
  },
  {
    id: 17,
    category: 'P17: Short Vowel A - Pack 2',
    subPack: 'Short Vowels',
    words: [
      'bag', 'tag', 'rag', 'wag', 'sag', 'drag', 'flag', 'snag', 'bad', 'dad',
      'had', 'mad', 'sad', 'glad', 'back', 'pack', 'sack', 'track', 'black', 'crack',
      'stack', 'snack', 'ham', 'jam', 'ram', 'dam', 'clam', 'slam', 'tram', 'gram'
    ],
    patterns: ['short-a', 'cvc', 'ccvc'],
    description: 'More short \'a\' patterns'
  },
  {
    id: 18,
    category: 'P18: Short Vowel E - Pack 1',
    subPack: 'Short Vowels',
    words: [
      'bed', 'red', 'fed', 'led', 'wed', 'shed', 'sled', 'bred', 'fled', 'Fred',
      'pen', 'hen', 'men', 'ten', 'den', 'when', 'then', 'glen', 'net', 'jet',
      'wet', 'pet', 'set', 'met', 'get', 'let', 'vet', 'bet', 'yet', 'fret'
    ],
    patterns: ['short-e', 'cvc'],
    description: 'Short \'e\' sound patterns'
  },
  {
    id: 19,
    category: 'P19: Short Vowel E - Pack 2',
    subPack: 'Short Vowels',
    words: [
      'bell', 'fell', 'tell', 'sell', 'well', 'shell', 'smell', 'spell', 'swell', 'yell',
      'deck', 'neck', 'peck', 'check', 'speck', 'wreck', 'held', 'meld', 'weld', 'help',
      'kelp', 'yelp', 'self', 'shelf', 'belt', 'felt', 'melt', 'pelt', 'welt', 'dwelt'
    ],
    patterns: ['short-e', 'cvcc'],
    description: 'Short \'e\' with consonant endings'
  },
  {
    id: 20,
    category: 'P20: Short Vowel I - Pack 1',
    subPack: 'Short Vowels',
    words: [
      'big', 'dig', 'fig', 'jig', 'pig', 'wig', 'twig', 'brig', 'bit', 'fit',
      'hit', 'kit', 'lit', 'pit', 'sit', 'wit', 'slit', 'split', 'grit', 'quit',
      'bin', 'fin', 'pin', 'tin', 'win', 'thin', 'skin', 'spin', 'grin', 'twin'
    ],
    patterns: ['short-i', 'cvc'],
    description: 'Short \'i\' sound in simple words'
  },
  {
    id: 21,
    category: 'P21: Short Vowel I - Pack 2',
    subPack: 'Short Vowels',
    words: [
      'lip', 'dip', 'hip', 'rip', 'sip', 'tip', 'zip', 'chip', 'clip', 'drip',
      'flip', 'grip', 'ship', 'skip', 'slip', 'snip', 'strip', 'trip', 'whip', 'did',
      'hid', 'kid', 'lid', 'rid', 'slid', 'grid', 'skid', 'milk', 'silk', 'lift'
    ],
    patterns: ['short-i', 'cvc', 'ccvc'],
    description: 'More short \'i\' patterns'
  },
  {
    id: 22,
    category: 'P22: Short Vowel O - Pack 1',
    subPack: 'Short Vowels',
    words: [
      'dog', 'fog', 'hog', 'jog', 'log', 'cog', 'frog', 'clog', 'smog', 'dot',
      'got', 'hot', 'lot', 'not', 'pot', 'rot', 'cot', 'plot', 'shot', 'spot',
      'trot', 'box', 'fox', 'ox', 'pox', 'hop', 'mop', 'pop', 'top', 'shop'
    ],
    patterns: ['short-o', 'cvc'],
    description: 'Short \'o\' sound words'
  },
  {
    id: 23,
    category: 'P23: Short Vowel O - Pack 2',
    subPack: 'Short Vowels',
    words: [
      'chop', 'crop', 'drop', 'flop', 'plop', 'prop', 'stop', 'rob', 'bob', 'cob',
      'job', 'mob', 'sob', 'blob', 'knob', 'snob', 'doll', 'golf', 'pond', 'bond',
      'fond', 'cost', 'lost', 'frost', 'long', 'song', 'strong', 'wrong', 'clock', 'block'
    ],
    patterns: ['short-o', 'cvc', 'cvcc'],
    description: 'Short \'o\' with different endings'
  },
  {
    id: 24,
    category: 'P24: Short Vowel U - Pack 1',
    subPack: 'Short Vowels',
    words: [
      'bug', 'dug', 'hug', 'jug', 'mug', 'pug', 'rug', 'tug', 'plug', 'slug',
      'snug', 'bus', 'pus', 'plus', 'but', 'cut', 'gut', 'hut', 'jut', 'nut',
      'rut', 'shut', 'bun', 'fun', 'gun', 'nun', 'pun', 'run', 'sun', 'spun'
    ],
    patterns: ['short-u', 'cvc'],
    description: 'Short \'u\' sound patterns'
  },
  {
    id: 25,
    category: 'P25: Short Vowel U - Pack 2',
    subPack: 'Short Vowels',
    words: [
      'stun', 'bud', 'cud', 'mud', 'thud', 'stud', 'cup', 'pup', 'sup', 'bump',
      'dump', 'jump', 'lump', 'pump', 'stump', 'thump', 'trunk', 'skunk', 'bunk', 'dunk',
      'funk', 'gunk', 'hunk', 'junk', 'sunk', 'duck', 'luck', 'muck', 'puck', 'stuck'
    ],
    patterns: ['short-u', 'cvc', 'cvcc'],
    description: 'More short \'u\' word patterns'
  },
  {
    id: 26,
    category: 'P26: Mixed Short Vowels - Pack 1',
    subPack: 'Short Vowels',
    words: [
      'ant', 'and', 'band', 'hand', 'land', 'sand', 'stand', 'brand', 'grand', 'strand',
      'camp', 'damp', 'lamp', 'ramp', 'stamp', 'clamp', 'cramp', 'tramp', 'class', 'grass',
      'brass', 'glass', 'last', 'fast', 'past', 'mast', 'vast', 'blast', 'grasp', 'clasp'
    ],
    patterns: ['short-a', 'consonant-blends'],
    description: 'Short \'a\' with consonant clusters'
  },
  {
    id: 27,
    category: 'P27: Mixed Short Vowels - Pack 2',
    subPack: 'Short Vowels',
    words: [
      'best', 'fest', 'nest', 'pest', 'rest', 'test', 'vest', 'west', 'zest', 'chest',
      'crest', 'desk', 'dusk', 'husk', 'musk', 'risk', 'brisk', 'disk', 'flask', 'task',
      'mask', 'bask', 'cask', 'crisp', 'grasp', 'lisp', 'wisp', 'list', 'fist', 'mist'
    ],
    patterns: ['short-e', 'short-i', 'short-u', 'cvcc'],
    description: 'Mixed short vowels with clusters'
  },
  {
    id: 28,
    category: 'P28: Mixed Short Vowels - Pack 3',
    subPack: 'Short Vowels',
    words: [
      'gust', 'just', 'must', 'rust', 'dust', 'crust', 'trust', 'bust', 'gift', 'lift',
      'rift', 'shift', 'swift', 'drift', 'craft', 'draft', 'raft', 'shaft', 'left', 'cleft',
      'deft', 'heft', 'theft', 'soft', 'loft', 'split', 'twist', 'wrist', 'wasp', 'clasp'
    ],
    patterns: ['short-u', 'short-i', 'short-o', 'cvcc', 'ccvcc'],
    description: 'Complex short vowel patterns'
  },

  // ============================================================================
  // CONSONANT BLENDS (Packs 29-36)
  // ============================================================================
  {
    id: 29,
    category: 'P29: L-Blends - Pack 1',
    subPack: 'Consonant Blends',
    words: [
      'black', 'clack', 'slack', 'blade', 'glade', 'blame', 'flame', 'blank', 'clank', 'flank',
      'plank', 'blast', 'class', 'glass', 'blend', 'blend', 'blond', 'blood', 'bloom', 'blown',
      'blue', 'blur', 'club', 'clue', 'plug', 'plus', 'plum', 'slum', 'slug', 'sled'
    ],
    patterns: ['l-blends', 'bl', 'cl', 'fl', 'pl', 'sl'],
    description: 'Words beginning with L-blends'
  },
  {
    id: 30,
    category: 'P30: L-Blends - Pack 2',
    subPack: 'Consonant Blends',
    words: [
      'glad', 'gland', 'glaze', 'gleam', 'glen', 'glide', 'glint', 'globe', 'gloom', 'gloss',
      'glove', 'glow', 'glue', 'glum', 'plan', 'plane', 'plant', 'plate', 'play', 'plea',
      'please', 'pledge', 'plenty', 'plight', 'plot', 'plow', 'pluck', 'plunge', 'fly', 'flung'
    ],
    patterns: ['l-blends', 'gl', 'pl', 'fl'],
    description: 'More L-blend combinations'
  },
  {
    id: 31,
    category: 'P31: R-Blends - Pack 1',
    subPack: 'Consonant Blends',
    words: [
      'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broke', 'brother', 'brown', 'brush',
      'crab', 'crack', 'craft', 'crash', 'crate', 'crawl', 'crazy', 'cream', 'creek', 'creep',
      'crew', 'crib', 'crime', 'crisp', 'cross', 'crowd', 'crown', 'cruel', 'crush', 'crust'
    ],
    patterns: ['r-blends', 'br', 'cr'],
    description: 'Words with BR and CR blends'
  },
  {
    id: 32,
    category: 'P32: R-Blends - Pack 2',
    subPack: 'Consonant Blends',
    words: [
      'drag', 'drain', 'drake', 'drama', 'drank', 'drape', 'draw', 'dream', 'dress', 'drew',
      'dried', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drown', 'drum', 'drunk',
      'frame', 'frank', 'fraud', 'freak', 'free', 'freeze', 'fresh', 'friend', 'fright', 'frog'
    ],
    patterns: ['r-blends', 'dr', 'fr'],
    description: 'DR and FR blend words'
  },
  {
    id: 33,
    category: 'P33: R-Blends - Pack 3',
    subPack: 'Consonant Blends',
    words: [
      'from', 'front', 'frost', 'frown', 'froze', 'fruit', 'fry', 'grab', 'grace', 'grade',
      'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'gray', 'graze',
      'great', 'greed', 'green', 'greet', 'grew', 'grid', 'grief', 'grill', 'grim', 'grin'
    ],
    patterns: ['r-blends', 'fr', 'gr'],
    description: 'FR and GR combinations'
  },
  {
    id: 34,
    category: 'P34: R-Blends - Pack 4',
    subPack: 'Consonant Blends',
    words: [
      'grip', 'grit', 'groan', 'groom', 'grope', 'gross', 'ground', 'group', 'grow', 'grown',
      'pram', 'prank', 'pray', 'press', 'price', 'pride', 'priest', 'prince', 'print', 'prize',
      'probe', 'prompt', 'prone', 'proof', 'prop', 'prose', 'proud', 'prove', 'prune', 'pry'
    ],
    patterns: ['r-blends', 'gr', 'pr'],
    description: 'GR and PR blend words'
  },
  {
    id: 35,
    category: 'P35: S-Blends - Pack 1',
    subPack: 'Consonant Blends',
    words: [
      'scale', 'scare', 'scarf', 'scene', 'school', 'scope', 'score', 'scout', 'scrap', 'screen',
      'screw', 'script', 'skill', 'skin', 'skip', 'skirt', 'skull', 'skunk', 'sky', 'slam',
      'slant', 'slap', 'slate', 'slave', 'sled', 'sleep', 'sleet', 'slept', 'slice', 'slick'
    ],
    patterns: ['s-blends', 'sc', 'sk', 'sl'],
    description: 'S-blend patterns (SC, SK, SL)'
  },
  {
    id: 36,
    category: 'P36: S-Blends - Pack 2',
    subPack: 'Consonant Blends',
    words: [
      'slide', 'slime', 'sling', 'slip', 'slit', 'slope', 'slow', 'slug', 'slum', 'smack',
      'small', 'smart', 'smash', 'smell', 'smile', 'smoke', 'smooth', 'snack', 'snail', 'snake',
      'snap', 'snare', 'sneak', 'sniff', 'snore', 'snow', 'snug', 'space', 'spade', 'spark'
    ],
    patterns: ['s-blends', 'sl', 'sm', 'sn', 'sp'],
    description: 'More S-blends (SM, SN, SP)'
  },

  // ============================================================================
  // DIGRAPHS (Packs 37-48)
  // ============================================================================
  {
    id: 37,
    category: 'P37: CH Digraph - Pack 1',
    subPack: 'Digraphs',
    words: [
      'chair', 'chain', 'chalk', 'champ', 'chance', 'change', 'chant', 'chap', 'charge', 'charm',
      'chart', 'chase', 'chat', 'cheap', 'cheat', 'check', 'cheek', 'cheer', 'cheese', 'chef',
      'chess', 'chest', 'chew', 'chick', 'chief', 'child', 'chill', 'chime', 'chimp', 'chin'
    ],
    patterns: ['ch-digraph', 'ch-initial'],
    description: 'CH sound at beginning of words'
  },
  {
    id: 38,
    category: 'P38: CH Digraph - Pack 2',
    subPack: 'Digraphs',
    words: [
      'chip', 'chirp', 'choke', 'choose', 'chop', 'chose', 'chosen', 'chow', 'chunk', 'church',
      'beach', 'bench', 'branch', 'bunch', 'catch', 'coach', 'couch', 'each', 'inch', 'lunch',
      'march', 'match', 'much', 'patch', 'peach', 'preach', 'reach', 'rich', 'such', 'teach'
    ],
    patterns: ['ch-digraph', 'ch-final'],
    description: 'CH at end of words'
  },
  {
    id: 39,
    category: 'P39: SH Digraph - Pack 1',
    subPack: 'Digraphs',
    words: [
      'shade', 'shadow', 'shaft', 'shake', 'shall', 'shallow', 'shame', 'shampoo', 'shape', 'share',
      'shark', 'sharp', 'shave', 'she', 'shed', 'sheep', 'sheer', 'sheet', 'shelf', 'shell',
      'shelter', 'shield', 'shift', 'shine', 'ship', 'shirt', 'shock', 'shoe', 'shone', 'shook'
    ],
    patterns: ['sh-digraph', 'sh-initial'],
    description: 'SH sound at start of words'
  },
  {
    id: 40,
    category: 'P40: SH Digraph - Pack 2',
    subPack: 'Digraphs',
    words: [
      'shop', 'shore', 'short', 'shot', 'should', 'shout', 'show', 'shown', 'shrank', 'shred',
      'shrink', 'shrub', 'shrug', 'shut', 'bash', 'blush', 'brush', 'cash', 'crash', 'crush',
      'dash', 'dish', 'fish', 'flash', 'flesh', 'fresh', 'gush', 'harsh', 'hush', 'lash'
    ],
    patterns: ['sh-digraph', 'sh-final'],
    description: 'SH at end of words'
  },
  {
    id: 41,
    category: 'P41: TH Digraph - Pack 1',
    subPack: 'Digraphs',
    words: [
      'than', 'thank', 'that', 'thaw', 'the', 'theft', 'their', 'them', 'theme', 'then',
      'there', 'these', 'they', 'thick', 'thief', 'thigh', 'thin', 'thing', 'think', 'third',
      'thirst', 'thirteen', 'thirty', 'this', 'thorn', 'those', 'though', 'thought', 'thousand', 'thrash'
    ],
    patterns: ['th-digraph', 'voiced-th', 'voiceless-th'],
    description: 'TH sound (voiced and voiceless)'
  },
  {
    id: 42,
    category: 'P42: TH Digraph - Pack 2',
    subPack: 'Digraphs',
    words: [
      'thread', 'threat', 'three', 'threw', 'thrill', 'thrive', 'throat', 'throne', 'through', 'throw',
      'thrown', 'thrush', 'thrust', 'thumb', 'thump', 'thunder', 'thus', 'bath', 'booth', 'both',
      'breath', 'cloth', 'earth', 'faith', 'fifth', 'forth', 'fourth', 'growth', 'health', 'math'
    ],
    patterns: ['th-digraph', 'th-final'],
    description: 'TH blends and final TH'
  },
  {
    id: 43,
    category: 'P43: WH Digraph',
    subPack: 'Digraphs',
    words: [
      'whale', 'wharf', 'what', 'wheat', 'wheel', 'wheeze', 'when', 'where', 'whether', 'which',
      'whiff', 'while', 'whim', 'whine', 'whip', 'whirl', 'whisk', 'whisker', 'whisper', 'whistle',
      'white', 'whiz', 'who', 'whole', 'whom', 'whose', 'why'
    ],
    patterns: ['wh-digraph'],
    description: 'WH sound words'
  },
  {
    id: 44,
    category: 'P44: PH Digraph',
    subPack: 'Digraphs',
    words: [
      'phantom', 'pharaoh', 'pharmacy', 'phase', 'pheasant', 'phone', 'phonics', 'photo', 'phrase', 'physical',
      'alphabet', 'dolphin', 'elephant', 'geography', 'graph', 'paragraph', 'phone', 'photograph', 'prophet', 'osphere',
      'telephone', 'trophy', 'triumph'
    ],
    patterns: ['ph-digraph', 'ph-f-sound'],
    description: 'PH making F sound'
  },
  {
    id: 45,
    category: 'P45: CK Digraph',
    subPack: 'Digraphs',
    words: [
      'back', 'black', 'block', 'brick', 'check', 'chick', 'click', 'clock', 'crack', 'deck',
      'dock', 'duck', 'flick', 'flock', 'kick', 'knock', 'lack', 'lick', 'lock', 'luck',
      'neck', 'pack', 'pick', 'quick', 'rack', 'rock', 'sack', 'shock', 'sick', 'sock',
      'stack', 'stick', 'stock', 'stuck', 'thick', 'tick', 'track', 'trick', 'truck', 'wick'
    ],
    patterns: ['ck-digraph'],
    description: 'CK at end of words'
  },
  {
    id: 46,
    category: 'P46: NG Digraph',
    subPack: 'Digraphs',
    words: [
      'bang', 'bring', 'clang', 'cling', 'fang', 'fling', 'gang', 'hang', 'king', 'long',
      'lung', 'ping', 'rang', 'ring', 'sang', 'sing', 'sling', 'song', 'spring', 'sting',
      'string', 'strong', 'sung', 'swing', 'thing', 'wing', 'wrong', 'young', 'among', 'belong'
    ],
    patterns: ['ng-digraph'],
    description: 'NG ending sounds'
  },
  {
    id: 47,
    category: 'P47: NK Digraph',
    subPack: 'Digraphs',
    words: [
      'ank', 'bank', 'blank', 'clank', 'crank', 'dank', 'drank', 'flank', 'frank', 'plank',
      'prank', 'rank', 'sank', 'shrank', 'spank', 'stank', 'tank', 'thank', 'yank', 'blink',
      'brink', 'chink', 'clink', 'drink', 'ink', 'link', 'mink', 'pink', 'rink', 'shrink',
      'sink', 'skink', 'stink', 'think', 'wink', 'bonk', 'honk', 'monk', 'skunk', 'trunk'
    ],
    patterns: ['nk-digraph'],
    description: 'NK sound combinations'
  },
  {
    id: 48,
    category: 'P48: QU Digraph',
    subPack: 'Digraphs',
    words: [
      'quack', 'quail', 'quaint', 'quake', 'quality', 'quantity', 'quarrel', 'quarter', 'quartz', 'queen',
      'queer', 'quest', 'question', 'queue', 'quick', 'quicksand', 'quiet', 'quilt', 'quit', 'quite',
      'quiz', 'quote', 'equal', 'equip', 'liquid', 'squash', 'square', 'squeak', 'squeeze', 'squid'
    ],
    patterns: ['qu-digraph'],
    description: 'QU makes KW sound'
  },

  // ============================================================================
  // LONG VOWELS & VOWEL TEAMS (Packs 49-67)
  // ============================================================================
  {
    id: 49,
    category: 'P49: Long A - Silent E',
    subPack: 'Long Vowels',
    words: [
      'bake', 'cake', 'fake', 'flake', 'lake', 'make', 'rake', 'sake', 'shake', 'snake',
      'stake', 'take', 'wake', 'ame', 'blame', 'came', 'fame', 'flame', 'frame', 'game',
      'lame', 'name', 'same', 'shame', 'tame', 'ape', 'cape', 'drape', 'gape', 'grape',
      'shape', 'tape', 'ate', 'crate', 'date', 'fate', 'gate', 'grate', 'hate', 'late'
    ],
    patterns: ['long-a', 'a-e', 'magic-e'],
    description: 'Long A with silent E'
  },
  {
    id: 50,
    category: 'P50: AI Pattern',
    subPack: 'Long Vowels',
    words: [
      'aid', 'baid', 'braid', 'maid', 'paid', 'raid', 'said', 'ail', 'bail', 'fail',
      'hail', 'jail', 'mail', 'nail', 'pail', 'quail', 'rail', 'sail', 'snail', 'tail',
      'trail', 'wail', 'aim', 'claim', 'maim', 'ain', 'brain', 'chain', 'drain', 'gain',
      'grain', 'main', 'pain', 'plain', 'rain', 'spain', 'stain', 'strain', 'train', 'vain'
    ],
    patterns: ['long-a', 'ai-vowel-team'],
    description: 'AI making long A sound'
  },
  {
    id: 51,
    category: 'P51: AY Pattern',
    subPack: 'Long Vowels',
    words: [
      'bay', 'clay', 'day', 'fray', 'gay', 'gray', 'hay', 'jay', 'lay', 'may',
      'pay', 'play', 'pray', 'ray', 'say', 'spray', 'stay', 'stray', 'sway', 'tray',
      'way', 'delay', 'display', 'essay', 'okay', 'relay', 'repay', 'subway', 'today', 'birthday'
    ],
    patterns: ['long-a', 'ay-vowel-team'],
    description: 'AY at end of words'
  },
  {
    id: 52,
    category: 'P52: Long E - Silent E',
    subPack: 'Long Vowels',
    words: [
      'eve', 'gene', 'scene', 'these', 'athlete', 'complete', 'concrete', 'delete', 'compete', 'theme'
    ],
    patterns: ['long-e', 'e-e', 'magic-e'],
    description: 'Long E with silent E (rare)'
  },
  {
    id: 53,
    category: 'P53: EE Pattern',
    subPack: 'Long Vowels',
    words: [
      'bee', 'beef', 'been', 'beep', 'beer', 'beet', 'bleed', 'breeze', 'cheek', 'cheer',
      'creek', 'creep', 'deed', 'deep', 'deer', 'feed', 'feel', 'feet', 'flee', 'fleet',
      'free', 'freeze', 'geese', 'greed', 'green', 'greet', 'jeep', 'keen', 'keep', 'knee',
      'need', 'peek', 'peel', 'queen', 'reed', 'reef', 'reel', 'screech', 'seed', 'seek'
    ],
    patterns: ['long-e', 'ee-vowel-team'],
    description: 'EE vowel team'
  },
  {
    id: 54,
    category: 'P54: EA Pattern (Long E)',
    subPack: 'Long Vowels',
    words: [
      'beach', 'bead', 'beak', 'beam', 'bean', 'beast', 'beat', 'bleat', 'cheap', 'cheat',
      'clean', 'cream', 'deal', 'dream', 'each', 'east', 'easy', 'eat', 'feat', 'feast',
      'flea', 'gleam', 'heat', 'heap', 'jeans', 'lead', 'leaf', 'leak', 'lean', 'leap',
      'mean', 'meat', 'neat', 'peach', 'peak', 'peas', 'reach', 'read', 'real', 'ream'
    ],
    patterns: ['long-e', 'ea-vowel-team'],
    description: 'EA making long E sound'
  },
  {
    id: 55,
    category: 'P55: EA Pattern (Short E)',
    subPack: 'Long Vowels',
    words: [
      'bread', 'breath', 'dead', 'deaf', 'death', 'dread', 'head', 'health', 'heavy', 'instead',
      'lead', 'meant', 'measure', 'pleasant', 'ready', 'spread', 'steady', 'sweat', 'thread', 'threat',
      'tread', 'treasure', 'wealth', 'weapon', 'weather', 'feather', 'leather', 'breakfast', 'meadow', 'heaven'
    ],
    patterns: ['short-e', 'ea-exception'],
    description: 'EA making short E sound'
  },
  {
    id: 56,
    category: 'P56: Long I - Silent E',
    subPack: 'Long Vowels',
    words: [
      'bike', 'dike', 'hike', 'like', 'mike', 'pike', 'spike', 'strike', 'bite', 'cite',
      'kite', 'mite', 'quite', 'site', 'spite', 'white', 'write', 'dime', 'grime', 'lime',
      'mime', 'prime', 'slime', 'time', 'chime', 'crime', 'dine', 'fine', 'line', 'mine',
      'nine', 'pine', 'shine', 'shrine', 'spine', 'swine', 'twine', 'vine', 'whine', 'wine'
    ],
    patterns: ['long-i', 'i-e', 'magic-e'],
    description: 'Long I with silent E'
  },
  {
    id: 57,
    category: 'P57: IGH Pattern',
    subPack: 'Long Vowels',
    words: [
      'bright', 'fight', 'flight', 'fright', 'high', 'knight', 'light', 'might', 'night', 'right',
      'sight', 'slight', 'tight', 'thigh', 'sigh', 'nigh', 'plight', 'blight', 'delight', 'midnight',
      'twilight', 'daylight', 'sunlight', 'moonlight', 'flashlight', 'firelight', 'highlight', 'frighten', 'tighten', 'brighten'
    ],
    patterns: ['long-i', 'igh-pattern', 'silent-gh'],
    description: 'IGH making long I (GH is silent)'
  },
  {
    id: 58,
    category: 'P58: Y as Long I',
    subPack: 'Long Vowels',
    words: [
      'by', 'cry', 'dry', 'fly', 'fry', 'my', 'ply', 'pry', 'shy', 'sky',
      'sly', 'spy', 'sty', 'try', 'why', 'apply', 'deny', 'imply', 'rely', 'reply',
      'supply', 'butterfly', 'dragonfly', 'firefly', 'multiply', 'satisfy', 'terrify', 'classify', 'identify', 'modify'
    ],
    patterns: ['long-i', 'y-as-vowel'],
    description: 'Y making long I sound'
  },
  {
    id: 59,
    category: 'P59: Long O - Silent E',
    subPack: 'Long Vowels',
    words: [
      'bone', 'clone', 'cone', 'drone', 'hone', 'lone', 'phone', 'prone', 'stone', 'throne',
      'tone', 'zone', 'broke', 'choke', 'joke', 'poke', 'smoke', 'spoke', 'stoke', 'stroke',
      'woke', 'yoke', 'code', 'mode', 'node', 'rode', 'strode', 'dome', 'home', 'nome',
      'Rome', 'hole', 'mole', 'pole', 'role', 'sole', 'stole', 'whole', 'robe', 'globe'
    ],
    patterns: ['long-o', 'o-e', 'magic-e'],
    description: 'Long O with silent E'
  },
  {
    id: 60,
    category: 'P60: OA Pattern',
    subPack: 'Long Vowels',
    words: [
      'boat', 'boast', 'cloak', 'coach', 'coal', 'coast', 'coat', 'croak', 'float', 'foam',
      'gloat', 'goat', 'groan', 'load', 'loaf', 'loan', 'moan', 'moat', 'oat', 'poach',
      'road', 'roam', 'roast', 'soak', 'soap', 'throat', 'toad', 'toast', 'approach', 'cockroach'
    ],
    patterns: ['long-o', 'oa-vowel-team'],
    description: 'OA vowel team'
  },
  {
    id: 61,
    category: 'P61: OW Pattern (Long O)',
    subPack: 'Long Vowels',
    words: [
      'blow', 'bow', 'bowl', 'crow', 'elbow', 'flow', 'glow', 'grow', 'know', 'low',
      'mow', 'own', 'row', 'show', 'slow', 'snow', 'stow', 'throw', 'tow', 'yellow',
      'below', 'bellow', 'fellow', 'follow', 'hollow', 'mellow', 'pillow', 'shallow', 'swallow', 'willow'
    ],
    patterns: ['long-o', 'ow-vowel-team'],
    description: 'OW making long O sound'
  },
  {
    id: 62,
    category: 'P62: OW Pattern (OU sound)',
    subPack: 'Long Vowels',
    words: [
      'bow', 'brow', 'brown', 'clown', 'cow', 'crowd', 'crown', 'down', 'drown', 'frown',
      'gown', 'growl', 'how', 'howl', 'now', 'owl', 'plow', 'pow', 'powder', 'power',
      'prowl', 'scowl', 'shower', 'town', 'towel', 'tower', 'vow', 'vowel', 'wow', 'eyebrow'
    ],
    patterns: ['ou-sound', 'ow-diphthong'],
    description: 'OW making OU sound (as in cow)'
  },
  {
    id: 63,
    category: 'P63: Long U - Silent E',
    subPack: 'Long Vowels',
    words: [
      'cube', 'cute', 'duke', 'fluke', 'flute', 'fume', 'fuse', 'huge', 'June', 'lute',
      'mule', 'mute', 'prune', 'rude', 'rule', 'tube', 'tune', 'use', 'brute', 'crude',
      'dune', 'duke', 'refuse', 'excuse', 'pollute', 'compute', 'dispute', 'salute', 'costume', 'volume'
    ],
    patterns: ['long-u', 'u-e', 'magic-e'],
    description: 'Long U with silent E'
  },
  {
    id: 64,
    category: 'P64: UE Pattern',
    subPack: 'Long Vowels',
    words: [
      'blue', 'clue', 'due', 'flue', 'glue', 'hue', 'rue', 'sue', 'true', 'value',
      'argue', 'avenue', 'barbecue', 'catalogue', 'continue', 'dialogue', 'issue', 'league', 'plague', 'rescue',
      'tissue', 'tongue', 'unique', 'vague', 'pursue', 'statue', 'virtue', 'revenue', 'intrigue', 'fatigue'
    ],
    patterns: ['long-u', 'ue-vowel-team'],
    description: 'UE vowel team'
  },
  {
    id: 65,
    category: 'P65: EW Pattern',
    subPack: 'Long Vowels',
    words: [
      'blew', 'brew', 'chew', 'crew', 'dew', 'drew', 'few', 'flew', 'grew', 'jew',
      'knew', 'new', 'pew', 'screw', 'shrew', 'skew', 'slew', 'stew', 'threw', 'view',
      'cashew', 'curfew', 'nephew', 'renew', 'review', 'jewel', 'sewer', 'ewer', 'ewer', 'mildew'
    ],
    patterns: ['long-u', 'ew-vowel-team'],
    description: 'EW making long U sound'
  },
  {
    id: 66,
    category: 'P66: Y as Long E',
    subPack: 'Long Vowels',
    words: [
      'baby', 'bakery', 'berry', 'body', 'bumpy', 'bunny', 'busy', 'candy', 'carry', 'city',
      'copy', 'crazy', 'daisy', 'dirty', 'easy', 'empty', 'fairy', 'family', 'fancy', 'fifty',
      'funny', 'happy', 'heavy', 'jelly', 'lady', 'lazy', 'lucky', 'many', 'marry', 'misty',
      'money', 'monkey', 'muddy', 'party', 'penny', 'pony', 'pretty', 'puppy', 'rainy', 'ready'
    ],
    patterns: ['long-e', 'y-as-vowel'],
    description: 'Y making long E at end of words'
  },
  {
    id: 67,
    category: 'P67: IE Pattern',
    subPack: 'Long Vowels',
    words: [
      'believe', 'brief', 'chief', 'field', 'fierce', 'grief', 'niece', 'piece', 'pierce', 'priest',
      'relief', 'shield', 'shriek', 'thief', 'tier', 'achieve', 'cookie', 'movie', 'brownie', 'prairie',
      'series', 'species', 'died', 'fried', 'lied', 'tied', 'tried', 'cried', 'dried', 'spied'
    ],
    patterns: ['long-e', 'long-i', 'ie-vowel-team'],
    description: 'IE making different sounds'
  },

  // ============================================================================
  // R-CONTROLLED VOWELS (Packs 68-82)
  // ============================================================================
  {
    id: 68,
    category: 'P68: AR Pattern - Pack 1',
    subPack: 'R-Controlled Vowels',
    words: [
      'arc', 'arch', 'are', 'ark', 'arm', 'art', 'bar', 'bark', 'barn', 'car',
      'card', 'care', 'carp', 'cart', 'char', 'charm', 'chart', 'dark', 'dart', 'far',
      'fare', 'farm', 'hare', 'harm', 'harp', 'hard', 'jar', 'lard', 'lark', 'mar'
    ],
    patterns: ['r-controlled', 'ar-pattern'],
    description: 'AR making /ar/ sound'
  },
  {
    id: 69,
    category: 'P69: AR Pattern - Pack 2',
    subPack: 'R-Controlled Vowels',
    words: [
      'mark', 'marsh', 'mart', 'par', 'park', 'part', 'rare', 'scar', 'scare', 'scarf',
      'shark', 'sharp', 'shard', 'smart', 'snare', 'snarl', 'spark', 'star', 'stare', 'stark',
      'start', 'tar', 'tart', 'target', 'yarn', 'yard', 'alarm', 'apart', 'arbor', 'argue'
    ],
    patterns: ['r-controlled', 'ar-pattern'],
    description: 'More AR words'
  },
  {
    id: 70,
    category: 'P70: OR Pattern - Pack 1',
    subPack: 'R-Controlled Vowels',
    words: [
      'born', 'cord', 'core', 'cork', 'corn', 'fort', 'for', 'fork', 'form', 'forth',
      'horn', 'horse', 'more', 'morn', 'north', 'or', 'ore', 'porch', 'pork', 'port',
      'score', 'shore', 'short', 'snore', 'sort', 'sport', 'store', 'stork', 'storm', 'thorn'
    ],
    patterns: ['r-controlled', 'or-pattern'],
    description: 'OR making /or/ sound'
  },
  {
    id: 71,
    category: 'P71: OR Pattern - Pack 2',
    subPack: 'R-Controlled Vowels',
    words: [
      'torn', 'torch', 'wore', 'worn', 'adore', 'before', 'border', 'corner', 'explore', 'forest',
      'forget', 'formal', 'former', 'fortune', 'morning', 'normal', 'order', 'organ', 'perform', 'restore',
      'support', 'uniform', 'ignore', 'important', 'export', 'import', 'report', 'transport', 'senator', 'mentor'
    ],
    patterns: ['r-controlled', 'or-pattern'],
    description: 'More OR combinations'
  },
  {
    id: 72,
    category: 'P72: ER Pattern - Pack 1',
    subPack: 'R-Controlled Vowels',
    words: [
      'ber', 'clerk', 'der', 'fern', 'germ', 'her', 'herd', 'jerk', 'perk', 'per',
      'term', 'verb', 'verse', 'alert', 'alter', 'anger', 'baker', 'banner', 'better', 'bitter',
      'border', 'butter', 'camper', 'center', 'chapter', 'cheer', 'clever', 'corner', 'cover', 'danger'
    ],
    patterns: ['r-controlled', 'er-pattern'],
    description: 'ER making /er/ sound'
  },
  {
    id: 73,
    category: 'P73: ER Pattern - Pack 2',
    subPack: 'R-Controlled Vowels',
    words: [
      'differ', 'dinner', 'eager', 'elder', 'enter', 'ever', 'father', 'filter', 'finger', 'flower',
      'gather', 'ginger', 'hammer', 'helper', 'hunger', 'inner', 'ladder', 'laser', 'later', 'letter',
      'liver', 'longer', 'lover', 'maker', 'master', 'meter', 'mother', 'never', 'number', 'offer'
    ],
    patterns: ['r-controlled', 'er-pattern'],
    description: 'ER in multi-syllable words'
  },
  {
    id: 74,
    category: 'P74: IR Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'bird', 'birth', 'chirp', 'circle', 'circus', 'dirt', 'fir', 'firm', 'first', 'flirt',
      'girl', 'girth', 'shirt', 'sir', 'skirt', 'smirk', 'squirm', 'squirt', 'stir', 'swirl',
      'third', 'thirst', 'thirteen', 'thirty', 'twirl', 'whir', 'confirm', 'firmly', 'dirty', 'thirteen'
    ],
    patterns: ['r-controlled', 'ir-pattern'],
    description: 'IR making /er/ sound'
  },
  {
    id: 75,
    category: 'P75: UR Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'blur', 'blurt', 'burn', 'burst', 'churn', 'church', 'curl', 'curb', 'curd', 'cure',
      'curfew', 'curious', 'curse', 'curve', 'fur', 'hurl', 'hurt', 'lurch', 'nurse', 'pur',
      'pure', 'purple', 'purse', 'slur', 'spur', 'spurt', 'surf', 'sure', 'turn', 'turtle',
      'turf', 'turkey', 'urban', 'urge', 'urgent', 'urn', 'burden', 'current', 'curtain', 'further'
    ],
    patterns: ['r-controlled', 'ur-pattern'],
    description: 'UR making /er/ sound'
  },
  {
    id: 76,
    category: 'P76: AIR Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'air', 'chair', 'dairy', 'fair', 'fairy', 'hair', 'haircut', 'hairy', 'lair', 'pair',
      'repair', 'stair', 'upstairs', 'affair', 'aircraft', 'airline', 'airport', 'unfair', 'prairie', 'despair'
    ],
    patterns: ['r-controlled', 'air-pattern'],
    description: 'AIR sound pattern'
  },
  {
    id: 77,
    category: 'P77: ARE Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'are', 'bare', 'blare', 'care', 'compare', 'dare', 'declare', 'fare', 'flare', 'glare',
      'hare', 'mare', 'pare', 'prepare', 'rare', 'scare', 'share', 'snare', 'spare', 'square',
      'stare', 'ware', 'ware', 'aware', 'beware', 'compare', 'nightmare', 'software', 'warehouse', 'welfare'
    ],
    patterns: ['r-controlled', 'are-pattern'],
    description: 'ARE making /air/ sound'
  },
  {
    id: 78,
    category: 'P78: EAR Pattern (EER sound)',
    subPack: 'R-Controlled Vowels',
    words: [
      'dear', 'ear', 'fear', 'gear', 'hear', 'lear', 'near', 'pear', 'rear', 'sear',
      'shear', 'smear', 'spear', 'tear', 'year', 'appear', 'beard', 'clear', 'disappear', 'earring',
      'earlobe', 'early', 'earn', 'earth', 'earthquake', 'fearless', 'nearby', 'nearly', 'teardrop', 'yearly'
    ],
    patterns: ['r-controlled', 'ear-pattern'],
    description: 'EAR making /eer/ sound'
  },
  {
    id: 79,
    category: 'P79: EAR Pattern (AIR sound)',
    subPack: 'R-Controlled Vowels',
    words: [
      'bear', 'pear', 'swear', 'tear', 'wear', 'bearable', 'forbear', 'unbearable', 'wearable', 'weary'
    ],
    patterns: ['r-controlled', 'ear-exception'],
    description: 'EAR making /air/ sound (rare)'
  },
  {
    id: 80,
    category: 'P80: EER Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'beer', 'cheer', 'deer', 'jeer', 'leer', 'peer', 'queer', 'sheer', 'sneer', 'steer',
      'veer', 'career', 'cheerful', 'cheerleader', 'engineer', 'pioneer', 'reindeer', 'volunteer', 'steering', 'cheering'
    ],
    patterns: ['r-controlled', 'eer-pattern'],
    description: 'EER vowel team'
  },
  {
    id: 81,
    category: 'P81: IRE Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'dire', 'fire', 'hire', 'mire', 'sire', 'tire', 'wire', 'admire', 'acquire', 'bonfire',
      'campfire', 'desire', 'empire', 'entire', 'expire', 'fireplace', 'inspire', 'perspire', 'require', 'retire',
      'umpire', 'vampire', 'wildfire', 'wireless', 'backfire', 'crossfire', 'fireworks', 'tiresome', 'inquire', 'spire'
    ],
    patterns: ['r-controlled', 'ire-pattern'],
    description: 'IRE making /ire/ sound'
  },
  {
    id: 82,
    category: 'P82: ORE Pattern',
    subPack: 'R-Controlled Vowels',
    words: [
      'bore', 'chore', 'core', 'fore', 'gore', 'lore', 'more', 'pore', 'score', 'shore',
      'snore', 'sore', 'spore', 'store', 'swore', 'tore', 'wore', 'adore', 'before', 'explore',
      'ignore', 'restore', 'seashore', 'anymore', 'evermore', 'forevermore', 'furthermore', 'therefore', 'offshore', 'folklore'
    ],
    patterns: ['r-controlled', 'ore-pattern'],
    description: 'ORE making /or/ sound'
  },

  // ============================================================================
  // ADVANCED PATTERNS (Packs 83-130)
  // ============================================================================
  {
    id: 83,
    category: 'P83: OUGH Pattern (F sound)',
    subPack: 'Advanced Patterns',
    words: [
      'cough', 'rough', 'tough', 'enough', 'trough', 'roughage', 'roughen', 'roughhouse', 'roughneck', 'toughen'
    ],
    patterns: ['ough-pattern', 'gh-f-sound'],
    description: 'OUGH making F sound'
  },
  {
    id: 84,
    category: 'P84: OUGH Pattern (O sound)',
    subPack: 'Advanced Patterns',
    words: [
      'dough', 'though', 'although', 'thorough', 'borough', 'furlough', 'doughnut'
    ],
    patterns: ['ough-pattern', 'silent-gh', 'long-o'],
    description: 'OUGH making long O sound'
  },
  {
    id: 85,
    category: 'P85: OUGH Pattern (AW sound)',
    subPack: 'Advanced Patterns',
    words: [
      'bought', 'brought', 'fought', 'ought', 'sought', 'thought', 'wrought', 'besought', 'forethought', 'afterthought'
    ],
    patterns: ['ough-pattern', 'silent-gh', 'aw-sound'],
    description: 'OUGH making AW sound'
  },
  {
    id: 86,
    category: 'P86: OUGH Pattern (OO sound)',
    subPack: 'Advanced Patterns',
    words: [
      'through', 'throughout', 'breakthrough', 'passthrough', 'walkthrough'
    ],
    patterns: ['ough-pattern', 'silent-gh', 'oo-sound'],
    description: 'OUGH making OO sound'
  },
  {
    id: 87,
    category: 'P87: OUGH Pattern (OW sound)',
    subPack: 'Advanced Patterns',
    words: [
      'bough', 'plough', 'slough', 'drought', 'ploughman'
    ],
    patterns: ['ough-pattern', 'silent-gh', 'ow-sound'],
    description: 'OUGH making OW sound'
  },
  {
    id: 88,
    category: 'P88: AUGH Pattern',
    subPack: 'Advanced Patterns',
    words: [
      'caught', 'taught', 'daughter', 'slaughter', 'laughter', 'naughty', 'haughty', 'onslaught', 'distraught', 'manslaughter'
    ],
    patterns: ['augh-pattern', 'silent-gh'],
    description: 'AUGH making AW sound'
  },
  {
    id: 89,
    category: 'P89: EIGH Pattern',
    subPack: 'Advanced Patterns',
    words: [
      'eight', 'eighth', 'eighty', 'freight', 'sleigh', 'weigh', 'weight', 'neigh', 'neighbor', 'neighborhood',
      'weightless', 'lightweight', 'heavyweight', 'overweight', 'sleighbell', 'freighter', 'eighteen', 'eighty-eight'
    ],
    patterns: ['eigh-pattern', 'silent-gh', 'long-a'],
    description: 'EIGH making long A'
  },
  {
    id: 90,
    category: 'P90: Silent Letters - Silent B',
    subPack: 'Advanced Patterns',
    words: [
      'bomb', 'climb', 'comb', 'crumb', 'debt', 'doubt', 'dumb', 'lamb', 'limb', 'numb',
      'plumber', 'subtle', 'thumb', 'tomb', 'womb', 'bomber', 'climber', 'number', 'cucumber', 'slumber'
    ],
    patterns: ['silent-b', 'silent-letters'],
    description: 'Words with silent B'
  },
  {
    id: 91,
    category: 'P91: Silent Letters - Silent K',
    subPack: 'Advanced Patterns',
    words: [
      'knee', 'kneel', 'knew', 'knife', 'knight', 'knit', 'knob', 'knock', 'knot', 'know',
      'knowledge', 'knuckle', 'knapsack', 'kneecap', 'kneeling', 'knifing', 'knightly', 'knotty', 'knowing', 'unknown'
    ],
    patterns: ['silent-k', 'silent-letters', 'kn-pattern'],
    description: 'Words with silent K (KN)'
  },
  {
    id: 92,
    category: 'P92: Silent Letters - Silent W',
    subPack: 'Advanced Patterns',
    words: [
      'wrap', 'wrath', 'wreath', 'wreck', 'wren', 'wrench', 'wrestle', 'wriggle', 'wring', 'wrinkle',
      'wrist', 'write', 'writer', 'writing', 'written', 'wrong', 'wrote', 'wrung', 'wry', 'wrapper',
      'wrapping', 'wreckage', 'wrestler', 'wrestling', 'wristband', 'wristwatch', 'wrinkly', 'wrongful', 'playwright', 'shipwreck'
    ],
    patterns: ['silent-w', 'silent-letters', 'wr-pattern'],
    description: 'Words with silent W (WR)'
  },
  {
    id: 93,
    category: 'P93: Silent Letters - Silent G',
    subPack: 'Advanced Patterns',
    words: [
      'gnat', 'gnash', 'gnaw', 'gnome', 'gnu', 'align', 'assign', 'benign', 'campaign', 'champagne',
      'cologne', 'design', 'ensign', 'foreign', 'malign', 'reign', 'resign', 'sign', 'signal', 'signature',
      'designer', 'assignment', 'alignment', 'realign', 'consign', 'reassign'
    ],
    patterns: ['silent-g', 'silent-letters', 'gn-pattern'],
    description: 'Words with silent G'
  },
  {
    id: 94,
    category: 'P94: Silent Letters - Silent H',
    subPack: 'Advanced Patterns',
    words: [
      'heir', 'heirloom', 'honest', 'honestly', 'honor', 'honorable', 'hour', 'hourly', 'rhyme', 'rhythm',
      'ghost', 'ghastly', 'ghetto', 'gherkin', 'ghoul', 'exhaust', 'exhibit', 'exhilarate', 'vehicle', 'vehement'
    ],
    patterns: ['silent-h', 'silent-letters'],
    description: 'Words with silent H'
  },
  {
    id: 95,
    category: 'P95: Silent Letters - Silent L',
    subPack: 'Advanced Patterns',
    words: [
      'calf', 'calm', 'folk', 'half', 'palm', 'psalm', 'salmon', 'talk', 'walk', 'chalk',
      'stalk', 'yolk', 'could', 'should', 'would', 'calming', 'walking', 'talking', 'balmy', 'folklore',
      'sidewalk', 'crosswalk', 'walkway', 'talker', 'stalker', 'chalkboard'
    ],
    patterns: ['silent-l', 'silent-letters'],
    description: 'Words with silent L'
  },
  {
    id: 96,
    category: 'P96: Silent Letters - Silent T',
    subPack: 'Advanced Patterns',
    words: [
      'ballet', 'bouquet', 'castle', 'fasten', 'gourmet', 'hustle', 'jostle', 'listen', 'mortgage', 'nestle',
      'often', 'rustle', 'soften', 'thistle', 'whistle', 'wrestle', 'bristle', 'bustle', 'glisten', 'moisten',
      'castle', 'fastener', 'listener', 'whistler', 'wrestler', 'rustling', 'hustling', 'jostling'
    ],
    patterns: ['silent-t', 'silent-letters'],
    description: 'Words with silent T'
  },
  {
    id: 97,
    category: 'P97: Silent Letters - Silent E',
    subPack: 'Advanced Patterns',
    words: [
      'axe', 'ache', 'argue', 'cologne', 'fatigue', 'league', 'meringue', 'ogue', 'plague', 'tongue',
      'vague', 'ague', 'antique', 'boutique', 'catalogue', 'colleague', 'dialogue', 'ogue', 'prologue', 'rogue',
      'technique', 'unique', 'intrigue', 'opaque', 'plaque', 'baroque', 'mystique', 'critique', 'physique', 'oblique'
    ],
    patterns: ['silent-e', 'silent-letters', 'gue-pattern'],
    description: 'Words with silent E (not magic E)'
  },
  {
    id: 98,
    category: 'P98: OI/OY Diphthong - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'boil', 'broil', 'choice', 'coin', 'coil', 'foil', 'hoist', 'join', 'joint', 'joist',
      'moist', 'noise', 'oil', 'point', 'poison', 'soil', 'spoil', 'toil', 'voice', 'void',
      'avoid', 'appoint', 'anoint', 'disappoint', 'embroider', 'exploit', 'invoice', 'rejoice', 'turmoil', 'recoil'
    ],
    patterns: ['oi-diphthong', 'oy-diphthong'],
    description: 'OI making /oy/ sound'
  },
  {
    id: 99,
    category: 'P99: OI/OY Diphthong - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'boy', 'coy', 'joy', 'ploy', 'soy', 'toy', 'ahoy', 'alloy', 'annoy', 'cloy',
      'convoy', 'corduroy', 'cowboy', 'decoy', 'deploy', 'destroy', 'employ', 'enjoy', 'oyster', 'royal',
      'voyage', 'employer', 'employee', 'enjoyment', 'joyful', 'joyous', 'loyalty', 'royalty', 'tomboy', 'toyshop'
    ],
    patterns: ['oy-diphthong'],
    description: 'OY making /oy/ sound'
  },
  {
    id: 100,
    category: 'P100: OU/OW Diphthong - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'about', 'around', 'bound', 'cloud', 'couch', 'count', 'doubt', 'found', 'foul', 'ground',
      'house', 'hound', 'loud', 'mound', 'mount', 'mouse', 'mouth', 'ounce', 'ouch', 'our',
      'out', 'pound', 'pounce', 'pouch', 'pout', 'proud', 'round', 'scout', 'shout', 'sound'
    ],
    patterns: ['ou-diphthong'],
    description: 'OU making /ow/ sound'
  },
  {
    id: 101,
    category: 'P101: OU/OW Diphthong - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'south', 'sprout', 'trout', 'announce', 'amount', 'account', 'bounce', 'cloudy', 'compound', 'county',
      'crouch', 'discount', 'fountain', 'grouch', 'housetop', 'lousy', 'mountain', 'outlaw', 'playground', 'pronounce',
      'rebound', 'renounce', 'slouch', 'thousand', 'voucher', 'without', 'background', 'boundary', 'surroundings', 'astound'
    ],
    patterns: ['ou-diphthong'],
    description: 'More OU words'
  },
  {
    id: 102,
    category: 'P102: AU/AW Pattern - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'auto', 'August', 'author', 'autumn', 'because', 'cause', 'caught', 'caution', 'daughter', 'fault',
      'fraud', 'haul', 'haunt', 'launch', 'laundry', 'pause', 'sauce', 'saucer', 'slaughter', 'taught',
      'taut', 'vault', 'applause', 'applaud', 'astronaut', 'audience', 'auditorium', 'auction', 'augment', 'default'
    ],
    patterns: ['au-pattern', 'aw-sound'],
    description: 'AU making AW sound'
  },
  {
    id: 103,
    category: 'P103: AU/AW Pattern - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'awful', 'brawl', 'claw', 'crawl', 'dawn', 'draw', 'drawer', 'drawn', 'fawn', 'hawk',
      'jaw', 'law', 'lawn', 'paw', 'prawn', 'raw', 'saw', 'shawl', 'spawn', 'straw',
      'thaw', 'yawn', 'awful', 'awesome', 'awning', 'bawl', 'drawbridge', 'lawful', 'lawyer', 'outlaw',
      'sawdust', 'seashaw', 'seesaw', 'strawberry', 'trawler', 'unlawful', 'withdraw', 'jigsaw', 'coleslaw', 'hacksaw'
    ],
    patterns: ['aw-pattern'],
    description: 'AW making AW sound'
  },
  {
    id: 104,
    category: 'P104: OO Pattern (Short)',
    subPack: 'Advanced Patterns',
    words: [
      'book', 'brook', 'cook', 'cookie', 'crook', 'foot', 'good', 'hood', 'hoof', 'hook',
      'look', 'nook', 'rook', 'shook', 'stood', 'took', 'wood', 'wool', 'bookmark', 'bookshelf',
      'cookbook', 'football', 'goodbye', 'goodness', 'looking', 'notebook', 'overlook', 'textbook', 'understood', 'wooden'
    ],
    patterns: ['oo-short', 'oo-pattern'],
    description: 'OO making short sound (as in book)'
  },
  {
    id: 105,
    category: 'P105: OO Pattern (Long)',
    subPack: 'Advanced Patterns',
    words: [
      'balloon', 'bloom', 'boo', 'boom', 'boost', 'boot', 'booth', 'broom', 'choose', 'cool',
      'drool', 'food', 'fool', 'gloomy', 'goose', 'groom', 'groove', 'hoop', 'loom', 'loose',
      'mood', 'moon', 'moose', 'noon', 'pool', 'proof', 'room', 'roof', 'root', 'school',
      'scoop', 'smooth', 'snoop', 'soon', 'spool', 'spoon', 'stool', 'swoop', 'tool', 'tooth',
      'troop', 'zoo', 'zoom', 'afternoon', 'bathroom', 'bedroom', 'cartoon', 'classroom', 'foolish', 'noodle'
    ],
    patterns: ['oo-long', 'oo-pattern'],
    description: 'OO making long sound (as in moon)'
  },
  {
    id: 106,
    category: 'P106: Soft C - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'ace', 'cell', 'cent', 'center', 'cereal', 'certain', 'circle', 'city', 'circus', 'cycle',
      'cymbals', 'face', 'fancy', 'fence', 'ice', 'lace', 'mice', 'nice', 'once', 'pace',
      'pencil', 'place', 'police', 'price', 'prince', 'race', 'rice', 'since', 'slice', 'space',
      'spice', 'twice', 'voice', 'accident', 'celebrate', 'century', 'citizen', 'civilization', 'cylinder', 'decide'
    ],
    patterns: ['soft-c', 'c-as-s'],
    description: 'Soft C (makes S sound before E, I, Y)'
  },
  {
    id: 107,
    category: 'P107: Soft C - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'accept', 'access', 'bicycle', 'cancel', 'cancer', 'ceiling', 'celebrate', 'celery', 'cement', 'cemetery',
      'central', 'ceremony', 'certificate', 'cider', 'cigar', 'cinema', 'cinnamon', 'concert', 'cyclone', 'cymbal',
      'decent', 'decimal', 'excite', 'excellent', 'except', 'excess', 'exercise', 'grocery', 'icicle', 'innocent',
      'medicine', 'necessary', 'ocean', 'office', 'pencil', 'percent', 'recede', 'receipt', 'receive', 'recent'
    ],
    patterns: ['soft-c'],
    description: 'More soft C words'
  },
  {
    id: 108,
    category: 'P108: Hard C',
    subPack: 'Advanced Patterns',
    words: [
      'cab', 'cage', 'cake', 'call', 'came', 'camp', 'can', 'cape', 'car', 'card',
      'care', 'cart', 'case', 'cast', 'cat', 'cave', 'clap', 'class', 'clean', 'clip',
      'clock', 'close', 'club', 'coat', 'code', 'coin', 'cold', 'come', 'cone', 'cook',
      'cool', 'cope', 'copy', 'cord', 'core', 'corn', 'cost', 'cot', 'count', 'cup',
      'cure', 'curl', 'cut', 'cute', 'camera', 'campus', 'candy', 'candle', 'cargo', 'cartoon'
    ],
    patterns: ['hard-c', 'c-as-k'],
    description: 'Hard C (makes K sound before A, O, U)'
  },
  {
    id: 109,
    category: 'P109: Soft G - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'age', 'agent', 'cage', 'change', 'charge', 'danger', 'edge', 'engine', 'gem', 'gender',
      'gene', 'general', 'generous', 'genius', 'gentle', 'germ', 'giant', 'ginger', 'giraffe', 'gym',
      'gymnastics', 'gypsy', 'angel', 'arrange', 'badge', 'barge', 'bridge', 'bulge', 'challenge', 'damage'
    ],
    patterns: ['soft-g', 'g-as-j'],
    description: 'Soft G (makes J sound before E, I, Y)'
  },
  {
    id: 110,
    category: 'P110: Soft G - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'dodge', 'energy', 'engage', 'enlarge', 'exchange', 'forge', 'fudge', 'gauge', 'gently', 'geography',
      'geology', 'geometry', 'gerund', 'gesture', 'hinge', 'huge', 'imagine', 'judge', 'large', 'legend',
      'ledge', 'lodge', 'lounge', 'magic', 'manage', 'margin', 'merge', 'origin', 'page', 'passage',
      'passenger', 'pledge', 'plunge', 'range', 'rage', 'ridge', 'siege', 'stage', 'strange', 'surge',
      'tragic', 'urgent', 'village', 'voyage', 'wage', 'wedge'
    ],
    patterns: ['soft-g'],
    description: 'More soft G patterns'
  },
  {
    id: 111,
    category: 'P111: Hard G',
    subPack: 'Advanced Patterns',
    words: [
      'bag', 'beg', 'big', 'bog', 'bug', 'dig', 'dog', 'egg', 'fog', 'gag',
      'game', 'gap', 'garden', 'gate', 'gave', 'gift', 'girl', 'give', 'glad', 'glass',
      'glove', 'glue', 'go', 'goal', 'goat', 'gold', 'gone', 'good', 'got', 'grab',
      'grade', 'grand', 'grape', 'grass', 'great', 'green', 'grew', 'grin', 'ground', 'grow',
      'guard', 'guess', 'guest', 'guide', 'guitar', 'gulf', 'gum', 'gun', 'gust', 'gut'
    ],
    patterns: ['hard-g', 'g-as-g'],
    description: 'Hard G (regular G sound before A, O, U)'
  },
  {
    id: 112,
    category: 'P112: DGE Pattern',
    subPack: 'Advanced Patterns',
    words: [
      'badge', 'bridge', 'budge', 'edge', 'fridge', 'fudge', 'grudge', 'hedge', 'judge', 'ledge',
      'lodge', 'nudge', 'pledge', 'ridge', 'smudge', 'wedge', 'abridge', 'acknowledge', 'cartridge', 'dislodge',
      'dodgeball', 'drawbridge', 'drudgery', 'judgment', 'knowledge', 'partridge', 'porridge', 'refrigerator', 'sledgehammer', 'unfledged'
    ],
    patterns: ['dge-pattern', 'soft-g'],
    description: 'DGE making J sound'
  },
  {
    id: 113,
    category: 'P113: TCH Pattern',
    subPack: 'Advanced Patterns',
    words: [
      'batch', 'blotch', 'catch', 'clutch', 'crutch', 'ditch', 'etch', 'fetch', 'hatch', 'hitch',
      'hutch', 'itch', 'latch', 'match', 'notch', 'patch', 'pitch', 'scratch', 'sketch', 'snatch',
      'stitch', 'stretch', 'switch', 'thatch', 'watch', 'witch', 'botchery', 'catcher', 'dispatcher', 'hatchery',
      'kitchen', 'pitcher', 'ratchet', 'satchel', 'sketchy', 'stretcher', 'thatched', 'watchful', 'watcher', 'wretchedness'
    ],
    patterns: ['tch-pattern'],
    description: 'TCH making CH sound'
  },
  {
    id: 114,
    category: 'P114: TION Suffix',
    subPack: 'Advanced Patterns',
    words: [
      'action', 'addition', 'attention', 'caution', 'collection', 'condition', 'connection', 'construction', 'correction', 'creation',
      'decoration', 'description', 'destruction', 'detection', 'direction', 'education', 'election', 'emotion', 'equation', 'exception',
      'fiction', 'fraction', 'function', 'generation', 'infection', 'information', 'instruction', 'intention', 'invention', 'lotion',
      'mention', 'motion', 'nation', 'notion', 'operation', 'option', 'portion', 'position', 'potion', 'prediction',
      'production', 'promotion', 'protection', 'question', 'reaction', 'section', 'selection', 'station', 'subtraction', 'tradition'
    ],
    patterns: ['tion-suffix', 'shun-sound'],
    description: 'TION making SHUN sound'
  },
  {
    id: 115,
    category: 'P115: SION Suffix',
    subPack: 'Advanced Patterns',
    words: [
      'admission', 'collision', 'commission', 'compassion', 'comprehension', 'conclusion', 'confession', 'confusion', 'conversion', 'decision',
      'dimension', 'discussion', 'division', 'erosion', 'excursion', 'expansion', 'explosion', 'expression', 'extension', 'fusion',
      'illusion', 'immersion', 'impression', 'inclusion', 'invasion', 'mission', 'occasion', 'passion', 'pension', 'permission',
      'persuasion', 'precision', 'profession', 'provision', 'revision', 'session', 'submission', 'succession', 'suspension', 'television',
      'tension', 'transmission', 'version', 'vision'
    ],
    patterns: ['sion-suffix', 'zhun-sound'],
    description: 'SION making ZHUN sound'
  },
  {
    id: 116,
    category: 'P116: CIAN Suffix',
    subPack: 'Advanced Patterns',
    words: [
      'electrician', 'magician', 'musician', 'optician', 'pediatrician', 'physician', 'politician', 'statistician', 'technician', 'beautician',
      'clinician', 'dietician', 'logician', 'mathematician', 'mortician', 'patrician'
    ],
    patterns: ['cian-suffix', 'shun-sound'],
    description: 'CIAN making SHUN sound'
  },
  {
    id: 117,
    category: 'P117: TURE Suffix',
    subPack: 'Advanced Patterns',
    words: [
      'adventure', 'agriculture', 'architecture', 'capture', 'creature', 'culture', 'departure', 'feature', 'fixture', 'fracture',
      'furniture', 'future', 'gesture', 'juncture', 'lecture', 'literature', 'manufacture', 'mature', 'mixture', 'moisture',
      'nature', 'nurture', 'pasture', 'picture', 'pleasure', 'posture', 'puncture', 'rupture', 'sculpture', 'signature',
      'structure', 'temperature', 'texture', 'torture', 'venture', 'vulture', 'denture', 'miniature', 'overture', 'suture'
    ],
    patterns: ['ture-suffix', 'cher-sound'],
    description: 'TURE making CHER sound'
  },
  {
    id: 118,
    category: 'P118: OUS Suffix',
    subPack: 'Advanced Patterns',
    words: [
      'anxious', 'cautious', 'conscious', 'continuous', 'curious', 'dangerous', 'delicious', 'enormous', 'fabulous', 'famous',
      'ferocious', 'furious', 'generous', 'glamorous', 'glorious', 'gorgeous', 'gracious', 'hazardous', 'hilarious', 'humorous',
      'jealous', 'joyous', 'luxurious', 'marvelous', 'monstrous', 'mysterious', 'nervous', 'nutritious', 'obvious', 'poisonous',
      'precious', 'previous', 'ridiculous', 'serious', 'spacious', 'studious', 'suspicious', 'tremendous', 'various', 'vigorous'
    ],
    patterns: ['ous-suffix'],
    description: 'OUS adjective suffix'
  },
  {
    id: 119,
    category: 'P119: ABLE/IBLE Suffix',
    subPack: 'Advanced Patterns',
    words: [
      'able', 'capable', 'comfortable', 'enjoyable', 'favorable', 'honorable', 'likeable', 'lovable', 'notable', 'profitable',
      'readable', 'reasonable', 'reliable', 'remarkable', 'renewable', 'responsible', 'valuable', 'visible', 'accessible', 'audible',
      'convertible', 'credible', 'edible', 'eligible', 'flexible', 'horrible', 'impossible', 'incredible', 'invisible', 'legible',
      'permissible', 'possible', 'reversible', 'sensible', 'terrible', 'visible'
    ],
    patterns: ['able-suffix', 'ible-suffix'],
    description: 'ABLE and IBLE suffixes'
  },
  {
    id: 120,
    category: 'P120: Contractions',
    subPack: 'Advanced Patterns',
    words: [
      'aren\'t', 'can\'t', 'couldn\'t', 'didn\'t', 'doesn\'t', 'don\'t', 'hadn\'t', 'hasn\'t', 'haven\'t', 'he\'d',
      'he\'ll', 'he\'s', 'I\'d', 'I\'ll', 'I\'m', 'I\'ve', 'isn\'t', 'it\'s', 'let\'s', 'mightn\'t',
      'mustn\'t', 'shan\'t', 'she\'d', 'she\'ll', 'she\'s', 'shouldn\'t', 'that\'s', 'there\'s', 'they\'d', 'they\'ll',
      'they\'re', 'they\'ve', 'wasn\'t', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'weren\'t', 'what\'s', 'who\'s',
      'won\'t', 'wouldn\'t', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve'
    ],
    patterns: ['contractions', 'apostrophe'],
    description: 'Common contractions'
  },
  {
    id: 121,
    category: 'P121: Compound Words - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'afternoon', 'airplane', 'anyone', 'anything', 'anywhere', 'backpack', 'baseball', 'basketball', 'bathroom', 'bedroom',
      'birthday', 'blackboard', 'bookshelf', 'breakfast', 'butterfly', 'campfire', 'cannot', 'classroom', 'cupcake', 'daylight',
      'doorbell', 'downtown', 'dragonfly', 'driveway', 'earring', 'earthquake', 'everything', 'everywhere', 'eyebrow', 'fingernail'
    ],
    patterns: ['compound-words'],
    description: 'Two words joined together'
  },
  {
    id: 122,
    category: 'P122: Compound Words - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'firefly', 'football', 'footprint', 'forever', 'goldfish', 'grandfather', 'grandmother', 'grapefruit', 'grasshopper', 'haircut',
      'handwriting', 'headache', 'highway', 'homework', 'honeybee', 'horseback', 'hotdog', 'jellyfish', 'keyboard', 'lighthouse',
      'lunchtime', 'mailbox', 'midnight', 'moonlight', 'motorcycle', 'notebook', 'outside', 'pancake', 'passport', 'peanut'
    ],
    patterns: ['compound-words'],
    description: 'More compound words'
  },
  {
    id: 123,
    category: 'P123: Homophones - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'ate-eight', 'bare-bear', 'blew-blue', 'brake-break', 'buy-by-bye', 'cell-sell', 'dear-deer', 'flour-flower', 'for-four', 'hair-hare',
      'heal-heel', 'hear-here', 'hole-whole', 'hour-our', 'knew-new', 'knight-night', 'know-no', 'made-maid', 'mail-male', 'meat-meet'
    ],
    patterns: ['homophones', 'sound-alikes'],
    description: 'Words that sound the same but mean different things'
  },
  {
    id: 124,
    category: 'P124: Homophones - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'one-won', 'pair-pear', 'peace-piece', 'plain-plane', 'read-red', 'right-write', 'road-rode', 'sea-see', 'son-sun', 'tail-tale',
      'their-there-they\'re', 'threw-through', 'to-too-two', 'wait-weight', 'way-weigh', 'weak-week', 'wear-where', 'weather-whether', 'wood-would', 'your-you\'re'
    ],
    patterns: ['homophones'],
    description: 'More challenging homophones'
  },
  {
    id: 125,
    category: 'P125: Prefixes - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'undo', 'unhappy', 'unfair', 'unable', 'unlock', 'untie', 'unpack', 'unwrap', 'unusual', 'unsafe',
      'replay', 'return', 'rebuild', 'rewrite', 'refill', 'repaint', 'retell', 'redo', 'reheat', 'rethink',
      'disagree', 'disappear', 'discover', 'dislike', 'disobey', 'displease', 'dishonest', 'disconnect', 'discontinue', 'disapprove'
    ],
    patterns: ['prefixes', 'un-prefix', 're-prefix', 'dis-prefix'],
    description: 'Common prefixes: UN, RE, DIS'
  },
  {
    id: 126,
    category: 'P126: Prefixes - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'preschool', 'preview', 'prefix', 'preheat', 'prehistoric', 'prejudge', 'precaution', 'prepay', 'pretest', 'preorder',
      'misplace', 'misspell', 'mistake', 'misunderstand', 'misbehave', 'misread', 'mislead', 'misfortune', 'misjudge', 'mistrust',
      'bicycle', 'triangle', 'unicycle', 'biweekly', 'bilingual', 'biannual', 'tripod', 'triple', 'tricycle', 'trio'
    ],
    patterns: ['prefixes', 'pre-prefix', 'mis-prefix', 'bi-tri-prefix'],
    description: 'Prefixes: PRE, MIS, BI, TRI'
  },
  {
    id: 127,
    category: 'P127: Suffixes - Pack 1',
    subPack: 'Advanced Patterns',
    words: [
      'careful', 'colorful', 'faithful', 'fearful', 'graceful', 'grateful', 'harmful', 'helpful', 'hopeful', 'joyful',
      'painful', 'peaceful', 'playful', 'powerful', 'skillful', 'successful', 'thankful', 'thoughtful', 'useful', 'wonderful',
      'careless', 'endless', 'fearless', 'harmless', 'helpless', 'homeless', 'hopeless', 'meaningless', 'needless', 'painless',
      'pointless', 'powerless', 'sleepless', 'thoughtless', 'timeless', 'useless', 'wireless', 'worthless'
    ],
    patterns: ['suffixes', 'ful-suffix', 'less-suffix'],
    description: 'Suffixes: FUL and LESS'
  },
  {
    id: 128,
    category: 'P128: Suffixes - Pack 2',
    subPack: 'Advanced Patterns',
    words: [
      'badly', 'barely', 'boldly', 'bravely', 'briefly', 'brightly', 'carefully', 'clearly', 'closely', 'coldly',
      'completely', 'correctly', 'differently', 'directly', 'easily', 'exactly', 'fairly', 'finally', 'freely', 'friendly',
      'gladly', 'gently', 'greatly', 'happily', 'hardly', 'honestly', 'kindly', 'lately', 'likely', 'lonely',
      'loudly', 'lovely', 'nearly', 'nicely', 'perfectly', 'politely', 'poorly', 'possibly', 'probably', 'properly',
      'quickly', 'quietly', 'rapidly', 'rarely', 'recently', 'safely', 'simply', 'slowly', 'smoothly', 'softly'
    ],
    patterns: ['suffixes', 'ly-suffix', 'adverbs'],
    description: 'LY suffix for adverbs'
  },
  {
    id: 129,
    category: 'P129: Suffixes - Pack 3',
    subPack: 'Advanced Patterns',
    words: [
      'action', 'addition', 'celebration', 'collection', 'condition', 'connection', 'correction', 'creation', 'decoration', 'direction',
      'discussion', 'education', 'election', 'imagination', 'information', 'instruction', 'invention', 'invitation', 'location', 'mention',
      'operation', 'pollution', 'population', 'position', 'prediction', 'production', 'protection', 'question', 'selection', 'solution',
      'station', 'subtraction', 'suggestion', 'vacation'
    ],
    patterns: ['suffixes', 'tion-suffix'],
    description: 'TION suffix making SHUN sound'
  },
  {
    id: 130,
    category: 'P130: Multi-Syllable Challenge Words',
    subPack: 'Advanced Patterns',
    words: [
      'absolutely', 'accidentally', 'accomplishment', 'adventurous', 'altogether', 'appreciate', 'approximately', 'automatically', 'beautiful', 'beginning',
      'believe', 'beneficial', 'bicycle', 'cafeteria', 'calendar', 'category', 'celebrate', 'chocolate', 'comfortable', 'community',
      'completely', 'concentrated', 'definitely', 'delicious', 'describe', 'develop', 'different', 'difficult', 'dinosaur', 'disappointing',
      'elementary', 'encouragement', 'especially', 'everyone', 'everything', 'excellent', 'excitement', 'experience', 'explanation', 'extraordinary',
      'favorite', 'fortable', 'fortunately', 'frequently', 'immediately', 'important', 'impossible', 'independence', 'information', 'interesting'
    ],
    patterns: ['multi-syllable', 'complex-words'],
    description: 'Complex multi-syllable words for advanced readers'
  }
];
