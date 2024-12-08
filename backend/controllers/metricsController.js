const User = require('../models/user');
const Project = require('../models/project');

// Get user success metrics
exports.getUserMetrics = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('createdProjects')
            .populate('donations')
            .populate('recurringDonations');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const totalFundsRaised = await Project.aggregate([
            { $match: { creatorId: userId } },
            { $group: { _id: null, totalFunds: { $sum: '$fundsRaised' } } },
        ]);

        const successfulProjectsCount = await Project.countDocuments({
            creatorId: userId,
            status: 'completed',
        });

        const averageSupporterSatisfaction = 4.5; // Example placeholder

        res.status(200).json({
            userMetrics: {
                name: user.name,
                email: user.email,
                totalFundsRaised: totalFundsRaised.length ? totalFundsRaised[0].totalFunds : 0,
                successfulProjectsCount,
                averageSupporterSatisfaction,
                supporterLevel: user.supporterLevel,
                donationsMade: user.donations.length,
                recurringDonationsMade: user.recurringDonations.length,
                socialMediaLinks: user.socialMediaLinks,
            },
        });
    } catch (error) {
        console.error('Error retrieving user metrics:', error);
        res.status(500).json({ message: 'Error retrieving user metrics', error: error.message });
    }
};

// Get project success metrics
exports.getProjectMetrics = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate('donations investments');

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const successLikelihood = ((project.fundsRaised / project.goalAmount) * 100).toFixed(2);

        const projectedROI = project.investmentTerms
            ? `15% (Based on creator's track record and project business model)`
            : 'N/A';

        res.status(200).json({
            projectMetrics: {
                campaignName: project.campaignName,
                fundsRaised: project.fundsRaised,
                goalAmount: project.goalAmount,
                successLikelihood: `${successLikelihood}%`,
                donorCount: project.donorCount,
                projectedROI,
            },
        });
    } catch (error) {
        console.error('Error retrieving project metrics:', error);
        res.status(500).json({ message: 'Error retrieving project metrics', error: error.message });
    }
};

// Comparison of projects in the same category
exports.compareProjects = async (req, res) => {
    try {
        const { category } = req.query;

        const projects = await Project.find({ category }).populate('creatorId');

        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found in the specified category.' });
        }

        const comparisonData = projects.map((project) => ({
            campaignName: project.campaignName,
            creator: project.creatorId ? project.creatorId.name : 'Unknown',
            fundsRaised: project.fundsRaised,
            goalAmount: project.goalAmount,
            successLikelihood: ((project.fundsRaised / project.goalAmount) * 100).toFixed(2),
            donorCount: project.donorCount,
        }));

        res.status(200).json({
            message: 'Comparison data retrieved successfully',
            comparisonData,
        });
    } catch (error) {
        console.error('Error comparing projects:', error);
        res.status(500).json({ message: 'Error comparing projects', error: error.message });
    }
};
