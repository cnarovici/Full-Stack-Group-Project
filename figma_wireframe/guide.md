# CareerConnect - Full Stack Career Fair Platform

## Project Overview

**CareerConnect** is a comprehensive career fair management platform that connects students with employers through intelligent event discovery, personalized recommendations, and seamless networking opportunities. Our platform bridges the gap between traditional career fair platforms by offering advanced features like AI-powered event matching, real-time autocomplete search, and post-event follow-up systems.

### Project Goals
1. **Simplify Event Discovery**: Make it much simpler for students to find relevant career opportunities, workshops, and networking events through recommendations and searches posted by real employers
2. **Enhance Employer Reach**: Provide employers with the tools to connect with qualified student candidates making their such easier and talent pool of higher quality
3. **Facilitate Meaningful Connections**: Enable students and employers with the ability to network before, during, and after events
4. **Streamline the Recruiting Process**: Create a unified platform that handles all of the event registration, profile management, and employer follow-ups in one place

---

## Figma Wireframe

### Screenshots & Link

**Figma Project Link**: https://github.com/cnarovici/Full-Stack-Group-Project

#### 1. Landing Page (Loading Screen)

**Purpose**: This is the first point for users, allowing them to log in or register as employers or students

**Layout Rationale**:
- Clean, centered design that is simple to use and focused
- 2 distinct call-to-actions (CTA) that makes it simple for users to interact
- Clean purple gradiant background
- Our tagline "Connecting talent and opportunity - smarter" communicates the app's value

**User Flow**: Users land here and choose their registration path (Student or Employer), which determines which experience they will get

---

#### 2. Registration Page

**Purpose**: Allow users to register and collect useful user info that tailors to their experience

**Layout Rationale**:
- **Tab-based navigation**: Located at the top allows users to easily switch between user types and for ease of employer and student layouts
- **Progressive disclosure**: Only shows fields that are relevant to the specific type of user
- **Visual hierarchy**: The most important info (user email, password, name) appear first
- **Job preferences field**: Important as our app will allow students to browse for events which will be ranked by their interest and fields

---

#### 3A. Student Dashboard

**Purpose**: The "main page" where students can search events, access all their key actions, and discover potential reccommendations

**Layout Rationale**:
- **Search bar positioning**: Displayed prominently at the top, as this will be the primary action for most users when they want to search and register for events
- **4-card grid layout**: Simplifies the user experience, allowing for easy direction to what student users wish to do
- **Recommended Events section**: A page that will recommend events based on user skills, allowing for users to "browse" for events they may potentially be interested in

**Autocomplete Functionality**:
The search bar includes a dropdown that shows **4 suggestions in real time** as users search based on key words. This makes it easier for students to quickly find events they are looking for, if not they can be directed to the search page for a deeper dive.

#### 3B. Employer Dashboard

**Purpose**: The "main page" for employers, where they can interact and view applicants and post events, and manage recruitment

**Layout Rationale**:
- **"Post New Event" Action**: Located at the top as it is the primary employer action
- **Your Posted Events section**: Shows Event title, date, number of interested students (simple engagement metric) and the ability to view each applicant
- **Recent Messages section**: Displays the student inquiries and messages about the event posted or job postings

---

#### 4. Event Details Page

**Purpose**: Provides the comprehensive information provided by employers about a specific event and job

**Layout Rationale**:
- **Event title**: Primary header displays event name so students know which event
- **Company logos/names and info**: Both prominantly displayed next for students to see
- **Full description and tags**: Informs students quickly about useful key points, and full paragraph description that will explain what the event will entail
- **Large RSVP button**: Our main call to action done simply
- **Similar Events section**: Encourages students to explore other opportunities (the more the better!)

---

#### 5A. Student Profile Page

**Purpose**: Allows students to view their profile and edit information, and view registered events

**Layout Rationale**:
- **Profile header**: Prominently displays all the main information of the student
- **Section-based organization**: Organizes the information of the profile based on importance, Resume first as it is most likely to be accessed and updated, then skills and interests as tags, Job preferences next done similarly, finally events saved in a carousel
- **Edit Profile button**: Prominent and easy to access

---

#### 5B. Employer Profile Page

**Purpose**: Allows employers to to view their profile and edit information, view posted events to track easily, and view student messages and inquiries

**Layout Rationale**:
- **Profile header**: Prominently displays all the main information of the employer
- **Post-Event button**: Prominent and easy to access
- **Section-based organization**: Organizes the information of the employer in a simple column, listing events and inquries

---

#### 6. Extra Search Event Page

**Purpose**: A page that allows students to discover relevant events based on their searches if not found in the auto complete drop down

**Layout Rationale**:
- **Persistent search bar**: Displayed at the top allowing students to easily search again and again
- **Result count**: Provides transparent search result amount (hits)
- **Detailed event cards**: Shows each event and their related info for easy viewing and access
- **Full-page results**: Card based to provide easy scanning so students can easily access the events and their info quickly

## Assumptions & Design Constraints

### Assumptions
1. Students have resumes ready
2. Email-based authentication
3. Single school per student
4. Events are future-dated (Will need to remove and clean events that are past current date)
5. No payment processing but maybe a chance in the future to allow for companies to charge for certain events (will need to add filters for free and paid events potentially)

### Limitations
1. No real-time chat, messages are currently async
2. No calendar integration, as students will need to manually add events to calendar, unless they view the site (will show upcoming events)
3. No mobile app, web only
4. Single company per event, each event has one host

### Open Questions
1. Employer verification: How should we verify employer/company legitimacy?
2. Event capacity: Should we add event registration limits?
3. Any UI issues that seem counter-intuitive or unintuitive

## Future Improvements

1. Ability to schedule 1 on 1 meetings
2. Post-event follow ups that are seperate from private messages
3. More analytics for employers like demographic breakdowns for their events and if event is monetized, total profit
4. Ability for employers to add video embeds as an "intro video"