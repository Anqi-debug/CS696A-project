const cron = require('node-cron');
const Project = require('./models/Project');

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const currentDate = new Date();

    // Find all projects that are past their endDate and meet the funding goal
    const projectsToUpdate = await Project.updateMany(
      {
        endDate: { $lt: currentDate },
        amountRaised: { $gte: fundingGoal },
        status: 'active' // Only update active projects
      },
      { status: 'completed' } // Set status to completed
    );

    console.log(`Updated ${projectsToUpdate.nModified} projects to completed status.`);
  } catch (error) {
    console.error('Error updating project statuses:', error);
  }
});
