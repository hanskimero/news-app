import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ErrorInfo } from '../errors/errorhandler';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

    try {
      
        const user = await prisma.user.findFirst({
            where : {
                kayttajatunnus : req.body.username
            }
        });

        if (req.body.username === user?.kayttajatunnus) {

            let hash = crypto.createHash("SHA256").update(req.body.password).digest("hex");

            if (hash === user?.salasana) {

                let token = jwt.sign({}, "SalausAvain");

                res.json({ token : token })

            } else {
                next(new ErrorInfo(401, "Faulty username or password"));
            }

        } else {
            next(new ErrorInfo(401, "Faulty username or password"));
        }

    } catch {
        next(new ErrorInfo());
    }

});


apiAuthRouter.post("/register", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

    if (req.body.username && req.body.password) {

        const existingUser = await prisma.user.findFirst({
            where : {
                kayttajatunnus : req.body.username
            }
        })

        if (existingUser) {

            next(new ErrorInfo(400, "Username already taken"))

        } else {

            try {

                let hash = crypto.createHash("SHA256").update(req.body.password).digest("hex");

                await prisma.user.create({
                    data : {
                        kayttajatunnus : req.body.username,
                        salasana : hash
                    }
                })

                res.status(200).json({ message: "User created successfully" });

            } catch {

                next(new ErrorInfo(500, "Creating new user failed"));
            }
        }

    } else {
        next(new ErrorInfo(400, "Username and password required"));
    }
    

});

export default apiAuthRouter;