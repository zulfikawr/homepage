export const getTimeAgo = (dateString: string): string => {
  // Handle "Present" case from formatDateRange
  if (dateString === 'Present') {
    return 'Present';
  }

  // Handle invalid date strings
  if (dateString === 'Invalid Date') {
    return 'Invalid date';
  }

  try {
    // Parse the date string which could be in formats like:
    // "Jan 2023", "1 Jan 2023", "January 2023", etc.
    const parsedDate = new Date(dateString);

    // Validate if date is valid
    if (isNaN(parsedDate.getTime())) {
      // Try an alternative approach for formats like "Jan 2023" which might not parse directly
      const parts = dateString.split(' ');
      if (parts.length >= 2) {
        const month = parts[0];
        const year = parts[parts.length - 1];
        const tempDate = new Date(`${month} 1, ${year}`);
        if (!isNaN(tempDate.getTime())) {
          return calculateTimeDifference(tempDate);
        }
      }
      throw new Error('Invalid date format');
    }

    return calculateTimeDifference(parsedDate);
  } catch (error) {
    console.error('Error processing date:', error);
    return 'Invalid date';
  }
};

const calculateTimeDifference = (postedDate: Date): string => {
  const currentDate = new Date();

  // Set both dates to start of day for accurate comparison
  postedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Handle future dates
  if (postedDate > currentDate) {
    return 'In the future';
  }

  const timeDifference = currentDate.getTime() - postedDate.getTime();
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 1) {
    return `${days} days ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else {
    return 'Today';
  }
};
