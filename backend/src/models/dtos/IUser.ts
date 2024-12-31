export default interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    creationDate: Date;
    _id: string;
}
