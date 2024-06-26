import { MyKeyv, repos, RepositoryType } from "./RepositoryService";
import { v4 as uuid } from 'uuid';
import { ServiceError } from "./Model";

export class UserService {
    userRepo: MyKeyv;
    constructor() {
        this.userRepo = repos.get(RepositoryType.User);
    }

    async get(id: string): Promise<User> {
        JSON.stringify(this.userRepo);
        return await this.userRepo.get(id);
    }
    
    async set(user: User): Promise<User> {
        user.id = uuid();
        this.userRepo.validate(user);
        await this.userRepo.set(user.id, user);
        return user;
    }

    async update(id:string, user: User): Promise<User> {
        const old = await this.userRepo.get(id);
        if(!old) throw new ServiceError(`user not found`, 404);
        await this.userRepo.set(id, user);
        return user;
    }

    async delete(id: string): Promise<void> {
        const msg =  await this.userRepo.get(id);
        if(!msg) throw new ServiceError(`user not found`, 404);
        this.userRepo.delete(id);
    }

    async list(): Promise<User[]> {
        return this.userRepo.query(()=>true);
    }
}

export interface User {
    name: string;
    id?: string;
}