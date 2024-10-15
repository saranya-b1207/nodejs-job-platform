import jobModel from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from 'moment';
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return next('Please Provide All Fileds');
    }
    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body);
    res.status(201).json({ job });
};
//get jobs 
export const getAllController = async (req, res, next) => {
    const { status, workType, search,sort } = req.query;
    //condition for searching filters
    const queryObject = {
        createdBy: req.user.userId,
    }
    //logic filters
    //status

    if (status && status !== 'all') {
        queryObject.status = status;
    }
    //worktype
    if (workType && workType !== 'all') {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }
    let queryResult = jobModel.find(queryObject);

    //sort
 
    if (sort === 'latest') {
        queryResult = queryResult.sort('-createdAt');
    }
    if (sort === 'oldest') {
        queryResult = queryResult.sort('createdAt');
    }
    if (sort === 'a-z') {
        queryResult = queryResult.sort('position');
    }
    if (sort === 'z-a') {
        queryResult = queryResult.sort('-position');
    }
    //pagination
    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;
    const skip=(page-1)*limit;

    queryResult=queryResult.skip(skip).limit(limit);
//jobs count
    const totalJobs=await jobModel.countDocuments(queryResult);
    const numOfPage=Math.ceil(totalJobs/limit);


    const jobs = await queryResult;
    // const jobs = await jobModel.find({ createdBy: req.user.userId })
    res.status(201).json({
        totaljobs: jobs.length,
        jobs,
    });
};
//update jobs
export const updateController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;
    //validation
    if (!company || !position) {
        return next('Please provide all Fields');
    }
    //find job
    const job = await jobModel.findOne({ _id: id })
    //validation
    if (!job) {
        return next(`No jobs found with this id ${id}`);
    }
    if (!req.user.userId === job.createdBy.toString()) {
        return
        next('Your are not Authorizes to update this jobs');
    }
    const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    });
    res.status(201).json({ updateJob });

};
//delete job
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    //find job
    const job = await jobModel.findOne({ _id: id });
    //validation
    if (!job) {
        return next(`No job found with this ID ${id}`);
    }
    if (!req.user.userId === job.createdBy.toString()) {
        return next('You are not authorized to delete the job')
    }
    await job.deleteOne()
    res.status(200).json({
        message: "successfully Deleted",
    });
};
//job stats and filters
export const statsJobController = async (req, res) => {
    const stats = await jobModel.aggregate([
        //search by  user jobs
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },

        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },

            },
        },
    ]);
    //default stats
    const defaultStats = {
        Pending: stats.Pending || 0,
        Reject: stats.Reject || 0,
        Interview: stats.Interview || 0
    };
    //monthly /yearly stats
    let monthlyJobStats = await jobModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: {
                    $sum: 1
                },
            },
        },
    ]);
    //month/year format
    monthlyJobStats = monthlyJobStats.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y');
        return { date, count };
    });

    res.status(200).json({ totalJob: stats.length, stats, defaultStats, monthlyJobStats });
};