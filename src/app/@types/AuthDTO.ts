import { UserDTO } from "./UserDTO";

export interface AuthDTO extends UserDTO {
    isLogged: boolean;
}