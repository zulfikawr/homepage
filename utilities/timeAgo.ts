export const getTimeAgo = (dateString: string): string => {
  // Validate date format (dd/mm/yyyy)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateString)) {
    console.error('Invalid date format. Expected: DD/MM/YYYY');
    return 'Invalid date';
  }

  try {
    // Parse the date string (dd/mm/yyyy)
    const [day, month, year] = dateString.split('/').map(Number);

    // Validate date components
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error('Invalid date components');
    }

    const postedDate = new Date(year, month - 1, day);

    // Validate if date is valid
    if (isNaN(postedDate.getTime())) {
      throw new Error('Invalid date');
    }

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
  } catch (error) {
    console.error('Error processing date:', error);
    return 'Invalid date';
  }
};
