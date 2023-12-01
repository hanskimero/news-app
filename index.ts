import express from 'express';
import path from 'path';
import apiNewsRouter from './routes/apiNews';
import errorhandler from './errors/errorhandler';
import cors from 'cors';
import apiAuthRouter from './routes/apiAuth';
import * as jwt from 'jsonwebtoken';

const app : express.Application = express();

const port : number = Number(process.env.PORT) || 3106;

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        jwt.verify(token, "SalausAvain");

        next(); 

    } catch (e: any) {
        res.status(401).json({});
    }

}

app.use(cors({origin : "http://localhost:3000"}));

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/news", apiNewsRouter);

app.use(errorhandler);

app.use("/api/auth", apiAuthRouter);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Faulty route"});
    }

    next();
});

app.listen(port, () => {

    console.log(`Server running in port : ${port}`);    

});