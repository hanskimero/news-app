import express from 'express';

export class ErrorInfo extends Error {
    status : number
    message : string
    constructor(status? : number, message? : string) {
        super();
        this.status = status || 500;
        this.message = message || "Unexpected error occured in the server";
    }

}

const errorhandler = (err : ErrorInfo, req : express.Request, res : express.Response, next : express.NextFunction) => {

    res.status(err.status).json({virhe : err.message});

    next();

}

export default errorhandler;