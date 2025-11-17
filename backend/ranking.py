from models import Event, StudentProfile, StudentSkill
from collections import defaultdict, deque

def calculate_event_relevance_score(event, student_profile):
    """
    Calculate how relevant an event is to a student based on:
    1. Skills match
    2. Job preferences match
    3. Tags match
    
    Returns a score (higher = more relevant)
    """
    score = 0
    
    # Get student's skills
    student_skills = set([skill.skill_name.lower() for skill in student_profile.skills])
    
    # Get student's job preferences
    student_preferences = set()
    if student_profile.job_preferences:
        student_preferences = set([pref.strip().lower() for pref in student_profile.job_preferences.split(',')])
    
    # Get event tags
    event_tags = set()
    if event.tags:
        event_tags = set([tag.strip().lower() for tag in event.tags.split(',')])
    
    # Score based on skills match
    skills_match = student_skills.intersection(event_tags)
    score += len(skills_match) * 3  # Weight: 3 points per skill match
    
    # Score based on job preferences match
    preferences_match = student_preferences.intersection(event_tags)
    score += len(preferences_match) * 5  # Weight: 5 points per preference match
    
    # Bonus for exact title matches
    event_title_words = set(event.title.lower().split())
    title_match = student_preferences.intersection(event_title_words) or student_skills.intersection(event_title_words)
    score += len(title_match) * 2  # Weight: 2 points per title word match
    
    return score


def topological_sort_events(events, student_profile):
    """
    Sort events using topological sort based on relevance scores.
    Events with higher relevance come first.
    
    Returns: List of events sorted by relevance (highest first)
    """
    # Calculate scores for all events
    event_scores = []
    for event in events:
        score = calculate_event_relevance_score(event, student_profile)
        event_scores.append((event, score))
    
    # Sort by score (descending) - higher scores first
    event_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Return just the events (without scores)
    return [event for event, score in event_scores]


def build_event_dependency_graph(events, student_profile):
    """
    Advanced: Build a directed graph where events depend on prerequisites
    (e.g., "Advanced ML" depends on "Intro to ML")
    
    For now, we just use relevance scores, but this can be extended
    for more complex ranking logic.
    """
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    # Calculate relevance scores
    event_scores = {}
    for event in events:
        score = calculate_event_relevance_score(event, student_profile)
        event_scores[event.id] = score
        in_degree[event.id] = 0
    
    # Build dependency graph based on scores
    # Higher score events should come before lower score events
    sorted_events = sorted(events, key=lambda e: event_scores[e.id], reverse=True)
    
    for i, event in enumerate(sorted_events):
        for j in range(i + 1, len(sorted_events)):
            if event_scores[event.id] > event_scores[sorted_events[j].id]:
                graph[event.id].append(sorted_events[j].id)
                in_degree[sorted_events[j].id] += 1
    
    # Perform topological sort using Kahn's algorithm
    queue = deque([event_id for event_id in in_degree if in_degree[event_id] == 0])
    sorted_event_ids = []
    
    while queue:
        event_id = queue.popleft()
        sorted_event_ids.append(event_id)
        
        for neighbor in graph[event_id]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Map back to event objects
    event_map = {event.id: event for event in events}
    return [event_map[event_id] for event_id in sorted_event_ids if event_id in event_map]