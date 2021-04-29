import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { SALTORROUND, SECRET_KEY,ROLES } from "../../constants/config";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async createUser(user) {
    const result = await this.userRepo.save(user);
    return result;
  }
  async findByEmail(email) {
    const result = await this.userRepo.findOne({ email });
    return result;
  }
  async findAll(){
    const result = await this.userRepo.find()
    return result
  }
  async encryptPassword(password) {
    const encrypted = await bcrypt.hash(password, SALTORROUND);
    return encrypted;
  }
  async passwordCompare(password, hash) {
    const isCorrect = await bcrypt.compare(password, hash);
    return isCorrect;
  }
  async generateToken({ fname, lname, email }) {
    const role_index = await Math.floor(Math.random() * 3) + 1
    console.log(role_index);
      
    const roles  = Object.values(ROLES)
    const token = jwt.sign(
      {
        data: {
          fname,
          lname,
          email,
          role:roles[role_index]
        },
      },
      SECRET_KEY,
      {
        expiresIn: "120s",
      },
    );
    return token
  }
  async checkToken(token){
      try {
          const isCorrect = await jwt.verify(token,SECRET_KEY)
          return isCorrect
      } catch (error) {
          return error.message
      }
  }
}
