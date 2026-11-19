import { Injectable } from '@nestjs/common';

interface User {
    id: number;
    name: string;
    email:string;
}

@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService) {}
    private users: User[] = [
        {id:1, name: "Ebuka Aranye", email:"davidachibiri6@gmail.com"},
        {id:2, name: "Morakinyo Doe", email:"M.Doe@gmail.com"}
    ];

    findAllUsers(name: string='') {
        return this.users.filter((user) => 
            user.name.toLowerCase().includes(name.toLowerCase()),
    );
    };
}
