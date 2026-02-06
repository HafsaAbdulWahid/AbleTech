import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Pages/UserDashboard/UserContext";
import { VoiceAssistantProvider } from "./Pages/VoiceAssistant/VoiceAssistantProvider";
import LoginForm from "./Pages/Authentication/LoginForm";
import RegisterParent from "./Pages/Authentication/RegisterParent";
import UserDashboard from "./Pages/UserDashboard/UserDashboard";
import UserDetailsFormParent from "./Pages/Authentication/UserDetailsFormParent";
import UserDetailsForm2 from "./Pages/Authentication/UserDetailsForm2";
import JobDetails from "./Pages/UserDashboard/JobDetails";
import Jobs from "./Pages/UserDashboard/Jobs";
import UserNotifications from "./Pages/UserDashboard/UserNotifications";
import AllJobs from "./Pages/UserDashboard/AllJobs";
import AssistiveTechAll from "./Pages/UserDashboard/AssistiveTechAll";
import HomeMain from "./Pages/HomePage/HomeMain";
import AboutAbleTech from "./Pages/HomePage/AboutAbleTech";
import MotivationalSessions from "./Pages/UserDashboard/MotivationalSessions";
import TrainerDashboard from "./Pages/TrainerDashboard/TrainerDashboard";
import ViewRegisteredUsers from "./Pages/TrainerDashboard/MyTrainees";
import CreateTrainingProgram from "./Pages/TrainerDashboard/CreateTrainingProgram";
import TrackUserTraining from "./Pages/TrainerDashboard/Progress";
import ManageTrainingPrograms from "./Pages/TrainerDashboard/ProgramManagement";
import ContentManagement from "./Pages/TrainerDashboard/ContentManagement";
import TrainingPrograms from "./Pages/TrainerDashboard/TrainingPrograms";
import ProgramDetails from "./Pages/TrainerDashboard/ProgramDetails";
import Quiz from "./Pages/TrainerDashboard/Quiz";
import UserProfile from "./Pages/UserDashboard/UserProfile";
import TrainerDetailsForm from "./Pages/Authentication/TrainerDetailsForm";
import RecruiterDashboard from "./Pages/RecruiterDashboard/RecruiterDashboard";
import PostJob from "./Pages/RecruiterDashboard/PostJob";
import JobListings from "./Pages/RecruiterDashboard/JobListings";
import DepartmentwiseJobs from "./Pages/RecruiterDashboard/DepartmentwiseJobs";
import RecruiterJobDetails from "./Pages/RecruiterDashboard/RecruiterJobDetails";
import ViewJobApplications from "./Pages/RecruiterDashboard/ViewJobApplications";
import TrackJobApplications from "./Pages/RecruiterDashboard/TrackJobApplications";
import RecruiterNotifications from "./Pages/RecruiterDashboard/RecruiterNotifications";
import ChatBot from "./Pages/Chatbot/Chatbot";
import TrainerNotifications from "./Pages/TrainerDashboard/TrainerNotifications";
import RecruiterDetailsForm from "./Pages/Authentication/RecruiterDetailsForm";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import AdminNotifications from "./Pages/AdminDashboard/AdminNotifications";
import AssistiveTechAdmin from "./Pages/AdminDashboard/AssistiveTechAdmin";
import MotivationalSessionsAdmin from "./Pages/AdminDashboard/MotivationalSessionsAdmin";
import AdminJobListings from "./Pages/AdminDashboard/AdminJobListings";
import Applications from "./Pages/AdminDashboard/Applications";
import TraineeProgress from "./Pages/AdminDashboard/TraineeProgress";
import TrainingProgramsAdmin from "./Pages/AdminDashboard/TrainingProgramsAdmin";
import UserTrainingPrograms from "./Pages/UserDashboard/UserTrainingPrograms";
import UserProgramDetails from "./Pages/UserDashboard/UserProgramDetails";
import MockInterview from "./Pages/InterviewPreparation/MockInterview";
import CommunityForum from "./Pages/UserDashboard/CommunityForum";
import CourseQuiz from "./Pages/TrainerDashboard/Coursequiz";



export default function App() {
  return (
    <ChakraProvider>
      <UserProvider>
        <VoiceAssistantProvider
          onChatbotToggle={(isOpen) => {
            console.log('Chatbot toggled:', isOpen);
          }}
        >
          <Routes>

            {/* HomePage */}
            <Route path="/" element={<HomeMain />} />
            <Route path="/about-us" element={<AboutAbleTech />} />







            {/* User Dashboard */}
            <Route path="about" element={<AboutAbleTech />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterParent />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/user-details/*" element={<UserDetailsFormParent />} />
            <Route path="/education-details/*" element={<UserDetailsForm2 />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/user-notifications" element={<UserNotifications />} />
            <Route path="/all-jobs" element={<AllJobs />} />
            <Route path="/assistive-tech" element={<AssistiveTechAll />} />
            <Route path="/motivational-sessions" element={<MotivationalSessions />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/user-training-programs" element={<UserTrainingPrograms />} />
            <Route path="/user-program-details" element={<UserProgramDetails />} />
            <Route path="/ai-interview" element={<MockInterview />} />
            <Route path="/community-forum" element={<CommunityForum />} />


            

            {/* Trainer Dashboard */}
            <Route path="/trainer-details" element={<TrainerDetailsForm />} />
            <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
            <Route path="/registered-users" element={<ViewRegisteredUsers />} />
            <Route path="/create-training" element={<CreateTrainingProgram />} />
            <Route path="/track-training" element={<TrackUserTraining />} />
            <Route path="/manage-training" element={<ManageTrainingPrograms />} />
            <Route path="/program-management" element={<ManageTrainingPrograms />} />
            <Route path="/content-management" element={<ContentManagement />} />
            <Route path="/training-programs" element={<TrainingPrograms />} />
            <Route path="/program-details" element={<ProgramDetails />} />
            <Route path="/trainer-notifications" element={<TrainerNotifications />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/course-quiz" element={<CourseQuiz />} />
            



            {/* Recruiter Dashboard */}
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/job-listings" element={<JobListings />} />
            <Route path="/department-jobs/:department" element={<DepartmentwiseJobs />} />
            <Route path="/recruiter-job-details/:department/:jobId" element={<RecruiterJobDetails />} />
            <Route path="/view-job-applications" element={<ViewJobApplications />} />
            <Route path="/track-job-applications" element={<TrackJobApplications />} />
            <Route path="/recruiter-notifications" element={<RecruiterNotifications />} />
            <Route path="/recruiter-details" element={<RecruiterDetailsForm />} />
            {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}

            {/* Admin Dashboard */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/assistive-tech-for-admin" element={<AssistiveTechAdmin />} />
            <Route path="/admin-job-listings" element={<AdminJobListings />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/training-programs-for-admin" element={<TrainingProgramsAdmin />} />
            <Route path="/trainee-progress" element={<TraineeProgress programId={0} onBack={() => { }} />} />
            <Route path="/motivational-sessions-for-admin" element={<MotivationalSessionsAdmin />} />
            <Route path="/admin-notifications" element={<AdminNotifications />} />
          </Routes>
        </VoiceAssistantProvider>
      </UserProvider>
    </ChakraProvider>
  );
}
