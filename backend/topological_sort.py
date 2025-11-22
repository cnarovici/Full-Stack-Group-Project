from collections import defaultdict, deque

def topological_sort_events(events, student_profile):
    """
    Sort events based on student's skills and job preferences using topological sort.
    Events with more matching tags get higher priority.
    
    Args:
        events: List of Event objects
        student_profile: StudentProfile object with skills and job_preferences
        
    Returns:
        List of sorted events (most relevant first)
    """
    if not events:
        return []
    
    # Get student's interests (skills + job preferences)
    student_skills = set(skill.skill_name.lower() for skill in student_profile.skills)
    student_prefs = set(pref.lower() for pref in (student_profile.job_preferences.split(',') if student_profile.job_preferences else []))
    student_interests = student_skills | student_prefs
    
    print(f"🎯 Student interests: {student_interests}")
    
    if not student_interests:
        # No preferences, return events sorted by date
        return sorted(events, key=lambda e: e.event_date)
    
    # Calculate relevance score for each event
    event_scores = []
    
    for event in events:
        # Get event tags
        event_tags = set(tag.lower().strip() for tag in (event.tags.split(',') if event.tags else []))
        
        # Calculate match score
        matches = student_interests & event_tags
        match_score = len(matches)
        
        # Bonus points for company name match with job preferences
        company_name_lower = event.employer.company_name.lower() if event.employer else ""
        industry_lower = event.employer.industry.lower() if event.employer and event.employer.industry else ""
        
        for pref in student_prefs:
            if pref in company_name_lower or pref in industry_lower:
                match_score += 2  # Bonus for industry/company match
        
        event_scores.append({
            'event': event,
            'score': match_score,
            'matches': matches
        })
        
        print(f"📊 Event '{event.title}': score={match_score}, matches={matches}")
    
    # Sort by score (descending), then by date
    sorted_events = sorted(
        event_scores,
        key=lambda x: (-x['score'], x['event'].event_date)
    )
    
    return [item['event'] for item in sorted_events]


def get_personalized_events(events, student_profile, limit=None):
    """
    Get personalized event recommendations for a student.
    
    Args:
        events: List of all Event objects
        student_profile: StudentProfile object
        limit: Optional maximum number of events to return
        
    Returns:
        List of Event objects sorted by relevance
    """
    sorted_events = topological_sort_events(events, student_profile)
    
    if limit:
        return sorted_events[:limit]
    
    return sorted_events