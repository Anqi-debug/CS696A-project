const Investment = require('../models/investment');
const Project = require('../models/project');
const User = require('../models/user');

// Create a new investment
exports.createInvestment = async (req, res) => {
    try {
        const { donorId, projectId, investmentAmount, potentialReturns } = req.body;

        const project = await Project.findById(projectId);
        const user = await User.findById(donorId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User (Donor) not found.' });
        }

        const newInvestment = new Investment({
            donorId,
            projectId,
            investmentAmount,
            potentialReturns,
        });

        await newInvestment.save();

        project.investments.push(newInvestment._id);
        await project.save();

        res.status(201).json({ message: 'Investment created successfully', investment: newInvestment });
    } catch (error) {
        console.error('Error creating investment:', error);
        res.status(500).json({ message: 'Error creating investment', error: error.message });
    }
};

// Get all investments for a specific project
exports.getInvestmentsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate('investments');

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json({ message: 'Investments retrieved successfully', investments: project.investments });
    } catch (error) {
        console.error('Error retrieving investments:', error);
        res.status(500).json({ message: 'Error retrieving investments', error: error.message });
    }
};

// Get all investments made by a specific donor (user)
exports.getInvestmentsByDonor = async (req, res) => {
    try {
        const { donorId } = req.params;

        const investments = await Investment.find({ donorId }).populate('projectId');

        if (!investments.length) {
            return res.status(404).json({ message: 'No investments found for this donor.' });
        }

        res.status(200).json({ message: 'Investments retrieved successfully', investments });
    } catch (error) {
        console.error('Error retrieving investments by donor:', error);
        res.status(500).json({ message: 'Error retrieving investments by donor', error: error.message });
    }
};

// Update an existing investment
exports.updateInvestment = async (req, res) => {
    try {
        const { investmentId } = req.params;
        const { investmentAmount, potentialReturns } = req.body;

        const updatedInvestment = await Investment.findByIdAndUpdate(
            investmentId,
            { investmentAmount, potentialReturns },
            { new: true }
        );

        if (!updatedInvestment) {
            return res.status(404).json({ message: 'Investment not found.' });
        }

        res.status(200).json({ message: 'Investment updated successfully', investment: updatedInvestment });
    } catch (error) {
        console.error('Error updating investment:', error);
        res.status(500).json({ message: 'Error updating investment', error: error.message });
    }
};

// Delete an investment
exports.deleteInvestment = async (req, res) => {
    try {
        const { investmentId } = req.params;

        const deletedInvestment = await Investment.findByIdAndDelete(investmentId);

        if (!deletedInvestment) {
            return res.status(404).json({ message: 'Investment not found.' });
        }

        const project = await Project.findById(deletedInvestment.projectId);
        if (project) {
            project.investments = project.investments.filter(
                (investment) => investment.toString() !== investmentId
            );
            await project.save();
        }

        res.status(200).json({ message: 'Investment deleted successfully', investment: deletedInvestment });
    } catch (error) {
        console.error('Error deleting investment:', error);
        res.status(500).json({ message: 'Error deleting investment', error: error.message });
    }
};
