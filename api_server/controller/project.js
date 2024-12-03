const Project = require('../models/Project');
const Category = require('../models/Category');

// Fetch categories
exports.category = async (req, res) => {
    try {
        const categories = await Category.find()
            .select('name description')
            .sort({ name: 1 });

        res.status(200).json({
            message: "Successfully fetched categories",
            data: categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { category, title, description, fundingGoal, startDate, endDate } = req.body;

        // Check if category exists
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            return res.status(400).json({
                message: "Invalid category. Please choose a valid category from the system."
            });
        }

        // Create and save the project
        const project = new Project({
            creatorId: req.user._id,
            title,
            description,
            category,
            fundingGoal,
            amountRaised: 0,
            startDate,
            endDate,
        });

        await project.save();

        res.status(201).json({
            message: "Project created successfully",
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to create project",
            error: err.message
        });
    }
};

// Cancel a project
exports.cancelProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Update project status to 'cancelled'
        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: 'cancelled' },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({
                message: 'Project not found or already cancelled'
            });
        }

        res.status(200).json({
            message: 'Project successfully cancelled',
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// Update project details
exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updateData = req.body;

        // Update the project with new details
        const project = await Project.findByIdAndUpdate(projectId, updateData, {
            new: true,
            runValidators: true
        });

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).json({
            message: 'Project updated successfully',
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update project",
            error: err.message
        });
    }
};

// View project details
exports.viewProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch project details
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.status(200).json({
            message: 'Project details fetched successfully',
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};
