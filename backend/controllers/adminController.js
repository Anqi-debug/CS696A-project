const Project = require('../models/project');
const Notification = require('../models/notification');

// List all pending fundraiser applications
exports.getPendingFundraisers = async (req, res) => {
  try {
    const fundraisers = await Project.find({ status: 'Pending' })
      .populate('creatorId', 'name portfolioItems') // Fetch creator's name and portfolio
      .select('campaignName description goalAmount portfolio status');

    res.status(200).json({ fundraisers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending fundraisers' });
  }
};

// Approve a fundraiser
exports.approveFundraiser = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }

    project.status = 'Approved';
    await project.save();

    // Notify the creator
    const notification = new Notification({
      recipientId: project.creatorId,
      message: `Your fundraiser "${project.campaignName}" has been approved!`
    });
    await notification.save();

    res.status(200).json({ message: 'Fundraiser approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve fundraiser' });
  }
};

// Reject a fundraiser
exports.rejectFundraiser = async (req, res) => {
  const { projectId } = req.params;
  const { rejectionReason } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }

    project.status = 'Rejected';
    project.rejectionReason = rejectionReason;
    await project.save();

    // Notify the creator
    const notification = new Notification({
      recipientId: project.creatorId,
      message: `Your fundraiser "${project.campaignName}" has been rejected. Reason: ${rejectionReason}`
    });
    await notification.save();

    res.status(200).json({ message: 'Fundraiser rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject fundraiser' });
  }
};
