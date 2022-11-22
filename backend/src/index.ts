import { dbConnection } from "./mysql";
import express, { request, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { FieldPacket } from "mysql2";

dotenv.config();
const PORT:number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const app = express();
app.use(express.json());

interface I_Participant {
    type: string;
    name: string;
    job: string;
    company: string;
    location: string;
    link: string;
};

app.get('/getparticipant', (request: Request, response: Response) => {
    dbConnection.query(`SELECT * FROM participants WHERE contacts = '' LIMIT 1`, (_:any, result: FieldPacket[]) => {
        if (result.length) {
            response.status(200).json(result[0]);
        } else {
            response.status(204).send('');
        }
    });

});

app.post('/createparticipants', (request: Request, response: Response) => {
    const jsonParticipants:I_Participant[] = request.body;
    const participantsValues = [];
    for (const participant of jsonParticipants) {
        participantsValues.push(`("${participant.type}", "${participant.name}", "${participant.job}", "${participant.company}", "${participant.location}", "${participant.link}")`);
    }
    dbConnection.query(`INSERT IGNORE INTO participants (type, name, job, company, location, link) VALUES ${participantsValues.join(',')}`);
    response.status(201).send();
});

app.patch('/updatecontacts/:id', (request: Request, response: Response) => {
    const jsonContacts: string[] = request.body;
    dbConnection.query(`UPDATE participants SET contacts = '${jsonContacts.join(',')}' WHERE id = ${request.params.id}`);
    response.status(200).send();
});

app.listen(PORT, () => {
    console.log(`Backend for browser extension started at ${PORT}`);
});