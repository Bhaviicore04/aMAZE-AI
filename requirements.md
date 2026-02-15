# Requirements Document

## Introduction

aMAZE AI is a modern, AI-powered web application designed to serve two distinct user types: Content Creators and Content Consumers. The platform leverages generative AI to provide content discovery, idea generation, productivity tracking, and reflection tools. Content Creators receive AI-powered content ideas, trending topics, and productivity planning tools, while Content Consumers get personalized content feeds, smart recommendations, and AI-assisted reflection capabilities.

## Glossary

- **System**: The aMAZE AIweb application
- **User**: Any authenticated person using the platform (Creator or Consumer)
- **Content_Creator**: A user who creates content for social media platforms
- **Content_Consumer**: A user who consumes and learns from content
- **AI_Engine**: The generative AI service that powers idea generation, summarization, and recommendations
- **Reflection**: User-generated summary and insights from consumed content
- **Vision_Board**: User's collection of goals, inspiration, and motivational notes
- **Productivity_Score**: Calculated metric representing user activity and consistency
- **Trending_Topic**: Popular content theme identified by the AI_Engine
- **Content_Feed**: Personalized stream of content recommendations
- **Admin_Panel**: Administrative interface for monitoring platform metrics

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to authenticate using multiple methods, so that I can securely access the platform with my preferred login option.

#### Acceptance Criteria

1. WHEN a user selects Google authentication, THE Authentication_Service SHALL authenticate the user via Google OAuth
2. WHEN a user provides email and password, THE Authentication_Service SHALL authenticate the user via email/password credentials
3. WHEN authentication succeeds, THE System SHALL create or retrieve the user record from Firestore
4. WHEN authentication fails, THE System SHALL display a descriptive error message
5. THE System SHALL maintain user session state across page refreshes

### Requirement 2: User Onboarding and Role Selection

**User Story:** As a new user, I want to select my role during onboarding, so that the platform can provide me with the appropriate dashboard and features.

#### Acceptance Criteria

1. WHEN a user completes authentication for the first time, THE System SHALL display a role selection interface
2. WHEN a user selects "I am a Content Creator", THE System SHALL store the role as "creator" in Firestore
3. WHEN a user selects "I am a Content Consumer", THE System SHALL store the role as "consumer" in Firestore
4. WHEN a user completes role selection, THE System SHALL redirect them to the appropriate dashboard
5. WHEN a returning user logs in, THE System SHALL load their stored role and display the corresponding dashboard

### Requirement 3: AI Content Idea Generation

**User Story:** As a Content Creator, I want to generate AI-powered content ideas based on my niche and audience, so that I can create engaging content consistently.

#### Acceptance Criteria

1. WHEN a Content_Creator provides niche, interests, and target audience, THE AI_Engine SHALL generate relevant content ideas
2. WHEN generating ideas, THE AI_Engine SHALL include short-form content ideas for Reels and Shorts
3. WHEN generating ideas, THE AI_Engine SHALL include long-form content ideas for YouTube and Blogs
4. WHEN generating ideas, THE AI_Engine SHALL include carousel and post ideas for social media
5. WHEN generating ideas, THE AI_Engine SHALL source from both trending content and new AI-generated concepts
6. WHEN ideas are generated, THE System SHALL display them with titles, hooks, and captions
7. WHEN a Content_Creator saves an idea, THE System SHALL store it in the contentIdeas collection in Firestore

### Requirement 4: Trending Topics Display

**User Story:** As a Content Creator, I want to view AI-curated trending topics filtered by niche, so that I can stay current with my audience's interests.

#### Acceptance Criteria

1. WHEN a Content_Creator accesses the trending topics section, THE AI_Engine SHALL provide curated trending topics
2. WHEN displaying trending topics, THE System SHALL support filtering by niche categories including Tech, Fashion, Gaming, Education, and Mental Health
3. WHEN a Content_Creator selects a niche filter, THE System SHALL display only topics relevant to that niche
4. THE System SHALL update trending topics data periodically to maintain relevance

### Requirement 5: Goals and Vision Management

**User Story:** As a Content Creator, I want to set goals and maintain a vision board, so that I can track my aspirations and stay motivated.

#### Acceptance Criteria

