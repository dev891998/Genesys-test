import { MyKeyv, repos, RepositoryType } from "./RepositoryService";
import { User } from './UserService';
import { v4 as uuid } from 'uuid';
import { ServiceError } from "./Model";

export class MessageService {
    messageRepo: MyKeyv<Message>;
    repositoryType = RepositoryType.Message;
    constructor() {
        this.messageRepo = repos.get(this.repositoryType);
    }

    async get(id: string): Promise<Message|undefined> {
        return await this.messageRepo.get(id);
    }

    async set(message: Message): Promise<Message> {
        const id = uuid();
        message.id = id;
        message.time = new Date().toISOString();
        await this.messageRepo.set(id, message);
        return message;
    }

    async update(id:string, newMessage: Message): Promise<Message> {
        const message = await this.messageRepo.get(id);
        if(!message) throw new ServiceError(`message not found`, 404);
        await this.messageRepo.set(id, newMessage);
        return newMessage;
    }


    async delete(id: string): Promise<void> {
        const msg =  await this.messageRepo.get(id);
        if(!msg) throw new ServiceError(`message not found`, 404);
        this.messageRepo.delete(id);
    }


    async list(from?:string, to?:string): Promise<Message[]> {
        return this.messageRepo.query((v,_k)=> {
            if(!from && !to){
                return true;
            }
            if (v.from.id==from){
                return true;
            }
            if (v.to.id==to){
                return true;
            }
            return false
        }).sort((x,y)=>{
            return (new Date(y.time!)).getTime() - (new Date(x.time!)).getTime();
        });
    }
}

export interface Message {
    from: User;
    to: User;
    message: string;
    time?: string;
    id?: string;
}