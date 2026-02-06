export interface NotificationData {
  type: 'job' | 'profile' | 'application' | 'general' | 'training';
  icon: string;
  title: string;
  message: string;
  priority?: 'high' | 'medium' | 'low';
  programId?: number;
}

export const addNotification = (notificationData: NotificationData) => {
  const existingNotifications = getNotifications();
  
  const newNotification = {
    id: Date.now(),
    ...notificationData,
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    isRead: false
  };
  
  const updatedNotifications = [newNotification, ...existingNotifications];
  
  saveNotifications(updatedNotifications);
  
  return newNotification;
};

export const getNotifications = () => {
  try {
    const stored = sessionStorage.getItem('userNotifications');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
};

export const saveNotifications = (notifications: any[]) => {
  try {
    sessionStorage.setItem('userNotifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

export const createJobNotification = (jobTitle: string, department: string) => {
  addNotification({
    type: 'job',
    icon: 'FaBriefcase',
    title: 'New Job Posted',
    message: `A new position for ${jobTitle} in ${department} has been posted. Check it out!`,
    priority: 'high'
  });
};

export const createTechNotification = (techTitle: string, category: string) => {
  addNotification({
    type: 'training',
    icon: 'FiBookOpen',
    title: 'New Assistive Technology Added',
    message: `${techTitle} has been added to the ${category} catalog. Explore this new technology!`,
    priority: 'medium'
  });
};

export const createSessionNotification = (sessionTitle: string, speaker: string, date: string) => {
  addNotification({
    type: 'training',
    icon: 'FaGraduationCap',
    title: 'New Motivational Session',
    message: `"${sessionTitle}" by ${speaker} scheduled for ${date}. Don't miss it!`,
    priority: 'medium'
  });
};

export const createTrainingProgramNotification = (programTitle: string, trainerName: string, category: string, programId: number) => {
  addNotification({
    type: 'training',
    icon: 'FiBookOpen',
    title: 'New Training Program Available',
    message: `${trainerName} has launched a new ${category} training program: "${programTitle}". Enroll now to enhance your skills!`,
    priority: 'high',
    programId: programId
  });
};