1. WHEN a Content_Creator adds a goal, THE System SHALL store it in the visionBoards collection with goal type and target metrics
2. WHEN a Content_Creator uploads an inspiration image, THE System SHALL store the image reference in Firestore
3. WHEN a Content_Creator saves a motivational note, THE System SHALL persist it to the visionBoards collection
4. WHEN a Content_Creator views their vision board, THE System SHALL display all goals, images, and notes
5. THE System SHALL support goal types including Subscribers, Brand Deals, and Posting Frequency

### Requirement 6: Content Productivity Planner

**User Story:** As a Content Creator, I want to plan my content schedule with a visual calendar, so that I can maintain consistency and track my productivity.

#### Acceptance Criteria

1. WHEN a Content_Creator accesses the planner, THE System SHALL display a weekly calendar interface
2. WHEN a Content_Creator adds a content item to the calendar, THE System SHALL store it in the schedules collection
3. WHEN a Content_Creator marks content as posted, THE System SHALL update the status in Firestore
4. WHEN viewing the calendar, THE System SHALL distinguish between planned and posted content visually
5. THE System SHALL calculate and display a consistency score based on planned versus posted content ratio

### Requirement 7: Creator Analytics Dashboard

**User Story:** As a Content Creator, I want to view my productivity analytics, so that I can understand my performance and improve my consistency.

#### Acceptance Criteria

1. WHEN a Content_Creator accesses analytics, THE System SHALL calculate and display a weekly productivity score
2. WHEN calculating productivity, THE System SHALL track the content creation streak in days
3. WHEN displaying analytics, THE System SHALL show goal completion percentage
4. THE System SHALL persist analytics data in the analytics collection in Firestore
5. THE System SHALL update analytics metrics in real-time as the Content_Creator completes activities

### Requirement 8: Personalized Content Feed

**User Story:** As a Content Consumer, I want to receive a personalized content feed based on my interests, so that I can discover high-quality content relevant to me.

#### Acceptance Criteria

1. WHEN a Content_Consumer provides their interests, THE System SHALL store them in the user profile
2. WHEN generating the content feed, THE AI_Engine SHALL curate content based on stored interests
3. WHEN displaying content, THE System SHALL organize it by categories
4. THE System SHALL exclude low-quality or irrelevant content from the feed
5. WHEN a Content_Consumer interacts with content, THE System SHALL record the interaction for future recommendations

### Requirement 9: Smart Recommendation Engine

**User Story:** As a Content Consumer, I want to receive smart content recommendations, so that I can discover content aligned with my preferences and behavior.

#### Acceptance Criteria

1. WHEN generating recommendations, THE AI_Engine SHALL analyze the Content_Consumer's watch history
2. WHEN generating recommendations, THE AI_Engine SHALL consider saved content preferences
3. WHEN generating recommendations, THE AI_Engine SHALL factor in interaction types including likes, saves, and shares
4. WHEN recommendations are generated, THE System SHALL display them in the content feed
5. THE System SHALL update recommendations dynamically as user behavior changes

### Requirement 10: AI Reflection Assistant

**User Story:** As a Content Consumer, I want to reflect on content I've consumed with AI assistance, so that I can extract meaningful insights and action steps.

#### Acceptance Criteria

1. WHEN a Content_Consumer completes consuming content, THE System SHALL offer a reflection option
2. WHEN a Content_Consumer provides a summary of what they learned, THE AI_Engine SHALL generate an enhanced summary
3. WHEN generating reflections, THE AI_Engine SHALL provide actionable next steps
4. WHEN generating reflections, THE AI_Engine SHALL create discussion prompts
5. WHEN a reflection is completed, THE System SHALL store it in the reflections collection in Firestore
6. THE System SHALL provide an AI chat interface for discussing learning and improvement topics
7. WHEN a Content_Consumer engages in AI chat, THE AI_Engine SHALL provide contextual responses based on the consumed content

### Requirement 11: Consumer Productivity Tracking

**User Story:** As a Content Consumer, I want to track my content consumption time, so that I can understand my productivity patterns and optimize my learning.

#### Acceptance Criteria

