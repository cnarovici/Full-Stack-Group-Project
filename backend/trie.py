class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
        self.data = []  # Store event/company IDs or objects


class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word, data_id):
        """Insert a word into the trie with associated data"""
        node = self.root
        word = word.lower()
        
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.is_end_of_word = True
        if data_id not in node.data:
            node.data.append(data_id)
    
    def search(self, word):
        """Search for exact word match"""
        node = self.root
        word = word.lower()
        
        for char in word:
            if char not in node.children:
                return []
            node = node.children[char]
        
        return node.data if node.is_end_of_word else []
    
    def starts_with(self, prefix):
        """Find all words/data that start with the given prefix"""
        node = self.root
        prefix = prefix.lower()
        
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        
        # Collect all data from this node and its descendants
        return self._collect_all_data(node)
    
    def _collect_all_data(self, node):
        """Helper method to collect all data from a node and its descendants"""
        results = []
        
        if node.is_end_of_word:
            results.extend(node.data)
        
        for child in node.children.values():
            results.extend(self._collect_all_data(child))
        
        return list(set(results))  # Remove duplicates


# Global Trie instances
event_trie = Trie()
company_trie = Trie()
skill_trie = Trie()


def build_event_trie():
    """Build/rebuild the event search trie"""
    global event_trie
    event_trie = Trie()
    
    events = Event.query.all()
    for event in events:
        # Index by title words
        for word in event.title.split():
            event_trie.insert(word, event.id)
        
        # Index by tags
        if event.tags:
            for tag in event.tags.split(','):
                event_trie.insert(tag.strip(), event.id)
        
        # Index by company name
        if event.employer:
            event_trie.insert(event.employer.company_name, event.id)


def build_company_trie():
    """Build/rebuild the company search trie"""
    global company_trie
    company_trie = Trie()
    
    employers = EmployerProfile.query.all()
    for employer in employers:
        # Index by company name words
        for word in employer.company_name.split():
            company_trie.insert(word, employer.id)
        
        # Index by industry
        if employer.industry:
            company_trie.insert(employer.industry, employer.id)


def build_skill_trie():
    """Build/rebuild the skill search trie"""
    global skill_trie
    skill_trie = Trie()
    
    skills = StudentSkill.query.all()
    for skill in skills:
        skill_trie.insert(skill.skill_name, skill.student_id)