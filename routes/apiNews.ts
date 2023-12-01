import express from 'express';
import { ErrorInfo } from '../errors/errorhandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiNewsRouter : express.Router = express.Router();

apiNewsRouter.use(express.json());

apiNewsRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const news = await prisma.news.findMany();
        const comments = await prisma.comment.findMany();

        res.json({ news, comments});
    
    } catch (e : any) {
        next(new ErrorInfo());
    }

});

apiNewsRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (req.body.kommentti?.length > 0) {

        try {
            

            await prisma.comment.create({
                data : {
                    uutisId : Number(req.body.uutisId),
                    kayttajatunnus : req.body.kayttajatunnus,
                    kommentti : req.body.kommentti
                }
            });
            
            const news = await prisma.news.findMany();
            const comments = await prisma.comment.findMany();
            
            res.json({ news, comments });
    
        } catch (e : any) {
          
            next(new ErrorInfo())
        }

    } else {
        next(new ErrorInfo(400, "Empty comment"));
    }

});


export default apiNewsRouter;