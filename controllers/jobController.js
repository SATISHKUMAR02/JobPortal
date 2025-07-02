const mongoose = require("mongoose");
const jobsModel = require("../model/jobsModel");
const moment = require('moment');
exports.createjobs = async (req, res, next) => {
    try {
        console.log("job controller")
        const { company, position } = req.body;
        if (!company || !position) {
            return next("please provide all fields");
        }
        req.body.createdBy = req.user.userId
        const job = await jobsModel.create(req.body);
        res.status(201).json({
            success: true,
            message: 'job created successfully',
            data: job
        })
    }
    catch (error) {
        console.log(error)
    }
}

exports.getAllJobs = async (req, res, next) => {
    try {
        // const jobs = await jobsModel.find({ createdBy: req.user.userId })
        const {status,workType,search,sort } = req.query;
        const queryObject = {
            createdBy:req.user.userId
        }
        if(status && status!== "all"){
            queryObject.status = status;
        }
        if(workType && workType!=="all"){
            queryObject.workType = workType;
        }
        if(search){
            queryObject.position = {$regex:search,$options:'i'}
        }
        
        let queryResult =  jobsModel.find(queryObject);
        
        
        // SORT
        if(sort === "latest"){
            queryResult = queryResult.sort('-createdAt')
            // the minus symbol is descending
        }
        if(sort === "oldest"){
            queryResult = queryResult.sort('createdAt')
        }
        if(sort === "a-z"){
            queryResult = queryResult.sort('position')
            // the minus symbol is descending
        }
          if(sort === "z-a"){
            queryResult = queryResult.sort('-position')
            // the minus symbol is descending
        }

        //PAGINATION
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page-1)*limit

        queryResult = queryResult.skip(skip).limit(limit)
        const totalJobs = await jobsModel.countDocuments(queryResult)
        const numofPage = Math.ceil(totalJobs/limit)

        const jobs = await queryResult;
        res.status(200).json({
            success: true,
            message: 'jobs retrived successfully',
            data: jobs,numofPage
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getAllJobsByStatus = async (req, res, next) => {
    try {
        //  const jobs = await jobsModel.find({ createdBy: req.user.userId })
        const { status } = req.query;
        const queryObject = {
            createdBy: req.user.userId
        }
        if (status && status !== "all") {
            queryObject.status = status;
        }
        const queryResult = jobsModel.find(queryObject);
        const jobs = await queryResult;
        res.status(200).json({
            success: true,
            message: 'jobs retrived successfully',
            data: jobs
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getAllJobsByworktype = async (req, res, next) => {
    try {
        const {workType} = req.query;
        const queryObject = {
            createdBy : req.user.userId
        }
        if(workType && workType!=="all"){
            queryObject.workType = workType;
        }

        const queryResult = jobsModel.find(queryObject);
        const jobs = await queryResult;
        res.status(200).json({
            success:true,
            message:'job retrived successfully',
            data:jobs
        }) 
    } catch (error) {

        console.log(error);
    }
}

exports.updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, position } = req.body;
        if (!company || !position) {
            return next('invalid credentials')
        }
        const exjob = await jobsModel.findOne({ _id: id });
        if (!exjob) {
            // res.status(400).json({
            //     success:false,
            //     message:'no jobs found'
            // })
            return next('no jobs found')
        }
        if (req.user.userId !== exjob.createdBy.toString()) {
            return next('not authorized to update this job');
        }
        const updatejob = await jobsModel.findByIdAndUpdate({ _id: id }, req.body, {
            new: true, // tells mongoose to return the updated document rather than the original one 
            // if we ommit it will return the old document
            // 
            runValidators: true
            // enables schema validation when updating
        })
        res.status(200).json({
            success: true,
            message: 'updated successfully',
            data: updatejob
        })


    } catch (error) {
        console.log(error);
    }
}

exports.deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = jobsModel.findOne({ _id: id });
        if (!job) {
            return next('no job found');
        }

        if (req.user.userId !== exjob.createdBy.toString()) {
            return next('not authorized to update this job');
        }
        // await job.remove();

        await jobsModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'delted successfully',
        })



    } catch (error) {
        return next(error);
    }
}

exports.jobStats = async (req, res, next) => {
    try {
        const stats = await jobsModel.aggregate([
            {
                $match: { // filters documents like Where clause in SQL
                    createdBy: new mongoose.Types.ObjectId(req.user.userId),
                },
            },
            {
                $group: { // like group by
                    _id: '$status', // drouping by status filed
                    count: { $sum: 1 }, // for each group add 1 for every document an store the total in count
                }
            },
        ]);
        const defaultStats = {
            pending: stats.pending || 0,
            reject: stats.reject || 0,
            interview: stats.interview || 0
        }

        let monthlyApplication = await jobsModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.userId)
                }
            }, {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
        monthlyApplication = monthlyApplication.map(item => {
            const { _id: { year, month }, count } = item;
            const date = moment().month(month - 1).year(year).format('MMM Y')
            return { date, count };
        }).reverse();


        return res.status(200).json({
            totalJob: stats.length,
            defaultStats,
            monthlyApplication
        })
    } catch (error) {
        return next(error)
    }
}
/*

query string => in the url , anything after ? (key=value)
the key value pair is called the query string 

*/