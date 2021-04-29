import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("/signup")
  @UseInterceptors(FileInterceptor("img", {
    storage: diskStorage({
      filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
      },
      destination: "./src/upload",
    }),
  }))
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file,
    @Body() body: Body,
  ) {
    try {
      const user: any = body;
      user.img = file.filename;
      user.password = await this.userService.encryptPassword(user.password);
      const signedup = await this.userService.createUser(body);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  }

  @Post("/login")
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const {email,password:password} = req.body
      const hasUser = await this.userService.findByEmail(email)
      if(!hasUser) return res.status(401).json({message:"NOT FOUND USER"})
      const {fname,lname,password:hash} = hasUser
      const logedIn = await this.userService.passwordCompare(password,hash)
      if(!logedIn) return res.status(401).json({message:"USERNAME OR PASSWORD IS INVALID"})
      const token = await this.userService.generateToken(hasUser)
      return res.status(200).json({message:"LOGIN SUCCESS",data:token}) 
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response){
    try {
        const users = await this.userService.findAll()
        return res.status(200).json({data:users})      
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      
    }
  }
}
