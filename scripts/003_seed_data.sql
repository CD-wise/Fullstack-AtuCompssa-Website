-- Seed department offerings
INSERT INTO department_offerings (title, description, icon, display_order) VALUES
('Bachelor of Technology', 'A comprehensive 4-year program focusing on advanced computer science concepts, software engineering, and research methodologies.', 'GraduationCap', 1),
('Higher National Diploma', 'An intensive 2-year program providing practical skills in programming, networking, and database management.', 'BookOpen', 2),
('Diploma Program', 'A foundational program introducing core computing concepts and preparing students for advanced studies.', 'Award', 3),
('Research & Innovation', 'Cutting-edge research facilities and opportunities for students to work on innovative projects.', 'Lightbulb', 4),
('Industry Partnerships', 'Strong connections with tech companies providing internship and job placement opportunities.', 'Building', 5),
('Modern Computer Labs', 'State-of-the-art laboratories equipped with the latest hardware and software.', 'Monitor', 6);

-- Seed sample staff
INSERT INTO staff (name, role, email, phone, staff_type, display_order) VALUES
('Dr. Emmanuel Adjei', 'Dean of Faculty', 'dean@university.edu', '+233 20 123 4567', 'dean', 1),
('Prof. Kwame Asante', 'Head of Department', 'hod.cs@university.edu', '+233 20 234 5678', 'hod', 2),
('Dr. Abena Mensah', 'Senior Lecturer', 'a.mensah@university.edu', '+233 20 345 6789', 'faculty', 3),
('Mr. Kofi Owusu', 'Lecturer', 'k.owusu@university.edu', '+233 20 456 7890', 'faculty', 4),
('Ms. Ama Serwaa', 'Department Secretary', 'secretary.cs@university.edu', '+233 20 567 8901', 'staff', 5);

-- Seed sample events
INSERT INTO events (title, description, event_date, event_time, location) VALUES
('Tech Innovation Summit 2025', 'Annual technology summit featuring industry experts, workshops, and networking opportunities for CS students.', '2025-02-15', '09:00', 'Main Auditorium'),
('Hackathon: Code for Change', 'A 24-hour coding competition focused on solving real-world problems with technology.', '2025-03-01', '08:00', 'Computer Science Building'),
('Guest Lecture: AI & Future', 'Distinguished lecture on Artificial Intelligence and its impact on society by Dr. James Chen from MIT.', '2025-01-20', '14:00', 'Lecture Hall B');

-- Seed sample announcements
INSERT INTO announcements (title, content, is_active) VALUES
('Registration Open for 2025 Academic Year', 'Student registration for the 2025/2026 academic year is now open. Visit the department office or register online.', true),
('New Computer Lab Opening', 'We are pleased to announce the opening of our new state-of-the-art computer laboratory in Block C.', true),
('Internship Opportunities', 'Several tech companies are offering internship positions. Check the notice board for details.', true);
