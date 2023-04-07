import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {} // private readonly jwtService: JwtService, // private readonly usersService: UsersService,

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = 'token';
    //TODO: generate token

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email / password do not match');
    }

    const token = 'token';

    return {
      token,
      user,
    };
  }
}
