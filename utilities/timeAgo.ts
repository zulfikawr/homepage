export const getTimeAgo = (date: string | number | Date): string => {
  // Handle "Present" case from formatDateRange
  if (date === 'Present') {
    return 'Present';
  }

  // Handle invalid date strings
  if (date === 'Invalid Date') {
    return 'Invalid date';
  }

  try {
    let parsedDate: Date;

    if (date instanceof Date) {
      parsedDate = date;
    } else if (typeof date === 'number') {
      parsedDate = new Date(date);
    } else {
      // Parse the date string
      parsedDate = new Date(date);

      // Validate if date is valid
      if (isNaN(parsedDate.getTime())) {
        // Try an alternative approach for formats like "Jan 2023" which might not parse directly
        const parts = date.split(' ');
        if (parts.length >= 2) {
          const month = parts[0];
          const year = parts[parts.length - 1];
          const tempDate = new Date(`${month} 1, ${year}`);
          if (!isNaN(tempDate.getTime())) {
            parsedDate = tempDate;
          } else {
            throw new Error('Invalid date format');
          }
        } else {
          throw new Error('Invalid date format');
        }
      }
    }

    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }

    return calculateTimeDifference(parsedDate);
  } catch {
    return 'Invalid date';
  }
};

const calculateTimeDifference = (postedDate: Date): string => {
  const currentDate = new Date();

  // Handle future dates
  if (postedDate > currentDate) {
    return 'In the future';
  }

  const timeDifference = currentDate.getTime() - postedDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};