1. WHEN a Content_Consumer consumes content, THE System SHALL track the time spent
2. WHEN tracking time, THE System SHALL categorize it as productive or non-productive based on content type
3. WHEN a week completes, THE System SHALL generate a weekly productivity report
4. THE System SHALL display total time spent consuming content in the dashboard
5. THE System SHALL persist productivity data in the analytics collection in Firestore

### Requirement 12: Consumer Vision Board

**User Story:** As a Content Consumer, I want to maintain a vision board with learning goals and skill roadmaps, so that I can track my personal development journey.

#### Acceptance Criteria

1. WHEN a Content_Consumer adds a learning goal, THE System SHALL store it in the visionBoards collection
2. WHEN a Content_Consumer creates a skill-building roadmap, THE System SHALL persist the roadmap structure
3. WHEN viewing the vision board, THE System SHALL display all learning goals and roadmaps
4. THE System SHALL support progress tracking for each goal and roadmap item
5. WHEN a Content_Consumer updates progress, THE System SHALL reflect changes in real-time

### Requirement 13: Theme and UI Customization

**User Story:** As a user, I want to toggle between dark and light modes, so that I can use the platform comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user toggles the theme, THE System SHALL switch between dark mode and light mode
2. WHEN the theme changes, THE System SHALL persist the preference to the user profile
3. WHEN a user returns to the platform, THE System SHALL load their saved theme preference
4. THE System SHALL apply the theme consistently across all pages and components
5. THE System SHALL use smooth transitions when switching themes

### Requirement 14: Responsive Design

**User Story:** As a user, I want the platform to work seamlessly on mobile devices, so that I can access it from any device.

#### Acceptance Criteria

1. WHEN a user accesses the platform on a mobile device, THE System SHALL display a mobile-optimized layout
2. WHEN a user accesses the platform on a tablet, THE System SHALL display a tablet-optimized layout
3. WHEN a user accesses the platform on a desktop, THE System SHALL display a desktop-optimized layout
4. THE System SHALL maintain full functionality across all device sizes
5. WHEN the viewport size changes, THE System SHALL adapt the layout responsively

### Requirement 15: Admin Panel Monitoring

**User Story:** As an administrator, I want to monitor platform metrics, so that I can understand user engagement and platform health.

#### Acceptance Criteria

1. WHEN an administrator accesses the admin panel, THE System SHALL display total Content_Creator productivity metrics
2. WHEN displaying admin metrics, THE System SHALL show total Content_Consumer learning statistics
3. WHEN displaying admin metrics, THE System SHALL show engagement metrics across the platform
4. THE System SHALL aggregate data from the analytics collection for admin reporting
5. THE System SHALL restrict admin panel access to users with administrator privileges

### Requirement 16: Data Persistence and Synchronization

**User Story:** As a user, I want my data to be automatically saved and synchronized, so that I never lose my work and can access it from any device.

#### Acceptance Criteria

1. WHEN a user creates or modifies data, THE System SHALL persist changes to Firestore immediately
2. WHEN a user accesses the platform from a different device, THE System SHALL load their synchronized data
3. IF a network error occurs during save, THEN THE System SHALL retry the operation and notify the user
4. THE System SHALL maintain data consistency across all user sessions
5. WHEN multiple devices are active, THE System SHALL synchronize changes in real-time

### Requirement 17: UI Animations and Interactions

**User Story:** As a user, I want smooth animations and modern interactions, so that the platform feels polished and engaging.

#### Acceptance Criteria

1. WHEN cards are displayed, THE System SHALL animate them with smooth entrance transitions
2. WHEN a user interacts with buttons and controls, THE System SHALL provide visual feedback
3. WHEN navigating between pages, THE System SHALL use smooth page transitions
4. THE System SHALL use animations that complete within 300ms to maintain responsiveness
5. WHEN animations are active, THE System SHALL maintain 60fps performance

### Requirement 18: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages and feedback, so that I understand what's happening and can resolve issues.

#### Acceptance Criteria

1. WHEN an error occurs, THE System SHALL display a user-friendly error message
2. WHEN an operation succeeds, THE System SHALL provide confirmation feedback
3. WHEN a long operation is in progress, THE System SHALL display a loading indicator
4. IF Firestore connection fails, THEN THE System SHALL notify the user and suggest retry actions
5. IF AI_Engine fails to generate content, THEN THE System SHALL display an error and allow retry
